
require('scripts/app/_global')
require('styles/scss/cart/cart')
require('js/jquery.lazyload.js')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')

/* eslint-disable */
new Vue({
  el: '.bd',
  components: {
    'car': require('components/cart/car.vue')
  }
})
