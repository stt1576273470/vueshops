<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分配权限弹出层 -->
    <el-dialog title="角色分配" :visible.sync="distributeDialog" width="60%">
      <el-form :model="distributeForm" ref="distributeRef" label-width="120px">
        <el-form-item label="当前角色:">{{distributeForm.roleName}}</el-form-item>
        <el-form-item label="分配的权限:">
          <!-- :default-checked-keys ="defaultChecked" 默认选中的key的数组 -->
          <el-tree
            :data="rightsInfo"
            show-checkbox
            node-key="id"
            :default-expand-all="true"
            :props="treeProps"
            :default-checked-keys="defaultChecked"
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialog = false">取 消</el-button>
        <el-button type="primary" @click="fenRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片部分 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addRoleUser()">添加角色</el-button>
      <!-- 表格 -->
      <el-table :data="roleList" style="width: 100%" border stripe>
        <!-- 展开项设置 -->
        <el-table-column type="expand" width="100">
          <!-- 作用域插槽 获取数据信息 -->
          <template slot-scope="info">
            <!-- 第一级别权限遍历 -->
            <!-- 给所有的el-row的bottom设置边框  当是第一个项目时，头部top也需要设置 -->
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom':'1px solid rgb(235,238,245)','border-top'
             :k===0?'1px solid rgb(235,238,245)':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="delRights(info.row,v.id)">{{v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 第二级别权限遍历 -->
                <!-- 给所有的el-row设置border-top边框  第一个不用设置 -->
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-top' :kk !==0 ? '1px solid rgb(235,238,245)':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRights(info.row,vv.id)"
                    >{{vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 第三级别权限遍历 -->
                    <el-tag
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      type="warning"
                      closable
                      @close="delRights(info.row,vvv.id)"
                    >{{vvv.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="250"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <!--slot-scope="info" 作用域插槽-->
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRightsUser(info.row.id)"
            >删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  methods: {
    // 添加新角色
    addRoleUser() {
      alert('添加新角色')
    },
    // 用于展示的角色列表信息
    async getRoleList() {
      const { data: dt } = await this.$http.get('roles')
      // console.log(dt)   //获取列表数据成功
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // this.$message.success(dt.meta.msg)   获取成功
      // 因为字段名有冲突  要重新定义children的字段名
      // 把dt.data的第一维的“children”字段改名为“son”名称
      dt.data.forEach(item => {
        // 循环遍历每个小单元item
        item.son = item.children // 把children的信息赋予给son
        delete item.children //删除第一维的children 和son内容一致
      })
      // console.log(dt)
      this.roleList = dt.data
      // console.log(this.roleList)
    },
    // 删除角色指定权限
    // 请求路径： roles/:roleId/rights/:rightId
    // 请求方法：delete
    // role: 当前角色对象的参数（具体有 id/roleName/roleDesc/son等）
    // rightId： 被删除权限的id
    delRights(role, rightId) {
      this.$confirm('你确定要删除此权限吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: dt } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        // 权限被删除后 服务器端要返回最新数据
        // console.log(dt);
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        // 提示删除成功
        this.$message.success(dt.meta.msg)
        // 页面数据重新刷新
        // 弊端：会把页面关闭 影响用户体验
        // this.getRoleList()
        // 解决办法
        // 只对当前角色拥有的权限进行数据更新
        role.son = dt.data
      })
    },
    // 分配权限对话框
    // role: 当前角色对象（id/roleName/roleDesc/son等）
    async showDistributeDialog(role) {
      // 获得用于分配的权限数据
      const { data: dt } = await this.$http.get('rights/tree')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 获取成功 把获得好的用于分配权限数据赋予给rightsInfo成员
      this.rightsInfo = dt.data
      // 把当前角色拥有的第三级别的权限id获取得到  并以数组呈现
      // 具体从参数role中获取
      var idKeys = [] //接收第三级别权限id的数组
      this.getHaveRights(role, idKeys)
      console.log(idKeys)
      // 把拥有第三级别权限的id数组赋予给defaultChecked成员
      this.defaultChecked = idKeys
      // 把role参数赋予给表单数据对象
      this.distributeForm = role
      // 显示弹出框表单
      this.distributeDialog = true
    },
    // 通过 递归遍历 的方式， 把一个角色的全部第三级别权限id给获得到
    getHaveRights(node, arr) {
      // 给node的第一维设置children字段
      if (node.son) {
        // 如果数据里有son字段  进入此判断 并赋予给children
        node.children = node.son
      }
      // 如果是第三级别权限  就把起id给到arr里面
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果是第1/2级别权限  就要遍历其children 继续 挖掘内部节点
      node.children.forEach(item => {
        this.getHaveRights(item, arr)
      })
    },
    // 收集分配的权限存储入库
    async fenRights() {
      // roleid : this.distributeForm.id
      // getCheckedKeys   全选
      // getHalfCheckedKeys   半选
      // 获取全选  半选权限的id
      var ids1 = this.$refs.treeRef.getCheckedKeys()
      var ids2 = this.$refs.treeRef.getHalfCheckedKeys()
      // ids1和ids2合并  并以字符串呈现
      // .concat 方法  字符串拼接 以逗号分隔
      var ids12 = ids1.concat(ids2).join(',')
      // roles/:roleId/rights  路由
      const { data: dt } = await this.$http.post(
        `roles/${this.distributeForm.id}/rights`,
        { rids: ids12 }
      )
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 角色分配权限成功  关闭对话框 提示 刷新数据
      this.distributeDialog = false
      this.$message.success(dt.meta.msg)
      this.getRoleList()
    },
    // 删除权限管理员信息
    delRightsUser(id) {
      this.$confirm('你确定要删除用户权限信息吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: dt } = await this.$http.delete('roles/' + id)
        // console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        this.$message.success(dt.meta.msg)
        this.getRoleList()
      })
    }
  },
  data() {
    return {
      // 角色列表数据成员
      roleList: [],
      // 分配权限相关
      // 对话框默认设置为false
      distributeDialog: false,
      // 角色拥有权限集合  具体是叶子（第3级别）权限的id数组
      defaultChecked: [],
      // 表单数据
      distributeForm: {
        id: 0, //角色id
        roleName: '', //角色名称
        roleDesc: '' //角色描述
      },
      // 权限树的属性
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 定义被选取全选的成员
      rightsInfo: []
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
