require('scripts/app/_global')
require('scripts/tools/vue-tips')
require('scripts/tools/setfontsize')
require('styles/scss/cart/cart')
require('styles/public/tips.css')
require('js/jquery.lazyload.js')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'car': require('components/cart/car.vue'),
    'navBar': require('components/navBar.vue')
  }
})
