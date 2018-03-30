// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/auth')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'bg': require('components/auth/bg.vue'),
    'login': require('components/auth/login.vue')
  }
})
