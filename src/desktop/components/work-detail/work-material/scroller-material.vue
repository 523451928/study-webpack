<!-- Copyright 2016 Chen Xianren. All rights reserved. -->
<template>
<div class="m-material">
  <overflow-box v-if="showIconStyle" :bom-length="materials2 && materials2.length" ref="overflower">
    <div class="scroller-header clearfix">
      <span class="bom-type">{{bomTitle}}: </span>
      <i class="wa" :class="isShow ? 'wa-caret-up' : 'wa-caret-down'" @click="isShow = !isShow"></i>
      <div class="pull-right scroll-title more" @click="togglePop(true)">查看更多</div>
      <!-- <div class="scroller-title pull-right">{{getTitle()}}</div> -->
    </div>
    <ul class="scroll-list scroll-icon-list clearfix" v-if="isShow">
      <li v-for="i of materials2" :class="getClass(i)" @click="selectLine(i)">
        <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
      </li>
    </ul>
  </overflow-box>
  <div v-else class="text-select">
    <div class="selected">
      <span class="bom-type">{{bomTitle}}: </span>
      {{textSelected.Name}}
      <span class="wa" :class="textSelectShow ? 'wa-caret-up':' wa-caret-down' " @click="toggleSelect"></span>
    </div>
    <ul class="text-option-ul" v-show="textSelectShow">
      <li v-for="i of materials2" :class="textSelected.Name === i.Name?'hide':''" @click="selectText(i)">
        {{i.Name}}
      </li>
    </ul>
  </div>
</div>
</template>

<script>
/* eslint-disable */
import { MaterialTypes as mt, ListParam } from 'scripts/utils/custom/consts.js'
import { filterTypeMat } from 'scripts/utils/custom/material.js'
import ScrollPop from './scroll-pop'
import { mixin } from './scroller-util'

const bomsTypeMap = [
  {
    id: mt.Line,
    name: '画框'
  },
  {
    id: mt.Paper,
    name: '画纸'
  },
  {
    id: mt.Glass,
    name: '玻璃'
  },
  {
    id: mt.Canvas,
    name: '画布'
  },
  {
    id: mt.Template,
    name: '模板'
  },
  {
    id: mt.MagnetLine, // 磁贴画画框
    name: '画框'
  }
]
export default {
  mixins: [mixin],
  data() {
    return {
      ct: true,
      initMaterials2: {},
      finalMaterials: {},
      count: ListParam.Count,
      page: 1,
      textSelected: {},
      textSelectShow: false,
      isShow: true,
      popShow: false
    }
  },
  components: {
    ScrollPop
  },
  created() {
    this.initMaterial()
  },
  mounted() {
    if (!this.showIconStyle) {
      this.textSelected = this.materials2[0]
    }
    
  },
  computed: {
    no() {
      let x = this.material
      let index = bomsTypeMap.findIndex(v => v.id === x.Type)
      return index === -1
    },
    bomTitle() {
      let x = this.material
      return bomsTypeMap.find(v => v.id === x.Type).name
    },
    showIconStyle() {
      //  是否显示成icon,为了节省空间某些物料  （'画纸', '玻璃', '画布'） 等按照文本物料显示
      let type = this.material.Type
      let showStyle = false
      if (type === mt.Template || type === mt.Line || type === mt.MagnetLine) {
        showStyle = true
      }
      return showStyle
    },
    currents() {
      let c = this.materials
      let f = filterTypeMat(c, 1)
      let r = []
      f.forEach(i => {
        r.push(i.Id)
      })
      return r
    },
    materials2() {
      switch(this.material.Type) {
        case mt.Line:
          return this.userMaterials.filter(v => v.Type === mt.Line)
          break
        case mt.Paper:
          return this.userMaterials.filter(v => v.Type === mt.Paper)
          break
        case mt.Glass:
          return this.userMaterials.filter(v => v.Type === mt.Glass)
          break
        case mt.Template:
          if (!this.matData) return
          return this.matData.filter(v => v.Type === mt.Template)
          break
        case mt.MagnetLine:
          return [{Type: 10, Name: '无画框'}, ...this.userMaterials.filter(v => v.Type === mt.MagnetLine)]
          break
        case mt.Canvas:
          if (this.userMaterials.length > 0) {
            return this.userMaterials.filter(v => v.Type === mt.Canvas)
          } else {
            if (!this.matData) return
            return this.matData.filter(v => v.Type === mt.Canvas)
          }
          break
      }
    },
  },
  props: {
    userMaterials: { type: Array },
    matData: { type: Array }
  },
  methods: {
    selectText(i) {
      this.textSelected = i
      this.textSelectShow = false
      // this.select(i)
      this.$emit('select-material', i)
    },
    toggleSelect() {
      this.textSelectShow = true
    },
    togglePop(type) {
      this.popShow = type
    },
    initMaterial() {
      //  初始化当前物料  Pages:*总页数,Counts:*总数量， Data:{page:[],page+1:[]}
      if (this.materialStatus) return
      let x = this.material
      this.initMaterials2 = this.materials.filter(v => v.Type === x.Type)
      if (x.Type === mt.MagnetLine) {
        this.initMaterials2.unshift({Type: mt.MagnetLine, Name: '无画框'})
      }
      this.finalMaterials['counts'] = this.initMaterials2.length
      this.finalMaterials['pages'] = Math.ceil(this.initMaterials2.length / this.count)
      this.finalMaterials['data'] = {}

      for (let i = 0; i < this.finalMaterials['pages']; i++) {
        let pageIndex = i
        this.finalMaterials['data'][i + 1] = this.initMaterials2.slice(pageIndex * this.count, (pageIndex + 1) * this.count)
      }
    },
    selectLine(item) {
      this.$emit('select-material', item)
    },
    showMatDetail(m) {
      this.$bus.$emit('show-material-detail', m)
    },
    closePop(t) {
      this.popShow = t
    },
    saveMaterial(c) {
      this.$emit('save-material', c)      
    }
  }
}
</script>
