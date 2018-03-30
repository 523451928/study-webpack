require('scripts/app/_global')
require('styles/scss/buy/buy')
require('scripts/tools/vue-tips')
require('scripts/tools/setfontsize')
require('styles/public/weui.css')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('styles/public/tips.css')
require('js/jquery.lazyload.js')

/* eslint-disable */
new Vue({
  el: '.bd',
  components: {
    'buy': require('components/buy/buy.vue')
  }
})
