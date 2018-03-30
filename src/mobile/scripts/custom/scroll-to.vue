<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="btn-group">
  <button type="button" class="btn btn-sm"
    v-for="a of targets" @click="scrollTo($event, a[0])"
    :class="getClass(a[0])">{{a[1]}}</button>
</div>
</template>

<script>
const targets = {
  'size-shape': [['v', '竖形'], ['s', '方形'], ['h', '横形']],
  'mat-hole': [[0, '无卡'], [1, '单孔'], [2, '多孔']],
  'mat-view': [['size', '尺寸'], ['shape', '形状'], ['color', '颜色']],
  'rimless-line': [['outer', '外框'], ['inner', '内框']],
  'poster-texture': [['paper', '画纸'], ['canvas', '画布']]
}
export default {
  props: {
    target: {type: String, required: true},
    active: {type: String}
  },
  data() {
    return {x: false}
  },
  ready() {
    if (this.active) {
      this.x = true
      this.emit(this.active)
    }
  },
  computed: {
    targets() {
      return targets[this.target]
    }
  },
  methods: {
    emit(x) {
      this.$EE.emit('scroll-to', this.target, x)
    },
    isActive(x) {
      return this.x && this.active === x
    },
    getClass(x) {
      let a = ['btn-' + (this.x ? 'primary' : 'secondary')]
      if (this.isActive(x)) a.push('active')
      return a.join(' ')
    },
    scrollTo($event, x) {
      $event.target.blur()
      if (!this.isActive(x)) this.emit(x)
    }
  }
}
</script>
