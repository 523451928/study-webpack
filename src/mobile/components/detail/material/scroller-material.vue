<!-- Copyright 2016 Chen Xianren. All rights reserved. -->
<template>
<div class="m-boms">
  <overflow-box v-if="showIconStyle" :bom-length="materials2.length" ref="overflower" class="clearFloat" flex="dir:left box:first cross:center">
    <div class="scroller-header clearfix">
      <span class="bom-type">{{bomTitle}}: </span>
    </div>
    <div class="select-content swiper-container" id="Frames_material">
      <ul class="scroll-list scroll-icon-list clearfix swiper-wrapper">
        <li v-for="i of materials2" :class="getClass(i)" @click="select(i)" class="material-item swiper-slide">
          <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
        </li>
      </ul>
    </div>
  </overflow-box>
  <div v-else class="text-select">
    <div class="selected" @click="textSelectShow = !textSelectShow" flex="dir:left cross:center box:first">
      <span class="bom-type">{{bomTitle}}: </span>
      {{textSelected.Name}}
    </div>
  </div>
</div>
</template>

<script>
/*eslint-disable */
let Swiper = require('scripts/swiper-4.1.0.min.js')
import { MaterialTypes as mt, ListParam } from 'scripts/utils/custom/consts.js'
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
      textSelectShow: false
    }
  },
  components: {
  },
  created() {
    this.initMaterial()
  },
  mounted() {
    if (!this.showIconStyle) {
      this.textSelected = this.materials2[0]
    }
    this.$nextTick(() => {
      this.initSwiper()
    })
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
    materials2() {
      if (this.materialStatus) return
      let thisP = this.page || 1
      return this.finalMaterials['data'][thisP]
    },
    showIconStyle() {
      //  是否显示成icon,为了节省空间某些物料  （'画纸', '玻璃', '画布'） 等按照文本物料显示
      let type = this.material.Type
      let showStyle = false
      if (type === mt.Template || type === mt.Line || type === mt.MagnetLine) {
        showStyle = true
      }
      return showStyle
    }
  },
  methods: {
    selectText(i) {
      this.textSelected = i
      this.textSelectShow = false
      this.select(i)
    },
    initSwiper() {
      this.$nextTick(() => {
        let swiper = new Swiper('#Frames_material', {
          autoplay: false,
          slidesPerView: 'auto',
          slidesPerGroup: 4,
          spaceBetween: 20,
          setWrapperSize: true
        })
      })
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
    showMatDetail(m) {
      this.$bus.$emit('show-material-detail', m)
    }
  }
}
</script>

<style lang="sass" scoped>
@import "~styles/swiper-4.1.0.min.css";
</style>

