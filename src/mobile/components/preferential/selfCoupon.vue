<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">我的优惠码</div>
        <div class="panel-body profile-panel-body coupon-panel">
          <div class="top">
            <span class="tit">
              <i class="wa wa-discount"></i>
               邀请好友，共享优惠！
            </span>
            <a href="/message.html?messages=1" class="link notFloat" target="_blank">详情</a><br />
            <span class="desc mt10">
              分享我的优惠码( 价值￥<span class="u-amount" v-text="moneyChange(coupon.Amount)"></span> ) 给身边的小伙伴,定制成功即可获得 ￥<span v-text="moneyChange(coupon.Return)"></span> 返现(可累计)
            </span>
          </div>
          <div class="bottom">
            <span class="desc">分享我的优惠码
              <strong> {{coupon.Code}} </strong>至
            </span>
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
              <div class="share-erweima" v-show="erweima">
                <button type="button" class="close" @click="close">
                  <span>×</span>
                </button>
                <p class="mb10">扫一扫进行分享,打开网页后点击屏幕右上角分享按钮</p>
                <div class="code-wrap">
                  <img :src="weixin" alt="墙蛙微信分享二维码" class="code"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
export default {
  data() {
    return {
      erweima: false,
      coupon: [],
      shareUrl: {},
      weixin: ''
    }
  },
  mounted() {
    let self = this
    request({ url: 'tc/coupon/user' }).then(res => {
      self.coupon = res.take('Data')
    })
  },
  methods: {
    close() {
      this.erweima = false
    },
    seen() {
      this.erweima = true
      let params = {}
      request.submit(Interf.shareCoupon + 'weixin', params).then(res => {
        this.weixin = 'data:image/png;base64,' + res.take('Data')
      }, res => {
        res.hide()
      })
    },
    moneyChange(x) {
      let a = x / 100
      return a
    },
    share(action) {
      let params = {}
      switch (action) {
        case 'douban':
          request.submit(Interf.shareCoupon + 'douban', params).then(
          res => {
            this.shareUrl.douban = res.take('Data')
            window.location.href = this.shareUrl.douban
          }, res => {
            res.hide()
          })
          break
        case 'qzone':
          request.submit(Interf.shareCoupon + 'qzone', params).then(
          res => {
            this.shareUrl.qzone = res.take('Data')
            window.location.href = this.shareUrl.qzone
          }, res => {
            res.hide()
          })
          break
        case 'weibo':
          request.submit(Interf.shareCoupon + 'weibo', params).then(res => {
            this.shareUrl.weibo = res.take('Data')
            window.location.href = this.shareUrl.weibo
          }, res => {
            res.hide()
          })
          break
      }
    }
  }
}
</script>
