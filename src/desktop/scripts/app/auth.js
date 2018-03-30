// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/auth')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')
/* eslint-disable  */
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/forget', component: require('components/auth/forget'), meta: { title: '忘记密码' } },
    { path: '/improve', component: require('components/auth/improve'), meta: { title: '完善信息' } },
    { path: '/login', component: require('components/auth/login'), meta: { title: '登录-墙蛙网' } },
    { path: '/logout', component: require('components/auth/logout'), meta: { title: '退出' } },
    { path: '/register', component: require('components/auth/register'), meta: { title: '注册' } },
    { path: '*', redirect: '/forget' }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

new Vue({
  router,
  el: '.bd',
  components: {
    'bg': require('components/auth/bg.vue')
  }
})
