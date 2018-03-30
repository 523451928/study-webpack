require('scripts/app/_global.js')
require('styles/scss/share/share.scss')
require('scripts/app/public/rgbaster.js')
import 'styles/public/flex.css'
// import VueFullpage from 'vue-fullpage'
// Vue.use(VueFullpage)
let router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/preshare', component: require('components/share') }
  ]
})

let vue = function() {
  return new Vue({
    el: '.bd',
    router
  })
}

vue()
