<!-- 产品详情 主舞台  DISPLAY展示  物料组合 -->
<template>
<div class="product-detail-con">
  <div class="product-edit-wrapper">
    <div class="figure">
      <div class="pic-cell active">
        <Loading v-show="loadingStatus || proUpdateStatus"></Loading>
        <component :keep-alive="false" :is="showItem.displayer" :editstatus="false" :pictures="showItem.pictures" :canvas="canvasType" :entry="showItem.entry" :displays="showItem.displays"></component>
      </div>
    </div>
    <div class="product-options-panel">
      <h3 class="pro-detail-title">{{title}}</h3>
      <div class="pro-detail-text clearfix">
        <span class="pro-detail-type">{{categoryName}}</span>
        <div class="pull-right">
          <img class="discount-png" src="~images/icon/discount.png">
          <span class="normal-price">￥{{itemNormalPrice}}</span>
          <strong class="real-price">￥{{itemRealPrice}}</strong>
        </div>
      </div>
      <div class="edit-pane">
        <div class="error-wrap"></div>
        <frame-size v-if="isFrame" :selectSizes="showItem.selectSizes" :defaultSize="showItem.defaultSize" @selectMaterial="selectMaterial($event)"></frame-size>
        <component v-for="b in showItem.boms" :keep-alive="false" :is="showItem.matTplType" :bomType="b.type" :catId="showItem.categoryId" :name="b.name" :selects="b.selects" :using="b.using" @selectMaterial="selectMaterial($event)"></component>
      </div>
      <div class="buy-set clearfix">
        <div class="num-wrap">
          <span class="input-item">
                <input type="text" v-model="count" @change="verify()">
          </span>
          <a href="javascript:void(0)" @click="setCount('minus')" class="default-link num-ope-item minus">
              -
          </a>
          <a href="javascript:void(0)" @click="setCount('plus')" class="default-link num-ope-item plus">
              +
          </a>
        </div>
        <a class="btn btn-success btn-lg add-cart-btn" @click="addToCart()" id="add-cart-btn"><i class="wa wa-shopping-cart"></i> 加入购物车</a>
      </div>
    </div>
  </div>
  <div class="product-social-box">
  </div>
</div>
</template>
<script>
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import { getMaterials } from 'components/custom/core/material.js'
import { DecorativeCategories as dc, MaterialTypes as mt, tabsProduct } from 'scripts/utils/custom/consts'
import { sizeShape, swapSize, getByProperty, isFrames } from 'scripts/utils/custom/utils'
import { getEntries } from 'scripts/utils/entry'
import { freshEntry } from 'components/custom/core/entry.js'
import { initEditBoms, initDisplayParam, renderById, selectMaterialUtil } from 'components/product/app/utils.js'

import displayComponents from 'components/custom/display/components.js'
import MaterialNormal from './material-normal'
import MaterialFrame from './material-frame'
import MaterialPro from './material-pro'
import FrameSize from './frame-size'
import Loading from 'components/public/loading.vue'

// import { newCustom } from 'components/custom/core/custom'

