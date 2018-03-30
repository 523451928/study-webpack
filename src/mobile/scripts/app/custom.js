// Copyright 2016 CHEN Xianren. All rights reserved.
/* eslint-disable */
require('scripts/app/_global')
import Loadmore from 'scripts/tools/loadmore'
require('scripts/tools/vue-tips')
require('styles/scss/custom/custom.scss')
require('styles/public/tips.css')
import customBody from 'components/custom/index'
window.Loadmore = Loadmore
// import customList from 'components/custom/custom-list'

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    // { path: '/customlist', component: require('component/custom/custom-list'), meta: { title: '定制列表' } },
    { path: '/category/:id', component: customBody, meta: { title: '定制' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})
Vue.component('custom-pro-detail', require('components/custom/custom-pro-detail.vue'))
router.afterEach(to => { document.title = to.meta.title })

let vue = function() {
  return new Vue({
    router,
    el: '.custom-wrap'
  })
}
vue()
