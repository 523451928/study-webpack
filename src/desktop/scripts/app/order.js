require('scripts/app/_global')
require('styles/scss/order/order')
require('js/cxcalendar')
require('scripts/app/public/vue-tips.js')
require('styles/public/tips.css')

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/0' },
    { path: '/:status', component: require('components/order/order.vue'), meta: { title: '交易管理-我的订单' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd'
})
