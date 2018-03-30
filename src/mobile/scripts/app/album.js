/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/album/album')
require('css/jquery.flex-images')
require('js/jquery.flex-images')

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/album' },
    { path: '/album', component: require('components/album/album'), meta: { title: '我的作品集' } },
    { path: '/photo', component: require('components/album/photo'), meta: { title: '我的作品' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

let vue = function() {
  return new Vue({
    router,
    el: '.bd',
    components: {
      'userhead': require('components/setting/userhead.vue')
    }
  })
}
vue()
