/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/setting/setting')
require('styles/scss/income/income')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'userhead': require('components/setting/userhead.vue'),
    'withdraw': require('components/withdraw/withdraw.vue')
  }
})
