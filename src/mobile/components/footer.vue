<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div id="footer">
    <ul class="footer-list">
      <li data-type="about"><a href="/static/about.html">关于墙蛙<span class="wa wa-right"></span></a></li>
      <li data-type="copysign"><a href="/static/disney.html">迪斯尼正版授权<span class="wa wa-right"></span></a></li>
      <li data-type="agreement"><a href="/static/shop-guide.html">开店指南<span class="wa wa-right"></span></a></li>
      <li data-type="message"><a href="/static/copy-sign.html">版权签约<span class="wa wa-right"></span></a></li>
      <li data-type="join"><a href="/static/join.html">加入我们<span class="wa wa-right"></span></a></li>
      <li data-type="agency"><a href="/static/agency.html">机构合作优惠<span class="wa wa-right"></span></a></li>
    </ul>
    <p class="copyrights">© 2015 wallwa.com 版权所有 浙ICP备14010433号</p>
  </div>
</template>

<style lang='sass'>
  #footer {
    width: 100%;
    height: auto;
    background-color: #fff;
    position: relative;
    padding-bottom: 50px;
    .footer-list {
      padding: 0 5px;
      padding-top: 10px;
      > li {
        padding: 5px 10px 5px 15px;
        /*height: 100%;*/
        line-height:41px;
        width: 100%;
        border-top: 1px solid #f5f5f5;
        &:nth-last-child(1) {
          border-bottom: 1px solid #f5f5f5;
        }
        > a {
          color: rgb(130, 136, 138) ;
          display: block;
          cursor: pointer;
          > span {
            float: right;
            line-height: 39px;
            color: #c4c4c4;
            font-size: 10px;
          }
        }
      }
    }
    .copyrights {
      font-size: 13px;
      padding-left: 15px;
      line-height: 40px;
    }
  }
</style>

<script>
import {initGo2Top, gotop} from './gotop'
export default {
  data() {
    return {
      testMsg: 'Hello, Vue!'
    }
  },
  created() {
    // alert('testMsg is: ' + this.testMsg)
  },
  mounted() {
    initGo2Top()
  },
  methods: {
    goTop: function() {
      gotop()
    }
  }
}
</script>
