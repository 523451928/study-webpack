<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <div class="scroller-header">
    <span class="bom-type">画框</span>
    <!-- <div class="scroller-title pull-right">{{getTitle()}}</div> -->
    <scroll-to :target="targetkey" :active="shape" :target-data="materials2"></scroll-to>
  </div>
  <ul class="scroll-list scroll-icon-list clearfix">
    <li v-for="i of materials2[shape]" :class="getClass2(i)" @click="select(i)">
      <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
    </li>
  </ul>
  <toast :show.sync="show" :message="message" :time="2"
    :icon="false" :mask="false" :cancel="true"></toast>
</div>
</template>

<script>
import { MaterialTypes as mt } from 'scripts/utils/custom/consts.js'
import { mixin } from './scroller-util'

function getCode(i) {
  switch (i.Type) {
    case mt.InnerLine:
      return 'inner'
    case mt.OuterLine:
      return 'outer'
  }
}

function getCode2(i) {
  switch (i.Type) {
    case mt.InnerLine:
      return 'outer'
    case mt.OuterLine:
      return 'inner'
  }
}

export default {
  mixins: [mixin],
  data() {
    return {
      type: 'line',
      show: false,
      message: '',
      shape: 'outer',
      targetkey: 'rimless-line'
    }
  },
  computed: {
    materials2() {
      if (this.no) return
      let a = this.materials.filter(i => i.Type === mt.OuterLine)
      a.unshift({Type: mt.OuterLine, Name: '无外框'})
      let b = this.materials.filter(i => i.Type === mt.InnerLine)
      b.unshift({Type: mt.InnerLine, Name: '无内框'})
      // return a.concat(b)
      return {
        outer: a,
        inner: b
      }
    }
  },
  mounted() {
    this._d = _.mergeFuncs(
        this.$onBus('scroll-to', (t, v) => {
//          if (!this._isAttached || this.no) return
          if (this.no) return
          if (t === this.targetkey) {
            this.shape = v
          }
        }, this)
    )
  },
  methods: {
    getTitle() {
      if (this.no) return
      let x = this.material
      if (x.outer.Id) return x.outer.Name
      if (x.inner.Id) return x.inner.Name
    },
    isActive(i) {
      if (this.no) return
      let x = this.material
      let c = getCode(i)
      x = x[c]
      return x.Id === i.Id && x.CategoryId === i.CategoryId && x.Type === i.Type
    },
    getClass2(i) {
      return this.getClass(i, 'rimless-line-' + getCode(i))
    },
    select(i) {
      if (this.no || this.isActive(i)) return
      let x = this.material
      let y = {Type: this.type}
      y[getCode(i)] = i
      let c = getCode2(i)
      y[c] = x[c]
      if (i.Id || y[c].Id) {
        if (i.Type === mt.InnerLine && y.outer.Id) {
          this.show = true
          this.message = i.Name
        }
        this.$bus.$emit('select-material', y)
      } else {
        this.show = true
        this.message = '内框和外框至少选择其一'
      }
    }
  }
}
</script>
