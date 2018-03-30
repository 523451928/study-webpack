<template>
  <!--bcb-wrap:bottom-custom-bar-wrap-->
  <!--对应底部的材料  图片、尺寸、画框等  包括滚动区域-->
  <div class="bcb-wrap">
    <ul class="bcb-header clearfix">
      <li class="bcb-header-item" :class="{active:idx == isShowIdx}" v-for="(bh, idx) of bomsHeader" @click="changeBodyShow(idx)">{{ bh.name }}</li>
    </ul>
    <!--<transition-group name="slide-toggle">-->
      <component v-for="(bom, idx) of boms2" :is="tpl(bom.name)" :key="bom.cat" v-show="isShowIdx == idx"
                 :materials="custom.materials(bom.name)" :showHeader="idx==1" :properties="bom.Properties" :material="custom.material(bom.name)" :class="'bomsBody'" :ref="bom.cat"
      ></component>
    <!--</transition-group>-->
  </div>
</template>
<script>
  import { mixin as components } from './app/components'
  // import { tabs } from 'scripts/utils/custom/consts'
  /* eslint-disable */
  export default {
    mixins: [{components: components}],
    props: {
      boms: {
        type: Array,
        required: true
      },
      materials: {
        type: Object
      },
      material: {
        type: Array
      },
      bomsHeader: {
        type: Array,
        required: true
      },
      custom: {
        type: Object
      }
    },
    data() {
      return {
        isShowIdx: 0
      }
    },
    methods: {
      changeBodyShow(idx) {
        if (this.isShowIdx === idx) {
          this.isShowIdx = -1
        } else {
          this.isShowIdx = idx
        }
        let bcbHeader = document.querySelector('.bcb-header')
        let itemWidth = document.documentElement.clientWidth / 4
        if (this.bomsHeader.length > 4) {
          if (idx >= 2) {
            bcbHeader.scrollLeft = (idx - 1) * itemWidth
          } else {
            bcbHeader.scrollLeft = 0
          }
        }
        this.$emit('canShowEdit', this.isShowIdx)
      },
      tpl(name) {
        let tplName = this.custom.initBomTplName(name)
        return tplName
      }
    },
//    image-scroller 即图片     { mixin as components } from './app/components'
    computed: {
      boms2() {
        const imageBom = {
          cat: 0,
          name: 'image',
          tagName: 'image-scroller'
        }
        let tempBoms = this.boms
//        材料的前提是图片，每一个都有图片，因此unshift
        tempBoms.forEach((item, index) => {
          if (this.custom.materials(item.name)[0] && this.custom.materials(item.name)[0].Properties && this.custom.materials(item.name)[0].Properties instanceof Array) {
            item.Properties = []
            this.custom.materials(item.name)[0].Properties.forEach((itm) => {
              if (itm.Key === item.prokey) {
                item.Properties.push(itm)
              }
            })
          }
          if (item.name === 'image') {
            tempBoms.splice(index, 1)
          }
        })
        tempBoms.unshift(imageBom)
        tempBoms.forEach((item, index) => {
          if (item.Properties && item.Properties.length === 0) {
            tempBoms.splice(index, 1)
          }
        })
        return tempBoms
      }
    }
  }
</script>
<style lang="sass" scope>
  .slide-toggle-enter-active, .slide-toggle-leave-active,.slide-toggle-move {
    transition: all .5s;
  }
  .slide-toggle-move{
    position: absolute !important;
    bottom: 50px !important;
  }
  .slide-toggle-enter, .slide-toggle-leave-active {
    opacity: 0;
    transform: translateY(10%);
  }
  .bcb-wrap {
    position: absolute;
    left: 0;
    bottom: 0;
    min-width: 100%;
    height: auto;
    .bcb-header {
      height: 50px;
      list-style-type: none;
      width: 100%;
      margin-bottom: 0;
      padding-left: 0;
      overflow-x: auto;
      white-space: nowrap;
      border-top: 1px solid #dce0e0;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      z-index: 100;
      bottom: 0;
      left: 0;
      .bcb-header-item {
        position: relative;
        height: 100%;
        width: 25%;
        text-align: center;
        line-height: 50px;
        display: inline-block;
        background: #fff;
        color: #aaa;
        &:first-of-type {
          border-right: 1px solid #dce0e0;
        }
        &:after {
          content:"";
          position: absolute;
          width: 0;
          height: 0;
          top: -1px;
          left: 50%;
          margin-left: -9px;
          vertical-align: middle;
          border-top: 9px solid #fff;
          border-right: 9px solid transparent;
          border-left: 9px solid transparent;
          z-index: 3;
          display: none;
        }
      }
      .active {
        background-color: #EDEFED;
        border: none;
        color: #565a5c;
        &:after {
          display: block;
        }
      }
    }
    .bomsBody {
      position: absolute;
      bottom: 52px;
      left: 0;
      width: 100%;
      height: auto;
      z-index: 5;
    }
  }
</style>
