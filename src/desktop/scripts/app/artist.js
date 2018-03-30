// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('styles/scss/artist/artist')
require('js/jquery.lazyload.js')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'artist': require('components/artist/artist.vue')
  }
})
