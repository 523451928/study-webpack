<template>
  <div class="tip-wrapper">
    <transition name="fade">
      <div class="mask" v-show="tipShow" @click="tipShow=false">
        <div class="tip-info" @click.stop>
          <p class="first-p">请点击右上角的「<span></span><span></span><span></span>」按钮</p>
          <p>选择直接发送给朋友或分享到朋友圈</p>
          <span class="triangle"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        tipShow: false
      }
    },
    methods: {
      showTip() {
        this.tipShow = true
      }
    }
  }
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: all .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .fade-enter .tip-info, .fade-leave-to .tip-info{
    transform: translateY(50%);
  }
  .mask{
    position: fixed;
    width:100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 13px 12px;
    background: rgba(0,0,0,0.4);
  }
  .tip-info{
    background: #fff;
    transition: all .3s;
    text-align: center;
    font-size: 14px;
    padding: 0.2rem 0;
    color: #82888a;
    position: relative;
    border-radius: 4px;
  }
  .tip-info .first-p{
    color: #26A7C7;
    margin-bottom: 5px;
  }
  .tip-info .first-p span{
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #26A7C7;
    margin: 0 2px 2px 0;
  }
  .triangle {
    position: absolute;
    right: 10px;
    top: -14px;
    display: inline-block;
    width: 0;
    height: 0;
    line-height: 0;
    border: 15px solid transparent;
    border-bottom-color: #fff;
    border-top-width: 0;
  }
</style>
