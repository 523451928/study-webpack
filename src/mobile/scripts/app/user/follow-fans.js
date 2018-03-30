/* eslint-disable */
require('scripts/app/_global')
require('scripts/tools/setfontsize')
require('styles/scss/user/follow-fans')

const router = new VueRouter({
    linkActiveClass: 'active',
    routes: [
        {path: '/', redirect: '/follow'},
        {path: '/follow', component: require('components/user/follow/my-follow')},
        { path: '/fans', component: require('components/user/follow/my-fans')}
    ]
})

new Vue({
    router,
    el: '.bd',
    components: {
        'followHead': require('components/user/follow/follow-head'),
        'followNav':require('components/user/follow/follow-nav')
    }
})