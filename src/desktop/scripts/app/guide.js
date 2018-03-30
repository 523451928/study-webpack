
require('scripts/app/_global')
require('styles/scss/guide/guide')
require('styles/scss/artist/artist')
require('js/jquery.lazyload.js')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'guide': require('components/guide/guide.vue')
  }
})
