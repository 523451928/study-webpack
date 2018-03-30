<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
<div id="auth-background">
  <div class="bg-wrap" :class="[on?'bg-wrap-'+on+' active':'']">
  </div>
  <div class="author-msg-wrap">
    <div class="author-msg work-1" :class="[1==on?'active':'']">
      《行走日记E》 by <a href="javascript:void(0)">陈曦</a>
    </div>
    <div class="author-msg work-2" :class="[2==on?'active':'']">
      《离人》 by <a href="/persional?userId=254">外星人金亮</a>
    </div>
    <div class="author-msg work-3" :class="[3==on?'active':'']">
      《一纸清梦 东山》 by <a href="javascript:void(0)">昔酒</a>
    </div>
    <div class="author-msg work-4" :class="[4==on?'active':'']">
      《行走日记C》 by <a href="javascript:void(0)">陈曦</a>
    </div>
    <div class="author-msg work-5" :class="[5==on?'active':'']">
      《行走日记F》 by <a href="javascript:void(0)">陈曦</a>
    </div>
    <div class="author-msg work-6" :class="[6==on?'active':'']">
      《日常影像 金字塔》
    </div>
    <div class="author-msg work-7" :class="[7==on?'active':'']">
      《行走日记D》 by <a href="javascript:void(0)">陈曦</a>
    </div>
    <div class="author-msg work-8" :class="[8==on?'active':'']">
      《梦中梦》 by <a href="javascript:void(0)">昔酒</a>
    </div>
    <div class="author-msg work-9" :class="[9==on?'active':'']">
      《水天之间》 by <a href="javascript:void(0)">陈曦</a>
    </div>
  </div>
  <div class="rl-footer visible-lg-block">
    <div class="pull-right bgslide-btn-wrap">
      <a href="javascript:;" @click='pre' class="ww-icon arrow-small prev" data-type="prev">&lt;</a>
      <a href="javascript:;" @click='next' class="ww-icon arrow-small next" data-type="next">&gt;</a>
    </div>
    <span>&copy; 2011 wallwa.com 版权所有 浙ICP备 1102094</span>
  </div>
</div>
</template>


<style lang='sass'>
#auth-background{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}
.arrow-small{
  color: #fff;
  text-decoration: none;
  &:hover,&:focus,&:active{
   color: #fff;
   text-decoration: none;
 }
}
</style>

<script>
export default{
  data() {
    return {
      on: 0
    }
  },
  mounted() {
    let self = this
    let random = Math.floor(Math.random() * 9 + 1)
    setTimeout(function() { self.on = random }, 200)
  },
  methods: {
    pre() {
      this.on = ((--this.on) < 1) ? 9 : this.on
    },
    next() {
      this.on = ((++this.on) > 9) ? 1 : this.on
    }
  }
}
</script>


