/**
 * Created by Administrator on 2017/4/17.
 */
require('scripts/app/_global')
require('styles/scss/custom/custom.scss')

import customList from 'components/custom/custom-list'
import fixedCartBtn from 'components/public/fixed-icon-btn'

let vue = function() {
  return new Vue({
    el: '.custom-list-wrap',
    components: {
      'custom-list': customList,
      'fixed-cart-btn': fixedCartBtn
    }
  })
}
vue()
