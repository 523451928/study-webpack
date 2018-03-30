// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/persional/persional')
require('styles/scss/user/follow')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'list': require('components/persional/list.vue'),
    'display': require('components/list/display.vue'),
    'userhead': require('components/persional/userhead.vue')
  }
})
