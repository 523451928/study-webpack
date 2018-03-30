<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="display-wrapper" :style="style.canvas">
  <div class="display-canvas">

    <div  v-if="editstatus" v-for="p of style.photos" :style="p.style" @click="changePhoto(p.index)">
      <component :keep-alive="false" :is="p.displayer" :entries="p.entries"
        :displays="p.displays" :pictures="p.pictures"
        :photo="p.index" :xi="0" :di="p.di" :length="p.length"
        :horizontal="false" :vertical="false"></component>
    </div>
    <div v-else v-for="p of style.photos" :style="p.style">
      <component :keep-alive="false" :is="p.displayer" :entries="p.entries"
                 :displays="p.displays" :pictures="p.pictures"
                 :photo="p.index" :xi="0" :di="p.di" :length="p.length"
                 :horizontal="false" :vertical="false"></component>
    </div>
  </div>
</div>
</template>

<script>
import { DecorativeCategories as dc, DisplayTypes as dt,
  StackLines as sl } from './app/consts'
import { mixin, getDisplayer } from './app/display-util'
import Display from './display'
import Rimless from './rimless'
import Poster from './poster'
import MultiHole from './multi-hole'

export default {
  mixins: [mixin],
  components: {Display, Rimless, Poster, MultiHole},
  mounted() {
    this.loading = false
  },
  computed: {
    style() {
      let u = this.addUnit
      let l = this.length
      let p = this.entry.Properties
      let s = p.Size

      let w, h, r
      if (s[0] < s[1]) {
        h = l
        r = h / s[1]
        w = s[0] * r
      } else {
        w = l
        r = w / s[0]
        h = s[1] * r
      }

      let x = (l - w) / 2
      let y = (l - h) / 2
      if (this.ch) x = 0
      if (this.cv) y = 0

      let o = {}

      o.canvas = {
        width: u(x > 0 ? l : w),
        height: u(y > 0 ? l : h)
      }

      p = p.Photos
      o.photos = []
      for (let i = 0; i < p.length; i++) {
        let c = this.displays[i + 1]
        let e = c.entry
        let hole = p[i].Hole
        let padding = 10
        let di = 0

        switch (e.CategoryId) {
          case dc.Poster:
          case dc.Scroll:
            padding = 0
            break
          case dc.Rimless:
            if (e.Decorative.Stack === sl.Inner) {
              padding = 0
              di = 1
            }
            break
        }

        let entries = [{
          index: -1,
          categoryId: e.categoryId,
          entry: e
        }]

        l = e.Decorative.Large
        w = (l[0] + 2 * padding) * r
        h = (l[1] + 2 * padding) * r
        o.photos.push({
          index: i,
          displayer: getDisplayer(e, di),
          entries: entries,
          displays: e.Displays[0].filter(v => v.Type === dt.Default),
          pictures: c.pictures,
          di: di,
          length: Math.floor(Math.max(w, h)),
          style: {
            // width: u(w),
            // width: u(hole[0] * r),
            // height: u(h),
            // height: u(hole[1] * r),
            // left: u(x + (hole[2] - (l[0] - hole[0]) / 2) * r),
            left: u(x + hole[2] * r),
            // top: u(y + (hole[3] - (l[1] - hole[1]) / 2) * r)
            top: u(y + hole[3] * r)
          }
        })
      }

      return o
    }
  },
  methods: {
    changePhoto(index) {
      this.$bus.$emit('change-indicator', index + 1)
    }
  }
}
</script>

