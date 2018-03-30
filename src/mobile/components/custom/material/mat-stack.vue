<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="mat-stack pull-right">
    <div class="btn-group">
      <button type="button" v-if="stack>0" class="btn btn-info btn-sm" v-for="i of stack"
              :class="{active: i === index + 1}" @click="touch(i-1)">第{{i}}层</button>
    </div>
    <button type="button" class="btn btn-secondary btn-sm btn-compact"
            :class="{'disabled': stack === 0}"
            @click="remove()">
      <!--:disabled="stack <= 1"-->
      <i class="wa wa-minus-o"></i>
    </button>
    <button type="button" class="btn btn-secondary btn-sm btn-compact"
            @click="add()" :disabled="stack >= this.max">
      <i class="wa wa-plus-o"></i>
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
  mounted() {
    this.emit('touch', this.index, this.stack)
  },
  methods: {
    emit(action, index, stack) {
      this.$bus.$emit('change-mat-stack', action, index, stack)
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
      if (n === 0) {
        return
      } else if (n === 1) {
        this.emit('setMatless')
      } else {
        this.emit('remove', Math.min(this.index, n - 2), n - 1)
      }
    }
  }
}
</script>

  <style lang='sass'>
  .mat-stack {
    display: inline-block;
    line-height: 1;
  }
  </style>
