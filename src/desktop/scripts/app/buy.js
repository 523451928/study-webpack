
require('scripts/app/_global')
require('styles/scss/buy/buy')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/jquery.lazyload.js')
require('scripts/app/public/vue-tips.js')
require('styles/public/tips.css')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'buy': require('components/buy/buy.vue')
  }
})
