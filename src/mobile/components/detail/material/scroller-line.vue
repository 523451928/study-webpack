<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="m-boms boms-line" flex="dir:left cross:center box:first">
  <div class="scroller-header">
    <span class="bom-type">画框</span>
  </div>
  <div class="select-content swiper-container" id="rimless_line">
    <ul class="scroll-list scroll-icon-list clearfix swiper-wrapper">
      <li v-for="i in materials2" :class="getClass2(i)" @click="select(i)" class="material-item swiper-slide">
        <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
/*eslint-disable */
let Swiper = require('scripts/swiper-4.1.0.min.js')
import { MaterialTypes as mt } from 'scripts/utils/custom/consts.js'
import { mixin } from './scroller-util'

function getCode(i) {
  switch (i.Type) {
    case mt.InnerLine:
      return 'inner'
    case mt.OuterLine:
      return 'outer'
  }
}

function getCode2(i) {
  switch (i.Type) {
    case mt.InnerLine:
      return 'outer'
    case mt.OuterLine:
      return 'inner'
  }
}

export default {
  mixins: [mixin],
  data() {
    return {
      type: 'line',
      show: false,
      message: '',
      shape: 'outer',
      targetkey: 'rimless-line'
    }
  },
  computed: {
    materials2() {
      if (this.no) return
      let a = this.materials.filter(i => i.Type === mt.OuterLine)
      a.unshift({Type: mt.OuterLine, Name: '无外框'})
      let b = this.materials.filter(i => i.Type === mt.InnerLine)
      b.unshift({Type: mt.InnerLine, Name: '无内框'})
      // return a.concat(b)
      // 返回外框
      return a
    }
  },
  mounted() {
//     this._d = _.mergeFuncs(
//       this.$onBus('scroll-to', (t, v) => {
// //          if (!this._isAttached || this.no) return
//         if (this.no) return
//         if (t === this.targetkey) {
//           this.shape = v
//         }
//       }, this)
//     )
    this.initSwiper()
  },
  methods: {
    getTitle() {
      if (this.no) return
      let x = this.material
      if (x.outer.Id) return x.outer.Name
      if (x.inner.Id) return x.inner.Name
    },
    isActive(i) {
      if (this.no) return
      let x = this.material
      let c = getCode(i)
      x = x[c]
      return x.Id === i.Id && x.CategoryId === i.CategoryId && x.Type === i.Type
    },
    getClass2(i) {
      return this.getClass(i, 'rimless-line-' + getCode(i))
    },
    select(i) {
      if (this.no || this.isActive(i)) return
      let x = this.material
      let y = {Type: this.type}
      y[getCode(i)] = i
      let c = getCode2(i)
      y[c] = x[c]
      if (i.Id || y[c].Id) {
        if (i.Type === mt.InnerLine && y.outer.Id) {
          this.show = true
          this.message = i.Name
        }
        this.$emit('select-material', y)
      } else {
        this.show = true
        this.message = '内框和外框至少选择其一'
      }
    },
    initSwiper() {
      this.$nextTick(() => {
        let swiper = new Swiper('#rimless_line', {
          autoplay: false,
          slidesPerView: 'auto',
          slidesPerGroup: 4,
          spaceBetween: 20,
          setWrapperSize: true
        })
      })
    }
  }
}
</script>

