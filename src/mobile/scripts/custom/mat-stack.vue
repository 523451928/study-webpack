<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="mat-stack">
  <div class="btn-group">
    <button type="button" class="btn btn-info btn-sm" v-for="i of stack"
      :class="{active: i === index}" @click="touch(i)">第{{i + 1}}层</button>
  </div>
  <button type="button" class="btn btn-secondary btn-sm btn-compact"
    @click="remove()" :disabled="stack <= 1">
    <i class="material-icons">remove_circle_outline</i>
  </button><button type="button" class="btn btn-secondary btn-sm btn-compact"
    @click="add()" :disabled="stack >= this.max">
    <i class="material-icons">add_circle_outline</i>
  </button>
</div>
</template>

<script>
export default {
  props: {
    max: {type: Number, default: 3},
    stack: {type: Number, default: 1},
    index: {type: Number, default: 0}
  },
  ready() {
    this.emit('touch', this.index, this.stack)
  },
  methods: {
    emit(action, index, stack) {
      this.$EE.emit('change-mat-stack', action, index, stack)
    },
    touch(i) {
      if (this.index === i) return
      this.emit('touch', i, this.stack)
    },
    add() {
      let n = this.stack
      if (n < this.max) this.emit('add', n, n + 1)
    },
    remove() {
      let n = this.stack
      if (n > 1) this.emit('remove', Math.min(this.index, n - 2), n - 1)
    }
  }
}
</script>

<style lang='stylus'>
.mat-stack
  display: inline-block
  line-height 1
</style>
