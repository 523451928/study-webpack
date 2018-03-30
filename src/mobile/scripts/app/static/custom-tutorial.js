/**
 * Created by Administrator on 2017/4/17.
 */
require('scripts/app/_global')
require('styles/scss/custom/custom.scss')

let vue = function() {
  return new Vue({
    el: '.custom-tutorial',
    components: {
      tutorial: require('components/static/tutorial.vue')
    }
  })
}
vue()
