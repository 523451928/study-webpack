/**
 * Created by admin on 2017/2/24.
 */

require('scripts/app/_global')
require('scripts/app/public/vue-tips')
require('styles/scss/introduction/introduction')
require('styles/public/tips.css')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'userhead': require('components/setting/userhead.vue'),
    'introduction': require('components/introduction/introduction.vue')
  }
})
