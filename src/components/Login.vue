<template>
  <div id="login">
    <!-- <p>管理员登录系统</p> -->
    <div id="login-box">
      <div id="login-img-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <!-- 添加表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <!-- 插槽 -->
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password>
            <!-- show-password 密码的显示或保密 -->
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-col :push="15">
          <!-- element 组件库  layout布局  参数 :push 栅格向右移动格数 -->
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="reset()">重置</el-button>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 制定规则,给登录表单域制作校验规则。必须写在data里
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  //   添加方法
  methods: {
    // 后台管理员登录系统
    login() {
      // 跳转到后台首页
      // this.$router.push('/home')
      // 对登录的form表单进行整体校验
      // validate方法是element组件库的方法  使用箭头函数因为有this指向问题
      this.$refs.loginFormRef.validate( async valid=> {
        // valid表单校验的标志信息  true：成功   false： 失败
        if(valid === true) {
          // 跳转到后台首页
          // this.$router.push('/home')
          // 用户名和密码的真实校验
          //     重命名                 post请求   路由地址     
          const {data:dt} = await this.$http.post('/login',this.loginForm)
          // console.log(dt);    //随意的用户名密码  打印为不存在用户名
          // 判断用户名和密码
          if(dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 通过浏览器的sessionStorage记录服务器返回的token信息
          window.sessionStorage.setItem('token',dt.data.token)
          this.$router.push('/home')
          console.log(dt);
        }
      })
    },
    reset() {
      // 重置表单数据
      // this.$refs.loginFormRef.resetField() 错误
         this.$refs.loginFormRef.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  height: 100%;
  background-color: #2b4b6b;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    #login-img-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      padding: 8px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      box-shadow: 0 0 10px #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .el-form {
    width: 100%;
    padding: 20px;
    box-sizing: border-box; //怪异盒模型
    position: absolute;
    bottom: 0;
  }
}
</style>
