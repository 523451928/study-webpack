// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/pay/pay')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/jquery.lazyload.js')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'problem': require('components/problem/problem.vue')
  }
})
