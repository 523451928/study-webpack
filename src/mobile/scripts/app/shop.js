require('scripts/app/_global')
require('scripts/tools/setfontsize')
require('styles/scss/shop/shop')

/* eslint-disable */
new Vue({
  el: '.bd',
  components: {
    'searchHead': require('components/wa-shop/searchHead'),
    'navBar': require('components/navBar'),
    'categorySwiper': require('components/wa-shop/categorySwiper'),
    'recommend': require('components/wa-shop/recommend')
  }
})
