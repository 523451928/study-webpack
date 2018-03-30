<template lang="html">
  <section class="m-detail" flex="dir:top">
    <div class="display detail-panel">
      <component slot="content" class="product-box"
      v-if="isrender"
     :length="displayW"
     :keep-alive="false" :is="displayer"
     :canvas="'Custom'"
     :editstatus="false"
     :entry="custom.current.entry"
     :displays="custom.displays"
     :pictures="custom.current.pictures"
     :xi="custom.xi"
     :di="custom.di" 
     :isproduct="false">
      </component>
    </div>
    <panel :adClass="'work-info'">
      <div slot="content" flex="dir:top">
        <div class="line" flex="dir:left cross:bottom">
          <h4>{{workTitle}}</h4>
          <discount :discount="discount" :adClass="'discount'"></discount>
        </div>
        <div class="line" flex="dir:left cross:center main:justify">
          <div class="price" flex="dir:left cross:baseline">
            <span class="present">
              ¥{{(money/100).toFixed(1)}}
            </span>
            <span class="original">
              ¥{{originalPrice.toFixed(1)}}
            </span>
          </div>
          <user-like :itemId="itemId" :liked="like" :count="likeCount" @liked="onliked"></user-like>
        </div>
      </div>
    </panel>
    <div class="edit-content">
      <h4>选择搭配</h4>
      <components v-for="bom in boms" v-if="isrender"
      :is="tpl(bom.name)"
      :custom="custom"
      :fix="bom.fix"
      :key="bom.cat"
      :prokey="bom.prokey"
      :cat-id="categoryId"
      :materials="custom.current.materials"
      :material="custom.material(bom.name)"
      :current="custom.current"
      :entrys="entrys"
      :incomes="income"
      :entry="custom.current.entry"
      @select-material = "selectMaterial"
      >
      </components>
    </div>
    <panel :adClass="'select-number'">
      <div slot="content" class="content" flex="dir:left cross:center">
        <span>数量:</span>
        <select-number @select-count="selectCount"></select-number>
      </div>
    </panel>
    <div class="cart-bar">
      <div class="content" flex="dir:left">
        <ul class="nav-bar" flex="dir:left cross:center box:mean">
          <li class="nav-item">
            <a @click.prevent="contactService"  flex="dir:top main:center cross:center">
              <i class="wa wa-woman"></i>
              <span>客服</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="" flex="dir:top main:center cross:center">
              <i class="wa wa-new-store"></i>
              <span>店铺</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="/cart.html" flex="dir:top main:center cross:center">
              <i class="wa wa-shopping-cart"></i>
              <span>购物 </span>
            </a>
          </li> 
        </ul>
        <m-button :text="'加入购物车'" :adClass="'adCart'" 
        @clickBtn="addCart()"></m-button>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import { newCustom } from "../custom/core/custom" // custom组件 核心s
