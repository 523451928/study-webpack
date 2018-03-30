// Copyright 2016 Chen Xianren. All rights reserved.

import { loadImages } from 'utils/image'
import { DecorativeCategories as dc } from './consts'
import { getCanvasLength, getThumbnailLength, addUnit, isColor,
  parseSize, rejectImage, getByProperty } from './util'
import Paint from './paint'

export function getDisplayer(entry = {}, index = 0) {
  switch (entry.CategoryId) {
    case dc.PhotoWall:
      return 'photo-wall'
    case dc.Rimless:
      return entry.Decorative.Stack > 0 ? 'display'
        : (index === 1 ? 'poster' : 'rimless')
    case dc.Poster:
      return 'poster'
    case dc.MultiHole:
      return 'multi-hole'
  }
  if (entry.CategoryId) return 'display'
}

export const mixin = {
  components: {Paint},
  props: {
    entry: {type: Object, required: true, validator: v => v.Id > 0},
    displays: {type: Array, required: true},
    pictures: {type: Array, required: true},
    photo: {type: Number, default: -1},
    xi: {type: Number, default: 0},
    di: {type: Number, default: 0},
    length: {type: Number, default: 'auto'},
    horizontal: {type: Boolean, default: true},
    vertical: {type: Boolean, default: 'auto'}
  },
  created() {
    if (this.length === 'auto') {
      this.length = getCanvasLength()
      this._d = this.$lodash.addEvent(window, 'resize', function() {
        this.length = getCanvasLength()
      }.bind(this))
    }
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
  },
  data() {
    return {loading: true}
  },
  computed: {
    ch() {
      return !this.horizontal
    },
    cv() {
      let v = this.vertical
      if (v === 'auto') return this.length >= 600
      return !v
    },
    el() {
      return getThumbnailLength(this.length)
    }
  },
  methods: {
    addUnit: addUnit,
    parseSize: parseSize,
    thumbnail(s) {
      let e = this.entry
      return this.$request.thumbnail(
        e.ProductId ? 'material' : 'entry', e.Id, this.el, s)
    },
    loadImages(a) {
      let that = this
      that.loading = true
      loadImages(a.filter(
        v => !isColor(v)).map(
        v => that.thumbnail(v))).then(() => {
          that.loading = false
        }, rejectImage)
    },
    addFore(s, f) {
      s['background-image'] = `url(${this.thumbnail(f)})`
      s['background-size'] = 'cover'
    },
    addBack(s, b) {
      if (isColor(b)) {
        s['background-color'] = b.slice(0, b.indexOf('-'))
      } else {
        s['background-image'] = `url(${this.thumbnail(b)})`
        s['background-size'] = 'cover'
      }
    },
    getPicture(i) {
      return getByProperty(this.pictures, i, 'Index')
    }
  }
}
