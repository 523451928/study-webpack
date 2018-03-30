<template>
  <div class="group-studio">
    <wa-head title="画室机构合作"></wa-head>
    <div class="item-wrap">
      <div class="img-wrap"><img src="~images/collections/studio/studio-01.jpg" alt=""></div>
      <div class="title-wrap">
        <p>如果您是绘画机构的老师或负责人，可申请成为墙蛙绘画机构合作伙伴。确认合作后即可免费领取一套机构专属定制礼包+定期新品体验资格。</p>
        <p>请点击下方按钮，留言您所在的<span>机构名称，学生数量，授课所在地及联系方式</span>，我们会在看到留言的第一时间与您联系。</p>
      </div>
    </div>
    <div class="contact-customer">
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
