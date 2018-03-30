
require('scripts/app/_global')
require('styles/scss/pay/pay')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/jquery.lazyload.js')
import Pay from 'components/pay/pay.vue'

/* eslint-disable no-new */
new Vue({
  components: {
    Pay
  },
  el: '.bd'
})
