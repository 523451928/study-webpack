// Copyright 2016 CHEN Xianren. All rights reserved.
/* eslint-disable */
require('scripts/app/_global')
require('styles/scss/persional/persional')
require('styles/scss/user/follow')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')
require('styles/scss/user-head')
const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    { path: '/artist', redirect: '/artist-list/1' },
    { path: '/artist/:id', meta: { title: '墙蛙 - 定制' } }
  ]
})
/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'list': require('components/persional/list.vue'),
    'display': require('components/list/display.vue'),
    'like': require('components/public/personal/like.vue'),
    'displayHover': require('components/list/displayHover.vue')
  },
  router,
  methods: {
    /**
     * 关注用户
     */
    onFollow() {
      const self = this
      const el = self.$refs.follow
      const userId1 = self.$user.UserId
      const userId2 = self.$refs.follow.getAttribute('data-id')
      if (Number(userId1) === Number(userId2)) {
        self.$notify({
          type: 'wa-warning',
          text: '不能自己关注自己'
        })
      } else {
        self.$request.submit('follow/user', {
          UserId: userId2
        }).then(res => {
          let data = res.take('Data')
          let str = ''
          if (data) {
            str = '关注成功'
            el.innerHTML = '取消关注'
          } else {
            str = '取消成功'
            el.innerHTML = '关注TA'
          }
          self.$notify({
            type: 'wa-warning',
            text: str
          })
        })
      }
    }
  }
})
var vue = new Vue()
