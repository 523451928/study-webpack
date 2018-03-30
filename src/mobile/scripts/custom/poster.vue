<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="display-wrapper" :style="style.canvas">
  <div class="display-canvas">
    <div :style="style.inner"></div>
    <div :style="style.outer">
      <paint :size="style.size" :picture="style.picture"></paint>
    </div>
  </div>
</div>
</template>

<script>
import { mixin } from './display-util'

export default {
  mixins: [mixin],
  ready() {
    this.loading = false
  },
  computed: {
    style() {
      let u = this.addUnit
      let l = this.length
      let d = this.entry.Decorative
      let w = d.Size[0]
      let h = d.Size[1]

      let r = l / (w < h ? h : w)

      w *= r
      h *= r
      let b = d.Blank.map(i => i * r)

      let x = (l - w) / 2
      let y = (l - h) / 2
      if (this.ch) x = 0
      if (this.cv) y = 0

      let o = {}

      o.canvas = {
        width: u(x > 0 ? l : w),
        height: u(y > 0 ? l : h)
      }

      o.inner = {
        width: u(w),
        height: u(h),
        left: u(x),
        top: u(y),
        'background-color': '#FFF',
        'box-shadow': '0 0 5px rgba(0,0,0,0.1)'
      }

      o.size = [w - b[1] - b[3], h - b[0] - b[2]]
      o.outer = {
        width: u(o.size[0]),
        height: u(o.size[1]),
        left: u(x + b[3]),
        top: u(y + b[0]),
        'background-color': '#FFF',
        'box-shadow': '0 0 1px rgba(0,0,0,0.1)'
      }
      o.picture = this.getPicture(0)

      return o
    }
  }
}
</script>
