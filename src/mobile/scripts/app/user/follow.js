/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/user/follow')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'follow': require('components/user/follow/follow.vue')
  }
})
