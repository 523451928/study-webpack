require('scripts/app/_global')
require('scripts/tools/setfontsize')
require('scripts/tools/vue-tips')
require('styles/public/tips.css')
require('styles/scss/activity/wallactivity')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'wallactivity': require('components/activity/wallactivity.vue')
  }
})
