/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/setting/setting')
require('styles/scss/income/income')

require('js/cxcalendar')

/* eslint-disable no-new */
const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/income' },
    { path: '/income', component: require('components/income/income'), meta: { title: '我的收入' } },
    { path: '/wacoin', component: require('components/income/waCoin'), meta: { title: '蛙币' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})
router.afterEach(to => { document.title = to.meta.title })
new Vue({
  router,
  el: '.bd',
  components: {
    'bg': require('components/income/bg.vue'),
    'userEditNav': require('components/user/user-edit-nav.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})
