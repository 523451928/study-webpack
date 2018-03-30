/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/work/work')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'work': require('components/work/work.vue'),
    'userhead': require('components/setting/userhead.vue')
  }
})
