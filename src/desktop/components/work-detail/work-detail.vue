<template>
  <div class="custom-wrapper">
    <div class="display-content">
      <component class="product-box"
      v-if="custom"
     :length="450"
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
      <div class="operate">
        <div class="operate-content">
          <div class="like">
            <i class="wa wa-heart-fill" :class="like && 'like'" @click="onLike"></i>
            <span class="like-number">{{likecount}}</span>
          </div>
        </div>
      </div>
    </div> 
    <div class="edit-content">
      <h3 class="work-title">{{workTitle}}</h3>
      <div class="work-info">
        <div class="work-class">{{categoryName}}</div>
        <div class="work-price">
          <div class="u-discount">{{discount/10}}折惠</div>
          <div class="price">
            <div class="dis-price">
              ¥{{originalPrice}}
            </div>
            <div class="og-price">
              ¥{{money}}
            </div>
          </div>
        </div>
      </div>
      <div class="edit">
        <components v-for="bom in boms"
        v-if="matData" 
        :is="tpl(bom.name)"
        :custom="custom"
        :fix="bom.fix"
        :key="bom.cat"
        :cat-id="catId"
        :prokey="bom.prokey"
        :materials="custom.current.materials"
        :material="custom.material(bom.name)"
        :userMaterials="userMaterials"
        :userOptions="userOptions"
        :matData="matData"
        :current="custom.current"
        :incomes="income"
        :entry="custom.current.entry"
        :pic="tranPic"
        @select-material = "selectMaterial"
        @select-income="selectIncome"
        @select-options="selectOptions"
      >
      </components>
      </div>
      <div class="add-cart" flex="dir:left cross:center main:justify">
          <input-number @selectNumber="changeNumber" class="input-number"></input-number>
          <div class="add-cart-btn" @click="addCart">
            <p>
              <span class="wa wa-shopping-cart"></span>
              加入购物车
            </p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable*/
function flyadd() {
  let $addCartCount = $(".add-cart-count");
  let $addCartBtn = $(".add-cart-btn");
  let offsetcart = $addCartCount[0].getBoundingClientRect();
  let offsetbtn = $addCartBtn[0].getBoundingClientRect();
  let correct = $addCartBtn.width() / 2 - 30;
  let div = $('<span class="add-cart-fly">1</span>');
  div.fly({
    start: { top: offsetbtn.top, left: offsetbtn.left + correct },
    end: {
      top: offsetcart.top + 12,
      left: offsetcart.left,
      width: 15,
      height: 15
    },
    speed: 2,
    onEnd: function() {
      this.destroy();
    }
  });
}
/**
 * 根据指定packets在incomes上找到对应的income
 * @param {Number} id 品类的id
 * @param {Array} incomes 对应作品的incomes
 * @param {packets} 指定的packets
 */
function filterIncomes(id, incomes, packets) {}
import { MockData } from './mock-data/product-detail-1.js'
import { newCustom } from "../custom/core/custom"
import {
  categoryImgSize,
  DecorativeCategories as dc,
  MaterialTypes as mt,
  Angles,
  StackLines,
  Fulls,
  tabs,
  product,
  Directions,
  SuggestSize as ss
} from "scripts/utils/custom/consts.js"; // 一些常量
import { getDisplayer } from "../custom/display/display-util";
import {
  getByProperty,
  parseImageSize,
  swapSize,
  isDecorate,
  copySize,
  equalSize,
  sizeShape,
  reversePicturesData
} from "scripts/utils/custom/utils.js";
import { categoryUtil } from "scripts/utils/category"; // 针对物料的一些过滤方法
import DisplayComponents from "../custom/display/components";
import { getEntries } from "../custom/display/entry.js";
import { getMaterials, allMaterials } from "components/custom/core/material.js";
import materialComponents from "./work-material/index.js";
import PublicComponents from "./components.js";
import { buildEntry } from "components/custom/core/entry.js";
import {
  changePicture,
  resetPicture,
  serializePicture4
} from "components/custom/picture/picture.js";
import {
  mergeCategory,
  filterIncomeMat,
  picVersaSerialization
} from "scripts/core/utils.js";

