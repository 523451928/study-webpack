require('scripts/app/_global.js')
require('scripts/app/public/setfontsize.js')
require('scripts/tools/vue-tips.js')
require('styles/scss/receive-coupon/receive-coupon.scss')
require('styles/public/tips-mobile.css')
let router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/receive-coupon/:id', component: require('components/receive-coupon')}
  ]
})

function vue() {
  return new Vue({
    el: '.bd',
    router
  })
}
vue()
