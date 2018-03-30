require('scripts/app/_global')
require('scripts/tools/vue-tips')
require('styles/public/tips.css')
require('styles/scss/order/order')
require('js/cxcalendar')

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/0', component: require('components/order/order.vue'), meta: { title: '交易管理-我的订单' } },
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
