// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/preferential/preferential')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/activeCoupon' },
    { path: '/activeCoupon', component: require('components/preferential/activeCoupon'), meta: { title: '活动优惠券' } },
    { path: '/waCoin', component: require('components/preferential/waCoin'), meta: { title: '蛙币' } },
    { path: '/selfCoupon', component: require('components/preferential/selfCoupon'), meta: { title: '专属优惠码' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd',
  components: {
    'bg': require('components/preferential/bg.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})

