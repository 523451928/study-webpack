<template>
  <div class="user-hear-warp">
  <!--问题联系浮动二维码开始-->
    <div class="contact-wechat" v-show="seen">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)" @click="seen=false">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--问题结束-->

    <!--用户背景图片开始-->
    <div class="user-head-bnr" :style="{background: 'url('+banner+') 50% 50% repeat-x'}">
      <div class="follow-area">
        <a class="btn btn-default btn-sm" @click="toggleFollow(user.Id)" :class="{active:isFollow}" id="follow-btn">
          <span class="no-flw-text">+ 关注</span>
          <span class="flw-text">
              <span class="flw-text-normal">已关注</span>
              <span class="flw-text-hover">取消关注</span>
          </span>
        </a>
      </div>
      <div class="user-bnr-info">
        <a class="head-icon layout-avatar" href="javascript:;">
          <img class="item" :src="Avatar">
        </a>
        <div class="text-center user-info-name" v-text="Nickname"></div>
      </div>
    </div>
    <!--用户背景图片结束-->

    <!--用户导航nav开始-->
    <div class="user-nav">
      <ul class="user-nav-ul clearfix">
        <li class="li-link" :class="{active:flag=='pro'}" @click="tabClick('pro')">
          <a class="default-link">我的产品</a>
        </li>
        <li class="li-link" :class="{active:flag=='intro'}" @click="tabClick('intro')">
          <a class="default-link">简介</a>
        </li>
        <li class="li-link" :class="{active:flag=='like'}" @click="tabClick('like')">
          <a class="default-link">喜欢</a>
        </li>
        <li class="li-link" :class="{active:flag=='follow'}" @click="tabClick('follow')">
          <a class="default-link">关注</a>
        </li>
      </ul>
    </div>
    <!--用户导航nav结束-->
  </div>
</template>
<script>
import { getParameter } from 'js/getParameter.js'
export default {
  data() {
    return {
      seen: true,
      Avatar: '',
      Nickname: '',
      user: {},
      active: 1,
      isFollow: false,
      userID: '',
      flag: 'pro',
      banner: ''
    }
  },
  mounted() {
    this.userID = getParameter('userId')
    this.pull()
  },
  methods: {
    tabClick(str) {
      this.flag = str
      this.$bus.$emit('isOpen', str)
    },
    pull() {
      let params = {
        ArtistId: this.userID
      }
      request({url: 'profile/si', params}).then(res => {
        this.user = res.take('Data')
        if (!_.isEmpty(this.user['Banner'])) {
          this.banner = `http://192.168.1.6:8000/thumbnail/banner/${this.user['Banner']['Id']}/1920/${this.user['Banner']['Image']}`
        } else {
          this.banner = `https://wallwa.com/images/user/banner-tpl/tpl-0.jpg`
        }
        if (this.user['Avatar']) {
          this.Avatar = 'http://192.168.1.6:8000/thumbnail/avatar/' + this.user['Id'] + '/100/' + this.user['Avatar']
        } else {
          this.Avatar = '/static/images/user/default-profile.jpg'
        }
        if (this.user['Nickname'] !== '') {
          this.Nickname = this.user['Nickname']
        } else {
          this.Nickname = 'U' + this.user['Id']
        }
        this.isFollow = this.user['IsFollow']
      }, res => {
        res.hide()
        layer.toast(res.take('Error'))
      })
    },
    toggleFollow(id) {
      let params = {
        UserId: id
      }
      request.submit('follow/user', params).then(res => {
        const str = res.take('Data') ? '关注成功' : '取消关注成功'
        this.isFollow = res.take('Data')
        layer.toast(str)
      }, res => {
        res.hide()
        layer.toast(res.take('Error'))
      })
    }
  }
}
</script>
<style>
  @import "../../styles/scss/user-head.scss";
</style>

