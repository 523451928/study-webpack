<template>
  <div class="warp">
    <div class="user-head">
      <a href="/" class="pull-left back">
        <i class="wa wa-left"></i>返回
      </a>
      <h2 class="title">消息</h2>
    </div>
    <div class="message-content">
      <a @click="contactService" href="javascript:void (0)">
        <span class="wa-icon wa-woman"></span>
        <span class="text">客服</span>
        <span class="wa-right fr"></span>
      </a>
      <a href="javascript:void (0)">
        <span class="wa-icon wa-e-mail"></span>
        <span class="text">订单消息</span>
        <span class="wa-right fr"></span>
      </a>
      <a href="/user/active-coupon.html">
        <span class="wa-icon wa-order-income"></span>
        <span class="text">优惠券</span>
        <span class="wa-right fr"></span>
      </a>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    methods: {
      contactService() {
        request({url: 'user/improve'}).then((res) => {
          let data = res.body.Data
          ysf.config({
            uid: data.Id, // 用户ID
            name: data.Nickname, // 昵称
            email: data.Email, // 信箱
            mobile: data.Mobile // 手机
          })
          window.url = function(){
            location.href = ysf.url()
          }

          window.openSDK = function(){
            ysf.open()
          }
          location.href = ysf.url()
        })
      }
    }
  }
</script>
