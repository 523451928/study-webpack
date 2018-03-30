
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/user/wa-bin')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'wabin': require('components/user/wa-bin.vue')
  }
})
