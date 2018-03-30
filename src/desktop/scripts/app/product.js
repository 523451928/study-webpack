/* eslint-disable */
// Copyright 2016 CHEN Xianren. All rights reserved.
require('scripts/app/_global.js')
require('styles/scss/create-product/product')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')
const router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: require('components/create-product'), meta: { title: '发布新产品' } },
    { path: '/edit/:id', component: require('components/create-product'), meta: { title: '编辑产品' } },
    { path: '*', component: require('components/404'), meta: { title: '页面不存在' } }
  ]
})

// window.onbeforeunload = function() {
//   return true
// }
window.is_confirm = true
$(window).bind('beforeunload', function(){
  // 只有在标识变量is_confirm不为false时，才弹出确认提示
  if(window.is_confirm){
    return '您可能有数据没有保存'
  }
})

router.afterEach(to => { document.title = to.meta.title })

let vue = function() {
  return new Vue({
    router,
    el: '.product-wrap'
  })
}
vue()
