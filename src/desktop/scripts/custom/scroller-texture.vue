<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <div class="scroller-header">
    <div class="scroller-title">{{getTitle()}}</div>
    <scroll-to target="poster-texture"></scroll-to>
  </div>
  <scroller v-ref:scroller>
    <ul>
      <li v-for="i of materials2" :class="getClass2(i)" @tap="select(i)">
        <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </scroller>
</div>
</template>

<script>
import { MaterialTypes as mt } from './consts'
import { mixin } from './scroller-util'

function getCode(i) {
  switch (i.Type) {
    case mt.Paper:
      return 'paper'
    case mt.Canvas:
      return 'canvas'
  }
}

export default {
  mixins: [mixin],
  data() {
    return {type: 'texture', value: true, ct: true}
  },
  computed: {
    materials2() {
      if (this.no) return
      let a = this.materials.filter(v => v.Type === mt.Paper)
      let b = this.materials.filter(v => v.Type === mt.Canvas)
      return a.concat(b)
    }
  },
  ready() {
    this._d = this.onScrollTo('poster-texture')
  },
  methods: {
    getClass2(i) {
      return this.getClass(i, 'poster-texture-' + getCode(i))
    }
  }
}
</script>
