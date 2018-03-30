<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="scroller" v-el:scroller>
  <div><slot></slot></div>
</div>
</template>

<script>
export default {
  mounted() {
    this._d = this.$onBus(window, 'resize', function() {
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
