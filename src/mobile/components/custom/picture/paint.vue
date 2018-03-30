<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="paint" :style="box">
  <div v-show="loading"><loading></loading></div>
  <div class="image-wrap" :style="div">
    <img v-if="src" v-lazy="src" :style="img">
    <!--<img class="lazy-img" v-if="src" :imgsrc="src" :style="img">-->
  </div>
</div>
</template>

<script>
import { loadImage } from 'scripts/utils/image'
import { getThumbnailLength, addUnit, rejectImage, parseSize } from 'scripts/utils/custom/utils.js'
import { getVirtualLength, getVirtualSize } from './picture'

const abs = Math.abs

export default {
  props: {
    hole: {type: Array},
    size: {type: Array, required: true, validator: v => v.length === 2},
    picture: {type: Object}
  },
  data() {
    return {loading: false}
  },
  watch: {
    src(s) {
      if (s) {
        this.loading = true
        loadImage(s).then(() => {
          this.loading = false
        }, rejectImage)
      }
    }
  },
  computed: {
    box() {
      let s = this.size
      return {width: addUnit(s[0]), height: addUnit(s[1])}
    },
    dst() {
      if (!this.picture) return
      let p = this.picture
      if (p.hasOwnProperty('DPI') && p.DPI === 0) {
        p.DPI = 100
      }
      if (!p.Image) {
        // 数据格式的问题，在某些页面p没有Image属性，在这里格式化
        p.Image = {
          Id: p.ImageId,
          File: p.ImageFile
        }
      }
      if (p) {
        let f = a => {
          for (let i of a) {
            if (i !== 0) return false
          }
          return true
        }
        let o = p.Output.Size
        let v = getVirtualSize(o, p.DPI)
        let d = {
          p: p,
          s: this.size,
          o: v
        }
        let a = this.hole
        if (!a || a.length !== 4 || f(a)) {
          a = [o[0], o[1], 0, 0]
        } else {
          v = getVirtualSize(a.slice(0, 2), p.DPI)
        }
        d.x = d.s[0] / v[0]
        d.y = d.s[1] / v[1]
        d.o[0] *= d.x
        d.o[1] *= d.y
        f = parseSize(p.Image.File)
        d.w = d.x * f[0] * abs(p.ScaleX) / 100
        d.h = d.y * f[1] * abs(p.ScaleY) / 100
        d.a = a.map(v => getVirtualLength(v, p.DPI))
        return d
      }
    },
    src() {
      let d = this.dst
      if (d) {
        return request.thumb('image', d.p.Image.Id,
          getThumbnailLength(Math.max(d.w, d.h)), d.p.Image.File)
      }
    },
    div() {
      let d = this.dst
      if (d) {
        return {
          width: addUnit(d.o[0]),
          height: addUnit(d.o[1]),
          left: addUnit(-d.x * d.a[2]),
          top: addUnit(-d.y * d.a[3])
        }
      }
    },
    img() {
      let o = {
        position: 'absolute'
      }
      let d = this.dst
      if (d) {
        o.width = addUnit(d.w)
        o.height = addUnit(d.h)
        o.left = addUnit((d.o[0] - d.w) / 2)
        o.top = addUnit((d.o[1] - d.h) / 2)
        o.transform = [
          // `translateX(${addUnit(d.p.TranslateX)})`,
          // `translateY(${addUnit(d.p.TranslateY)})`,
          `translateX(${addUnit(d.x * d.p.TranslateX)})`,
          `translateY(${addUnit(d.y * d.p.TranslateY)})`,
          // `skewX(${d.p.SkewX}deg)`,
          // `skewY(${d.p.SkewY}deg)`,
          `rotate(${d.p.Rotate}deg)`,
          `scaleX(${d.p.ScaleX / abs(d.p.ScaleX)})`,
          `scaleY(${d.p.ScaleY / abs(d.p.ScaleY)})`
        ].join(' ')
      }
      return o
    }
  }
}
</script>

<style lang='sass'>
.paint{
  overflow: hidden;
  .image-wrap{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    img{
      /*transition: all .3s;*/
    }
  }
}
</style>
