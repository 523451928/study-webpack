<template>
  <div class="warp">
    <div class="user-head">
      <a href="./user.html" class="pull-left back">
        <i class="wa wa-left"></i>
      </a>
      <h2 class="title">关注与粉丝</h2>
    </div>
    <div class="pt45">
      <ul class="follow-nav-ul nav-tabs clearfix">
        <li :class="follow?'active':''" @click="Toggle('following')">
          <a class="primary-link">我的关注</a>
        </li>
        <li :class="!follow?'active':''" @click="Toggle('follower')" >
          <a class="primary-link">我的粉丝</a>
        </li>
      </ul>
      <div class="user-list">
        <div v-show="follow">
          <div class="follow-list-area clearfix">
            <div v-if="hasfollowing">
              <div class="clearfix">
                <div v-for="item in following" class="col-md-2 author-list last">
                  <a class="default-link" href="">
                    <img class="author-list-avatar" :src="item['Avatar']" />
                  </a>
                  <div class="follow-author-name text-center">
                    <a class="default-link" href="">
                      {{item['Nickname']}}
                    </a>
                  </div>
                </div>
              </div>
              <!-- 分页-->
              <div class="weui-loadmore" v-show="loading && !noMore">
                <div class="weui-loading"></div>
                <div class="weui-loadmore__tips">正在加载</div>
              </div>
              <p class="nomore text-center" v-show="noMore">没有更多了。。。</p>
            </div>
            <div v-if="!hasfollowing" class="no-pro-msg text-center">
              <h2>╮(╯▽╰)╭ 这里空空如也&nbsp;&nbsp;<a href="/list.html" class="underline-link"> 去逛逛 >> </a></h2>
            </div>
          </div>
        </div>

        <div v-show="!follow">
          <div class="follow-list-area clearfix">
            <div v-if="hasfollower">
              <div class="clearfix">
                <div v-for="itemer in follower" class="col-md-2 author-list last">
                  <a class="default-link" href="">
                    <img class="author-list-avatar" :src="itemer['Avatar']" />
                  </a>
                  <div class="follow-author-name text-center">
                    <a class="default-link" href="">
                      {{itemer['Nickname']}}
                    </a>
                  </div>
                </div>
              </div>
              <!-- 分页2-->
              <div class="weui-loadmore" v-show="loading2 && !noMore2">
                <div class="weui-loading"></div>
                <div class="weui-loadmore__tips">正在加载</div>
              </div>
              <p class="nomore text-center" v-show="noMore2">没有更多了。。。</p>
            </div>
            <div v-if="!hasfollower" class="no-pro-msg text-center">
              <h2>╮(╯▽╰)╭ 这里空空如也&nbsp;&nbsp;<a href="/list.html" class="underline-link"> 去逛逛 >> </a></h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import { getUrlParams } from 'scripts/tools/getUrlParams'
  export default {
    data() {
      return {
        hasfollower: true,
        hasfollowing: true,
        follow: true,
        follower: [],
        following: [],
        followerInit: false,
        followingInit: false,
        followingPage: 1,
        followerPage: 1,
        noMore: false,
        loading: true,
        noMore2: false,
        loading2: true
      }
    },
    mounted() {
      let self = this
      if (getUrlParams().isFollow) {
        this.follow = true 
        this.followingInit = true
        this.pullfollowing()
      } else {
        this.follow = false
        this.pullfollower()
      }
      window.onscroll = _.throttle(function() {
        if (self.follow) {  // 状态切换标志follow
          if (self.noMore) return
          if (!self.loading && $(window).scrollTop() === $(document).height() - $(window).height()) {
            self.followingPage++
            self.pullfollowing()
          }
        } else {
          if (self.noMore2) return
          if (!self.loading2 && $(window).scrollTop() === $(document).height() - $(window).height()) {
            self.followerPage++
            self.pullfollower()
          }
        }
      }, 1000)
    },
    methods: {
      Toggle(str) {
        if (str === 'following') {
          this.follow = true
          if (!this.followingInit) {
            this.followingInit = true
            this.pullfollowing()
          }
        } else if (str === 'follower') {
          this.follow = false
          if (!this.followerInit) {
            this.followerInit = true
            this.pullfollower()
          }
        }
      },
      toggleFollow(id) {
        let params = {
          UserId: id
        }
        request.submit('follow/user', params).then(res => {
          const str = res.take('Data') ? '关注成功' : '取消关注成功'
          layer.toast(str)
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pullfollowing() {
        let self = this
        let params = {
          'Page': this.followingPage || 1,
          'Passive': false
        }
        this.loading = true
        request({url: 'follow/list', params}).then(res => {
          self.following = self.following.concat(res.take('Data')) || []
          if (this.followingPage === 1) {
            if (_.isEmpty(res.take('Data'))) {
              self.hasfollowing = false
              return
            } else if (res.take('Data').length < res['body']['Pager']['Count']) {
              self.noMore = true
              self.loading = false
            }
          }
          _.each(self.following, function(v) {
            v['Avatar'] = v['Avatar'] ? `/thumbnail/avatar/${v['Id']}/100/${v['Avatar']}` : require('assets/images/user/default-profile.jpg')
          })
          self.loading = false
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pullfollower() {
        let self = this
        let params = {
          'Page': this.followerPage || 1,
          'Passive': true
        }
        this.loading2 = true
        request({url: 'follow/list', params}).then(res => {
          self.follower = self.follower.concat(res.take('Data')) || []
          if (this.followerPage === 1) {
            if (_.isEmpty(res.take('Data'))) {
              self.hasfollower = false
              return
            } else if (res.take('Data').length < res['body']['Pager']['Count']) {
              self.noMore2 = true
              self.loading2 = false
            }
          }
          _.each(self.follower, function(v) {
            v['Avatar'] = v['Avatar'] ? `http://192.168.1.6:8000/thumbnail/avatar/${v['Id']}/100/${v['Avatar']}` : `static/images/user/default-profile.jpg`
          })
          self.loading2 = false
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
