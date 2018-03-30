<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
    <scroll-to target="rimless-line"></scroll-to>
  </div>
  <scroller v-ref:scroller>
    <ul>
      <li v-for="i of materials2" :class="getClass2(i)" @tap="select(i)">
        <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </scroller>
  <toast :show.sync="show" :message="message" :time="2"
    :icon="false" :mask="false" :cancel="true"></toast>
</div>
</template>

<script>
import { MaterialTypes as mt } from './consts'
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
    return {type: 'line', show: false, message: ''}
  },
  computed: {
    materials2() {
      if (this.no) return
      let a = this.materials.filter(i => i.Type === mt.OuterLine)
      a.unshift({Type: mt.OuterLine, Name: '无外框'})
      let b = this.materials.filter(i => i.Type === mt.InnerLine)
      b.unshift({Type: mt.InnerLine, Name: '无内框'})
      return a.concat(b)
    }
  },
  ready() {
    this._d = this.onScrollTo('rimless-line')
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
        this.$EE.emit('select-material', y)
      } else {
        this.show = true
        this.message = '内框和外框至少选择其一'
      }
    }
  }
}
</script>
