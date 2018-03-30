<!-- Copyright Wallwa.com. All rights reserved. -->
<template>
  <div class="bom ">
    <h3 class="tit active">尺寸</h3>
    <ul class="cont size-cont" style="display: block;">
      <li v-for="i in selectSizes" class="item text" @click = "selectSize(i)" :class="{'active': isSelected(i)}">
        <list-item  :name="getName(i)"></list-item>
      </li>
    </ul>
  </div>
</template>

<script>
import ListItem from './list-item'
import { DecorativeCategories as dc } from 'scripts/utils/custom/consts'
export default {
  components: {ListItem},
  props: {
    selectSizes: {
      type: Object,
      default: [],
      required: true
    },
    defaultSize: {
      type: Object,
      required: true
    }
  },
  methods: {
    selectSize(m) {
      let self = this
      let param = {}
      this.defaultSize = m
      param.material = m
      param.type = 'frameSize'
      param.catId = dc['Frame']
      self.$emit('selectMaterial', param)
    },
    isSelected(m) {
      let defaultSize = this.defaultSize
      return (m[0] === defaultSize[0] && m[1] === defaultSize[1])
    },
    getName(m) {
      let size = m
      return size[0] / 10 + 'x' + size[1] / 10 + 'cm'
    }
  }
}
</script>
