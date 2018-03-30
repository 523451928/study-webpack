<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="m-boms m-product" flex="dir:left cross:center box:first">
  <div class="scroller-header">
    <div class="scroller-title">{{prokey}}:</div>
  </div>
  <div class="select-content product" v-if="materials2.length < 2">
    <span class="nomoreitem-header-title">{{materials2[0]['Value']}}</span>
  </div>
  <div class="select-content swiper-container" id="swiper_property">
    <ul v-if="materials2.length > 1" class="scroll-list clearfix swiper-wrapper" :class="{'scroll-icon-list':listStyle,'scroll-text-list':!listStyle}">
      <li v-for="i of materials2" :class="getClass(i)" @click="select(i)" class="swiper-slide material-item">
        <list-item :id="i.OptionId" :name="i.Value" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
/*eslint-disable */
let Swiper = require('scripts/swiper-4.1.0.min.js')
import { mixin } from './scroller-util'
import { indexOfProperty, equalOption } from 'scripts/utils/custom/utils.js'

function indexOfKey(a, v) {
  return indexOfProperty(a, v, 'Key')
}

export default {
  mixins: [mixin],
  props: {
    prokey: {
      type: String,
      required: true
    },
    incomes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {type: 'product'}
  },
  mounted() {
    this.initSwiper()
  },
  computed: {
    materials2() {
      if (this.no) return
      let p = this.material.product
      let k = this.prokey
      for (let i of this.incomes) {
        // 匹配到对应的incomes
        if (i.Packets[1] === p.Id) {
          p.Properties = p.Properties.filter(v => {
            for (let k of i.Options) {
              if (k === v.OptionId) {
                return v
              }
            }
          })
        }
      }
      return p.Properties.filter(i => i.Key === k)
    },
    listStyle() {
      let hasIcon = false
      if (this.materials2.length > 0) {
        hasIcon = this.materials2.some(item => !!item.Icon)
        return hasIcon
      }
      return hasIcon
    }
  },
  methods: {
    getTitle() {
      if (this.no) return
      let o = this.material.options
      let i = indexOfKey(o, this.prokey)
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
      j >= 0 ? Vue.set(o, j, i) : o.push(i)
      this.$emit('select-material', {
        Type: this.type,
        product: x.product,
        options: o
      })
    },
    initSwiper() {
      this.$nextTick(() => {
        let swiper = new Swiper('#swiper_property', {
          autoplay: false,
          slidesPerView: 'auto',
          slidesPerGroup: 4,
          spaceBetween: 20,
          setWrapperSize: true
        })
      })
    },
    productId() {
      return this.material.product.Id
    }
  }
}
</script>
<style lang="sass">
  .nomoreitem-header-title {
    color: #aaa;
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    padding: 5px 4px 4px 0;
    margin: 0;
  }
</style>
