<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div v-if="materials2.length > 1" class="m-boms">
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
  </div>
  <div class="select-content swiper-container" id="swiper_product">
    <ul class="scroll-list scroll-icon-list clearfix swiper-wrapper">
      <li v-for="i of materials2" :class="getClass(i)" @click="select(i)" class="swiper-slide material-item">
        <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
/*eslint-disable */
let Swiper = require('scripts/swiper-4.1.0.min.js')
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
