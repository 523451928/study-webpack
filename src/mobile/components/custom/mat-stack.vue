<!-- Copyright 2016 Chen Xianren. All rights reserved. -->
<!--卡纸第几层-->
<template>
<div class="mat-stack">
  <div class="btn-group pull-left">
    <button type="button" class="btn btn-info btn-sm" v-for="(i, index) of stack"
      :class="{active: index === activeIndex}" @click="touch(i-1, index)">第{{i}}层</button>
  </div>
  <div class="btn-action pull-right">
    <button type="button" class="btn btn-secondary btn-sm btn-compact"
            @click="remove()">
      <!--:disabled="stack <= 1"-->
      <i class="wa wa-minus-o"></i>
    </button>
    <button type="button" class="btn btn-secondary btn-sm btn-compact"
            @click="add()" :disabled="stack >= this.max">
      <i class="wa wa-plus-o"></i>
    </button>
  </div>
</div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    max: {type: Number, default: 3},
    stack: {type: Number, default: 1}
  },
  mounted() {
    this.$bus.$emit('touch', this.index, this.stack)
  },
  data() {
    return {
      activeIndex: 0
    }
  },
  methods: {
    emit(action, index, stack) {
      this.$bus.$emit('change-mat-stack', action, index, stack)
    },
    touch(i, index) {
      if (index === this.activeIndex) return
      this.activeIndex = index
      this.emit('touch', i, this.stack)
    },
    add() {
      let n = this.stack
      if (n < this.max) this.emit('add', n, n + 1)
      this.activeIndex = n--
    },
    remove() {
      let n = this.stack
      if (n > 1) {
        this.emit('remove', Math.min(this.index, n - 2), n - 1)
        this.activeIndex = n - 2
        this.emit('touch', n - 2, this.stack)
      } else {
        if (n === 0) {
          return
        }
        this.emit('setMatless', Math.min(this.index, n - 2), n - 1)
      }
    }
  }
}
</script>

<style lang='sass'>
.mat-stack {
  width: 100%;
  padding:0 15px;
  display: inline-block;
  line-height: 1;
  border-bottom: 1px solid #dce0e0;
  padding-left: 0px;
  .btn-action{
    margin-top: 7px;
  }
  .btn-info {
    color: #31b0d5;
    background-color: #fff;
    border: none;
    display: block;
    padding: 10px 18px;
    font-size: 14px;
    border-bottom: 2px solid #26a7c7;
  }
  .active{
    background: #00b3ee;
    color: #fff;
  }
}
</style>
