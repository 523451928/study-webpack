// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/static/static')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/cxcalendar')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'copysign': require('components/static/copysign.vue')
  }
})