export default {
  components: {
    ...DisplayComponents,
    ...materialComponents,
    ...PublicComponents
  },
  props: {
    // 作品id
    workId: {
      type: Number,
      default: 98
    },
    // 品类id
    categoryId: {
      type: [Array, Number],
      default: [1, 6]
    },
    // 作品名称
    workTitle: {
      type: String,
      default: "大概多少"
    },
    // 作品对应品类下面的incomes
    workIncome: { // 布艺画
      type:Array,
      default() {
        return []
      }
    },
    // 品类对应的名称
    categoryName: {
      type: String,
      default: "单孔画"
    },
    liked: {
      type: Boolean,
      default() {
        return true;
      }
    },
    likeCount: {
      type: Number,
      default() {
        return 10;
      }
    }
  },
  data() {
    return {
      custom: undefined,
      isrender: false,
      materiallist: undefined,
      itemId: -1, // 商品id
      money: 0, // 实际金额
      originalPrice: -1,
      like: this.liked,
      likecount: this.likeCount,
      count: 1,
      discount:0,
      customs: [], // 所有incomes所组成的数组
      matData: undefined
    };
  },
  methods: {
    // 初始化
    initCustom() {
      const self = this
      let catId = self.catId
      let incomes
      let n = 0
      if (catId === dc.Frames) {
        incomes = [...this.incomes[0], ...this.incomes[1]]
      } else {
        incomes = self.incomes
      }
      // let incomes = self.incomes
      // let n = 0
      let p1 = Promise.resolve()
      let promise = Promise.resolve(n)
      incomes.forEach(income => {
        // 执行串行操作
        promise = promise.then((n) => {
          n++
          return new Promise(resolve => {
            (function(income) {
              let entryId = income.Entries
              self.$request.get('entry', entryId).then(res => {
                let entrys = res.take('Data')
                let c = newCustom()
                let pictures
                c.initialize(catId, undefined, entrys[0], entrys, () => {
                  let o = {
                    options: [], // 选项名称
                    materials: [], // 可选物料
                    custom: undefined, // custom
                    packets: income.Packets
                  }
                  // 处理图片数据
                  pictures = serializePicture4.call(this, income.Pictures[0])
                  self.$request.do('GET', `image/info/${pictures.Image.Id}`).then(res => {
                    let info = res.take('Data')
                    pictures.Image.Info = info
                    c.entries[0].pictures = [pictures]
                    if (c.current.entry.CategoryId === dc.Matless) {
                      let select = c.current.selects.filter(v => v.Type === mt.Size)[0]
                      c.current.selects.push({
                        Type: 'mat',
                        angle: 0,
                        mat: select,
                        options: []
                      })
                    }
                    o.custom = c
                    if (income.Materials && income.Materials.length > 0) {
                      income.Materials.forEach(matId => {
                        for (let k of c.current.materials) {
                          if (k.Id === matId) {
                            o.materials.push(k)
                            continue
                          }
                        }
                      })
                    }
                    if (income.Options && income.Options.length > 0) {
                      let opts
                      if (catId === dc.Frames) {
                        opts = c.current.materials.filter(k => k.Id === income.Packets[0])[0].Properties.Options
                        income.Options.forEach(optId => {
                          for (let k of opts) {
                            let id = k.Property.OptionId
                            if (optId === id) {
                              o.options.push(k)
                              continue
                            }
                          }
                        })
                      } else {
                        // 新品类需要找到当前品类对应的物料下的选项
                        opts = c.current.materials.filter(k => k.Id === income.Packets[1])[0].Properties
                        income.Options.forEach(optId => {
                          for (let k of opts) {
                            if (optId === k.OptionId) {
                              o.options.push(k)
                              continue
                            }
                          }
                        })
                      }
                    }
                    self.customs.push(o)
                    if (!self.custom) {
                      self.custom = o.custom
                    }
                    if (n === incomes.length) {
                      // 串行结束时的回调
                      p1.then(() => {
                        self.initMatData()
                        self._buildItem()
                      })
                    }
                    resolve(n)
                  })
                })
              })
            })(income)
          })
        })
      })
    },
    getCategory() {
      return new Promise((resolve, reject) => {
        if (window.$categories) {
          resolve()
        } else {
          this.$request.list('category').then(res => {
            let m = new Map()
            res.take('Data').forEach(item => {
              m.set(item.Id, item)
            })
            window.$categories = m
            resolve()
          })
        }
      })
    },
    initMatData() {
      let r = []
      switch(this.catId) {
        case dc.Frames:
          r = {
            holes: 2,
            mixs: [],
            sizes: []
          }
          this.customs.forEach(item => {
            let c = item.custom
            let s
            let o = {
              angle: 0,
              hole: 1,
              icon: "",
              id: 0,
              mat: undefined,
              name: '标卡',
              size: undefined
            }
            if (c.current.entry.CategoryId === dc.Frame) {
              s = c.current.selects.filter(v => v.Type === 'mat')[0]
              o.angle = s.angle
              o.hole = 1,
              o.icom = s.mat.Icon
              o.id = s.mat.Id
              o.mat = s.mat
              switch(s.angle) {
                case Angles.Up:
                  o.name = `${s.mat.Name}N`
                  o.size = s.mat.Properties.Size
                  break
                case Angles.Down:
                  o.name = `${s.mat.Name}S`
                  o.size = s.mat.Properties.Size
                  break
                case Angles.Right:
                  o.name = `${s.mat.Name}E`
                  o.size = [s.mat.Properties.Size[1], s.mat.Properties.Size[0]]
                  break
                case Angles.Left:
                  o.name = `${s.mat.Name}W`
                  o.size = [s.mat.Properties.Size[1], s.mat.Properties.Size[0]]
                  break
              }
            } else if (c.current.entry.CategoryId === dc.Matless) {
              s = c.current.selects.filter(v => v.Type === mt.Size)[0]
              o.hole = 0
              o.size = s.Size
              o.mat = s
              o.name = '无卡纸'
              delete o.id
              delete o.icon
            }
            r.mixs.push(o)
          })
          r.mixs.forEach(item => {
            r.sizes.push(item.size)
          })
          let l = r.sizes.length
          for (let i = 0; i < l; i++) {
            for (let j = i + 1; j < l; j++) {
              if (r.sizes[i][0] === r.sizes[j][0] && r.sizes[i][1] === r.sizes[j][1]) {
                r.sizes.splice(j, 1)
                j--
                l--
              }
            }
          }
          break
        case dc.Rimless:
        case dc.Magnet:
          this.customs.forEach(item => {
            let c = item.custom
            let s = c.current.selects.filter(v => v.Type === mt.Size)[0].Size
            r.push(s)
          })
          break
        case dc.Scroll:
          this.customs.forEach(item =>{
            let c = item.custom
            let s = c.current.selects.filter(v => v.Type === mt.Template)[0]
            r.push(s)
          })
          this.custom.current.materials.filter(v => v.Type === mt.Canvas).forEach(item => {
            r.push(item)
          })
          break
        default:
          this.customs.forEach(item => {
            let c = item.custom
            let s = c.current.selects.filter(v => v.Type === 'product')[0].product
            r.push(s)
          })
          break
      }
      this.matData = r
    },
    /**
     * 重新生成一个商品
     */
    _buildItem() {
      const self = this;
      const catId = this.custom.current.entry.CategoryId;
      const workId = this.workId;
      let c = this.custom.current;
      let packets;
      let f;
      // 根据品类id,找到对应income下所需要的数据
      switch (catId) {
        case dc.Frame:
          f = c.selects.filter(v => v.Type === "mat")[0];
          packets = [f.mat.Id, f.angle];
          break;
        case dc.Rimless:
        case dc.Magnet:
        case dc.Matless:
          f = c.selects.filter(v => v.Type === mt.Size)[0];
          packets = f.Size;
          break;
        case dc.Scroll:
          f = c.selects.filter(v => v.Type === mt.Template)[0];
          packets = [f.Id, 0];
          break;
        default:
          f = c.selects.filter(v => v.Type === "product")[0];
          packets = [0, f.product.Id];
          break;
      }
      request
        .do("GET", "item/build", {
          params: {
            CategoryId: catId,
            WorkId: workId,
            Packets: packets,
            EntryId: c.entry.Id,
            Action: 4
          }
        })
        .then(res => {
          let data = res.body
          // 商品id
          self.itemId = data.Id
          self.money = data.Money / 100
          this.originalPrice = data.Price / 100
          if (window.sessionStorage.getItem('merchandiseId')) {
            window.sessionStorage.removeItem('merchandiseId')
            window.sessionStorage.setItem('merchandiseId', data.Id)
          } else {
            window.sessionStorage.setItem('merchandiseId', data.Id)
          }
        });
    },
    // 过滤物料
    _initMaterial(incomes) {
      const catId = Number(this.categoryId);
      let materlist = [];
      let inc;
      let f; // 过滤非匹配
      let f2; // 过滤匹配
      // 默认取第一条数据作为展示
      inc = incomes[0];
      switch (catId) {
        case dc.Frame:
        case dc.Frames:
          // 选择其他的物料尺寸
          // 首先要先过滤出incomes
          // todo 如果此处url上指定incomes的packets,则使用指定的incomes
          f = this.materiallist.filter(v => v.Type !== mt.Mat);
          f2 = this.materiallist.filter(v => v.Type === mt.Mat);
          for (let k of inc.Materials) {
            for (let i of f) {
              if (k === i.Id) {
                materlist.push(i);
                break;
              }
            }
          }
          // 首先对获取到的卡纸物料做一个遍历,把颜色选项换成income中对应的颜色选项
          for (let k of incomes) {
            // 找到对应的卡纸id
            let id = k.Packets[0];
            let color = k.Options;
            for (let i of f2) {
              if (i.Id === id) {
                let options = [];
                i.Properties.Options.forEach(item => {
                  if (
                    color.some(
                      v => Number(v) === Number(item.Property.OptionId)
                    )
                  ) {
                    options.push(item);
                  }
                });
                i.Properties.Options = options;
                materlist.push(i);
                break;
              }
            }
          }
          break;
        case dc.Rimless:
        case dc.Magnet:
        case dc.Matless:
          f = this.materiallist.filter(v => v.Type !== mt.Size);
          f2 = this.materiallist.filter(v => v.Type === mt.Size);
          for (let k of inc.Materials) {
            for (let i of f) {
              if (k === i.Id) {
                materlist.push(i);
              }
            }
          }
          for (let k of incomes) {
            for (let i of f2) {
              if (
                (k.Packets[0] === i.Size[0] && k.Packets[1] === i.Size[1]) ||
                (k.Packets[0] === i.Size[1] && k.Packets[1] === i.Size[0])
              ) {
                materlist.push(i);
              }
            }
          }
          break;
        case dc.Scroll:
          f = this.materiallist.filter(v => v.Type !== mt.Template);
          f2 = this.materiallist.filter(v => v.Type === mt.Template);
          for (let k of f2) {
            materlist.push(k);
          }
          for (let k of f) {
            materlist.push(k);
          }
          break;
        default:
          // f = this.materlist.filter(v => v.Type === )
          materlist = this.materiallist;
          break;
      }
      return materlist;
    },
    // 计算宽度
    computedWidth() {
      const w = window.innerWidth;
      this.displayW = Math.ceil(w * 0.5);
    },
    // 喜欢商品
    onLike() {
      const id = this.itemId
      request.submit('like/item', {
        ItemId: id
      }).then(res => {
        let flag = res.take('Data')
        this.like = flag
        if (flag) {
          this.likecount++
        } else {
          this.likecount--
        }
      })
    },
    tpl(name) {
      let tplName = this.custom.initBomTplName(name);
      return tplName;
    },
    // 选择物料
    selectMaterial(y, triggerBom) {
        const self = this
        let c = self.custom
        const id = c.current.categoryId // 当前品类id
        let id2 // 当前卡纸id
        let current = c.current
        let select
        let incomes
        if (y.Type === mt.Template) {
          this.selectIncome(y)
          return
        }
        // if (y.Type === 'product') {
        //   let productId = y.product.Id
        //   this.customs.forEach((item, index)=> {
        //     if (item.custom.current.entry.ProductId === productId) {
        //       this.customs[index].custom.current.selects = [y]
        //       this.custom = this.customs[index].custom
        //     }
        //   })
          
        //   return
        // }
        if (y.Type === 'mat' && current.entry.CategoryId === dc.Matless && y.options.length > 0) {
          let size = y.mat.Size
          let frame = this.customs.filter(v => {
            return v.custom.current.entry.CategoryId === dc.Frame
          })
          for (let k of frame) {
            select = k.custom.current.selects.filter(v => v.Type === 'mat')[0]
            let s1
            if (select.angle === Angles.Up || select.angle === Angles.Down) {
              s1 = select.mat.Properties.Size
            } else {
              s1 = [select.mat.Properties.Size[1], select.mat.Properties.Size[0]]
            }
            if (size[0] === s1[0] && size[1] === s1[1]) {
              select.options = y.options
              self.custom = k.custom
              self._buildItem()
              break
            }
          }
          return
        }
        c.selectMaterial(y, triggerBom, () => {
          switch(self.catId) {
            case dc.Frame:
              select = current.selects.filter(v => v.Type === 'mat')[0]
              for (let i = 0; i < self.customs.length; i++) {
                let cus = self.customs[i].custom.current.selects.filter(v => v.Type === 'mat')[0]
                if (cus.angle === select.angle && cus.mat.Id === select.mat.Id) {
                  self.customs.custom = c
                  break
                }
              }
              break
          }
          self._buildItem()
        })
        
    },
    op(mode, a, b) {
      let c = this.custom;
      if (c.waiting) return;
      const warnMsg = msg => layer.toast(`请先选择${msg}哦o_o`);
      let i = c.pictureIndex;
      switch (i) {
        case -2:
          warnMsg("照片");
          return;
        case -1:
          warnMsg("孔");
          return;
      }
      let p = getByProperty(c.current.pictures, i, "Index");
      if (!p) {
        // 因为在触发mouseleave事件时，会检查overstep，
        // 所以在没选择图片时，触发mouseleave事件不提示warnMsg('图片')
        a !== "overstep" && warnMsg("图片");
        return;
      }
      if (a === "rotate" && isDecorate(c.current.entry.CategoryId)) {
        let s = parseImageSize(p.Image);
        let material = c.changeSize(s, true);
        if (material) {
          p.Output.Size = swapSize(p.Output.Size);
          c.selectMaterial(material);
        }
      }
      switch (mode) {
        case "set-image":
          changePicture(p, a, b, this.n);
          break;
        case "reset-image":
          resetPicture(p, a);
          break;
      }
    },
    // 商品数量
    changeNumber(n) {
      this.count = n;
    },
     // 加入购物车
    addCart() {
      let packets
      let c = this.custom.current
      let entryId = c.entry.Id
      let catId = c.entry.CategoryId
      switch(catId) {
        case dc.Frame:
          packets = [c.selects.filter(v => v.Type === 'mat')[0].mat.Id, c.selects.filter(v => v.Type === 'mat')[0].angle]
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
          flyadd()
          layer.toast('加入成功')
          this.$user.getUserInfo()
        }
      })
    },
    selectIncome(m) {
      const self = this
      const id = self.catId
      let select
      switch(id) {
        case dc.Frames:
          let frame = self.customs.filter(v => {
            return v.custom.current.entry.CategoryId === dc.Frame
          })
          let matless = self.customs.filter(v => {
            return v.custom.current.entry.CategoryId === dc.Matless
          })
          if (this.custom.current.entry.CategoryId === dc.Frame) {
            for (let i = 0; i < self.customs.length; i++) {
              if (self.customs[i].custom.current.entry.CategoryId === dc.Matless) {
                continue
              }
              let s = self.customs[i].custom.current.selects.filter(v => v.Type === 'mat')[0]
              if (s.angle === m.angle && s.mat.Id === m.mat.Id) {
                self.custom = self.customs[i].custom
                break
              }
            }
          } else {
            for (let i = 0; i < self.customs.length; i++) {
              if (self.customs[i].custom.current.entry.CategoryId === dc.Frame) {
                continue
              }
              let s = self.customs[i].custom.current.selects.filter(v => v.Type === mt.Size)[0]
              if (s.Size[0] === m.mat.Size[0] && s.Size[1] === m.mat.Size[1]) {
                self.custom = self.customs[i].custom
                break
              }
            }
          }
          break
        case dc.Rimless:
        case dc.Magnet:
          for (let i = 0; i < self.customs.length; i++) {
            let s = self.customs[i].custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
            if (s[0] === m[0] && s[1] === m[1]) {
              self.custom = self.customs[i].custom
              break
            }
          }
          break
        case dc.Scroll:
          for (let i = 0; i < self.customs.length; i++) {
            let s = self.customs[i].custom.current.selects.filter(v => v.Type === mt.Template)[0]
            if (s.Id === m.Id) {
              self.custom = self.customs[i].custom
              break
            }
          }
          break
        default:
          for (let i = 0; i < self.customs.length; i++) {
            let s = self.customs[i].custom.current.selects.filter(v => v.Type === 'product')[0].product
            if (s.Id === m.product.Id) {
              self.custom = self.customs[i].custom
              break
            }
          }
          break
      }
      self._buildItem()
    },
    // 切换到无卡纸
    selectOptions() {
      let c = this.custom
      if (c.current.entry.CategoryId === dc.Matless) return
      let size
      let s
      s = c.current.selects.filter(v => v.Type === 'mat')[0]
      size = (s.angle === Angles.Up || s.angle === Angles.Down) ? s.mat.Properties.Size : [s.mat.Properties.Size[1], s.mat.Properties.Size[0]]
      let matless = this.customs.filter(v => {
        return v.custom.current.entry.CategoryId === dc.Matless
      })
      for (let k of matless) {
        let s1 = k.custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
        if (s1[0] === size[0] && s1[1] === size[1]) {
          this.custom = k.custom
          break
        }
      }
    }
  },
  mounted() {
    this.getCategory().then(() => {
      this.discount = window.$categories.get(this.catId).Discount
      this.initCustom()
    })
  },
  computed: {
    // 用户物料
    userMaterials() {
      const self = this
      let c = self.custom
      let m = c.current.materials
      let customs = self.customs
      let materials = []
      for (let k of customs) {
        let cus = k.custom
        let id1 = cus.current.entry.Id
        if (id1 === c.current.entry.Id) {
          if (k.materials.length === 0) {
            break
          }
          k.materials.forEach(item => {
            for (let j of m) {
              if (j.Id === item.Id) {
                materials.push(j)
                continue
              }
            }
          })
        }
      }
      return materials
    },
    // 用户的选项
    userOptions() {
      const self = this
      const id = self.catId
      let customs = self.customs
      let custom
      let c = this.custom
      let m = c.current.materials
      let select
      let opts
      let opts2
      let r = []
      if (id === dc.Frames) {
        let frame
        let matless
        if (this.custom.current.entry.CategoryId === dc.Frame) {
          select = c.current.selects.filter(v => v.Type === 'mat')[0]
          frame = customs.filter(v => {
            return v.custom.current.entry.CategoryId === dc.Frame
          })
          opts = m.filter(v => v.Id === select.mat.Id)[0].Properties.Options
          opts2 = frame.filter(v => {
            return v.custom.current.entry.Id === c.current.entry.Id
          })[0].options
        } else if (this.custom.current.entry.CategoryId === dc.Matless){
          select = c.current.selects.filter(v => v.Type === mt.Size)[0]
          let size = select.Size
          frame = customs.filter(v => {
            return v.custom.current.entry.CategoryId === dc.Frame
          })
          // 找到无卡画的原始的卡纸数据
          opts = m.filter(v => v.Type === mt.Mat && v.CategoryId !== dc.MultiHole).filter(v => {
            let s = v.Properties.Size
            if (s[0] === s[1]) {
              if (s[0] === size[0] && s[1] === size[1]) {
                return v
              }
            } else {
              if ((s[0] === size[0] && s[1] === size[1]) || (s[0] === size[1] && s[1] === size[0])) {
                return v
              }
            }
          })[0].Properties.Options
          opts2 = frame.filter(v => {
            let s = v.custom.current.selects.filter(k => k.Type === 'mat')[0]
            let size1
            if (s.angle === Angles.Up || s.angle === Angles.Down) {
              size1 = s.mat.Properties.Size
            } else {
              size1 = [s.mat.Properties.Size[1], s.mat.Properties.Size[0]]
            }
            if (size1[0] === size[0] && size1[1] === size[1]) {
              return v
            }
            
          })[0].options
        }
        opts2.forEach(item => {
          let id1 = item.Property.OptionId
          for (let k of opts) {
            let id2 = k.Property.OptionId
            if (id1 === id2) {
              r.push(k)
              break
            }
          }
        })
      } else if (id !== dc.Frames && id !== dc.Rimless && id !== dc.Magnet && id !== dc.Scroll && id !== dc.Matless && id !== dc.Frame){
        opts = m.filter(v => !v.Type).filter(v => v.Id === c.current.entry.ProductId)[0].Properties
        opts2 = customs.filter(v => {
          return v.custom.current.entry.ProductId === c.current.entry.ProductId
        })[0].options
        opts2.forEach(item => {
          for (let k of opts) {
            if (item.OptionId === k.OptionId) {
              r.push(k)
              break
            }
          }
        })
      }
      return r
    },
    // incomes
    incomes() {
      if (this.workIncome && this.workIncome.constructor === Array && this.workIncome.length > 0) {
        return this.workIncome
      } else {
        return MockData
      }
      // return this.workIncome
      // if (this.workIncome.length > 0) {
      //   return this.workIncome[0].constructor === Array ? this.workIncome[0] : this.workIncome
      // } else {
      //   return MockData
      // }
    },
    displayer() {
      let c = this.custom;
      if (c.waiting) return;
      return getDisplayer(c.current.entry, c.di);
    },
    boms() {
      if (this.custom) {
        return this.custom.getboms().filter(v => v.name !== 'image')
      }
    },
    tranPic() {
			let c = this.custom
			let i = c.pictureIndex
			let p = getByProperty(c.current.pictures, i, 'Index')
			return p
    },
    catId() {
      if (!this.categoryId) return
      if (typeof this.categoryId === 'number') {
        return this.categoryId
      } else if (this.categoryId.constructor === Array) {
        if (this.categoryId.length > 1) {
          // 如果传入的元素中存在1或者6,那么表示是有框画
          if (this.categoryId.some(v => v === dc.Frame || v === dc.Matless)) {
            return dc.Frames
          }
        } else if (this.categoryId.length === 1){
          return this.categoryId[0]
        }
      }
    }
  }
};

</script>


