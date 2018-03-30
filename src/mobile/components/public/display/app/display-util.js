// Copyright 2016 Chen Xianren. All rights reserved.

import { loadImages1 } from 'scripts/utils/image'
import { Canvas, DecorativeCategories as dc, PicParm } from './consts'
import { getThumbnailLength, addUnit, isColor,
  parseSize, rejectImage, getByProperty } from 'scripts/utils/custom/utils'
import Paint from '../paint'
import Loading from 'components/public/loading.vue'
import { getVirtualSize } from 'components/public/display/app/picture'

export function getDisplayer(entry = {}, index = 0) {
  switch (entry.CategoryId) {
    case dc.PhotoWall:
      return 'photo-wall'
    case dc.Rimless:
      let Stack = entry.hasOwnProperty('Decorative') ? entry.Decorative.Stack : entry.Stack
      return Stack > 0 ? 'display'
        : (index === 1 ? 'poster' : 'rimless')
    case dc.Poster:
      return 'poster'
    case dc.MultiHole:
      return 'multi-hole'
  }
  if (entry.CategoryId) return 'display'
}

export function initListEntryObj(entries = {}) {
  var initObj = {}
  let displayArray
  initObj['entry'] = entries[0] || entries
  initObj['displayer'] = getDisplayer(initObj['entry'])
  //  Displays 1级数组： 画芯不同状态时显示的内容  列表页按 List:2> Default:0 > Edit:1 显示
  //  2级数组多个画芯（画芯有可能有多面 eg: 多孔，T恤正方面） 列表页默认显示第一个
  displayArray = initObj['entry']['Displays']
  if (displayArray) {
    switch (displayArray.length) {
      case 1:
        initObj['displays'] = displayArray[0]
        break
      case 2:
        initObj['displays'] = displayArray[0]
        break
      case 3:
        initObj['displays'] = displayArray[2]
        break
    }
  }
  return initObj
}

export const mixin = {
  components: {Paint, Loading},
  props: {
    type: {
      type: String
    },
    pictures: {
      type: Array,
      required: true
    },
    canvas: {
      type: String,
      required: true
    },
    entry: {
      type: Object,
      required: true
    },
    displays: {
      type: Array,
      required: true,
      validator: v => v.length > 0
    },
    editstatus: {
      type: Boolean,
      default: false
    },
    photo: {
      type: Number,
      default: -1
    },
    xi: {
      type: Number,
      default: 0
    },
    di: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 'auto'
    },
    horizontal: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: 'auto'
    }
  },
  watch: {
    pictures: function(n, o) {
      let style = this.style
      let size = style.size
      let p = style.picture
      if (size.hasOwnProperty('incline')) {
        size = size.incline
      }
      if (p) {
        let o = p.Output.Size
        let v = getVirtualSize(o)
        let rate = []
        rate[0] = size[0] / v[0]
        rate[1] = size[1] / v[1]
        this.$bus.$emit('get-canvas-rate', rate, this.entry.CategoryId)
      }
    }
  },
  created() {
    if (this.canvas === 'Custom') {
      let docWidth = document.documentElement.clientWidth
      this.length = docWidth - 45
    } else {
      this.length = Canvas[this.canvas]
    }
    this.$onBus('reset-scale', () => {
      this.scale = 1
    })
  },
  data() {
    return {
      loading: true,
      movingStatus: false,
      offsetArr: [],
      scale: 1,
      oldScale: 1,
      downC: 0
    }
  },
  computed: {
    ch() {
      return !this.horizontal
    },
    cv() {
      let v = this.vertical
      if (v === 'auto') return this.length >= 600
      return !v
    },
    el() {
      return getThumbnailLength(this.length)
    }
  },
  methods: {
    addUnit: addUnit,
    parseSize: parseSize,
    thumbnail(s) {
      let e = this.entry
      let thumbnail = request.thumb(e.ProductId ? 'material' : 'entry', e.Id, this.el, s)
      return thumbnail
    },
    loadImages(a) {
      if (!this.movingStatus) {
        this.loading = true
      }
      loadImages1(a.filter(
          v => !isColor(v)).map(
          v => this.thumbnail(v))).then(() => {
            this.loading = false
          }, rejectImage)
    },
    addFore(s, f) {
      s['background-image'] = `url(${this.thumbnail(f)})`
      s['background-size'] = 'cover'
    },
    addBack(s, b) {
      if (isColor(b)) {
        s['background-color'] = b.slice(0, b.indexOf('-'))
      } else {
        s['background-image'] = `url(${this.thumbnail(b)})`
        s['background-size'] = 'cover'
      }
    },
    getPicture(i) {
      return getByProperty(this.pictures, i, 'Index')
    },
    getC(e) {
      if (e.targetTouches.length === 2) {
        let x1 = e.targetTouches[0].pageX
        let y1 = e.targetTouches[0].pageY
        let x2 = e.targetTouches[1].pageX
        let y2 = e.targetTouches[1].pageY
        let dissX = x1 - x2
        let dissY = y1 - y2
        return Math.sqrt(dissX * dissX + dissY * dissY)
      }
    },
    evStart(e) {
      this.movingStatus = true
      //  offset为一个宽高的数组，表示鼠标当前的位置
      this.offsetArr[0] = e.touches[0].pageX
      this.offsetArr[1] = e.touches[0].pageY
      this.oldScale = this.scale
      this.downC = this.getC(e)
      this.$bus.$emit('changeDisplayType', 'edit')
    },
    evMove(e) {
      if (!this.movingStatus) return
      let diffX = e.touches[0].pageX - this.offsetArr[0]
      let diffY = e.touches[0].pageY - this.offsetArr[1]
      let catId = this.entry.CategoryId
      this.offsetArr[0] = e.touches[0].pageX
      this.offsetArr[1] = e.touches[0].pageY
      if (e.targetTouches.length === 1) {
        this.$bus.$emit('set-image', 'drag', [diffX, diffY], catId)
      } else {
        let newScale = this.getC(e) / this.downC
        if (newScale > 1) {
          this.scale = (newScale - 1) / 2 + this.oldScale
        } else {
          this.scale = this.oldScale - 1 + newScale < 1 ? 1 : this.oldScale - 1 + newScale
        }
        let scale = parseInt(this.scale * 100)
        if (scale > this.pictures[0].scaleMax) {
          scale = this.pictures[0].scaleMax
        } else if (scale < PicParm.ScaleMin) {
          scale = PicParm.ScaleMin
        }
        this.$bus.$emit('set-image', 'scale', scale)
      }
    },
    evEnd(e) {
      setTimeout(() => {
        this.movingStatus = false
      }, 100)
      this.offsetArr = []
      this.diffArr = []
      this.$bus.$emit('set-image', 'resetImg')
      this.$bus.$emit('changeDisplayType', 'default')
    }
  }
}
