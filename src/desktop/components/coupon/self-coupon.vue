<template>
  <transition name="fade-in">
    <div class="main-cont tab-content col-md-10">
    <div class="form-wrap" @click="close">
      <div class="panel panel-default">
        <div class="panel-heading">我的优惠码</div>
        <div class="panel-body profile-panel-body coupon-panel">
          <div class="top">
            <span class="tit">
              <i class="wa wa-discount"></i>
               邀请好友，共享优惠！
            </span>
            <a href="/faq.html#coupon-share" class="link notFloat" target="_blank">详情</a><br />
            <span class="desc mt10">
              分享我的优惠码( <span v-text="amountText"></span> ) 给身边的小伙伴,定制成功即可获得订单实付金额 <span v-text="rewardText"></span> 返现(可累计)
            </span>
          </div>
          <div class="bottom">
            <span class="desc">分享我的优惠码<strong> {{couponObj.Code}} </strong>至</span>
            <div class="social-list">
              <button class="btn btn-default" @click="share('weibo')">
                <i class="ww-icon social-color weibo-light-color"></i>
                <span>新浪微博</span>
              </button>
              <button class="btn btn-default" @click="share('qzone')">
                <i class="ww-icon social-color qq-light-color"></i>
                <span>QQ空间</span>
              </button>
              <button class="btn btn-default" @mouseenter="seen">
                <i class="ww-icon social-color weixin-light-color"></i>
                <span>微信分享</span>
              </button>
              <button class="btn btn-default" @click="share('douban')">
                <i class="ww-icon social-color douban-light-color"></i>
                <span>豆瓣广播</span>
              </button>
              <transition name="fade-in">
                <div class="share-erweima" v-show="erweima" @click.stop >
                  <p class="close" @click="close">
                    <span>×</span>
                  </p>
                  <p class="mb10">扫一扫进行分享,打开网页后点击屏幕右上角分享按钮</p>
                  <div class="code-wrap">
                    <img :src="weixinSrc" alt="墙蛙微信分享二维码" class="code"/>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>
<script>
  /* eslint-disable */
import { InterfaceMap as interf } from 'scripts/interfaceConst'
export default {
  data() {
    return {
      erweima: false,
      couponObj: {},
      weixinSrc: ''
    }
  },
  mounted() {
    request({ url: 'coupon/user' }).then(res => {
      this.couponObj = res.take('Data')
    })
  },
  computed: {
    rewardText() {
      if (this.couponObj.RewardScale) {
        return '享受' + this.couponObj['Reward'] / 10 +'折优惠'
      } else {
        return '￥' + this.couponObj['Reward'] / 100 + '元'
      }
    },
    amountText() {
      if (this.couponObj.AmountScale) {
        return  '享受' + this.couponObj['Amount'] / 10 +'折优惠'
      } else {
        return '价值 ￥' + this.couponObj['Amount'] / 100 + '元'
      }
    }
  },
  methods: {
    close() {
      this.erweima = false
    },
    seen() {
      this.erweima = true
      let url = window.location.protocol + '//' + window.location.host + '/couponshare'
      // 请求获得分享二维码
      this.$request.submit('share/qr', {
        Link: url
      }).then(res => {
        this.weixinSrc = `data:image/png;base64,${res.take('Data')}`
      })
    },
    share(action) {
      return
      let params = {
        Target: '闲人'
      }
      switch (action) {
        case 'douban':
          params.Platform = 'douban'
          break
        case 'qzone':
          params.Platform = 'qzone'
          break
        case 'weibo':
          params.Platform = 'weibo'
          break
      }
      this.$request.submit('share', params).then(res => {
        window.location.href = res.take('Data')
      })
    }
  }
}
</script>
