<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="display-wrapper" :style="style.canvas" >
  <div v-show="loading">
    <loading></loading>
  </div>
  <div v-if="editstatus" class="display-canvas" @touchstart="evStart($event)" @touchmove.stop.prevent="evMove($event)"
       @touchend="evEnd($event)" >
    <div class="display-back" :style="style.back">
      <paint :hole="style.hole" :size="style.size" :picture="style.picture"></paint>
    </div>
    <div class="display-fore" :style="style.fore"></div>
    <div class="display-fake" :style="style.back"></div>
  </div>
  <div v-else class="display-canvas">
    <div class="display-back" :style="style.back">
      <paint :hole="style.hole" :size="style.size" :picture="style.picture"></paint>
    </div>
    <div class="display-fore" :style="style.fore"></div>
    <div class="display-fake" :style="style.back"></div>
  </div>
</div>
</template>

<script>
import { mixin } from './app/display-util'

export default {
  mixins: [mixin],
  watch: {
    T: {
      immediate: true,
      handler(t) {
        this.loadImages([t.d.Fore, t.d.Back])
      }
    }
  },
  computed: {
    T() {
      return {
        id: this.entry.Id,
        l: this.el,
        d: this.displays[this.di]
      }
    },
    style() {
      let u = this.addUnit
      let l = this.length
      let d = this.T.d
      let f = this.parseSize(d.Fore)
      let b = this.parseSize(d.Back)
      let w, h, r
      if (f[0] < f[1]) {
        h = l
        r = h / f[1]
        w = f[0] * r
      } else {
        w = l
        r = w / f[0]
        h = f[1] * r
      }

      let x = (l - w) / 2
      let y = (l - h) / 2
      if (this.ch) x = 0
      if (this.cv) y = 0

      let o = {}

      o.canvas = {
        width: u(x > 0 ? l : w),
        height: u(y > 0 ? l : h)
      }
      o.fore = {
        width: u(w),
        height: u(h),
        left: u(x),
        top: u(y)
      }
      this.addFore(o.fore, d.Fore)

      o.back = {
        width: u(b[0] * r),
        height: u(b[1] * r),
        left: u(x + d.Left * r),
        top: u(y + d.Top * r)
      }
      this.addBack(o.back, d.Back)
      o.hole = d.Hole
      o.size = b.map(v => Math.floor(v * r))
      o.picture = this.getPicture(this.entry.ProductId ? this.xi : 0)
      return o
    }
  }
}
</script>

<style lang='sass'>
.display-wrapper{
  margin: 0 auto;
  position: relative;
  .display-canvas{
    .display-back{
      position:absolute;
      overflow: hidden;
      z-index: 5;
    }
    .display-fore{
      position:absolute;
       z-index: 6;
    }
    .display-fake{
      position:absolute;
       z-index: 4;
    }
    .image-wrap{
      cursor: pointer;
    }
    &:hover {
      .display-back.ed{
        z-index: 7;
      }
    }
  }
}
</style>