let fixComponents = {
  MaterialNormal,
  MaterialFrame,
  MaterialPro,
  FrameSize,
  Loading,
  ...displayComponents
}
export default {
  components: fixComponents,
  props: {
    title: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    categoryId: {
      type: [Number, Array],
      required: true
    },
    incomes: {
      type: Array,
      required: true
    },
    workId: {
      type: String,
      requires: true
    }
  },
  data() {
    return {
      loadingStatus: true,
      proUpdateStatus: false,
      category: '',
      type: '',
      canvasType: 'ProDetail',
      showItem: {},
      activeItemId: 0,
      count: 1,
      itemNormalPrice: 0,
      itemRealPrice: 0
    }
  },
  mounted() {
    this.getCatList()
    this.initMaterials()
  },
  beforeUpdate() {
    this.$bus.$emit('initWorkId', this.initedWorkId)
  },
  methods: {
    getCatList(cb) {
      request.list('category').then(res => {
        let m = new Map()
        let a = res.data.Data || []
        a.forEach(v => {
          // 此阶段，某些品类的DPI值后台未设置有效值，默认为0，这里设为100
          if (!v.DPI) {
            v.DPI = 100
          }
          m.set(v.Id, v)
        })
        this.catList = m
        window.$categories = m
        if (typeof cb === 'function') {
          cb()
        }
      })
    },
    initMaterials() {
      let cId = this.isFrame ? dc.Frame : this.categoryId
      getMaterials(cId).then(details => {
        //  有框画的物料 -> 无卡画的物料且默认是有框画的子集，
        //  暂时不处理多孔和照片墙
        //  仅下载一次物料
        this.showItem.materials = details
        this.initProData()
      })
    },
    initProData() {
      let self = this
      let entriesIds = []
      let mtlessEntriesIds = []
      let defEntry
      let pictures
      let item = this.showItem
      let catId
      let proIncomes
      if (this.isFrame) {
        catId = dc.Frame
        let frameIndex = _.indexOf(this.categoryId, dc.Frame)
        proIncomes = this.incomes[frameIndex]
      } else {
        catId = this.categoryId
        proIncomes = this.incomes
      }
      switch (catId) {
        case dc.Frame:
          item.type = 'Paints'
          item.matTplType = 'material-frame'
          break
        case dc.Rimless:
        case dc.Magnet:
        case dc.Scroll:
          item.type = 'Paints'
          item.matTplType = 'material-normal'
          break
        default:
          item.type = 'Product'
          item.matTplType = 'material-pro'
      }
      //  初始化Incomes
      this.incomes.forEach(inc => {
        entriesIds = _.concat(entriesIds, inc.Entries)
      })
      if (this.matLessIncomes.length) {
        this.matLessIncomes.forEach(mtlInc => {
          mtlessEntriesIds = _.concat(mtlessEntriesIds, mtlInc.Entries)
        })
      }
      getEntries(entriesIds).then(entriesDetail => {
        //  初始化装饰画所有可用的sizes/incomes
        _.each(proIncomes, (inc, i) => {
          inc.Entries = renderById(entriesDetail, inc.Entries)
          if (isFrames(catId)) {
            inc.size = inc.Entries[0].Decorative.Size
            inc.hasMat = true
          }
          if (i === 0) {
            //  默认显示第一个Income
            inc.def = true
            defEntry = inc.Entries[0]
            pictures = inc.Pictures
          } else {
            inc.def = false
          }
        })
        //  初始化默认显示对象
        item.categoryId = catId
        item.entries = [{
          index: -1,
          categoryId: item.categoryId,
          entry: defEntry,
          selects: defEntry.selects,
          materials: item.materials,
          pictures: []
        }]
        item.Incomes = proIncomes
        item.entry = defEntry
        item.pictures = pictures[0]
        item.Packets = proIncomes[0].Packets
        initDisplayParam(item)
        self.getBoms()
        initEditBoms(item)
        self.initSizes()
        if (isFrames(catId)) {
          //  合并无卡画的数据到单孔的属性
          getEntries(mtlessEntriesIds).then(eds => {
            _.each(self.matLessIncomes, (inc, i) => {
              inc.Entries = renderById(eds, inc.Entries)
            })
            item.matlessItem = {
              CategoryId: dc.Matless,
              Incomes: self.matLessIncomes,
              Pause: false
            }
            //  默认显示有卡画
            item.hasMat = true
            self.buildItem(4)
            self.loadingStatus = false
          })
        } else {
          self.buildItem(4)
          self.loadingStatus = false
        }
      })
    },
    initSizes() {
      let self = this
      let sizes
      let item = this.showItem
      let cat = this.categoryId
      //  初始化装饰画Sizes， 主要用于根据画芯判断图片是否能填满， 以及默认选中的SIZE类型
      //  有框画和布艺画初始化Size类型  *h 横形 *v 竖形 *s 方形
      //  初始数据都是竖形的  需要拷贝出横形
      //  有框、布艺是一个对象  卷轴是一个数组
      switch (cat) {
        case dc.Frame:
          //  有框画尺寸根据卡纸计算
          let dMats = _.filter(item.materials, (m) => {
            return m.CategoryId === 1
          })
          let Properties = _.map(dMats, 'Properties')
          let fSizes = _.map(Properties, 'Size')
          sizes = {
            h: [],
            v: [],
            s: []
          }
          _.each(fSizes, s => {
            let type = sizeShape(s)
            sizes[type].push(s)
            if (type === 'v') {
              sizes['h'].push(swapSize(s))
            }
          })
          break
        case dc.Scroll:
          sizes = _.filter(item.materials, (m) => m.CategoryId === dc.Scroll)
                        .map(li => li['Properties']['Hole'])
          break
        case 'Rimless':
        case 'Magnet':
          //  有框画尺寸根据卡纸计算
          let rsObjs = _.filter(item.materials, i => {
            return i.hasOwnProperty('Size')
          })
          let rSizes = _.map(rsObjs, 'Size')
          sizes = {
            h: [],
            v: [],
            s: []
          }
          _.each(rSizes, s => {
            let type = sizeShape(s)
            sizes[type].push(s)
            if (type === 'v') {
              sizes['h'].push(swapSize(s))
            }
          })
          break
      }
      self.sizes = sizes
    },
    getBoms() {
      let self = this
      let item = self.showItem
      let catId = item.categoryId
      let mats = item.materials
      //  每个品类初始化物料 对象数组  :type :key
      let boms = []
      let tabsArray = []
      let keys = self.getkeys()
      tabsArray = tabsProduct.has(catId) ? tabsProduct.get(catId).slice() : []
      if (tabsArray.length) {
        _.each(tabsArray, t => {
          let str = t.code
          //  首字母大写
          if (str === 'outerLine') {
            str = 'OuterLine'
          } else if (str === 'innerLine') {
            str = 'InnerLine'
          } else if (str === 'magnetLine') {
            str = 'MagnetLine'
          } else {
            str = str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
          }
          let b = {}
          b.name = t.name
          b.type = mt[str]
          b.total = self.filterMaterialsByType(mats, mt[str])
          if (b.type !== mt['Size']) {
            b.total = _.uniqBy(b.total, 'Id')
          }
          boms.push(b)
        })
      }
      if (keys.length) {
        let selMat = item.entry.selects[0].product
        //  第一级 产品数组筛选
        //  第二级  选中产品下面Option 筛选
        boms.push({
          type: 'product',
          name: '产品类型',
          total: mats
        })
        keys.forEach((v) => {
          let total = self.filterMaterialsByKey(selMat, v)
          boms.push({
            type: 'productMat',
            name: v,
            total: total
          })
        })
      }
      item.boms = boms
    },
    getkeys() {
      let item = this.showItem
      let e = item.entry
      let a = []
      if (e.ProductId) {
        let selects
        if (e.selects) {
          selects = e.selects
        } else {
          selects = freshEntry(item.materials, e)
          e.selects = selects
        }
        let p = getByProperty(selects, 'product').product
        if (p.CategoryId === e.CategoryId) {
          for (let i of p.Properties) {
            if (a.indexOf(i.Key) === -1) a.push(i.Key)
          }
        }
      }
      return a
    },
    filterMaterialsByType(mats = [], type) {
      return mats.filter(li => li.Type === type)
    },
    filterMaterialsByKey(material, value) {
      let res
      res = _.filter(material.Properties, (p) => {
        return p.Key === value
      })
      return res
    },
    selectMaterial(param) {
      //  选中物料
      let material = param.material
      let type = param.type
      this.proUpdateStatus = true
      selectMaterialUtil(this.showItem, material, type, (i) => {
        this.proUpdateStatus = false
        this.showItem = i
        this.buildItem(4, 0)
      })
    },
    setCount(type, ev) {
      let count = this.count
      switch (type) {
        case 'plus':
          count++
          count = Math.max(count, 100)
          break
        case 'minus':
          count--
          count = Math.min(count, 1)
          break
      }
      this.count = count
    },
    verify() {
      let count = this.count
      if (count && /^[0-9]*[1-9][0-9]*$/.test(count)) {
        this.count = count > 100 ? 100 : count
      } else {
        this.count = 1
      }
    },
    addToCart() {
      this.buildItem(1, this.count)
    },
    buildItem(Action, Count) {
      //  Action 1添加购物车，2分享, 3喜欢, 4足记
      let params = {}
      let item = this.showItem
      let self = this
      params.Action = Action
      if (Count) {
        //  加购物车时需要传数量
        params.Count = Count
      }
      params.CategoryId = item.categoryId
      params.WorkId = this.initedWorkId
      params.EntryId = item.entry.Id
      switch (item.categoryId) {
        case dc.Frames:
        case dc.Frame:
          if (!item.hasMat) {
            // 无卡画的情况
            //              let mats
            //              let selMat
            //              mats = _.find(item.boms, b => {
            //                return b.type === mt['Mat']
            //              })
            //              selMat = mats.selectMat
            params.Packets = item.entry.Outputs[0].Size
            params.CategoryId = dc.Matless
          } else {
            params.Packets = item.Packets
            params.CategoryId = dc.Frame
          }
          break
        default:
          //  默认是新品类产品类型
          params.Packets = item.Packets
          break
      }

      request({
        url: Interf.buyProduct,
        params
      }).then(res => {
        self.$bus.$emit('refreshItemId', res.data.Id)
        self.itemRealPrice = res.data.Money / 100
        self.itemNormalPrice = Math.floor(res.data.Money / (res.data.Discount / 100)) / 100
        switch (Action) {
          case 1:
            layer.toast('添加商品成功')
            break
          case 4:
            break
        }
      })
    }
  },
  computed: {
    initedWorkId() {
      return parseInt(this.workId)
    },
    isFrame() {
      if (Array.isArray(this.categoryId)) {
        return this.categoryId.every(catId => isFrames(catId))
      } else {
        return isFrames(this.categoryId)
      }
    },
    matLessIncomes() {
      let matlessIncomes = []
      if (this.isFrame) {
        //  暂时不处理多孔或照片墙
        let matLessIndex = _.indexOf(this.categoryId, dc.Matless)
        if (matLessIndex >= 0) {
          matlessIncomes = this.incomes[matLessIndex]
        }
      }
      return matlessIncomes
    },
    proIncomes() {
      let incomes = []
      if (this.isFrame) {
        //  暂时不处理多孔或照片墙
        let frameIndex = _.indexOf(this.categoryId, dc.Frame)
        incomes = this.incomes[frameIndex]
      } else {
        incomes = this.incomes
      }
      return incomes
    }
  }
}
</script>
