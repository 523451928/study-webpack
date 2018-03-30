
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/user/like')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'like': require('components/user/like/like.vue'),
    'userEditNav': require('components/user/user-edit-nav.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})
