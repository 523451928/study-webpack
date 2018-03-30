<template>
  <div class="group-studio">
    <wa-head title="团体定制"></wa-head>
    <div class="item-wrap">
      <div class="img-wrap"><img src="~images/collections/group/group-01.jpg" alt=""></div>
      <div class="title-wrap">
        <p>欢迎来墙蛙进行团体定制。如果您需要批量定制10件及以上的产品，可联系客服获取相应的优惠价格。</p>
        <p>请点击下方按钮，留言您要批量定制的<span>产品，数量以及联系方式</span>，我们会在看到留言的第一时间与您联系。</p>
      </div>
    </div>
    <div class="contact-customer" @click="contactService">
      <a href="javascript:void(0)" class="contact-kefu">
        <span class="wa wa-woman"></span>
        <span>联系客服</span>
      </a>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import waHead from '../public/Wahead.vue'
  export default {
    components: {
      waHead
    },
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
