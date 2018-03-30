require('scripts/app/_global')
require('styles/scss/static/static')
require('styles/scss/static/collections')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/cxcalendar')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'group': require('components/static/group.vue')
  }
})
