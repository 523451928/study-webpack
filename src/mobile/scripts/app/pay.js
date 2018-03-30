
require('scripts/app/_global')
require('styles/scss/pay/pay')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/jquery.lazyload.js')

const router = new VueRouter({
  routes: [
    { path: '/:id', component: require('components/pay/pay.vue'), meta: { title: '订单支付' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd'
})
