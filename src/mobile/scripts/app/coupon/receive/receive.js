require('scripts/app/_global')
require('scripts/tools/setfontsize')
require('scripts/tools/vue-tips')
require('styles/scss/coupon/share')
require('styles/scss/coupon/receive')
require('styles/public/tips.css')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'receive': require('components/coupon/receive/receive.vue')
  }
})
