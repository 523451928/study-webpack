
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/user/userBnr')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'user': require('components/user/user.vue')
  }
})
