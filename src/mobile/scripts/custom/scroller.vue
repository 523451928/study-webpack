<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="scroller" v-el:scroller>
  <div><slot></slot></div>
</div>
</template>

<script>
export default {
  ready() {
    this._s = new this.$IScroll(this.$els.scroller, {
      scrollX: true,
      scrollY: false,
      // disableMouse: false,
      // disablePointer: false,
      // disableTouch: false,
      mouseWheel: true,
      eventPassthrough: true,
      click: false,
      tap: true // twice
    })
    this._d = this.$lodash.addEvent(window, 'resize', function() {
      this.refresh()
    }.bind(this))
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
    if (this._s) {
      this._s.destroy()
      this._s = null
    }
  },
  methods: {
    refresh() {
      if (this._s) this._s.refresh()
    },
    scrollToElement(el) {
      if (el && this._s) this._s.scrollToElement(el, 250, 0, 0)
    }
  }
}
</script>
