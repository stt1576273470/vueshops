import Vue from 'vue'
import App from './App'
import router from './router'
// 引入element-ui并配置
import ElementUI from 'element-ui'
// 引入global.css
import '@/assets/css/global.css'
// 注册
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
