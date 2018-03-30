// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/children/children')
require('js/jquery.lazyload.js')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'children': require('components/children/children.vue')
  }
})
