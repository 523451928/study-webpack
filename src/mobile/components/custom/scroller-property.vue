<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div>
    <div class="scroller-header">
      <div class="scroller-title">{{getTitle()}}</div>
    </div>
    <ul class="scroll-list scroll-property-wrap  clearfix" :class="{'scroll-icon-list':listShape,'scroll-text-list':!listShape}">
      <li v-for="i of properties" :class="getClass(i)" @click="select(i)">
        <list-item :id="i.OptionId" :name="i.Value" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </div>
</template>

<script>
  /* eslint-disable */
  import { mixin } from './app/scroller-util'
  import { indexOfProperty, equalOption } from 'scripts/utils/custom/utils'

  function indexOfKey(a, v) {
    return indexOfProperty(a, v, 'Key')
  }

  export default {
    mixins: [mixin],
    props: {
      prokey: {
        type: String,
        required: true
      }
    },
    mounted() {
      new Loadmore({
        el: document.querySelector('.scroll-property-wrap'),
        scrollDirection: 'horizontal',
        elasticRolling: true
      })
    },
    data() {
      return {type: 'product'}
    },
    computed: {
      materials2() {
        if (this.no) return
        let p = this.material.product
        let k = this.prokey
        return p.Properties.filter(i => i.Key === k)
      },
      listShape() {
        let ms = this.materials2
        let l = false
        for (let i = 0; i < ms.length; i++) {
          if (ms[i].Icon) {
            l = true
            break
          }
        }
        return l
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
        j >= 0 ? this.$set(o, j, i) : o.push(i)
        this.$bus.$emit('select-material', {
          Type: this.type,
          product: x.product,
          options: o
        })
      }
    }
  }
</script>
<style scope lang="sass">
  .scroll-list{
    li{
      display: inline-block;
      margin: 0 3px;
      border: 1px solid #ccc;
    }
    .active{
      border: 2px solid #26A7C7;
      background: #26A7C7;
      color: #fff;
    }
  }
  .scroll-text-list{
      margin: 4px 0;
  }
</style>
