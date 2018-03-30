<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
  </div>
  <scroller v-ref:scroller>
    <ul>
      <li v-for="i of materials2" :class="getClass(i)" @tap="select(i)">
        <list-item :id="i.OptionId" :name="i.Value" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </scroller>
</div>
</template>

<script>
import { mixin } from './scroller-util'
import { indexOfProperty, equalOption } from './util'

function indexOfKey(a, v) {
  return indexOfProperty(a, v, 'Key')
}

export default {
  mixins: [mixin],
  props: {
    key: {type: String, required: true}
  },
  data() {
    return {type: 'product'}
  },
  computed: {
    materials2() {
      if (this.no) return
      let p = this.material.product
      let k = this.key
      return p.Properties.filter(i => i.Key === k)
    }
  },
  methods: {
    getTitle() {
      if (this.no) return
      let o = this.material.options
      let i = indexOfKey(o, this.key)
      if (i >= 0) return o[i].Value
    },
    isActive(i) {
      if (this.no) return
      let o = this.material.options
      for (let j of o) {
        if (equalOption(i, j)) return true
      }
      return false
    },
    select(i) {
      if (this.no || this.isActive(i)) return
      let x = this.material
      let o = x.options.slice()
      let j = indexOfKey(o, i.Key)
      j >= 0 ? o.$set(j, i) : o.push(i)
      this.$EE.emit('select-material', {
        Type: this.type,
        product: x.product,
        options: o
      })
    }
  }
}
</script>
