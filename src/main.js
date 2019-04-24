import Vue from 'vue'
import App from './App'
import router from './router'
// 引入element-ui并配置
import ElementUI from 'element-ui'
// 引入global.css
import '@/assets/css/global.css'
// 引入icon图标库样式文件
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// axios配置请求公共跟地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// axios请求拦截器  在请求拦截器中配置token信息
axios.interceptors.request.use(
  function(config) {
    // config：axios的配置对象，具体是axios大对象内部的子级成员
    console.dir(axios)
    // 给axios配置token
    var token = window.sessionStorage.getItem('token')
    if (token !== null) {
      config.headers.Authorization = token
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// 给axios配置成为vue成员
Vue.prototype.$http = axios

// 注册
Vue.use(ElementUI)

Vue.config.productionTip = false //防止启动生产信息

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
