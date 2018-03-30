// Copyright 2016 Chen Xianren. All rights reserved.
import { DecorativeCategories as dc, MaterialTypes as mt,
  proBomsCount as pbCount, tabsProduct, InitBonus } from 'scripts/utils/custom/consts.js'
import { getMaterials } from 'components/custom/core/material.js'
import { zeroEntry, freshEntry, buildEntry } from 'components/custom/core/entry.js'
import { strMapToJson, sizeShape, swapSize, objToStrMap, isNotHandledCat } from 'scripts/utils/custom/utils.js'
import { getEntries } from 'scripts/utils/entry'
import { getImageInfo } from 'scripts/utils/image'
import { initPicture } from 'components/custom/picture/picture.js'
import { getProduct, initSelects, initMatlessSelects, getTags, updateIncomeMateria,
  initDisplayParam, renderById, initEditBoms, selectMaterialUtil, getkeys,
  filterMaterialsByKey } from './utils'
import { InterfaceMap as interf } from 'scripts/interfaceConst'

const { min, max, ceil } = Math

export function newProduct() {
  return new Vue({
    data() {
      return {
        waiting: true, // 是否正在上传
        materials: new Map(),
        entries: new Map(), // 一个map对象
        Pieces: [],
        Title: '',
        SelectTags: [],
        Tags: new Map(),
        Description: '',
        Offline: true,
        rowCount: 0,
        catList: [],
        isEditPage: false // 页面是否作为编辑功能使用
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
        // 判断id是否存在
        if (!id) {
          self.$bus.$emit('init-data', {
            isEditPage: self.isEditPage
          })
        } else {
          if (/^\d+$/.test(id)) {
            self.editId = id
            let proData
            getProduct(id).then(res => {
              proData = res.Data
              self.proData = proData
              self.Title = proData.Title
              self.SelectTags = proData.Tags
              self.Description = proData.Description
              self.isEditPage = true
              // 获取图片原始的元信息，e.g: Rotate
              return getImageInfo(proData.ImageId)
            }).then(res => {
              proData.ImageInfo = res
              proData.isEditPage = true
              self.$bus.$emit('init-data', proData)
            })
          }
        }
      },
      initMaterials() {
        let self = this
        let keys = []
        let values = []
        let p = Promise.resolve(true)
        request({url: interf.getCatList}).then(res => {
          let catList = res.data.Data
          let catDPIMap = new Map()
          self.catList = catList
          _.each(catList, cat => {
            if (!cat.DPI) {
              cat.DPI = 100
            }
            catDPIMap.set(cat.Id, cat)
            if (!isNotHandledCat(cat.Id)) {
              keys.push(cat.Name)
              p = p.then(() => getMaterials(cat.Id))
              values.push(p)
            }
          })
          window.$categories = catDPIMap
          Promise.all(values).then(materialsDetail => {
            // 所有异步结束后，把物料详情渲染到Map里
            materialsDetail.forEach((v, i) => {
              self.materials.set(keys[i], v)
            })
            if (self.isEditPage) {
              self.initEditData()
            } else {
              self.initData()
            }
          })
        })
      },
      initEditData() {
        let self = this
        let materials = self.materials
        let proData = self.proData
        let Pieces = proData.Pieces
        let entriesIds = []
        let mtlEntiresIds = []
        let mtlIncomes = []
        let mtlItem = {
          CategoryId: dc.Matless,
          Incomes: [],
          Pause: false
        }
        _.each(Pieces, item => {
          let catId = item.CategoryId
          if (catId === dc.Matless) {
            mtlIncomes = item.Incomes
            _.each(mtlIncomes, inc => {
              inc.status = true
              mtlEntiresIds = _.concat(mtlEntiresIds, inc.Entries)
            })
          }
          switch (catId) {
            case dc.Frame:
              item.type = 'Paints'
              item['matTplType'] = 'material-frame'
              break
            case dc.Scroll:
            case dc.Rimless:
            case dc.Magnet:
              item.type = 'Paints'
              item['matTplType'] = 'material-normal'
              break
            default:
              item.type = 'Product'
              item['matTplType'] = 'material-pro'
          }
          let catKey = self.catList.find(v => {
            return v.Id === catId
          }).Name
          item.materials = materials.get(catKey)
          item.active = !item.Pause //  active 状态表示品类是否下线 默认都是上线的
          item.canFire = true // canFire 是否可制作
          //  初始化Incomes
          _.each(item.Incomes, inc => {
            inc.status = true
            entriesIds = _.concat(entriesIds, inc.Entries)
          })
        })
        //  删除matless的数据 合并到frame里去
        _.remove(Pieces, i => {
          return i.CategoryId === dc.Matless
        })
        getEntries(entriesIds, true).then(entriesDetail => {
          //  初始化装饰画所有可用的sizes/incomes
          self.initSizes(Pieces)
          _.each(Pieces, item => {
            let incomes = item.Incomes
            let defEntry
            let pictures
            let minIncMoney
            let maxIncMoney
            let minPrice
            let maxPrice
            _.each(incomes, (inc, i) => {
              let incMony
              let thisE
              let price
              inc.Entries = renderById(entriesDetail, inc.Entries)
              if (item.CategoryId === dc.Frame) {
                inc.size = inc.Entries[0].Decorative.Size
                inc.hasMat = true
              }
              thisE = inc.Entries[0]
              incMony = thisE.Price * inc.Bonus / 100 // 佣金价格
              price = thisE.Price + incMony // 最终显示的价格
              _.each(inc.Pictures[0], (p, i) => {
                let iniP
                iniP = initPicture(0, inc.Entries[0].Outputs[0], p)
                inc.Pictures[0][i] = iniP
              })
              if (i === 0) {
                //  默认显示第一个Income
                inc.def = true
                defEntry = inc.Entries[0]
                pictures = inc.Pictures
                minIncMoney = incMony
                maxIncMoney = incMony
                minPrice = price
                maxPrice = price
              } else {
                inc.def = false
                minIncMoney = min(minIncMoney, incMony)
                maxIncMoney = max(maxIncMoney, incMony)
                minPrice = min(minPrice, price)
                maxPrice = max(maxPrice, price)
              }
            })
            if (item.CategoryId === dc.Frame) {
              // 处理无卡画的情况
              getEntries(mtlEntiresIds, true).then(mtlDetails => {
                _.each(mtlIncomes, mtlInc => {
                  mtlInc.Entries = renderById(mtlDetails, mtlInc.Entries)
                  _.each(mtlInc.Pictures[0], (p, i) => {
                    let iniP = initPicture(0, mtlInc.Entries[0].Outputs[0], p)
                    mtlInc.Pictures[0][i] = iniP
                  })
                })
                mtlItem.Incomes = mtlIncomes
                item.matlessItem = mtlItem
              })
            }
            item.entry = defEntry
            item.categoryId = item.CategoryId
            item.entries = [{
              index: -1,
              categoryId: item.CategoryId,
              entry: defEntry,
              selects: defEntry.selects,
              materials: item.materials,
              pictures: []
            }]
            item.minIncMoney = minIncMoney
            item.maxIncMoney = maxIncMoney
            item.minPrice = minPrice
            item.maxPrice = maxPrice
            item.pictures = pictures[0]
            initDisplayParam(item)
            item.soldCount = incomes.length
            item.active = true // active 状态表示品类是否下线 默认都是上线的
            item.boms = self.getBoms(item)
            initEditBoms(item)
          })
          self.rowCount = ceil(Pieces.length / 3)
          self.Pieces = Pieces
          self.waiting = false
        })
      },
      initData(entry = {}) {
        let self = this
        let keys = []
        let values = []
        let materials = self.materials
        materials.forEach((value, index) => {
          let categoryId = self.catList.find(c => c.Name === index).Id
          entry = zeroEntry(categoryId === dc.Frames ? dc.Frame : categoryId)
          if (index === '照片墙') {
            // keys.push(index)
            // values.push(freshPhotoWall(entry, self.entries))
          } else {
            let selects = freshEntry(value, entry)
            keys.push(index)
            values.push(buildEntry(entry.CategoryId, selects))
          }
        })
        Promise.all(values).then(entriesDetail => {
          // 所有异步结束后，把物料详情渲染到Map里
          _.each(entriesDetail, (d, i) => {
            let currentEntries
            let currentKey = keys[i]
            let categoryId = self.catList.find(c => c.Name === currentKey).Id
            let currentmaterials = materials.get(currentKey)
            if (currentKey === 'PhotoWall') {
              d.unshift({
                categoryId: categoryId,
                entry: currentmaterials[0],
                materials: currentmaterials,
                selects: [currentmaterials[0]]
              })
              d.forEach((v, k) => {
                v.index = k
                v.pictures = []
              })
              currentEntries = d
            } else {
              currentEntries = [{
                index: -1,
                categoryId: categoryId,
                entry: d,
                selects: d.selects,
                materials: this.materials,
                pictures: []
              }]
            }
            self.entries.set(currentKey, currentEntries)
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
        self.rowCount = ceil(len / 3)
        _.each(ie, (es) => {
          let item = {}
          for (var k in es) {
            item['category'] = k
            item['categoryId'] = self.catList.find(c => c.Name === k).Id
            item['DPI'] = window.$categories.get(item['categoryId']).DPI
            switch (item['categoryId']) {
              case dc.Frame:
              case dc.Frames:
                item.type = 'Paints'
                item['matTplType'] = 'material-frame'
                break
              case dc.Scroll:
              case dc.Rimless:
              case dc.Magnet:
                item.type = 'Paints'
                item['matTplType'] = 'material-normal'
                break
              default:
                item.type = 'Product'
                item['matTplType'] = 'material-pro'
            }
            item.entries = es[k]
            item.materials = materials.get(k)
            initDisplayParam(item)
            item.active = true  // active 状态表示品类是否下线 默认都是上线的
            item.canFire = false // canFire 状态表示品类是否可以制作 默认都是不能做
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
          switch (item.categoryId) {
            case dc.Frame:
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
              item.sizes = sizes
              break
            case dc.Scroll:
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
            case dc.Rimless:
            case dc.Magnet:
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
        let keys = getkeys(item)
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
            let total = filterMaterialsByKey(selMat, v)
            boms.push({
              type: 'productMat',
              name: v,
              total: total
            })
          })
        }
        return boms
      },
      filterMaterialsByType(mats = [], type) {
        return mats.filter(m => m.Type === type)
      },
      selectMaterial(item, material, type) {
        this.waiting = true
        selectMaterialUtil(item, material, type, (newItem) => {
          this.waiting = false
          item = newItem
        })
      },
      initIncomes(item, cb) {
        //  初始化所有Incomes, 装饰画是size, 卷轴画和产品是模板
        let catId = item.categoryId
        let boms = item.boms // boms数组成员中的属性selects表示该物料可以选择的选项。
        let incomes = []
        let defSizes
        let defaultSize
        let materials = []
        let options = []
        let entries = []
        let matlessItem = {
          CategoryId: dc.Matless,
          Incomes: [],
          Pause: false
        }
        let matlessEntries = []
        switch (catId) {
          case dc.Frame:
            //  初始化有框画时会同时初始化无卡画的数据
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
              let matlessSelects
              let matlessIncome = {}
              let m = _.find(bomMats.total, t => {
                let ts = t.Properties.Size
                return (ts[0] === s[0] && ts[1] === s[1]) || (ts[0] === s[1] && ts[1] === s[0])
              })
              //  *status 可用状态  条件1： 最多设置const里定义的最大值
              //  条件2： 用户在设置分成的界面里设置的状态
              if (ind <= pbCount) {
                incom.status = true
                matlessIncome.status = true
              } else {
                incom.status = false
                matlessIncome.status = false
              }
              // 当前box 渲染的size
              incom.def = s === defaultSize
              incom.size = s
              //  有卡画和无卡画状态区分
              incom.hasMat = true
              defMats.push(m)
              incom.Packets = [m.Id, 0]
              incom.Bonus = InitBonus
              selects = initSelects(boms, incom.Packets, 'init')
              incom.selects = selects
              incomes.push(incom)
              entries.push(buildEntry(catId, selects))
              //  初始化无卡的income数据
              matlessSelects = initMatlessSelects(selects, s)
              matlessIncome.Bonus = InitBonus
              matlessIncome.Packets = s
              matlessItem.Incomes.push(matlessIncome)
              matlessEntries.push(buildEntry(dc.Matless, matlessSelects))
            })
            break
          case dc.Rimless:
          case dc.Magnet:
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
              // bomSizes.total: 表示物料->尺寸（有效）的总数据
              let incom = {}
              let selects
              //  *status 物料->尺寸可用状态  条件1： 最多设置const里定义的最大值
              //  条件2： 用户在设置分成的界面里设置的状态
              if (ind <= pbCount) {
                incom.status = true
              } else {
                incom.status = false
              }
              // 当前box 渲染的size
              incom.def = s === defaultSize
              incom.Packets = s
              incom.Bonus = InitBonus
              incomes.push(incom)
              selects = initSelects(boms, s, 'init')
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
          default : // 新品类
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
          let initIncome, minIncMoney, maxIncMoney, minPrice, maxPrice
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
              minIncMoney = min(minIncMoney, incMony)
              maxIncMoney = max(maxIncMoney, incMony)
              minPrice = min(minPrice, price)
              maxPrice = max(maxPrice, price)
            }
            if (inc.def) {
              initIncome = inc
            }
          })
          item.entries[0].entry = initIncome.Entries[0]
          item['Incomes'] = incomes
          item['selects'] = initIncome.selects
          item.minIncMoney = minIncMoney
          item.maxIncMoney = maxIncMoney
          item.minPrice = minPrice
          item.maxPrice = maxPrice
          //  初始化可售卖数量 为0，  渲染图片后显示真实值
          item.soldCout = 0
          initDisplayParam(item)
          if (catId === dc.Frame) {
            Promise.all(matlessEntries).then(mtlEntries => {
              let mtlIncomes = matlessItem.Incomes
              _.each(mtlIncomes, (il, i) => {
                il.Entries = [mtlEntries[i]]
              })
              item.matlessItem = matlessItem
              updateIncomeMateria(item)
              cb()
            })
          } else {
            updateIncomeMateria(item)
            cb()
          }
        })
      }
    }
  })
}
