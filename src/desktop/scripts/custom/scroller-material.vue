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
import { MaterialTypes as mt } from './consts'
import { mixin } from './scroller-util'

const types = [mt.Line, mt.Paper, mt.Glass, mt.Canvas, mt.Template, mt.MagnetLine]

export default {
  mixins: [mixin],
  data() {
    return {ct: true}
  },
  computed: {
    no() {
      let x = this.material
      return types.indexOf(x.Type) === -1
    },
    materials2() {
      if (this.no) return
      let x = this.material
      let a = this.materials.filter(v => v.Type === x.Type)
      if (x.Type === mt.MagnetLine) {
        a.unshift({Type: mt.MagnetLine, Name: '无画框'})
      }
      return a
    }
  }
}
</script>
