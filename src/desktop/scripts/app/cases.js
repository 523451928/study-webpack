require('scripts/app/_global')
require('styles/scss/cases/cases')
require('js/jquery.lazyload.js')

const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/line'},
    {path: '/line', component: require('components/cases/cases.vue'), meta: {title: '线下案例'}},
    {path: '/inspiration', component: require('components/cases/inspiration.vue'), meta: {title: '灵感案例'}}
  ]
})
router.afterEach(to => { document.title = to.meta.title })
/* eslint-disable no-new */
new Vue({
  router,
  el: '.bd'
})
