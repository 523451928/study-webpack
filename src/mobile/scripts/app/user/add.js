/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('scripts/tools/vue-tips')
require('styles/public/tips.css')
require('styles/scss/user/add')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/cxcalendar')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'add': require('components/user/add.vue')
  }
})
