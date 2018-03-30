require('scripts/app/_global')
require('styles/scss/order-detail/order-detail')
require('js/jquery.lazyload.js')

const router = new VueRouter({
  routes: [
    { path: '/:id', component: require('components/order-detail/order-detail.vue'), meta: { title: '交易管理 - 订单详情' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd'
})
