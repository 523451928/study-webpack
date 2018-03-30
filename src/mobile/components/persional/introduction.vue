<template>
  <div class="user-center-wrap">
    <div class="row user-des">
      <div class="col-md-6">
        <h2 class="user-des-title">个人说明</h2>
        <div class="user-des-text">
            <pre class="user-des-con" v-text="obj.Introduction||'暂无个人说明'">
            </pre>
        </div>
        <div class="user-des-date">
          <span class="user-join-date" v-text="paraStr(obj.JoinDate)"></span> 加入墙蛙
        </div>

        <div class="user-profile-social social clearfix" v-show="false">
          <div class="center-social-area">
            <a class="weibo-share" target="_blank" id="weibo-share">
              <label>新浪微博：</label>
              <i class="wa wa-weibo active"></i>
            </a>
          </div>
          <div class="center-social-area">
            <label class="pull-left inline-label">微信二维码：</label>
            <div class="social-ewm pull-left " id="wechat-share">
              <img src="" class="big-image" />
              <i class="wa wa-wechat active"></i>
            </div>
          </div>
        </div>
        <div class="persional-coupon">
          <h2 class="user-des-title"><span class="per-avatar-name" v-text="obj.Nickname"></span>的优惠码</h2>
          下单时输入优惠码 <span class="per-coupon-code" v-text="obj.CouponUserCode"></span> 可优惠¥{{obj.CouponUserAmount/100}}元. 相应的，<span class="per-avatar-name" v-text="obj.Nickname"></span>也将获得10元返现红包。
        </div>
      </div>
      <div class="col-md-6 user-ads">
        <div class="user-ads-slider" id="user-ads-slider">
          <div class="flex-viewport">
            <ul class="list-unstyled slides user-ads-list clearfix">
              <li>
                <a href="javascript:void(0)">
                  <img src="http://wallwa.com/uc/advise/image/0/fa1af2938717777b5874aabc2150db79-480x300.jpeg" alt="photo"/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getParameter } from 'js/getParameter.js'
export default {
  data() {
    return {
      obj: {}
    }
  },
  mounted() {
    this.pull()
  },
  methods: {
    pull() {
      const id = getParameter('userId')
      const params = {
        ArtistId: id
      }
      request({url: 'profile/si', params}).then(res => {
        this.obj = res.take('Data')
      }, res => {
        res.hide()
        layer.toast(res.take('Error'))
      })
    },
    paraStr(num) {
      let str = String(num)
      return `${str.slice(0, -4)}.${str.slice(-4, -2)}.${str.slice(-2)}`
    }
  }
}
</script>
