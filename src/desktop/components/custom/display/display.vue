<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="display-wrapper" :style="style.canvas">
  <!-- <div v-show="loading"><loading></loading></div> -->
  <div class="display-canvas">
    <div class="display-back" :style="style.back">
      <paint :hole="style.hole" :size="style.size" :picture="style.picture"></paint>
    </div>
    <div v-if="editstatus" class="display-fore ed" @mouseover="evBeforeStart()"  @mousedown.prevent="evStart($event)" @mousemove.prevent.stop="evMove($event)"
         @mouseleave.prevent="evEnd($event, 'leave')" @mouseup.prevent="evEnd($event)" :style="style.fore"></div>
    <div v-else class="display-fore" :style="style.fore"></div>
    <div class="display-fake" :style="style.back"></div>
  </div>
</div>
</template>
<script>
/* eslint-disable */
import { mixin } from './display-util'

export default {
  mixins: [mixin],
  watch: {
    T: {
      immediate: true,
      handler(t) {
        if (t.d && t.d.Fore && t.d.Back) {
          this.loadImages([t.d.Fore, t.d.Back])
        }
      }
    },
    "entry"(o) {
    }
  },
  mounted() {
    // console.log(this.displays)
  },
  props: {
    isproduct: {
      type: Boolean
    }
  },
  computed: {
    T() {
      return {
        id: this.entry.Id,
        l: this.el,
        d: this.displays && this.displays[this.di]
      }
    },
    style() {
      // 向下或向上取整的Math方法
      let u = this.addUnit
      // 一个数值, 默认是auto
      let l = this.length
      // 基本数据 id el d
      let d = this.T.d
      let f = this.parseSize(d.Fore)
      let b = this.parseSize(d.Back)

      let w, h, r
      if (f[0] < f[1]) {
        h = l
        r = h / f[1]
        w = f[0] / f[1] * h
      } else {
        w = l
        r = w / f[0]
        h = f[1] / f[0] * w
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
      // 返回给display属性中的paint图片组件的img对象
      // this.entry 从父组件接受
      o.picture = this.getPicture(this.entry.ProductId ? this.xi : 0)
      return o
      // if (this.isPc) {
      //   return o
      // } else {
      //   let w = window.innerWidth
      //   const SCALE = (w - 200) / w
      //   for (let i in o) {
      //     switch (i) {
      //       case 'canvas':
      //         for (let j in o['canvas']) {
      //           o[i][j] = calculate(o[i][j], SCALE)
      //         }
      //         break
      //       case 'fore':
      //         for (let j in o['fore']) {
      //           switch (j) {
      //             case 'height':
      //             case 'width':
      //               o[i][j] = calculate(o[i][j], SCALE)
      //               break
      //           }
      //         }
      //         break
      //       case 'back':
      //         for (let j in o['back']) {
      //           switch (j) {
      //             case 'width':
      //             case 'height':
      //             case 'top':
      //             case 'left':
      //               o[i][j] = calculate(o[i][j], SCALE)
      //               break
      //           }
      //         }
      //         break
      //       case 'size':
      //         o['size'].forEach((item, index) => {
      //           o['size'][index] = o['size'][index] * SCALE
      //         })
      //         break
      //     }
      //   }
      //   return o
      // }
    }
  }
}
</script>

<style lang='sass'>
.display-wrapper{
  margin: 0 auto;
  position: relative;
  z-index: 0;
  .display-canvas{
    .display-back{
      position:absolute;
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
      cursor:pointer;
      .display-back.ed{
        .image-wrap img {
          opacity: .7;
        }
      }
    }
  }
}
</style>
