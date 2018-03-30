// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/product/product.scss')

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: require('components/product'), meta: { title: '创建新产品' } },
    { path: '/edit/:id', component: require('components/product'), meta: { title: '编辑产品' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

router.afterEach(to => { document.title = to.meta.title })

let vue = function() {
  return new Vue({
    router,
    el: '.product-wrap'
  })
}
vue()
