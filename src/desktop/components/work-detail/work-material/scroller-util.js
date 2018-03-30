/*eslint-disable */
// Copyright 2016 Chen Xianren. All rights reserved.

import ScrollTo from './scroll-to'
import Scroller from './scroller'
import ListItem from './list-item'
import OverflowBox from './overflow-box'
import Pagination from './pagination'

export const mixin = {
  components: { ScrollTo, Scroller, ListItem, OverflowBox, Pagination },
  props: {
    materials: {type: Array, required: true},
    material: {type: Object, required: true},
    catId: {type: Number, default: 8}, // 品类id
    entry: {
      type: Object,
    },
    current: {
      type: Object
    },
  },
  created() {
    let x = this.material
    this.no = x.Type !== this.type
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
  },
  computed: {
    no() {
      let x = this.material
      return x.Type !== this.type
    }
  },
  methods: {
    getTitle() {
      if (this.no) return
      let x = this.material
      if (this.value) x = x.Value
      return x.Name
    },
    isActive(i) {
      if (this.no) return
      let x = this.material
      if (this.value) x = x.Value
      return x.Id === i.Id && (!this.ct ||
        (x.CategoryId === i.CategoryId && x.Type === i.Type))
    },
    getClass(i, c = '') {
      if (this.no) return
      let a = []
      if (c) a.push(c)
      if (this.isActive(i)) a.push('active')
      return a.join(' ')
    },
    // 物料区选择图片操作
    select(i) {
      if (this.no || this.isActive(i)) return
      let x = this.material
      // 触发父组件的select-material方法从而调用custom.js的selectMaterial方法
      this.$emit('select-material',
        this.value ? {Type: x.Type, Value: i} : i)
        // 向父组件传递值,包括当前选中的物料类型和物料的值
    }
  }
}
