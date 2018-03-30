
require('scripts/app/_global')
require('styles/scss/faq/faq')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'faq': require('components/faq/faq.vue')
  }
})
