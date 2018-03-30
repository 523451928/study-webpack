<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="paint" :style="box">
  <div v-show="loading"><loading></loading></div>
  <div class="image-wrap" :style="div"><img v-if="src" :src="src" :style="img"></div>
</div>
</template>

<script>
import { loadImage } from 'scripts/utils/image'
import { getThumbnailLength, addUnit, rejectImage, parseSize } from 'scripts/utils/custom/utils'
import { getVirtualLength, getVirtualSize } from 'components/public/display/app/picture'

const abs = Math.abs

export default {
  props: {
    hole: {type: Array},
    size: {
      type: Array,
      required: true,
      validator: v => v.length === 2
    },
    picture: {type: Object}
  },
  data() {
    return {loading: false}
  },
  watch: {
    src(s) {
      if (s) {
//        this.loading = true
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
      let p = this.picture
      let file
      let scale
      if (p) {
        let f = a => {
          for (let i of a) {
            if (i !== 0) return false
          }
          return true
        }
        let o = p.Output.Size
        let v = getVirtualSize(o)
        let d = {p: p, s: this.size, o: v}
        let a = this.hole
        if (!a || a.length !== 4 || f(a)) {
          a = [o[0], o[1], 0, 0]
        } else {
          v = getVirtualSize(a.slice(0, 2))
        }
        if (p.hasOwnProperty('Image')) {
          d.type = 'custom'
          file = p.Image.File
          scale = p.SizeScale
        } else {
          d.type = 'show'
          file = p.ImageFile
          scale = p.ScaleX
        }
        d.x = d.s[0] / v[0]
        d.y = d.s[1] / v[1]
        d.o[0] *= d.x
        d.o[1] *= d.y
        f = parseSize(file)
//        if (p.Rotate / 90 % 2 !== 0) {
//          f[0] = [f[1], f[1] = f[0]][0]
//        }
        d.w = d.x * f[0] * abs(scale) / 100
        d.h = d.y * f[1] * abs(scale) / 100
        d.a = a.map(v => getVirtualLength(v))
        return d
      }
    },
    src() {
      let d = this.dst
      let file
      let id

      if (d) {
        file = d.p.Image ? d.p.Image.File : d.p.ImageFile
        id = d.p.Image ? d.p.Image.Id : d.p.ImageId
        return request.thumb('image', id,
          getThumbnailLength(Math.max(d.w, d.h)), file)
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
      let o = {position: 'absolute'}
      let d = this.dst
      if (d) {
        o.width = addUnit(d.w)
        o.height = addUnit(d.h)
        o.left = addUnit((d.s[0] - d.w) / 2)
        o.top = addUnit((d.s[1] - d.h) / 2)
        if (d.type === 'custom') {
          o.transform = [
            `translateX(${addUnit(d.p.TranslateX)})`,
            `translateY(${addUnit(d.p.TranslateY)})`,
            `rotate(${d.p.Rotate}deg)`,
            `scaleX(${d.p.ScaleX / 100})`,
            `scaleY(${d.p.ScaleY / 100})`
          ].join(' ')
        } else {
          o.transform = [
            `translateX(${addUnit(d.x * d.p.TranslateX)})`,
            `translateY(${addUnit(d.y * d.p.TranslateY)})`,
            `rotate(${d.p.Rotate}deg)`,
            `scaleX(1)`,
            `scaleY(1)`
          ].join(' ')
        }
      }
      return o
    }
  }
}
</script>

<style lang='sass'>
.paint{
  overflow: hidden;
  .image-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
}
</style>
