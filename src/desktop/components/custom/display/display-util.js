/* eslint-disable */
// Copyright 2016 Chen Xianren. All rights reserved.

import { loadImages1 } from 'scripts/utils/image'
import { DecorativeCategories as dc, Canvas } from 'scripts/utils/custom/consts.js'
import { getThumbnailLength, addUnit, isColor,
  parseSize, rejectImage, getByProperty } from 'scripts/utils/custom/utils.js'
import Paint from '../picture/paint'
import Loading from 'components/public/loading.vue'

export function getDisplayer(entry = {}, index = 0) {
  switch (entry.CategoryId) {
    case dc.PhotoWall:
      return 'photo-wall'
    case dc.Rimless:
      return entry.Decorative.Stack > 0 ? 'display'
        : (index === 1 ? 'poster' : 'rimless')
    case dc.Poster:
      return 'poster'
    case dc.MultiHole:
      return 'multi-hole'
  }
  if (entry.CategoryId) return 'display'
}

export function initListEntryObj(entries = {}) {
  console.log(entries)
  var initObj = {}
  let displayArray
  initObj['entry'] = entries[0] || entries
  initObj['displayer'] = getDisplayer(initObj['entry'])
  //  Displays 1级数组： 画芯不同状态时显示的内容  列表页按 List:2> Default:0 > Edit:1 显示
  //  2级数组多个画芯（画芯有可能有多面 eg: 多孔，T恤正方面） 列表页默认显示第一个
  if (!_.isNull(initObj['entry']['Displays'])) {
    displayArray = initObj['entry']['Displays']
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
  } else {
    if (initObj['entry'].CategoryId === dc.Rimless) {
      initObj['displays'] = {
        Stack: initObj['entry'].Decorative.Stack,
        Thick: initObj['entry'].Decorative.Thick
      }
    }
  }
  return initObj
}

export const mixin = {
  components: { Paint, Loading },
  props: {
    entry: { type: Object, required: true, validator: v => v.Id > 0 },
    displays: { type: Array, validator: v => v === null || v.length > 0 },
    editstatus: { type: Boolean, default: false },
    pictures: { type: Array, required: true },
    photo: { type: Number, default: -1 },
    xi: { type: Number, default: 0 },
    di: { type: Number, default: 0 },
    length: { type: Number, default: 'auto' },
    canvas: { type: String, required: true },
    horizontal: { type: Boolean, default: true },
    vertical: { type: Boolean, default: 'auto' },
    isPc: { type: Boolean, default: true } // 是否在pc上使用
  },
  created() {
    let autoFitParma = 2 / 3
    if (this.length === 'auto') {
      // this.length = Math.floor(getCanvasLength() * autoFitParma)
      // this._d = this.$onBus(window, 'resize', function() {
      //   this.length = getCanvasLength()
      // }.bind(this))
      this.length = Canvas[this.canvas]
    }
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
  },
  data() {
    return {
      loading: true,
      movingStatus: false,
      offsetArr: [],
      realDi: this.di || 0
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
      return this.$request.thumb(
        e.ProductId ? 'material' : 'entry', e.Id, this.el, s)
    },
    loadImages(a) {
      let that = this
      that.loading = true
      loadImages1(a.filter(v => !isColor(v))
                  .map(v => that.thumbnail(v)))
                .then(() => {
                  that.loading = false
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
      // 获取图片
      if (!this.pictures[0]) return
      return getByProperty(this.pictures, i, 'Index')
    },
    evBeforeStart() {
      let e = this.entry
      this.$bus.$emit('toggle-edit')
      if (e.ProductId) {
        this.realDi = _.findIndex(this.displays, d => {
          return d.Type === 1
        })
      }
    },
     // 拖动画芯事件
    evStart(e) {
      this.movingStatus = true
      //  offset为一个宽高的数组，表示鼠标当前的位置
      this.offsetArr[0] = e.pageX
      this.offsetArr[1] = e.pageY
    },
    evMove(e) {
      if (!this.movingStatus) return
      let diffX = e.pageX - this.offsetArr[0]
      let diffY = e.pageY - this.offsetArr[1]
      // 设置持续拖拽时的offsetArr值
      this.offsetArr[0] = e.pageX
      this.offsetArr[1] = e.pageY
      // let l = this.length
      // let d = this.T.d
      // let f = this.parseSize(d.Fore)
      // let r
      // if (f[0] < f[1]) {
      //   r = l / f[1]
      // } else {
      //   r = l / f[0]
      // }
      // let b = this.parseSize(d.Back).map(v => Math.floor(v * r))
      // let rate = (typeof this.style.size === 'object') ? this.style.size.incline : this.style.size
      let rate = []
      if (this.entry.CategoryId === dc.Rimless) {
        if (this.entry.Decorative.Stack === 0) {
          rate = this.style.size.incline
        } else {
          rate = this.style.size
        }
      } else {
        rate = this.style.size
      }
      if (!this.isproduct) {
        this.$bus.$emit('set-image', 'drag', [diffX, diffY, rate])
      } else if (this.isproduct) {
        this.$emit('set-image', 'drag', [diffX, diffY, rate])
        this.$emit('reset-image', 'overstep')
      }
    },
    evEnd(e, str) {
      // 拖拽完毕后对变量重置。
      if (str) {
        this.$bus.$emit('toggle-edit')
      }
      this.movingStatus = false
      this.offsetArr = []
      // 图片越界后恢复回去
      if (!this.isproduct) {
        this.$bus.$emit('reset-image', 'overstep')
      } else {
        this.$emit('reset-image', 'overstep')
      }
    }
  }
}
