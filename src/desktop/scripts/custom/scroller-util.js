// Copyright 2016 Chen Xianren. All rights reserved.

import ScrollTo from './scroll-to'
import Scroller from './scroller'
import ListItem from './list-item'

export const mixin = {
  components: {ScrollTo, Scroller, ListItem},
  props: {
    materials: {type: Array, required: true},
    material: {type: Object, required: true}
  },
  watch: {
    'material.Type': {
      immediate: true,
      handler() {
        if (this.no) return
        this.nextTickScrollTo()
      }
    }
  },
  computed: {
    no() {
      let x = this.material
      return x.Type !== this.type
    }
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
  },
  methods: {
    onScrollTo(target) {
      return this.$EE.addEvent('scroll-to', (t, v) => {
        if (!this._isAttached || this.no) return
        if (t === target) this.scrollTo(t + '-' + v)
      }, this)
    },
    scrollTo(c = 'active') {
      let s = this.$refs.scroller
      s.refresh()
      s.scrollToElement(s.$el.querySelector('li.' + c))
    },
    nextTickScrollTo(c) {
      this.$nextTick(() => this.scrollTo(c))
    },
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
    select(i) {
      if (this.no || this.isActive(i)) return
      let x = this.material
      this.$EE.emit('select-material',
        this.value ? {Type: x.Type, Value: i} : i)
    }
  }
}
