// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/pet/pet')
require('js/jquery.lazyload.js')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'pet': require('components/pet/pet.vue')
  }
})
