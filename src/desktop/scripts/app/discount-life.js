require('scripts/app/_global')
require('styles/scss/discountlife/discountlife')
require('js/jquery.lazyload.js')
require('scripts/app/public/vue-tips.js')
require('styles/public/tips.css')

/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'discountlife': require('components/discountlife/discountlife.vue')
  }
})
