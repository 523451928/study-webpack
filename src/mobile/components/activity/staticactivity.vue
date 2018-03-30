<template>
  <div class="activity-wrapper">
    <div class="fix-header">
      <a href="/">
        <img src="~images/activity/eleven/logo.png" class="logo">
      </a>
      <span class="share-btn" @click="showTip">
        分享给朋友<img src="~images/activity/ic-share.svg">
      </span>
    </div>
    <div class="img-container">
      <img src="~images/activity/eleven/1.jpg">
      <img src="~images/activity/eleven/2.jpg">
      <img src="~images/activity/eleven/3.jpg" @click="receiveCoupon">
    </div>
    <share-tip ref="shareTip"></share-tip>
  </div>
</template>

<script>
  import ShareTip from '../public/ShareTip.vue'
  import { wxShare } from 'scripts/utils/wx-util.js'
  import { getUrlParams } from 'scripts/tools/getUrlParams'
  import { mixin as methods } from 'scripts/tools/reciveCoupon'
  export default {
    mixins: [methods],
    data() {
      return {
        shareUrl: window.location.href,
        couponArr: []
      }
    },
    methods: {
      showTip() {
        this.$refs.shareTip.showTip()
      }
    },
    mounted() {
      this.couponArr = [getUrlParams().couponCode]
      request.submit('share/sign', {
        Debug: false,
        Link: this.shareUrl
      }).then(res => {
        console.log(res.take('Data'))
        let wxObj = {
          title: '我在墙蛙网买到了一个好东西，快来围观吧！',
          desc: '30万家庭的共同选择，让你的家更有艺术气息！',
          link: window.location.href.split('#')[0],
          imgUrl: 'http://m.wallwa.com/images/share-logo2.jpg'
        }
        // 调用微信分享
        wxShare(res.take('Data'), wxObj)
      })
    },
    components: {
      ShareTip
    }
  }
</script>
