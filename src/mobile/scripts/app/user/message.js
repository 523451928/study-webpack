require('scripts/app/_global')
require('styles/scss/user/message.scss')
require('styles/style.scss')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'message': require('components/user/message/message.vue')
  }
})
