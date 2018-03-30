/*eslint-disable */

require('scripts/app/_global')
require('js/jquery.lazyload.js')
require('styles/scss/core/reset.scss')

let win = window
let doc = win.document
let docEl = doc.documentElement
let tid

function refreshRem() {
 let w = docEl.getBoundingClientRect().width
 if (w > 540) {
   w = 540
 }
 docEl.style.fontSize = (w / 3.75) + 'px'
}
refreshRem()
win.addEventListener('resize', function() {
  clearTimeout(tid)
  tid = setTimeout(refreshRem, 300)
}, false)

new Vue({
  el: '.bd',
  components: {
    OrderTitle: require('components/core/title.vue'),
    OrderVerify: require('components/order-verify/order-verify.vue')
  }
})