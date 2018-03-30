<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="material-wrap">
    <!--<div class="material-header" v-show="showHeader">-->
      <!--&lt;!&ndash;若是尺寸&ndash;&gt;-->
      <!--<div class="material-size-header" v-show="headerType === 'size'">-->
        <!--<scroll-to :target="'size-shape'"></scroll-to>-->
      <!--</div>-->
      <!--&lt;!&ndash;此处为卡纸下的层次关系  第几层&ndash;&gt;-->
      <!--<div class="material-size-header" v-show="headerType === 'color'">-->
        <!--<mat-stack></mat-stack>-->
      <!--</div>-->
    <!--</div>-->
    <!--画纸 画框-->
    <overflow-box v-ref:overflower >
      <ul ref="scrollList" class="scroll-list scroll-icon-list">
        <li v-for="(i, index) of materials2"  :class="getClass(i)" class="list-item" @click.stop="select(i, index)">
          <list-item :id="i.Id" :name="i.Name" :icon="i.Icon"></list-item>
        </li>
      </ul>
    </overflow-box>
  </div>
</template>
<style lang="sass" scope>
  .material-wrap {
    /*padding: 6px 0;*/
    /*border-top: 1px solid #dce0e0;*/
  }
  .scroll-list {
    width: auto;
      height: 100%;
      list-style-type: none;
      margin: 0;
      padding: 0;
      background-color: #fff;
      overflow-x: auto;
      white-space: nowrap;
      .list-item {
        margin-right: 5px;
        cursor: pointer;
        /*width: 70px;*/
        /*height: 70px;*/
        border: 1px solid #dce0e0;
        overflow: hidden;
        display: inline-block;
        &:nth-last-child(1) {
          margin-right: 0;
        }
        .list-item-img {
          outline: none;
          width: 100%;
          .active {
            border: 2px solid #26a7c7;
        }
      }
    }
  }
</style>
<script>
/* eslint-disable */
//  import { MaterialTypes as mt, ListParam } from 'scripts/utils/custom/consts'
  import { MaterialTypes as mt } from 'scripts/utils/custom/consts'
  import { mixin } from './app/scroller-util'

  const types = [mt.Line, mt.Paper, mt.Glass, mt.Canvas, mt.Template]
//  const bomTitleMap = ['画框', '画纸', '玻璃', '画布', '模板']

  export default {
    mixins: [mixin],
    mounted() {
      new Loadmore({
        el: document.querySelector('.scroll-list'),
        scrollDirection: 'horizontal',
        elasticRolling: true
      })
    },
    data() {
      return {
        ct: true,
        activeIndex: 0
//        initMaterials2: {},
//        finalMaterials: {},
//        page: 1,
//        count: ListParam.Count
      }
    },
//    props: {
//      showHeader: {
//        type: Boolean,
//        default: false
//      },
//      headerType: {
//        type: String,
//        default: 'size'
//      }
//    },
//    created() {
//      this.initMaterial()
//    },
    computed: {
      no() {
        let x = this.material
        if (x) {
          return types.indexOf(x.Type) === -1
        }
      },
      materials2() {
        // if (this.no) return
//        let thisP = this.page || 1
//        let tempFinalMaterials = this.finalMaterials
//        return tempFinalMaterials.hasOwnProperty('data') && tempFinalMaterials['data'][thisP]
        let x = this.material
        if (x) {
          let materials = this.materials.filter(v => v.Type === x.Type)
          if (x.CategoryId === 24 || x.Type === 10) {
            materials = [
              {"CategoryId":24,"Icon":"","Id":2000001,"Message":"","Name":"柚木纹","Picture":"","Type":10},
              {
                Name: '无画框',
                Type: 10
              }
            ]
          }
          return materials
        }
      }
//      bomTitle() {
//        let index = types.indexOf(this.material.Type)
//        return bomTitleMap[index]
//      }
    },
    methods: {
//      initMaterial() {
//        //  初始化当前物料  Pages:*总页数,Counts:*总数量， Data:{page:[],page+1:[]}
//        if (this.materialStatus) return
//        let x = this.material
//        this.initMaterials2 = this.materials.filter(v => v.Type === x.Type)
//
//        this.finalMaterials['counts'] = this.initMaterials2.length
//
//        this.finalMaterials['pages'] = this.finalMaterials['counts'] % this.count === 0 ? this.initMaterials2.length / this.count : Math.ceil(this.initMaterials2.length / this.count)
//
//        this.finalMaterials['data'] = {}
//
//        for (let i = 1; i < this.finalMaterials['pages'] + 1; i++) {
//          let pageIndex = i - 1
//          this.finalMaterials['data'][i] = this.initMaterials2.slice(pageIndex * this.count, i * this.count)
//        }
//      }
    }
  }
</script>