import Discount from 'components/core/discount.vue' // 折扣显示
import UserLike from 'components/core/user-like.vue' // 喜欢组件
import MButton from 'components/core/btn.vue' // 按钮组件
import SelectNumber from 'components/core/select-number.vue' // 计数器组件
import { getDisplayer } from "components/custom/display/display-util" // 判断当前品类应该用哪个物料渲染模版
import Panel from 'components/core/panel.vue' // 通用面板组件
// import Swiper from 'components/core/swiper.vue' // 通用轮播组件
import DisplayComponents from "components/custom/display/components" // 显示物料组件
import { mergeCategory, filterIncomeMat, picVersaSerialization } from "scripts/core/utils.js" // 常见的工具类方法
import { getMaterials, allMaterials } from 'components/custom/core/material.js'
import { getEntries } from 'components/custom/display/entry.js'
import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
} from "scripts/utils/custom/consts.js" // 一些常量
import {
  getByProperty,
  parseImageSize,
  swapSize,
  isDecorate,
  copySize,
  equalSize,
  sizeShape,
  reversePicturesData
} from 'scripts/utils/custom/utils.js'
import {
  changePicture,
  resetPicture
} from 'components/custom/picture/picture.js'
import materialComponents from './material/index.js'
import {mixin} from 'scripts/contactMixin'
export default {
  mixins: [mixin],
  data() {
    return {
      custom: newCustom(), // 核心组件
      isrender: false, // 是否渲染完成
      materiallist: undefined, //　当前品类对应的所有物料
      displayW: 300, // display组件显示的宽度
      itemId: -1, // 生成的商品id
      money: -1, // 商品的价格
      originalPrice:-1, // 原价
      discount: 0, // 折扣
      like: this.liked,
      likeCount: this.count,
      boms:undefined,
      entrys: undefined, // 每个income所对应的entry数据
      count: 1, // 商品选中的数量
    }
  },
  props: {
    catId: {
      type: Array,
      default() {
        return [2]
      }
    },
    workTitle: {
      type: String,
      default: '大概多少'
    },
    workId: {
      type: Number,
      default: 94
    },
    categoryName: {
      type: String,
      default: '抱枕'
    },
    workIncome: { // 磁铁画
      type: Array,
      default() {
        return [
          [
            {
              Entries:[5],
              Materials: null,
              Options: [233, 266, 193, 268, 269],
              Packets: [0, 5],
              Pictures: [
                [
                  {
                    DPI: 100,
                    ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
                    ImageId:3,
                    Index: 0,
                    OutPut: {
                      Full: 2,
                      Size: [296, 348]
                    },
                    Rotate:0,
                    ScaleX: 31,
                    SclaeY: 31,
                    TranslateX: 0,
                    TranslateY: 0
                  }
                ]
              ]
            }
          ]
        ]
      }
    },
    // workIncome: { // 磁铁画
    //   type: Array,
    //   default() {
    //     return [
    //       [
    //         {
    //           Entries:[290],
    //           Materials: [4852, 2000001],
    //           Options: null,
    //           Packets: [500, 350],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //                 ImageId:3,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full: 2,
    //                   Size: [500, 350]
    //                 },
    //                 Rotate:0,
    //                 ScaleX: 45,
    //                 SclaeY: 45,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         },
    //         {
    //           Entries:[297],
    //           Materials: [4852, 2000001],
    //           Options: null,
    //           Packets: [600, 400],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //                 ImageId:3,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full: 2,
    //                   Size: [600, 400]
    //                 },
    //                 Rotate:0,
    //                 ScaleX: 52,
    //                 SclaeY: 52,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         },
    //         {
    //           Entries:[296],
    //           Materials: [4852, 2000001],
    //           Options: null,
    //           Packets: [700, 500],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //                 ImageId:3,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full: 2,
    //                   Size: [700, 500]
    //                 },
    //                 Rotate:0,
    //                 ScaleX: 64,
    //                 SclaeY: 64,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         },
    //         {
    //           Entries:[298],
    //           Materials: [4852, 2000001],
    //           Options: null,
    //           Packets: [900, 600],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //                 ImageId:3,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full: 2,
    //                   Size: [900, 600]
    //                 },
    //                 Rotate:0,
    //                 ScaleX: 77,
    //                 SclaeY: 77,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         }
    //       ]
    //     ]
    //   }
    // },
    // workIncome: { // 卷轴画
    //   type: Array,
    //   default() {
    //     return [
    //       [
    //         {
    //           Entries:[14],
    //           Materials: null,
    //           Options: null,
    //           Packets: [24, 0],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //                 ImageId:3,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full: 2,
    //                   Size: [400, 600]
    //                 },
    //                 Rotate:0,
    //                 ScaleX: 77,
    //                 SclaeY: 77,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         },
    //         {
    //           Entries:[21],
    //           Materials: null,
    //           Options: null,
    //           Packets: [40, 0],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //                 ImageId:3,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full: 2,
    //                   Size: [500, 700]
    //                 },
    //                 Rotate:0,
    //                 ScaleX: 90,
    //                 SclaeY: 90,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         }
    //       ]
    //     ]
    //   }
    // },
    // workIncome: { // 布艺画
    //   type:Array,
    //   default() {
    //     return [
    //       [
    //         {
    //           Entries: [18],
    //           Materials: [33, 32, 71, 3517, 72, 10, 3533, 11, 42, 20],
    //           Options: null,
    //           Packets: [300, 300],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: "9ad69916ddc8c3b5ef148aeddc5e3966-1920x1080.jpg",
    //                 ImageId:103,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full:2,
    //                   Size: [300, 300]
    //                 },
    //                 Rotate: 0,
    //                 ScaleX: 77,
    //                 ScaleY: 77,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         },
    //         {
    //           Entries: [213],
    //           Materials: [33, 32, 71, 3517, 72, 10, 3533, 11, 42, 20],
    //           Options: null,
    //           Packets: [600, 300],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: "9ad69916ddc8c3b5ef148aeddc5e3966-1920x1080.jpg",
    //                 ImageId:103,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full:2,
    //                   Size: [600, 300]
    //                 },
    //                 Rotate: 0,
    //                 ScaleX: 87,
    //                 ScaleY: 87,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         },
    //         {
    //           Entries: [211],
    //           Materials: [33, 32, 71, 3517, 72, 10, 3533, 11, 42, 20],
    //           Options: null,
    //           Packets: [500, 350],
    //           Pictures: [
    //             [
    //               {
    //                 DPI: 70,
    //                 ImageFile: "9ad69916ddc8c3b5ef148aeddc5e3966-1920x1080.jpg",
    //                 ImageId:103,
    //                 Index: 0,
    //                 OutPut: {
    //                   Full:2,
    //                   Size: [500, 350]
    //                 },
    //                 Rotate: 0,
    //                 ScaleX: 90,
    //                 ScaleY: 90,
    //                 TranslateX: 0,
    //                 TranslateY: 0
    //               }
    //             ]
    //           ]
    //         }
    //       ]
    //     ]
    //   }
    // },
    // workIncome: { // 单孔画
    //   type: Array,
    //   default: [
    //     [
    //       {
    //         Entries: [39],
    //         Materials: [38, 49, 2, 3518, 48, 66, 21, 25, 29, 28, 23, 30, 31],
    //         Options: [100034, 100054, 103530, 100057, 100056, 100055],
    //         Packets: [101210, 0],
    //         Pictures: [
    //           [
    //             {
    //               DPI: 100,
    //               ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //               ImageId: 3,
    //               Index: 0,
    //               OutPut: {
    //                 Full: 2,
    //                 Size: [650, 190]
    //               },
    //               Rotate: 0,
    //               ScaleX: 67,
    //               ScaleY: 67,
    //               TranslateX: 0,
    //               TranslateY: 0
    //             }
    //           ]
    //         ]
    //       },
    //       {
    //         Entries: [30],
    //         Materials: [38, 49, 2, 3518, 48, 66, 21, 25, 29, 28, 23, 30, 31],
    //         Options: [100034, 100054, 103530, 100057, 100056, 100055],
    //         Packets: [101209, 0],
    //         Pictures: [
    //           [
    //             {
    //               DPI: 100,
    //               ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //               ImageId: 3,
    //               Index: 0,
    //               OutPut: {
    //                 Full: 2,
    //                 Size: [510, 510]
    //               },
    //               Rotate: 0,
    //               ScaleX: 93,
    //               ScaleY: 93,
    //               TranslateX: 0,
    //               TranslateY: 0
    //             }
    //           ]
    //         ]
    //       },
    //       {
    //         Entries: [29],
    //         Materials: [38, 49, 2, 3518, 48, 66, 21, 25, 29, 28, 23, 30, 31],
    //         Options: [100034, 100054, 103530, 100057, 100056, 100055],
    //         Packets: [104858, 0],
    //         Pictures: [
    //           [
    //             {
    //               DPI: 100,
    //               ImageFile: 'fdd9d230d0f567fb09410bb716c9bf08-3840x2160.jpg',
    //               ImageId: 3,
    //               Index: 0,
    //               OutPut: {
    //                 Full: 2,
    //                 Size: [510, 510]
    //               },
    //               Rotate: 0,
    //               ScaleX: 93,
    //               ScaleY: 93,
    //               TranslateX: 0,
    //               TranslateY: 0
    //             }
    //           ]
    //         ]
    //       },
    //     ]
    //   ]
    // },
    // 当前是否喜欢
    liked: {
      type: Boolean,
      default: true
    },
    count: {
      type: Number,
      default: 1
    }
  },
  components: {
    ...DisplayComponents,
    ...materialComponents,
    Panel,
    Discount,
    UserLike,
    SelectNumber,
    MButton
  },
  mounted() {
    this.computedWidth()
    this._initCustom()
  },
  methods: {
    _initCustom() {
      const self = this
      self._getCategory()
      .then(() => {
        return self._getMaterial()
      })
      .then(res => {
        // res 当前品类对应的物料类型
        self.materiallist = res[0]
        let entryIds = []
        self.income.forEach(item => {
          entryIds.push(item.Entries[0])
        })
        return self._buildEntry(entryIds)
      })
      .then(res => {
        let entry = res[0]
        self.entrys = res
        let material = self._initMaterial(self.income)
        self.custom.initialize(Number(self.categoryId), material, entry, [entry], () => {
          console.log(self.income[0])
          let pic = picVersaSerialization(self.income[0].Pictures)
          console.log(pic)
          self.custom.entries[0].pictures = pic
          console.log(self.custom)
          self.boms = self.custom.getboms().filter(v => v.name !== 'image')
          self.isrender = true
          return self._buildItem()
        })
      })
      .then(res => {

      })
    },
    // 获得所有品类数据
    _getCategory() {
      return new Promise((resolve, reject) => {
        request.list('category').then(res => {
          let m = new Map()
          res.take('Data').forEach(item => {
            m.set(item.Id, item)
          })
          window.$categories = m
          this.discount = window.$categories.get(this.categoryId).Discount
          resolve()
        })
      })
    },
    // 获取物料
    _getMaterial() {
      const self = this
      return new Promise((resolve, reject) => {
        const id = self.categoryId
        allMaterials([id]).then(res => {
          resolve(res)
        })
      })
    },
    // 初始化entry,并且返回对应卡纸是否需要旋转的数据
    _buildEntry(entryIds) {
      const self = this
      return new Promise((resolve, reject) => {
        getEntries(entryIds).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 重新生成一个商品
     */
    _buildItem() {
      return new Promise((resolve, reject) => {
        const catId = Number(this.categoryId)
        const workId = this.workId
        let c = this.custom.current
        let packets
        let f
        // 根据品类id,找到对应income下所需要的数据
        switch(catId) {
          case dc.Frame:
          case dc.Frames:
            f = c.selects.filter(v => v.Type === 'mat')[0]
            packets = [f.mat.Id, 0]
            break
          case dc.Rimless:
          case dc.Magnet:
          case dc.Matless:
            f = c.selects.filter(v => v.Type === mt.Size)[0]
            packets = f.Size
            break
          case dc.Scroll:
            f = c.selects.filter(v => v.Type === mt.Template)[0]
            packets = [f.Id, 0]
            break
          default:
            f = c.selects.filter(v => v.Type === 'product')[0]
            packets = [0, f.product.Id]
            break
        }
        request.do('GET', 'item/build', {
          params: {
            CategoryId: catId,
            WorkId: workId,
            Packets: packets,
            EntryId: c.entry.Id,
            Action: 4
          }
        }).then(res => {
          this.itemId = res.body.Id
          this.money = res.body.Money
          this.originalPrice = Math.ceil((this.money / 100) / (Number(window.$categories.get(catId).Discount) / 100))
          resolve(res.body)
        })
      })
    },
    // 过滤物料
    _initMaterial(incomes) {
      const catId = Number(this.categoryId)
      let materlist = []
      let inc
      let f // 过滤非匹配
      let f2 // 过滤匹配
        // 默认取第一条数据作为展示
      inc = incomes[0]
      switch (catId) {
        case dc.Frame:
        case dc.Frames:
          // 选择其他的物料尺寸
          // 首先要先过滤出incomes
          // todo 如果此处url上指定incomes的packets,则使用指定的incomes
          f = this.materiallist.filter(v => v.Type !== mt.Mat)
          f2 = this.materiallist.filter(v => v.Type === mt.Mat)
          for (let k of inc.Materials) {
            for (let i of f) {
              if (k === i.Id) {
                materlist.push(i)
                break
              }
            }
          }
          // 首先对获取到的卡纸物料做一个遍历,把颜色选项换成income中对应的颜色选项
          for (let k of incomes) {
            // 找到对应的卡纸id
            let id = k.Packets[0]
            let color = k.Options
            for (let i of f2) {
              if (i.Id === id) {
                let options = []
                i.Properties.Options.forEach((item) => {
                  if (color.some(v => Number(v) === Number(item.Property.OptionId))) {
                    options.push(item)
                  }
                })
                i.Properties.Options = options
                materlist.push(i)
                break
              }
            }
          }
          break
        case dc.Rimless:
        case dc.Magnet:
        case dc.Matless:
          f = this.materiallist.filter(v => v.Type !== mt.Size)
          f2 = this.materiallist.filter(v => v.Type === mt.Size)
          for (let k of inc.Materials) {
            for (let i of f) {
              if (k === i.Id) {
                materlist.push(i)
              }
            }
          }
          for (let k of incomes) {
            for (let i of f2) {
              if ((k.Packets[0] === i.Size[0] && k.Packets[1] === i.Size[1]) || (k.Packets[0] === i.Size[1] && k.Packets[1] === i.Size[0])) {
                materlist.push(i)
              }
            }
          }
          break
        case dc.Scroll:
          f = this.materiallist.filter(v => v.Type !== mt.Template)
          f2 = this.materiallist.filter(v => v.Type === mt.Template)
          for (let k of f2) {
            materlist.push(k)
          }
          for (let k of f) {
            materlist.push(k)
          }
          break
        default:
          // f = this.materlist.filter(v => v.Type === )
          materlist = this.materiallist
          break
      }
      return materlist
    },
    // 计算宽度
    computedWidth() {
      const w = window.innerWidth
      this.displayW = Math.ceil(w * 0.5)
    },
    // 喜欢商品
    onliked(v) {
      this.like = v.like
      this.likeCount = v.count
    },
    tpl(name) {
      let tplName = this.custom.initBomTplName(name)
      return tplName
    },
    // 选择物料
    selectMaterial(y, triggerBom) {
      const self = this
      let c = self.custom
      const id = c.current.categoryId // 当前品类id
      let id2 // 当前卡纸id
      let current = c.current.selects
      let incomes
      console.log(y)
      c.selectMaterial(y, triggerBom, () => {
        let pic
        if (y.Type === 'mat') {
          // 判断是否是有卡画
          if (y.mat.Id) {
            pic = self.income.filter(v => {
              if (v.Packets[0] === y.mat.Id) {
                return v
              }
            })[0].Pictures
          } else if (y.mat.Size){
            let size = v.mat.Size
            pic = self.income.filter(v => {
              if (v.Packets[0] === size[0] && v.Packets[1] === size[1]) {
                return v
              }
            })[0].Pictures
          }
          pic = picVersaSerialization(pic)
          c.entries[0].pictures = pic
        } else if (y.Type === mt.Size) {
          pic = self.income.filter(v => {
            if (v.Packets[0] === y.Size[0] && v.Packets[1] === y.Size[1]) {
              return v
            }
          })[0].Pictures
          pic = picVersaSerialization(pic)
          c.entries[0].pictures = pic
        }
        this._buildItem()
      })
    },
    op(mode, a, b) {
      let c = this.custom
      if (c.waiting) return
      const warnMsg = msg => layer.toast(`请先选择${msg}哦o_o`)
      let i = c.pictureIndex
      switch (i) {
        case -2:
          warnMsg('照片')
          return
        case -1:
          warnMsg('孔')
          return
      }
      let p = getByProperty(c.current.pictures, i, 'Index')
      if (!p) {
        // 因为在触发mouseleave事件时，会检查overstep，
        // 所以在没选择图片时，触发mouseleave事件不提示warnMsg('图片')
        a !== 'overstep' && warnMsg('图片')
        return
      }
      if (a === 'rotate' && isDecorate(c.current.entry.CategoryId)) {
        let s = parseImageSize(p.Image)
        let material = c.changeSize(s, true)
        if (material) {
          p.Output.Size = swapSize(p.Output.Size)
          c.selectMaterial(material)
        }
      }
      switch (mode) {
        case 'set-image':
          changePicture(p, a, b, this.n)
          break
        case 'reset-image':
          resetPicture(p, a)
          break
      }
    },
    // 商品数量
    selectCount(n) {
      this.count = n
    },
    // 加入购物车
    addCart() {
      let packets
      let c = this.custom.current
      let entryId = c.entry.Id
      let catId = c.entry.CategoryId
      switch(catId) {
        case dc.Frame:
          packets = [c.selects.filter(v => v.Type === 'mat')[0].mat.Id, 0]
          break
        case dc.Matless:
        case dc.Rimless:
        case dc.Magnet:
          packets = c.entry.Decorative.Size
          break
        case dc.Scroll:
          packets = [c.selects.filter(v => v.Type === mt.Template)[0].Id, 0]
          break
        default:
          packets = [0, c.entry.ProductId]
          break
      }
      this.$request.do('GET', 'item/build', {
        params: {
          Action: 1,
          Count: this.count,
          CategoryId: catId,
          WorkId: this.workId,
          Packets: packets,
          EntryId: entryId
        }
      }).then(res => {
        if (res.ok) {
          layer.toast('加入成功')
        }
      })
    },
    contactService() {
      request({url: 'user/improve'}).then((res) => {
        let data = res.body.Data
        ysf.config({
          uid: data.Id, // 用户ID
          name: data.Nickname, // 昵称
          email: data.Email, // 信箱
          mobile: data.Mobile // 手机
        })
        window.url = function(){
          location.href = ysf.url()
        }

        window.openSDK = function(){
          ysf.open()
        }
        location.href = ysf.url()
      })
    }
  },
  computed: {
    displayer() {
      let c = this.custom;
      if (c.waiting) return;
      return getDisplayer(c.current.entry, c.di);
    },
    income() {
      if (Array.isArray(this.workIncome)) {
        if (Array.isArray(this.workIncome[0])) {
          return this.workIncome[0]
        } else {
          return this.workIncome
        }
      } else {
        return [this.workIncome]
      }
    },
    // 实际的id
    categoryId() {
      if (Array.isArray(this.catId)) {
        return this.catId[0]
      }
      if (typeof this.catId === 'number') {
        return this.catId
      }
    }
  }
}
</script>
