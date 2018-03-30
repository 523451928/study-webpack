<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
    <scroll-to target="size-shape"></scroll-to>
  </div>
  <scroller v-ref:scroller>
    <ul>
      <li v-for="i of materials2" :class="getClass2(i)" @tap="select2(i)">
        <div class="li-name size">{{formatSize(i)}}</div>
      </li>
    </ul>
  </scroller>
</div>
</template>

<script>
import { MaterialTypes as mt } from './consts'
import { mixin } from './scroller-util'
import { formatSize, sizeShape, equalSize, copySize, swapSize } from './util'

function pack(s) {
  return {Type: mt.Size, Size: s}
}

export default {
  mixins: [mixin],
  data() {
    return {type: mt.Size}
  },
  computed: {
    materials2() {
      if (this.no) return
      let a = []
      let f = s => {
        for (let v of a) {
          if (equalSize(v, s)) return
        }
        a.push(s)
      }
      this.materials.filter(v => v.Type === mt.Size).forEach(v => {
        f(copySize(v.Size))
        f(swapSize(v.Size))
      })
      a.sort((i, j) => {
        let x = sizeShape(j).localeCompare(sizeShape(i))
        if (x === 0) return i[0] - j[0] || i[1] - j[1]
        return x
      })
      return a
    }
  },
  ready() {
    this._d = this.onScrollTo('size-shape')
  },
  methods: {
    formatSize: formatSize,
    getTitle() {
      if (this.no) return
      let x = this.material
      return formatSize(x.Size)
    },
    isActive(i) {
      if (this.no) return
      let x = this.material
      return i.Type === mt.Size && equalSize(x.Size, i.Size)
    },
    getClass2(i) {
      return this.getClass(pack(i), 'size-shape-' + sizeShape(i))
    },
    select2(i) {
      this.select(pack(i))
    }
  }
}
</script>
