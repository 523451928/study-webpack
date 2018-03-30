// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('scripts/app/public/flycart.js')
require('styles/scss/custom/custom.scss')
import HeadNav from 'components/custom/head-nav'
import CustomProDetail from 'components/custom/custom-pro-detail'
import { DecorativeCategories as dc } from 'scripts/utils/custom/consts'

const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    { path: '/custom', redirect: '/custom/' + dc.Frames },
    { path: '/custom/:id', component: require('components/custom'), meta: { title: '墙蛙 - 定制' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

let vue = function() {
  return new Vue({
    components: { HeadNav, CustomProDetail },
    router,
    el: '.custom-wrap'
  })
}
vue()
