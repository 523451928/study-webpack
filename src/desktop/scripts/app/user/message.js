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
    { path: '/', redirect: '/system' },
    { path: '/system', component: require('components/user/message/system'), meta: { title: '系统消息' } },
    { path: '/comment', component: require('components/user/message/comment'), meta: { title: '评论回复' } },
    { path: '/foucslike', component: require('components/user/message/focuslike'), meta: { title: '关注/喜欢' } },
    { path: '/order', component: require('components/user/message/order'), meta: { title: '订单消息' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd',
  components: {
    'bg': require('components/user/message/bg.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})
