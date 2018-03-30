// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/coupon/share')
require('js/validation/validationEngine-zh_CN')
require('js/validation/validationEngine')
require('js/cxcalendar')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'ninvitecode': require('components/coupon/invite/n-inviteCode.vue')
  }
})
