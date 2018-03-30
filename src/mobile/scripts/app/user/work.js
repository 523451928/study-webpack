require('scripts/app/_global')
require('scripts/tools/setfontsize')
require('scripts/tools/vue-tips')
require('styles/public/tips.css')
require('styles/scss/user/work')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'work': require('components/user/work.vue')
  }
})
