<template>
  <div class="ww-wrap" id="contact-static">
    <!--问题联系浮动二维码开始-->
    <div class="contact-wechat" v-show="seen">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)" @click="hide">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--//问题结束-->
    <!--联系我们开始-->
    <div class="ww-wrap assist-wrap">
      <div class="assist-hd contact-hd">
        <div class="cont">
          <h1>联系我们</h1>
          <p>期待听见你的声音</p>
        </div>
      </div>
      <div class="assist-item white">
        <div class="assist-cont">
          <ul class="icon-list list-unstyled row">
            <li class="col-md-4">
              <div class="icon-wrap pt15">
                <i class="assist-i email"></i>
              </div>
              <h3>业务联络</h3>
              <p>
                <a href="mailto:art@wallwa.com">art@wallwa.com</a>
              </p>
            </li>
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i join"></i>
              </div>
              <h3>加入墙蛙</h3>
              <p>
                <a href="mailto:join@wallwa.com">join@wallwa.com</a>
              </p>
            </li>
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i phone"></i>
              </div>
              <h3>售后电话</h3>
              <p>0571-88194120</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--//联系我们结束-->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        seen: true
      }
    },
    methods: {
      hide() {
        this.seen = false
      }
    }
  }
</script>
