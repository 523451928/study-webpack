<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="m-boms">
  <div class="mat-size" flex="dir:left box:first cross:center">
    <div class="scroller-header">
      <span class="bom-type">尺寸</span>
      <!--<div class="scroller-title pull-right">{{getTitle()}}</div>-->
      <!-- <scroll-to :target="[targetkey]" :active="shape" :target-data="materials2"></scroll-to> -->
    </div>
    <div class="select-content swiper-container" id="rimless_size">
      <ul class="scroll-list scroll-text-list clearfix swiper-wrapper">
        <li v-for="i in materials2" :class="getClass2(i)" @click="select2(i)" class="size-item swiper-slide">
          <div class="li-name size">{{formatSize(i)}}</div>
        </li>
      </ul>
    </div>
    <div v-if="showPaper" class="scroller-header clearfix">
      <span class="bom-type">
        卡纸
      </span>
      <mat-stack :stack="0"></mat-stack>
    </div>
  </div>
</div>
</template>

<script>
/*eslint-disable */
let Swiper = require('scripts/swiper-4.1.0.min.js')
import { MaterialTypes as mt, DecorativeCategories as dc, Fulls } from 'scripts/utils/custom/consts.js'
import { mixin } from './scroller-util'
import { formatSize, sizeShape, equalSize, copySize, swapSize, parseImageSize } from 'scripts/utils/custom/utils.js'
import { fitSize } from '../picture/picture.js'
import MatStack from './mat-stack'
import { filterFramesSize } from 'scripts/core/utils.js'

function pack(s) {
  return {Type: mt.Size, Size: s}
}

export default {
  components: { MatStack },
  mixins: [mixin],
  props: {
    pic: { type: Object },
    entrys: {
      type: Object,
      default() {
        return undefined
      }
    }
  },
  data() {
    return {
      type: mt.Size,
      shape: 'h',
      targetkey: 'size-shape'
    }
  },
  computed: {
    showPaper() {
      if (this.catId === dc.Frame || this.catId === dc.Frames) {
        return true
      }
      return false
    },
    materials2() {
      if (this.no) return
      let a = {h: [], v: [], s: []}
      let imageSize
      if (this.pic) {
        imageSize = parseImageSize(this.pic.Image)
      }
      let filterStatus = (size, hole) => {
        if (!size) return false
        let filterStatusByImage = true
        if (this.pic) {
          filterStatusByImage = fitSize({Full: Fulls.Always, Size: hole || size}, imageSize, this.pic.DPI)
        }
        return !!filterStatusByImage
      }
      let classify = arr => {
        let type = sizeShape(arr)
        for (let v of a[type]) {
          if (equalSize(v, arr)) return
        }
        a[type].push(arr)
      }
      this.materials.filter(v => {
        return v.Type === mt.Size
      }).forEach(v => {
        filterStatus(copySize(v.Size)) && classify(copySize(v.Size))
        filterStatus(swapSize(v.Size)) && classify(swapSize(v.Size))
      })
      for (var t in a) {
        a[t].sort((i, j) => {
          let x = sizeShape(j).localeCompare(sizeShape(i))
          if (x === 0) return i[0] - j[0] || i[1] - j[1]
          return x
        })
      }
      let _r = []
      for (let i in a) {
        _r = [..._r, ...a[i]]
      }
      let _a = filterFramesSize(_r, this.entrys)
      return _a
    }
  },
  mounted() {
    this.initSwiper()
    this._d = _.mergeFuncs(
      this.$onBus('scroll-to', (t, v) => {
        if (this.no) return
        if (t[0] === this.targetkey) {
          this.shape = v
        }
      }),
      this.$onBus('change-mat-stack', (action, index, stack) => {
        //          if (!this._isAttached || this.no) return
        if (this.no) return
        if (this.view === 'color') {
          switch (action) {
            case 'touch':
              break
            case 'add':
              this.changeOption('add')
              break
            case 'remove':
              this.changeOption('remove')
              break
            case 'setMatless':
              this.changeOption('setMatless')
              break
          }
          this.index = index
        }
      })
    )
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
    },
    initSwiper() {
      this.$nextTick(() => {
        let swiper = new Swiper('#rimless_size', {
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
