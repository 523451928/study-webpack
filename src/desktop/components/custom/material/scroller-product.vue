<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div v-if="materials2.length > 1">
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
  </div>
  <ul class="scroll-list scroll-icon-list clearfix">
    <li v-for="i of materials2" :class="getClass(i)" @click="select(i)">
      <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
    </li>
  </ul>
</div>
</template>

<script>
import { mixin } from './scroller-util'
import { freshProductOptions } from 'components/custom/core/entry.js'

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
      this.$bus.$emit('select-material', {
        Type: this.type,
        product: i,
        options: freshProductOptions(x.options.map(v => v.OptionId), i)
      })
    }
  }
}
</script>
