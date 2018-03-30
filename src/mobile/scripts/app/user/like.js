
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/user/like')

/* eslint-disable no-new */
let vue = function() {
  return new Vue({
    el: '.bd',
    components: {
      'like': require('components/user/like/like.vue')
    }
  })
}
vue()
