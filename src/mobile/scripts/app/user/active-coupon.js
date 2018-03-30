
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/user/active-coupon')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'activecoupon': require('components/user/active-coupon.vue')
  }
})
