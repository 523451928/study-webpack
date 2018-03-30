<template lang='pug'>
.viewer(v-on:click='large' v-bind:class='{large: isLarge}')
  template(v-if='loading')
    .weui-loading
  template(v-else)
    component(
      v-bind:length='length'
      v-bind:is='getDisplayer(e, di)'
      v-bind:entry='e'
      v-bind:displays='d'
      v-bind:pictures='p'
      v-bind:xi='xi'
      v-bind:di='di'
      v-bind:horizontal='false'
      v-bind:vertical='false'
      v-bind:isOrder='isOrder'
    )
</template>

<script>
/* eslint-disable */
import { DisplayTypes as dt } from './consts.js'
import { getViewportWidth, getViewportHeight } from 'scripts/utils/screen.js'
import Display from './display'
import MultiHole from './multi-hole'
import PhotoWall from './photo-wall'
import Poster from './poster'
import Rimless from './rimless'
import { getDisplayer } from './display-util'
import { getEntries } from './entry'

const padding = 15
const breakpoints = {
  xs: 120,
  sm: 240,
  md: 480,
  lg: 720,
  xl: 960
}

export default {
	data() {
		return {
			loading: true,
			index: 0,
      e: undefined,
      d: undefined,
      p: undefined,
      xi: undefined,
      di: undefined
		}
	},
	components: {
    Display,
    MultiHole,
    PhotoWall,
    Poster,
    Rimless
  },
 	props: {
    photoWall: { type: Object },
    entries: { type: Array, required: true, validator: v => v.length > 0 },
    pictures: { type: Array, required: true },
    length: { type: Number, default: breakpoints.xs },
    isClick: { type: Boolean, default: true}, // 是否添加点击事件
    isOrder: { type: Boolean, default: false }
  },
  computed: {
    isLarge() {
      return this.length >= breakpoints.md
    }
  },
  methods: {
    getDisplayer,
    large() {
      if (this.loading) return
      if (this.isClick) {
        this.length = this.isLarge ? breakpoints.xs
          : Math.max(breakpoints.xs, Math.min(getViewportWidth(), getViewportHeight()) - padding * 2)
      } else {
        return
      }
    },
    load() {
      if (this.photoWall) {
        this.loadPhotoWall()
        return
      }
      let id = this.entries[this.index]
      let p = this.pictures[this.index]
      this.loading = true
      getEntries([id]).then(a => {
        let e = a[0]
        if (!e || e.Id !== id) {
          layer.toast(`不存在单品#${id}`)
          return
        }
        this.e = e
        this.p = p
        this.xi = e.ProductId ? p[0].Index : 0
        this.di = 0
        this.d = e.Displays && e.Displays.length > 0 ? e.Displays[this.xi].filter(d => d.Type === dt.Default) : undefined
        this.loading = false
      })
    },
    loadPhotoWall() {
      let { photoWall, entries, pictures } = this
      if (!photoWall) return
      entries = entries.slice()
      let n = entries.length
      this.loading = true
      getEntries(entries).then(a => {
        for (let i = 0; i < n; i++) {
          let id = entries[i]
          if (!a[i] || a[i].Id !== id) {
            layer.toast(`不存在单品#${id}`)
            return
          }
          entries[i] = { entry: a[i], pictures: pictures[i] }
        }
        entries.unshift({ entry: photoWall, pictures: [] })
        this.e = photoWall
        this.p = []
        this.xi = 0
        this.di = 0
        this.d = entries
        this.loading = false
      })
    }
  },
  created() {
    this.$watch(() => [this.photoWall, this.entries, this.pictures], () => {
      this.index = 0
      this.load()
    }, {
      deep: true,
      immediate: true
    })
  }
}

</script>
