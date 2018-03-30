<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<ul class="tab">
  <li :class="{active: isTab('image')}" @click="selectTab('image')">图片</li>
  <li v-for="t of tabs" :class="{active: isTab(t.code)}"
    @click="selectTab(t.code)">{{t.name}}</li>
  <li v-for="k of keys" :class="{active: isTab('key', k)}"
    @click="selectTab('key', k)">{{k}}</li>
</ul>
</template>

<script>
import { DecorativeCategories as dc } from './consts'

const product = {code: 'product', name: '产品'}
const size = {code: 'size', name: '尺寸'}
const mat = {code: 'mat', name: '卡纸'}
const line = {code: 'line', name: '画框'}
const paper = {code: 'paper', name: '画纸'}
const glass = {code: 'glass', name: '玻璃'}
const canvas = {code: 'canvas', name: '画布'}
const template = {code: 'template', name: '模板'}
const texture = {code: 'texture', name: '材质'}
const blank = {code: 'blank', name: '白边'}

const tabs = new Map()
tabs.set(dc.Frame, [line, mat, paper, glass])
tabs.set(dc.Rimless, [size, line, canvas])
tabs.set(dc.PhotoWall, [template])
tabs.set(dc.Scroll, [template, canvas])
tabs.set(dc.Poster, [size, texture, blank])
tabs.set(dc.Matless, [size, line, paper, glass])
tabs.set(dc.MultiHole, [line, mat, paper, glass])
tabs.set(dc.Frames, [line, mat, paper, glass])
tabs.set(dc.Decorate, [])
tabs.set(dc.Magnet, [size, line, canvas])

export default {
  props: {
    categoryId: {type: Number, required: true},
    tab: {type: String, default: 'image'},
    keys: {type: Array, default: () => []},
    key: {type: String, default: ''}
  },
  ready() {
    this.$nextTick(() => this.emit())
  },
  watch: {
    categoryId() {
      this.selectTab('image')
    }
  },
  computed: {
    tabs() {
      return tabs.has(this.categoryId)
        ? tabs.get(this.categoryId).slice() : [product]
    }
  },
  methods: {
    emit() {
      this.$EE.emit('select-tab', this.tab, this.key)
    },
    isTab(t, k = '') {
      return this.tab === t && this.key === k
    },
    selectTab(t, k = '') {
      if (this.isTab(t, k)) return
      this.tab = t
      this.key = k
      this.emit()
    }
  }
}
</script>

<style lang='stylus'>
ul.tab
  background-color #FFF
  list-style none
  margin 0
  pading 0
  display table
  width 100%
  li
    display table-cell
    width auto
    margin 0
    padding 6px 0
    border-bottom 2px solid transparent
    text-align center
    color #888
    &.active
      border-bottom-color #3CC51F
      color #3CC51F
</style>
