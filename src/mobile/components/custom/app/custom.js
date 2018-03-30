// Copyright 2016 Chen Xianren. All rights reserved.

import { DecorativeCategories as dc, MaterialTypes as mt,
  DisplayTypes as dt, tabs, product, Angles, Fulls } from 'scripts/utils/custom/consts'
import { getMaterials } from 'scripts/utils/custom/material'
import { zeroEntry, freshEntry, freshPhotoWall, freshMatOptions,
  freshScrollCanvas, buildEntry } from 'scripts/utils/custom/entry'
import { zeroArray, getByProperty, setByProperty, cleanBlank,
  equalSize, parseSize, swapSize } from 'scripts/utils/custom/utils'
import { getVirtualSize, fitSize, newPicture, serializePictures } from 'components/public/display/app/picture'

let i = 0
const Uninitialized = i++
const Initializing = i++
const Initialized = i++
const Loading = i++
const Loaded = i++

function cry(s) {
  return s + '(T_T)'
}
/* eslint-disable */
export function newCustom() {
  return new Vue({
    data: {
      status: Uninitialized,
      message: '',
      type: 'image',
      prokey: '',
      entries: [],
      displayType: dt.Default,
      xi: 0,
      xn: 0,
      di: 0,
      dn: 0,
      hole: -1,
      entry: {},
      DPI: 100
    },
    computed: {
      waiting() {
        let s = this.status
        return s === Uninitialized || s === Initializing
      },
      doing() {
        let s = this.status
        return s === Initializing || s === Loading
      },
      done() {
        let s = this.status
        return s === Initialized || s === Loaded
      },
      index() {
        let i = this.entries[0] ? this.entries[0].index : -1
        return i === -1 ? i : this.xi
      },
      current() {
        let i = this.index
        return this.entries[i === -1 ? 0 : i]
      },
      // displayDefault() {
      //   return this.displayType === dt.Default
      // },
      displayEdit() {
        return this.displayType === dt.Edit
      },
      displays() {
        let c = this.current
        let i = c.index
        let a = this.entries
        if (i === 0) {
          this.dn = 1
        } else {
          let j = this.xi
          let ci = i === -1 ? 0 : j
          let ji = i === -1 ? j : 0
          let d = []
          if (a[ci].entry.Displays) {
            d = a[ci].entry.Displays[ji]
          }
          for (j of [this.displayType, dt.Default]) {
            a = d.filter(v => v.Type === j)
            if (a.length) break
          }
          this.dn = c.entry.CategoryId === dc.MultiHole ? 1 : a.length
        }

        if (this.di >= this.dn) this.di = 0

        return a
      },
      pictureIndex() {
        let c = this.current
        let e = c.entry
        if (e.CategoryId === dc.PhotoWall) return -2
        if (e.CategoryId === dc.MultiHole) return this.hole
        if (e.ProductId) return this.xi
        return 0
      }
    },
    methods: {
      resetType() {
        this.type = 'image'
        this.prokey = ''
      },
      toggleEdit() {
        this.displayType = this.displayEdit ? dt.Default : dt.Edit
      },
      initialize(categoryId, materials = [], entry = {}, entries = [], callback) {
        let that = this
        that.message = ''
        if (that.doing) {
          that.message = cry('状态进行中')
          return
        }
        let status = that.status
        let uninitialized = status === Uninitialized
        let reject = () => {
          that.status = status
        }
        let rejectMessage = s => {
          reject()
          that.message = cry(s)
        }
        that.status = uninitialized ? Initializing : Loading
        Promise.resolve(materials.length > 0 ? materials : getMaterials(categoryId)).then(materials => {
          if (!materials.length) {
            rejectMessage('没有物品哦')
            return
          }
          if (!entry.CategoryId) {
            entry = categoryId === dc.PhotoWall ? materials[0]
              : zeroEntry(categoryId === dc.Frames ? dc.Frame : categoryId)
          }

          if (categoryId === dc.PhotoWall) {
            if (!(entry.CategoryId === dc.PhotoWall && entry.Type === mt.Template)) {
              rejectMessage('不是照片墙模板哦')
              return
            }
            freshPhotoWall(entry, entries).then(data => {
              data.unshift({
                categoryId: categoryId,
                entry: entry,
                materials: materials,
                selects: [entry]
              })
              data.forEach((v, k) => {
                v.index = k
                v.pictures = []
              })
              if (!uninitialized) {
                let e = that.current.entry
                if (e.CategoryId !== entry.CategoryId) that.resetType()
              }
              that.entries = data
              that.xi = 0
              that.xn = entry.Properties.Photos.length + 1
              that.status = uninitialized ? Initialized : Loaded
              callback && callback(that.entries, that.current)
            }, reject)
          } else {
            if (!(categoryId === entry.CategoryId || (categoryId === dc.Frames &&
              [dc.Frame, dc.Matless, dc.MultiHole].indexOf(entry.CategoryId) >= 0))) {
              rejectMessage('单品品类不匹配哦')
              return
            }
            let selects = freshEntry(materials, entry)
            buildEntry(entry.CategoryId, selects).then(entry => {
              if (!uninitialized) {
                let e = that.current.entry
                if (e.CategoryId !== entry.CategoryId ||
                  e.ProductId !== entry.ProductId) that.resetType()
              }
              this.entry = entry
              that.entries = [{
                index: -1,
                categoryId: categoryId,
                entry: entry,
                materials: materials,
                selects: selects,
                pictures: []
              }]
              that.xi = 0
              that.xn = entry.ProductId ? entry.Outputs.length : 1
              that.status = uninitialized ? Initialized : Loaded
              callback && callback(that.entries, that.current)
            }, reject)
          }
        }, reject)
      },
      changeSize(image) {
        let c = this.current
        let e = c.entry
        let s = parseSize(image.File)
        if (image.Info.Rotate / 90 % 2 === 1) s = swapSize(s)
        let a = []
        const floor = Math.floor
        const push = (material, size) => {
          let fo = fitSize({Size: size, Full: Fulls.Always}, s)
          let f = fo && fo['imgSize']
          if (!f) return
          size = getVirtualSize(size)
          a.push({
            material: material,
            x: floor((f[0] > size[0] ? size[0] / f[0] : size[1] / f[1]) * 100),
            y: floor(f[0] / s[0] * 100),
            z: size[0] > size[1] ? -1 : (size[0] === size[1] ? 0 : 1)
          })
        }
        const sort = () => {
          if (a.length > 0) {
            a.sort((i, j) => {
              for (let k of ['x', 'y', 'z']) {
                k = j[k] - i[k]
                if (k !== 0) return k
              }
              return 0
            })
            return a[0].material
          }
        }
        switch (e.CategoryId) {
          case dc.Frame:
            let x = getByProperty(c.selects, 'mat')
            for (let i of c.materials) {
              if (i.CategoryId === dc.Frame && i.Type === mt.Mat) {
                let h = i.Properties.Hole.slice(0, 2)
                let o = freshMatOptions(i.Properties.Options, x.options)
                push({Type: 'mat', mat: i, angle: Angles.Up, options: o}, h)
                if (h[0] !== h[1]) {
                  push({Type: 'mat', mat: i, angle: Angles.Left, options: o}, swapSize(h))
                }
              }
            }
            a = sort()
            const y = [Angles.Up, Angles.Down]
            const z = [Angles.Left, Angles.Right]
            if (a && !(x.mat.Id === a.mat.Id &&
              (y.indexOf(x.angle) >= 0 && y.indexOf(a.angle) >= 0) ||
              (z.indexOf(x.angle) >= 0 && z.indexOf(a.angle) >= 0))) {
              return a
            }
            break
          case dc.Scroll:
            for (let i of c.materials) {
              if (i.CategoryId === dc.Scroll && i.Type === mt.Template) {
                push(i, i.Properties.Hole.slice(0, 2))
              }
            }
            a = sort()
            if (a && getByProperty(c.selects, mt.Template).Id !== a.Id) {
              return a
            }
            break
          case dc.Matless:
          case dc.Rimless:
          case dc.Poster:
            for (let i of c.materials) {
              if (i.Type === mt.Size) {
                push(i, i.Size)
                if (i.Size[0] !== i.Size[1]) {
                  let j = {Type: mt.Size, Size: swapSize(i.Size)}
                  push(j, j.Size)
                }
              }
            }
            a = sort()
            if (a) {
              if (c.categoryId === dc.Frames) {
                let x = getByProperty(c.selects, 'mat')
                if (!equalSize(x.mat.Size, a.Size)) {
                  return {Type: 'mat', mat: a, angle: x.angle, options: x.options}
                }
              } else if (!equalSize(getByProperty(c.selects, mt.Size).Size, a.Size)) {
                return a
              }
            }
            break
        }
      },
      selectImage(image, flag) {
        let that = this
        let c = that.current
        let e = c.entry
        const f = s => {
          that.message = ''
          that.$nextTick(() => {
            that.message = s
          })
        }
        window.$categories.forEach((item) => {
          if (item.Id === e.CategoryId) {
            this.DPI = item.DPI
            window.DPI = this.DPI
          }
        })
        const a = ['图片不合适哦T_T', '图片填完了哦^_^']
        const o = () => {
          for (let i = 0; i < e.Outputs.length; i++) {
            let p = getByProperty(c.pictures, i, 'Index')
            if (p) continue
            p = newPicture(i, e.Outputs[i], image, this.DPI)
            if (p) {
              c.pictures.push(p)
              return -1
            } else {
              return 0
            }
          }
          return 1
        }
        if (e.CategoryId === dc.PhotoWall) {
          for (c of that.entries.slice(1)) {
            e = c.entry
            switch (o()) {
              case -1:
                return
              case 0:
                f(a[0])
                return
              case 1:
                break
            }
          }
          f(a[1])
        } else {
          let i = 0
          if (e.CategoryId === dc.MultiHole) {
            if (that.hole === -1) {
              i = o()
              if (i >= 0) f(a[i])
              return
            } else {
              i = that.hole
            }
          }
          if (e.ProductId) i = that.xi
          let p = getByProperty(c.pictures, i, 'Index')
          if (p) {
            if (p.Image.Id === image.Id && p.Image.File === image.File) return
            p = newPicture(i, e.Outputs[i], image, this.DPI)
            if (p) {
              setByProperty(c.pictures, p, 'Index')
              this.$bus.$emit('changeActive', image['Index'])
              this.$bus.$emit('reset-scale')
              return
            } else {
              if (!flag) {
                this.$toast.center(a[0])
              }
            }
          } else {
            p = newPicture(i, e.Outputs[i], image, this.DPI)
            if (p) {
              this.$bus.$emit('changeActive', image['Index'])
              this.$bus.$emit('reset-scale')
              c.pictures.push(p)
              return
            } else {
              if (!flag) {
                this.$toast.center(a[0])
              }
            }
          }
        }
      },
      selectMaterial(material, flag) {
        if (!this.done) {
          this.message = cry('状态未结束')
          return
        }
        let image
        let t = material.Type
        if (t === 'image') {
          image = material.Value
          material = this.changeSize(image)
          if (material) {
            t = material.Type
          } else {
            this.selectImage(image, flag)
            return
          }
        }
        let c = this.current
        let selects
        let i = this.index
        if (i === 0) {
          this.initialize(c.categoryId, c.materials, material)
        } else {
          setByProperty(c.selects, material)
          selects = [getByProperty(c.selects, t)]
          if (!selects[0]) {
            this.message = cry('类型不存在')
            return
          }
          let id = c.entry.CategoryId

          switch (id) {
            case dc.Scroll:
              if (t === mt.Template) {
                selects.push(getByProperty(c.selects, mt.Canvas))
                freshScrollCanvas(c.selects, c.materials)
              }
              break
            case dc.Poster:
              if (t === mt.Size) {
                selects.push(getByProperty(c.selects, 'blank'))
                setByProperty(c.selects, {Type: 'blank', Value: zeroArray()})
              }
              if (t === 'blank') {
                material.Value = cleanBlank(
                  getByProperty(c.selects, mt.Size).Size, material.Value)
              }
              break
          }

          if (c.categoryId === dc.Frames && t === 'mat') {
            let mat = material.mat
            id = mat.Type === mt.Size ? dc.Matless : mat.CategoryId
          }
          if ((c.categoryId === dc.Frame || c.categoryId === dc.Frames) && t === 'mat' && material.options.length === 0) {
            //  设置无卡纸 切换 有卡=>无卡
            c.categoryId = dc.Matless
            id = dc.Matless
            let size = selects[0].mat.Properties.Size
            if (selects[0].angle === Angles.Left) {
              size = swapSize(size)
            }
            //  初始化无卡画selects, 二者物料必须完全一致
            c.selects.push({
              Type: mt['Size'],
              Size: size
            })
          } else if (c.categoryId === dc.Matless && t === 'mat') {
            let triggerBom = ''
            if (triggerBom !== 'size') {
              // 设置无卡纸，点击非size的mat物料时， 切换 无卡=>有卡
              c.categoryId = dc.Frame
              id = dc.Frame
              //  初始化无卡画selects, 二者物料必须完全一致
              _.remove(c.selects, s => {
                return s.Type === mt['Size']
              })
            } else {
              // 设置无卡纸，点击size物料时，
              // 切换display的尺寸而不进行（无卡=>有卡）的切换
              let selectMat = [getByProperty(c.selects, t)]
              let size = selectMat[0].mat.Properties.Size
              if (selectMat[0].angle === Angles.Left) {
                size = swapSize(size)
              }
              // 移除错误的size属性
              _.remove(c.selects, s => {
                return s.Type === mt['Size']
              })
              // push正确的size属性
              c.selects.push({
                Type: mt['Size'],
                Size: size
              })
              // 无卡画不需要optionId选项
              // 设置mat物料的options属性为[],便于buildEntry函数对其的过滤
              selectMat[0].options = []
            }
          }
          this.status = Loading
          this.message = ''
          buildEntry(id, c.selects).then(entry => {
            c.entry = entry
            this.entry = entry
            if (i === -1) {
              this.xn = entry.ProductId ? entry.Outputs.length : 1
              if (this.xi >= this.xn) this.xi = 0
            }
            if (image) {
              this.selectImage(image)
            } else {
              let a = []
              for (let p of c.pictures) {
                let o = entry.Outputs[p.Index]
                if (o) {
                  if (equalSize(o.Size, p.Output.Size) &&
                    o.Full === p.Output.Full) {
                    a.push(p)
                  } else {
                    p = newPicture(p.Index, o, p.Image, this.DPI)
                    if (p) a.push(p)
                  }
                }
              }
              c.pictures = a
            }
            selects.forEach(v => setByProperty(c.selects, v))

            this.status = Loaded
          })
        }
      },
      getboms() {
        const addScrollerStr = (str) => str + '-scroller'
        const getHanziByName = (type) => {
          if (type === mt.Size) return addScrollerStr('size')
          if (type === 'key') return addScrollerStr('property')
          if (_.isNumber(type)) return addScrollerStr('material')
          if (_.isString(type)) return addScrollerStr(type)
        }
        let catId = this.current && this.current.categoryId
        //  每个品类初始化物料 对象数组  :type :key
        let boms = []
        let tabsArray = tabs.has(catId) ? tabs.get(catId).slice() : [product]
        let keys = this.getkeys()
        if (tabsArray.length) {
          tabsArray.forEach((v) => {
            let tempType = this.initType(v.code)
            let name = tempType && tempType.type == 1 && catId == 24 ? 10 : tempType.type
            let l = boms.length
            boms.push({
              name: name,
              cat: catId + l,
              tagName: getHanziByName(name)
            })
          })
        }
        if (keys.length) {
          keys.forEach((v) => {
            let tempType = this.initType('key', v)
            let name = tempType && tempType.type
            let key = tempType && tempType.key
            let l = boms.length
            boms.push({
              name: name,
              prokey: key,
              cat: catId + l,
              hanzi: getHanziByName(name)
            })
          })
        }
        // const imageBom = {
        //   cat: 0,
        //   name: 'image',
        //   tagName: 'scroller-image'
        // }
        // boms.unshift(imageBom)
        return boms
      },
      getbomsHeader() {
        let c = this.current
        let catId = c && c.categoryId
        let hanziArr = tabs.get(catId) || []
        hanziArr.forEach((item, index) => {
          if (item.name === '图片') {
            hanziArr.splice(index, 1)
          }
        })
        if (catId == 8 || catId == 6 || catId == 1) {
          hanziArr.forEach((item, index) => {
            if (item.name === '尺寸') {
              hanziArr.splice(index, 1)
            }
          })
          hanziArr.unshift({code: 'mat', name: '尺寸'})
        }
        hanziArr.unshift({code: 'image', name: '图片'})
        return hanziArr
      },
      getbomsDetail() {

      },
      getkeys() {
        let c = this.current
        let e = c && c.entry

        let a = []
        if (e && e.ProductId) {
          let p = getByProperty(c.selects, 'product').product
          if (p.CategoryId === e.CategoryId) {
            for (let i of p.Properties) {
              if (a.indexOf(i.Key) === -1) a.push(i.Key)
            }
          }
        }
        return a
      },
      getfix() {
        let i = this.current.index
        if (i > 0) return this.entries[0].entry.Properties.Photos[i - 1].Hole.slice(0, 2)
      },
      materials(type) {
        let c = this.current
        if (type === 'image') return []
        if (type === mt.Canvas && c.categoryId === dc.Scroll) {
          let a = getByProperty(c.selects, mt.Template).Properties.Materials
          if (a.length) {
            return c.materials.filter(
                v => v.Type !== mt.Canvas || a.indexOf(v.Id) >= 0)
          }
        }
        return c.materials
      },
      material(type) {
        let c = this.current
        if (!c) return
        if (type === 'image') {
          let e = c.entry
          let i = e.ProductId ? this.xi : (e.CategoryId === dc.MultiHole ? this.hole : 0)
          let p = getByProperty(c.pictures, i, 'Index')
          return {Type: type, Value: (p ? p.Image : {})}
        }
        return getByProperty(c.selects, type === 'key' ? 'product' : type)
      },
      initType(t, k) {
        if (this.waiting) return
        switch (t) {
          case 'image':
          case 'blank':
          case 'key':
          case 'mat':
          case 'product':
          case 'texture':
          case mt.Line:
          case mt.Mat:
          case mt.Size:
          case mt.Paper:
          case mt.Glass:
          case mt.InnerLine:
          case mt.OuterLine:
          case mt.Canvas:
          case mt.Template:
            break
          case 'size':
            t = mt.Size
            break
          case 'paper':
            t = mt.Paper
            break
          case 'glass':
            t = mt.Glass
            break
          case 'canvas':
            t = mt.Canvas
            break
          case 'template':
            t = mt.Template
            break
          case 'line':
            let e = this.current.entry
            if (e.CategoryId !== dc.Rimless) t = mt.Line
            break
          case 'outerLine':
            t = 'line'
            break
          default:
            return
        }
        return {
          type: t,
          key: k
        }
      },
      initBomTplName(type) {
        let f = type => type + '-scroller'
        if (type === mt.Size) return f('size')
        if (type === 'key') return f('property')
        if (_.isNumber(type)) return f('material')
        if (_.isString(type)) return f(type)
      },
      changeIndicator(i, j) {
        if (this.waiting) return
        if (this.index >= 0) {
          let x = this.current.entry
          let y = this.entries[i].entry
          if (x.CategoryId !== y.CategoryId) this.resetType()
        }
        this.xi = i
        this.di = j
      },
      serialize() {
        let item = {Packets: zeroArray(2), Entries: [], Pictures: []}
        let e = this.entries[0]
        item.CategoryId = e.entry.CategoryId
        if (item.CategoryId === dc.PhotoWall) {
          item.Packets[0] = e.entry.Id
          for (e of this.entries.slice(1)) {
            if (e.pictures.length !== e.entry.Outputs.length) return
            item.Entries.push(e.entry.Id)
            item.Pictures.push(serializePictures(e.pictures))
          }
        } else {
          if (e.entry.ProductId) {
            if (e.pictures.length === 0) return
          } else {
            if (e.pictures.length !== e.entry.Outputs.length) return
          }
          item.Entries.push(e.entry.Id)
          //  'Custom' 画布类型
          item.Pictures.push(serializePictures(e.pictures, 'Custom'))
        }
        return item
      }
    }
  })
}
