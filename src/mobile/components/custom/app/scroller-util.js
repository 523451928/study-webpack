// Copyright 2016 Chen Xianren. All rights reserved.

import ScrollTo from '../scroll-to'
import OverflowBox from '../overflow-box'
import ListItem from '../list-item'
// import Pagination from '../pagination'
import MatStack from '../mat-stack'

export const mixin = {
  components: { ScrollTo, ListItem, OverflowBox, MatStack },
  data() {
    // return {
    //   no: false
    // }
  },
  props: {
    materials: {type: Array, required: true},
    material: {type: Object, required: true},
    properties: {type: Array}
  },
  // created() {
  //   let x = this.material
  //   this.no = x && x.Type !== this.type
  // },
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
      let x = this.material
      if (this.value) x = x.Value
      return x.Name
    },
    isActive(i) {
      let x = this.material
      if (this.value) x = x.Value
      return x.Id === i.Id && (!this.ct ||
        (x.CategoryId === i.CategoryId && x.Type === i.Type))
    },
    getClass(i, c = '') {
      let a = []
      if (c) a.push(c)
      if (this.isActive(i)) a.push('active')
      return a.join(' ')
    },
    select(i, index, flag) {
      this.activeIndex = index
      if (!flag && this.$refs.scrollList) {
        if (index > 2) {
          this.$refs.scrollList.scrollLeft = (index - 2) * 80
        } else {
          this.$refs.scrollList.scrollLeft = 0
        }
      }
      if (this.isActive(i)) return
      let x = this.material
      this.$bus.$emit('select-material',
        this.value ? {Type: x.Type, Value: i} : i, flag)
    }
  }
}
