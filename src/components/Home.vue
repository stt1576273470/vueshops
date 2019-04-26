<template>
<el-container>
  <el-header>
    <div id="logo-box">
      <img src="../assets/img/heima.png" alt>
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout()">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isshow?'65px':'200px'">
      <div class="toggle_bar" @click="isshow =!isshow">|||</div>
      <!--:router="true" 开启路由模式-->
      <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isshow" :collapse-transition="false" :router="true">
        <el-submenu :index="item.id+ ''" :style="{width:isshow?'65px':'200px'}" v-for="(item,k) in menuList" :key="item.id">
          <!-- :style="{width:isshow?'65px':'200px'}  属性绑定  三元表达式 实现自适应 -->
          <template slot="title">
              <i :class="'iconfont icon-'+ iconList[k]"></i>
              <span>{{item.authName}}</span>
</template>
            <!-- :index="item2.path" 设置导航路由地址-->
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="2" :style="{width:isshow?'65px':'200px'}">
<template slot="title">
<i class="el-icon-location"></i>
<span>导航二</span>
</template>
            <el-menu-item index="2-1">选项3</el-menu-item>
            <el-menu-item index="2-2">选项4</el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getMenuList()
  },
  data() {
    return {
      // 左侧权限数据成员
      menuList: [],
      // 左侧菜单栏设置icon图标
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'],
      // 左侧菜单权限折叠开关
      isshow: false
    }
  },
  // 管理员退出系统
  methods: {
    // 获取左侧菜单权限数据
    async getMenuList() {
      // 发送axios到后端获取数据
      const {
        data: dt
      } = await this.$http.get('menus')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获取到的数据返回给menuList
      this.menuList = dt.data
    },
    logout() {
      this.$confirm('你确定要退出系统吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token
        // 页面重定向
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    padding-right: 20px;
    #logo-box {
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      user-select: none;
    }
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  }
  .el-aside {
    background-color: rgb(51, 55, 68); // .el-menu-item.is-active {
    //   color: #409eff
    // }
    // 隐藏列表栏
    .toggle_bar {
      width: 100%;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      letter-spacing: 0.1em; //字符之间空隙
      user-select: none; //禁止用户选中
      cursor: pointer; //小手样式
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
