import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'

Vue.use(Router)

// export default new Router({
//   routes: [
//     { path: '/login', component: Login },
//     { path: '/home', component: Home }
//   ]
// })

// 配置路由守卫
const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User }
      ]
    }
  ]
})
// 设置路由守卫
router.beforeEach((to, from, next) => {
  // /home路由需要在token存在的支持下（表示用户处于登录状态）
  var token = window.sessionStorage.getItem('token')
  //  判断用户如果处于非登录状态，就禁止访问登录页面以外的其他页面
  if (token === null && to.path !== '/login') {
    // 强制用户登录
    return next('/login')
  }
  next() // 继续执行当前路由
})

export default router
