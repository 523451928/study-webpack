// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/coupon/coupon')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/activeCoupon' },
    { path: '/activeCoupon', component: require('components/coupon/active-coupon'), meta: { title: '活动优惠券' } },
    // { path: '/waCoin', component: require('components/coupon/waCoin'), meta: { title: '蛙币' } },
    { path: '/selfCoupon', component: require('components/coupon/self-coupon'), meta: { title: '专属优惠码' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd',
  components: {
    'bg': require('components/coupon/bg.vue'),
    'userEditNav': require('components/user/user-edit-nav.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})

