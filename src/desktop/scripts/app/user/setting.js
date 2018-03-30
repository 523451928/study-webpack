// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/setting/setting')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/cxcalendar')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/profile' },
    { path: '/profile', component: require('components/setting/profile'), meta: { title: '个人信息' } },
    { path: '/creatShop', component: require('components/setting/creatShop'), meta: { title: '创建品牌店' } },
    { path: '/account', component: require('components/setting/account'), meta: { title: '账号管理' } },
    { path: '/withdraw', component: require('components/setting/withdraw'), meta: { title: '提现' } },
    { path: '/password', component: require('components/setting/password'), meta: { title: '修改密码' } },
    { path: '/address', component: require('components/setting/address'), meta: { title: '收货地址' } },
    { path: '/invoice', component: require('components/setting/invoice'), meta: { title: '发票信息' } },
    { path: '/bind', component: require('components/setting/bind'), meta: { title: '社交账号' } },
    { path: '/avatar', component: require('components/setting/avatar'), meta: { title: '头像编辑' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd',
  components: {
    'bg': require('components/setting/bg.vue'),
    'userEditNav': require('components/user/user-edit-nav.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})
