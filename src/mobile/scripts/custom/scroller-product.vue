<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
  </div>
  <scroller v-ref:scroller>
    <ul>
      <li v-for="i of materials2" :class="getClass(i)" @tap="select(i)">
        <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </scroller>
</div>
</template>

<script>
import { mixin } from './scroller-util'
import { freshProductOptions } from './entry'

export default {
  mixins: [mixin],
  data() {
    return {type: 'product'}
  },
  computed: {
    materials2() {
      if (this.no) return
      return this.materials
    }
  },
  methods: {
    getTitle() {
      if (this.no) return
      let p = this.material.product
      return p.Name
    },
    isActive(i) {
      if (this.no) return
      let p = this.material.product
      return p.Id === i.Id && p.CategoryId === i.CategoryId
    },
    select(i) {
      if (this.no || this.isActive(i)) return
      let x = this.material
      this.$EE.emit('select-material', {
        Type: this.type,
        product: i,
        options: freshProductOptions(x.options.map(v => v.OptionId), i)
      })
    }
  }
}
</script>
