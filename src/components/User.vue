<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <!-- 添加新管理员弹出层 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserDialog"
        width="50%"
        @close="$refs.addUserRef.resetFields()"
      >
        <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile" autocomplete="off">
            <el-input v-model="addUser.mobile"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="tianjia">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户弹出层 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editUserDialog"
        width="50%"
        @close="$refs.editUserRef.resetFields()"
      >
        <el-form :model="editUser" :rules="editUserRules" ref="editUserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" autocomplete="off">
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="xiugai()">确 定</el-button>
        </span>
      </el-dialog>
    </el-breadcrumb>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="querycdt.query"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <!-- @clear = "getUserList()"   点击清空按钮的回调处理 -->
            <!-- @key.enter.native ="getUserList()"  按下回车键才可以触发执行  必须添加.native才可以生效 -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="8">
          <el-button type="primary" :span="8" @click="addUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="100">
          <el-switch v-model="info.row.mg_state" slot-scope="info">
            <!-- slot-scope="info"   作用域插槽 -->
          </el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <!--slot-scope="info" 作用域插槽-->
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2, 5, 8, 11]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期
  created() {
    this.getUserList()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
    },
    // 分页相关处理1
    handleSizeChange(val) {
      //  val: 变化后的每页显示条数
      // console.log(val)
      this.querycdt.pagesize = val
      this.getUserList()
    },
    // 分页相关数据2
    handleCurrentChange(val) {
      // 当前页码
      this.querycdt.pagenum = val
      this.getUserList()
    },
    // 获取用于显示真实后台数据
    async getUserList() {
      // axios返回的是promise对象  需要使用async  和  await
      // 解构赋值重命名  get方式获取数据
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt)
      // 获取失败处理
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 获取成功把数据渲染到页面userlist
      this.userlist = dt.data.users
      // 把获得总记录条数的数目赋予给tot
      this.tot = dt.data.total
    },
    // 添加用户 提交数据到后台;
    tianjia() {
      // 表单再次校验  没有进入输入框
      this.$refs.addUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('users', this.addUser)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 数据添加成功： 提示成功信息 关闭弹出框 数据刷新
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },
    // 删除用户
    delUser(id) {
      this.$confirm('你确定要删除用户信息吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 实现删除的代码
        // console.log(id)
        const { data: dt } = await this.$http.delete('users/' + id)
        // console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        // 成功后的提示
        this.$message.success(dt.meta.msg)
        if (this.userlist.length === 1 && this.querycdt.pagenum > 1) {
          this.querycdt.pagenum--
        }
        this.getUserList()
      })
    },
    // 修改用户信息
    xiugai() {
      //  表单验证
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          // 获取当前修改的id并获取此id下的所有内容
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 修改成功：成功提示，关闭对话框， 页面刷新
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    async showEditDialog(id) {
      // 获取当前修改的id并获取此id下的所有内容

      const { data: dt } = await this.$http.get('users/' + id)
      console.log(dt)
      //  把获得的数据赋值给editUser成员
      this.editUser = dt.data
      // 显示对话框
      this.editUserDialog = true
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      // console.log(value)
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功，继续执行
      callback()
    }
    return {
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      editUserDialog: false,

      editUserRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 用户数据列表显示
      //   数据列表
      userlist: [],
      // 查询数据条件
      tot: 0, // 总记录条数 默认为0
      querycdt: {
        // 接口文档提供参数
        query: '', // 查询参数  搜索关键字（模糊查询）
        pagenum: 1, // 当前页码 （分页功能体现）
        pagesize: 2 // 每页显示数据条数 （分页功能体现）
      },
      // 添加新用户
      // 表单验证
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 表单数据对象
      addUser: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 弹出框默认不显示
      addUserDialog: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
