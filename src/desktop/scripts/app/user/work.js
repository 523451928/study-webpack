/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/work/work')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'work': require('components/work/work.vue'),
    'userEditNav': require('components/user/user-edit-nav.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})
