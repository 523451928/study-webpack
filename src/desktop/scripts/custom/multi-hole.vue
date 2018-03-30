<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="display-wrapper" :style="style.canvas">
  <div v-show="loading"><loading></loading></div>
  <div v-else class="display-canvas">
    <div class="display-back" v-for="b of style.back" :style="b.style">
      <paint :size="b.size" :picture="b.picture"></paint>
    </div>
    <div class="display-fore" :style="style.fore"></div>
    <div class="display-fake" v-for="b of style.back" :style="b.style"
      :class="{hole: b.index === hole}" @click="changeHole(b.index)"></div>
  </div>
</div>
</template>

<script>
import { mixin } from './display-util'

export default {
  mixins: [mixin],
  props: {
    hole: {type: Number}
  },
  ready() {
    if (this.$lodash.isUndefined(this.hole)) this.changeHole(-1)
  },
  watch: {
    T: {
      immediate: true,
      handler() {
        this.loadImages([this.fore])
      }
    }
  },
  computed: {
    fore() {
      return this.displays[0].Fore
    },
    T() {
      return {
        id: this.entry.Id,
        l: this.el,
        d: this.displays
      }
    },
    style() {
      let u = this.addUnit
      let l = this.length
      let f = this.parseSize(this.fore)

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
      this.addFore(o.fore, this.fore)

      o.back = []
      let a = this.displays
      let i, j, s, b
      for (i = 0; i < a.length; i++) {
        j = a[i]
        s = this.parseSize(j.Back)
        b = {
          index: i,
          style: {
            width: u(s[0] * r),
            height: u(s[1] * r),
            left: u(x + j.Left * r),
            top: u(y + j.Top * r)
          },
          size: s.map(v => Math.floor(v * r)),
          picture: this.getPicture(i)
        }
        this.addBack(b.style, j.Back)
        o.back.push(b)
      }

      return o
    }
  },
  methods: {
    changeHole(index) {
      if (this.photo >= 0) return
      this.hole = this.hole === index ? -1 : index
      this.$EE.emit('change-hole', this.hole)
    }
  }
}
</script>

<style lang='stylus'>
.display-fake.hole
  box-shadow 0 0 1px 1px rgba(77,144,254,0.5) inset
</style>
