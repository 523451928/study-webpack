// Copyright 2016 Chen Xianren. All rights reserved.
import { DecorativeCategories as dc, MaterialTypes as mt,
  tabsProduct, proBomsCount as pbCount, InitBonus } from 'scripts/utils/custom/consts'
import { getMaterials } from 'scripts/utils/custom/material'
import { zeroEntry, freshEntry, freshPhotoWall, buildEntry } from 'scripts/utils/custom/entry'
//  import { initListEntryObj } from 'components/public/display/app/display-util'
import { strMapToJson, sizeShape, swapSize, getByProperty, objToStrMap } from 'scripts/utils/custom/utils'
import { getEntries } from 'scripts/utils/entry'
import { initPicture } from 'components/public/display/app/picture'
import { getProduct, initSelects, getTags, updateIncomeMateria, initDisplayParam, renderById, initEditBoms, selectMaterialUtil } from './utils'
export function newProduct() {
  return new Vue({
    data() {
      return {
        waiting: true,
        materials: new Map(),
        entries: new Map(),
        Pieces: [],
        Title: '',
        SelectTags: [],
        Tags: new Map(),
        Description: '',
        Offline: true,
        rowCount: 0,
        //  页面是否作为编辑功能使用
        isEditPage: false
      }
    },
    methods: {
      initTags() {
        let self = this
        getTags().then(tags => {
          self.Tags = objToStrMap(tags)
        })
      },
      initProData(id) {
        let self = this
        if (id && /^[0-9]*[1-9][0-9]*$/.test(id)) {
          self.editId = id
          getProduct(id).then(res => {
            let proData = res.Data
            self.proData = proData
            self.Title = proData.Title
            self.SelectTags = proData.Tags
            self.Description = proData.Description
            self.isEditPage = true
            self.$bus.$emit('init-data', proData)
          })
        } else {
          self.$bus.$emit('init-data', self.isEditPage)
        }
      },
      initMaterials() {
        let self = this
        let keys = []
        let values = []
        for (let cat in dc) {
          switch (cat) {
            case 'MultiHole':
            case 'PhotoWall':
            case 'Poster':
            case 'Matless':
            case 'Frames':
            case 'Decorate':
              break
            default:
              keys.push(cat)
              values.push(getMaterials(dc[cat]))
          }
        }
        Promise.all(values).then(materialsDetail => {
          // 所有异步结束后，把物料详情渲染到Map里
          _.each(materialsDetail, (d, i) => {
            self.materials.set(keys[i], d)
          })
          if (self.isEditPage) {
            self.initEditData()
          } else {
            self.initData()
          }
        })
      },
      initEditData() {
        let self = this
        let materials = self.materials
        let proData = self.proData
        let Pieces = proData.Pieces
        let entriesIds = []
        _.each(Pieces, item => {
          let catId = item.CategoryId
          let cat = _.findKey(dc, (id) => {
            return id === catId
          })
          switch (cat) {
            case 'Frame':
              item.type = 'Paints'
              item['matTplType'] = 'material-frame'
              break
            case 'Case':
              item.type = 'Product'
              item['matTplType'] = 'material-pro'
              break
            default:
              item.type = 'Paints'
              item['matTplType'] = 'material-normal'
          }
//          let entPromise
          item.category = cat
          item.categoryId = catId
          item.materials = materials.get(cat)
          //  active 状态表示品类是否下线 默认都是上线的
          item.active = !item.Pause
          item.canFire = true
          //  初始化Incomes
          _.each(item.Incomes, inc => {
            inc.status = true
            entriesIds = _.concat(entriesIds, inc.Entries)
          })
        })
        getEntries(entriesIds, true).then(entriesDetail => {
          //  初始化装饰画所有可用的sizes/incomes
          self.initSizes(Pieces)
          _.each(Pieces, item => {
            let incomes = item.Incomes
            let defEntry
            let pictures
            _.each(incomes, (inc, i) => {
              inc.Entries = renderById(entriesDetail, inc.Entries)
              if (item.CategoryId === dc.Frame) {
                inc.size = inc.Entries[0].Decorative.Size
                inc.hasMat = true
              }
              _.each(inc.Pictures[0], p => {
                initPicture(0, inc.Entries[0].Outputs[0], p)
              })
              if (i === 0) {
                //  默认显示第一个Income
                inc.def = true
                defEntry = inc.Entries[0]
                pictures = inc.Pictures
              } else {
                inc.def = false
              }
            })
            item.entry = defEntry
            item.entries = [{
              index: -1,
              categoryId: item.categoryId,
              entry: defEntry,
              selects: defEntry.selects,
              materials: item.materials,
              pictures: []
            }]
            item.pictures = pictures[0]
            initDisplayParam(item)
            //  active 状态表示品类是否下线 默认都是上线的
            item.active = true
            item.boms = self.getBoms(item)
            initEditBoms(item)
          })

          self.rowCount = Math.ceil(Pieces.length / 3)
          self.Pieces = Pieces
          self.waiting = false
        })
      },
      initData(entry = {}) {
        let self = this
        let entries = self.entries
        let keys = []
        let values = []
        let materials = self.materials

        materials.forEach((value, index) => {
          let categoryId = dc[index]
          entry = zeroEntry(categoryId === dc.Frames ? dc.Frame : categoryId)
          if (index === 'PhotoWall') {
            // 照片墙build entry
            keys.push(index)
            values.push(freshPhotoWall(entry, entries))
          } else {
            let selects = freshEntry(value, entry)
            keys.push(index)
            values.push(buildEntry(entry.CategoryId, selects))
          }
        })
        Promise.all(values).then(entriesDetail => {
          // 所有异步结束后，把物料详情渲染到Map里
          _.each(entriesDetail, (d, i) => {
            let thisEntries
            let thisKey = keys[i]
            let categoryId = dc[thisKey]
            let thismaterials = materials.get(thisKey)
            if (thisKey === 'PhotoWall') {
              d.unshift({
                categoryId: categoryId,
                entry: thismaterials[0],
                materials: thismaterials,
                selects: [thismaterials[0]]
              })
              d.forEach((v, k) => {
                v.index = k
                v.pictures = []
              })
              thisEntries = d
            } else {
              thisEntries = [{
                index: -1,
                categoryId: categoryId,
                entry: d,
                selects: d.selects,
                materials: thismaterials,
                pictures: []
              }]
            }
            self.entries.set(thisKey, thisEntries)
          })
          self.initPieces()
          self.waiting = false
        })
      },
      initPieces() {
        let self = this
        let entries = self.entries
        let materials = self.materials
        let ie = strMapToJson(entries)
        let Pieces = []
        let len = ie.length
        self.rowCount = Math.ceil(len / 3)
        _.each(ie, (es) => {
          let item = {}
          for (var k in es) {
            item['category'] = k
            item['categoryId'] = dc[k]
            switch (item['category']) {
              case 'Frame':
                item.type = 'Paints'
                item['matTplType'] = 'material-frame'
                break
              case 'Case':
                item.type = 'Product'
                item['matTplType'] = 'material-pro'
                break
              default:
                item.type = 'Paints'
                item['matTplType'] = 'material-normal'
            }
            item.entries = es[k]
            item.materials = materials.get(k)
            initDisplayParam(item)
            //  active 状态表示品类是否下线 默认都是上线的
            item.active = true
            //  canFire 状态表示品类是否可以做 默认都是不能做
            item.canFire = false
            item.pictures = []
            item.boms = self.getBoms(item)
          }
          Pieces.push(item)
        })
        self.initSizes(Pieces)
        self.Pieces = Pieces
      },
      initSizes(Pieces) {
        let sizes
        //  初始化装饰画Sizes， 主要用于根据画芯判断图片是否能填满， 以及默认选中的SIZE类型
        //  有框画和布艺画初始化Size类型  *h 横形 *v 竖形 *s 方形
        //  初始数据都是竖形的  需要拷贝出横形
        //  有框、布艺是一个对象  卷轴是一个数组
        _.each(Pieces, item => {
          switch (item.category) {
            case 'Frame':
              //  有框画尺寸根据卡纸计算
              let dMats = _.filter(item.materials, (m) => {
                return m.CategoryId === 1
              })
              let holeSizes
              let Properties = _.map(dMats, 'Properties')
              let fSizes = _.map(Properties, 'Size')
              let hSizes = _.map(Properties, 'Hole')
              sizes = {h: [], v: [], s: []}
              holeSizes = {h: [], v: [], s: []}
              _.each(fSizes, (s, i) => {
                let hole = {}
                let type = sizeShape(s)
                hole.size = s
                hole.holeSize = hSizes[i].slice(0, 2)
                holeSizes[type].push(hole)
                sizes[type].push(s)
                if (type === 'v') {
                  hole.size = swapSize(s)
                  hole.holeSize = swapSize(hSizes[i].slice(0, 2))
                  holeSizes['h'].push(hole)
                  sizes['h'].push(swapSize(s))
                }
              })
              item.holeSizes = holeSizes
              console.dir(holeSizes)
              item.sizes = sizes
              break
            case 'Scroll':
              let tpls = _.filter(item.materials, (m) => {
                return m.CategoryId === 4
              })
              let scrollP = _.map(tpls, 'Properties')
              let sSizes = _.map(scrollP, 'Hole')
              sizes = []
              _.each(sSizes, s => {
                sizes.push(s)
              })
              item.sizes = sizes
              break
            case 'Rimless':
              //  有框画尺寸根据卡纸计算
              let rsObjs = _.filter(item.materials, i => {
                return i.hasOwnProperty('Size')
              })
              let rSizes = _.map(rsObjs, 'Size')
              sizes = {h: [], v: [], s: []}
              _.each(rSizes, s => {
                let type = sizeShape(s)
                sizes[type].push(s)
                if (type === 'v') {
                  sizes['h'].push(swapSize(s))
                }
              })
              item.sizes = sizes
              break
          }
        })
      },
      getBoms(item) {
        let self = this
        let catId = item.categoryId
        let mats = item.materials
        //  每个品类初始化物料 对象数组  :type :key
        let boms = []
        let tabsArray = []
        let keys = this.getkeys(item)
        tabsArray = tabsProduct.has(catId) ? tabsProduct.get(catId).slice() : []
        if (tabsArray.length) {
          _.each(tabsArray, t => {
            let str = t.code
            //  首字母大写
            if (str === 'outerLine') {
              str = 'OuterLine'
            } else if (str === 'innerLine') {
              str = 'InnerLine'
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
        return boms
      },
      getkeys(item) {
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
      filterMaterialsByType(mats, type) {
        let res
        res = _.filter(mats, m => {
          return m.Type === type
        })
        return res
      },
      filterMaterialsByKey(material, value) {
        let res
        res = _.filter(material.Properties, (p) => {
          return p.Key === value
        })
        return res
      },
      selectMaterial(item, material, type) {
        this.waiting = true
        selectMaterialUtil(item, material, type, (i) => {
          this.waiting = false
          item = i
        })
      },
      initIncomes(item, cb) {
        //  初始化所有Incomes, 装饰画是size, 卷轴画和产品是模板
        let catId = item.categoryId
        let boms = item.boms
        let incomes = []
        let defSizes
        let defaultSize
        let materials = []
        let options = []
        let entries = []
        switch (catId) {
          case dc.Frame:
            let bomMats = []
            let defMats = []
            defSizes = item.defaultSizes
            defaultSize = item.defaultSize
            _.each(boms, b => {
              switch (b.type) {
                case mt['Mat']:
                  bomMats = b
                  options = b.selects
                  break
                default :
                  materials = _.concat(materials, b.selects)
              }
            })
            _.each(defSizes, (s, ind) => {
              let incom = {}
              let selects
              let m = _.find(bomMats.total, t => {
                let ts = t.Properties.Size
                return (ts[0] === s[0] && ts[1] === s[1]) || (ts[0] === s[1] && ts[1] === s[0])
              })
              //  *status 可用状态  条件1： 最多设置const里定义的最大值
              //  条件2： 用户在设置分成的界面里设置的状态
              if (ind < pbCount) {
                incom.status = true
              } else {
                incom.status = false
              }
              // 当前box 渲染的size
              incom.def = s === defaultSize
              incom.size = s
              //  有卡画和无卡画状态区分
              incom.hasMat = true
              defMats.push(m)
              incom.Packets = [m.Id, 0]
              incom.Bonus = InitBonus
              incomes.push(incom)
              selects = initSelects(boms, incom.Packets, 'init')
              entries.push(buildEntry(catId, selects))
            })
            break
          case dc.Rimless:
            let bomSizes = {}
            defaultSize = item.defaultSize
            _.each(boms, b => {
              switch (b.type) {
                case mt['Size']:
                  bomSizes = b
                  break
                default :
                  materials = _.concat(materials, b.selects)
              }
            })
            _.each(bomSizes.total, (s, ind) => {
              let incom = {}
              let selects
              //  *status 可用状态  条件1： 最多设置const里定义的最大值
              //  条件2： 用户在设置分成的界面里设置的状态
              if (ind < pbCount) {
                incom.status = true
              } else {
                incom.status = false
              }
              // 当前box 渲染的size
              incom.def = s === defaultSize
              incom.Packets = s
              incom.Bonus = InitBonus
              incomes.push(incom)
              selects = initSelects(boms, incom.Packets, 'init')
              entries.push(buildEntry(catId, selects))
            })
            break
          case dc.Scroll:
            let bomTpls = {}
            _.each(boms, b => {
              switch (b.type) {
                case mt['Template']:
                  bomTpls = b
                  break
                default :
                  materials = _.concat(materials, b.selects)
              }
            })
            _.each(bomTpls.invalidTpls, t => {
              let incom = {}
              let selects
              incom.status = true
              incom.def = bomTpls.using.Id === t.Id
              //  tpl 为了设置分成的列表显示名称
              incom.tpl = t
              incom.Packets = [t.Id, 0]
              incom.Bonus = InitBonus
              incomes.push(incom)
              selects = initSelects(boms, incom.Packets, 'init')
              entries.push(buildEntry(catId, selects))
            })
            break
          default :
            //  新品类
            let bomProduct = {}
            _.each(boms, b => {
              switch (b.type) {
                case 'product':
                  bomProduct = b
                  break
                default :
                  options = _.concat(options, b.selects)
              }
            })
            _.each(bomProduct.selects, p => {
              let incom = {}
              let selects
              incom.status = true
              incom.def = bomProduct.using.Id === p.Id
              //  tpl 为了设置分成的列表显示名称
              incom.tpl = p
              incom.Packets = [0, p.Id]
              incom.Bonus = InitBonus
              incomes.push(incom)
              selects = initSelects(boms, incom.Packets, 'init')
              entries.push(buildEntry(catId, selects))
            })
        }
        Promise.all(entries).then(entriesDetail => {
          let initIncome
          let minIncMoney
          let maxIncMoney
          let minPrice
          let maxPrice
          //  当前渲染的entry
          _.each(incomes, (inc, index) => {
            let thisE = entriesDetail[index]
            let incMony
            let price
            inc.Entries = [thisE]
            incMony = thisE.Price * inc.Bonus / 100
            price = thisE.Price + incMony
            if (index === 0) {
              initIncome = inc
              minIncMoney = incMony
              maxIncMoney = incMony
              minPrice = price
              maxPrice = price
            } else {
              minIncMoney = incMony > minIncMoney ? minIncMoney : incMony
              maxIncMoney = incMony < maxIncMoney ? maxIncMoney : incMony
              minPrice = price > minPrice ? minPrice : price
              maxPrice = price < maxPrice ? maxPrice : price
            }
            if (inc.def) {
              initIncome = inc
            }
          })
          item.entries[0].entry = initIncome.Entries[0]
          item['Incomes'] = incomes
          item.minIncMoney = minIncMoney
          item.maxIncMoney = maxIncMoney
          item.minPrice = minPrice
          item.maxPrice = maxPrice
          initDisplayParam(item)
          updateIncomeMateria(item)
          cb()
        })
      }
    }
  })
}
