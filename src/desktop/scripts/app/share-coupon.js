require('scripts/app/_global.js')
require('scripts/app/public/setfontsize.js')
require('styles/scss/share-coupon/share-coupon.scss')

let router = new VueRouter({
  mode: 'history',
  routes: [
    {path: '/coupon-share', redirect: '/couponshare/0'},
    {path: '/coupon-share/:id', component: require('components/share-coupon')}
  ]
})
function vue() {
  return new Vue({
    el: '.bd',
    router
  })
}
vue()
