<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div id="footer">
    <div class="ft-wrapper">
      <div class="footer-hd mb20">
        <div class="ft-right pull-right">
          <ul class="list-inline">
            <li data-type="copyright"><a href="/copy-right.html">版权声明</a></li>
            <li data-type="copysign"><a href="/copy-sign.html">版权签约</a></li>
            <li data-type="agreement"><a href="/agreement.html">用户协议</a></li>
            <li data-type="message"><a href="/faq.html">常见问题</a></li>
            <li @click='contact'><a href="javascript:void(0)">联系客服</a></li>
            <li data-type="about"><a href="/about.html">关于墙蛙</a></li>
            <li data-type="join"><a href="/join.html">加入墙蛙</a></li>
            <li data-type="contact"><a href="/contact.html">联系我们</a></li>
          </ul>
        </div>
        <div class="social-follow">
          <span class="item title">关注我们</span>
          <a href="http://weibo.com/wallwa" class="item social-item">
            <i class="ww-icon social-i weibo-b"></i>
          </a>
          <a href="javascript:void(0)" class="item social-item weixin-item">
            <i class="ww-icon social-i weixin-b" ></i>
            <img src="~images/weixinma.png" alt="微信二维码" class="erweima" />
          </a>
          <span class="item ceo-item">
              意见反馈 <a href="mailto:ceo@wallwa.com?subject=反馈有奖&body=您在使用中发现墙蛙网的不足之处，不好的体验，技术的bug，请您和我联系，优质的反馈，丰厚的奖品。请在邮件中注明您的墙蛙网账号。"> ceo@wallwa.com</a>
          </span>
        </div>
      </div>
      <p class="copyrights">&copy; 2015 wallwa.com 版权所有 浙ICP备 1102094</p>
    </div>
    <a href="javascript:;" id="back-to-top" @click='goTop'>
      <i class="glyphicon glyphicon-chevron-up"></i>
      <div class="inner1"><div class="inner2"></div></div>
    </a>
  </div>
</template>

<style lang='sass'>
  #footer {
    width: 100%;
    height: 121px;
    background: url('~images/ft-bg.png') repeat-y;
  .ft-wrapper {
    padding: 30px 60px 0;
  .ww-icon {
    background: url('~images/ww-icon.png') no-repeat;
    display: inline-block;
    cursor: pointer;
  }
  .ft-right {
    float: right;
    padding-top: 11px;
  .list-inline{
    margin-left: -5px;
  >li{
     display: inline-block;
     padding-left: 5px;
     padding-right: 5px;
   }
  }
  a{
    color: #fff;
  }
  }
  .social-follow .item {
    display: inline-block;
    position: relative;
    vertical-align: middle;
  &.social-item {
     padding: 0 10px;
     margin-right: 30px;
  &:hover{
  .erweima {
    visibility: visible;
  }
  }
  }
  &.weixin-item{
  .erweima {
    position: absolute;
    width: 150px;
    top: -168px;
    left: 0;
    visibility: hidden;
    z-index: 999;
  }
  }
  &.ceo-item {
     margin-left: 0;
  a{
    color: #fff;
  }
  }
  }
  .ww-icon.social-i {
    height: 36px;
    width: 36px;
    display: inline-block;
  &.weibo-b {
     background-position: -223px -40px;
  &:hover {
     background-position: -260px -40px;
   }
  }
  &.weixin-b {
     background-position: -223px -120px;
  &:hover {
     background-position: -260px -120px;
   }
  }
  }
  .copyrights {
    color: #777;
    font-size: 14px;
    margin-bottom: 0;
  }
  }
  }
  #back-to-top {
    position: fixed;
    right: 20px;
    bottom: 10px;
    z-index: 999;
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 20px;
    color: #1b1346;
    -webkit-transition: opacity 0.4s ease-out;
    -moz-transition: opacity 0.4s ease-out;
    -ms-transition: opacity 0.4s ease-out;
    -o-transition: opacity 0.4s ease-out;
    transition: opacity 0.4s ease-out;
    opacity : 0;
  &.active {
     opacity : 1;
   }
  .inner1,
  .inner2 {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: rgba(27, 19, 70, 0.2);
    margin-top: -50px;
    display: block;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
  }
  i {
    line-height: 51px;
  }
  .inner1 {
    -webkit-transition: transform 0.15s cubic-bezier(0.55, 0.085, 0.68, 0.53) ;
    -moz-transition: transform 0.15s cubic-bezier(0.55, 0.085, 0.68, 0.53) ;
    -ms-transition: transform 0.15s cubic-bezier(0.55, 0.085, 0.68, 0.53) ;
    -o-transition: transform 0.15s cubic-bezier(0.55, 0.085, 0.68, 0.53) ;
    transition: transform 0.15s cubic-bezier(0.55, 0.085, 0.68, 0.53) ;
  }
  .inner2 {
    -webkit-transition: all 0.8s;
    -moz-transition: all 0.8s;
    -ms-transition: all 0.8s;
    -o-transition: all 0.8s;
    transition: all 0.8s;
  }
  &:hover {
  .inner1 {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }
  .inner2 {
    -webkit-animation: inner2 0.8s;
    -moz-animation: inner2 0.8s;
    animation: inner2 0.8s;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }
  }
  }

  @-webkit-keyframes inner2 {
    0% {
      -webkit-transform: scale(0);
      -webkit-animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }

    10% {
      -webkit-transform: scale(0);
    }

    12% {
      -webkit-transform: scale(1);
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      opacity: 0.9;
    }

    100% {
      -webkit-transform: scale(1.6);
      opacity: 0;
    }
  }
  @-moz-keyframes inner2 {
    0% {
      -moz-transform: scale(0);
      -moz-animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }

    10% {
      -moz-transform: scale(0);
    }

    12% {
      -moz-transform: scale(1);
      -moz-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      opacity: 0.9;
    }

    100% {
      -moz-transform: scale(1.6);
      opacity: 0;
    }
  }
  @-o-keyframes inner2 {
    0% {
      -o-transform: scale(0);
    }

    10% {
      -o-transform: scale(0);
    }

    12% {
      -o-transform: scale(1);
      opacity: 0.9;
    }

    100% {
      -o-transform: scale(1.6);
      opacity: 0;
    }
  }
  @keyframes inner2 {
    0% {
      transform: scale(0);
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }

    10% {
      transform: scale(0);
    }

    12% {
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      opacity: 0.9;
    }

    100% {
      transform: scale(1.6);
      opacity: 0;
    }
  }

</style>

<script>
/* eslint-disable */
import {initGo2Top, gotop} from './gotop'
import {mixin as contactMixin} from './contactMixin'
export default {
  mixins: [contactMixin],
  mounted() {
    initGo2Top()
  },
  methods: {
    goTop() {
      gotop()
    }
  }
}
</script>


