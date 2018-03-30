/* eslint-disable */
// Copyright 2016 Chen Xianren. All rights reserved.

import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
  DisplayTypes as dt,
  Angles,
  StackLines,
  Fulls,
  isDecorate,
  tabs,
  product,
  SuggestSize as ss
} from 'scripts/utils/custom/consts.js'
import {
  getMaterials
} from './material.js'
import {
  zeroEntry,
  freshEntry,
  freshPhotoWall,
  freshMatOptions,
  freshScrollCanvas,
} from 'components/custom/core/entry.js'
import {
  zeroArray,
  getByProperty,
  setByProperty,
  indexOfProperty,
  cleanBlank,
  equalSize,
  swapSize,
  parseImageSize,
  reversePicturesData,
  resolveEntry
} from 'scripts/utils/custom/utils.js'
import {
  getVirtualSize,
  fitSize,
  newPicture,
  serializePictures
} from '../picture/picture'
import {
  buildEntry
} from './entry';

let i = 0
const Uninitialized = i++
  const Initializing = i++
    const Initialized = i++
      const Loading = i++
        const Loaded = i++

          function cry(s) {
            return s + '(T_T)'
          }

export function newCustom() {
  return new Vue({
    data: {
      status: Uninitialized,
      message: '',
      type: 'image',
      key: '',
      entries: [],
      displayType: dt.Default,
      xi: 0,
      xn: 0,
      di: 0,
      dn: 0,
      hole: -1,
      DPI: 100
    },
    computed: {
      waiting() {
        // 等待中
        let s = this.status
        return s === Uninitialized || s === Initializing
      },
      doing() {
        // 执行中
        let s = this.status
        return s === Initializing || s === Loading
      },
      done() {
        // 结束
        let s = this.status
        return s === Initialized || s === Loaded
      },
      index() {
        // 入口数据第一项的索引
        let i = this.entries[0].index
        return i === -1 ? i : this.xi
      },
      current() {
        // 当前选中的这一项
        let i = this.index
        return this.entries[i === -1 ? 0 : i]
      },
      // displayDefault() {
      //   return this.displayType === dt.Default
      // },
      displayEdit() {
        // 判断是否是编辑模式
        return this.displayType === dt.Edit
      },
      displays() {
        let c = this.current
        let e = c.entry
        let a
        if (e.CategoryId === dc.Rimless && e.Decorative.Stack === StackLines.Inner) {
          a = []
          this.dn = 3
        } else if (e.CategoryId === dc.Poster) {
          a = []
          this.dn = 1
        } else {
          a = this.entries
          let i = c.index
          if (i === 0) {
            this.dn = 1
          } else {
            let j = this.xi
            let d = a[i === -1 ? 0 : j].entry.Displays[i === -1 ? j : 0]
            for (j of [this.displayType, dt.Default]) {
              a = d.filter(v => v.Type === j)
              if (a.length) break
            }
            this.dn = e.CategoryId === dc.MultiHole ? 1 : a.length
          }
        }
        if (this.di >= this.dn) this.di = 0
        return a
      },
      suggestSize() {
        let catId = this.entries[0].categoryId
        return ss.get(catId) || ss.get('pro')
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
        this.key = ''
      },
      toggleEdit() {
        this.displayType = this.displayEdit ? dt.Default : dt.Edit
      },
      // 初始化custom
      initialize(categoryId, materials = [], entry = {}, entries = [], callback) {
        let that = this
        that.message = ''
        if (that.doing) {
          // that.message = cry('状态进行中')
          return
        }
        let status = that.status
        let uninitialized = status === Uninitialized
        let reject = () => {
          that.status = status
        }
        let rejectMessage = s => {
          reject()
          // that.message = cry(s)
          // layer.toast(cry(s))
        }
        that.status = uninitialized ? Initializing : Loading
        // getMaterials 根据品类id获取物料数据
        return Promise.resolve(materials.length ? materials : getMaterials(categoryId)).then(materials => {
          if (!materials.length) {
            rejectMessage('没有物品哦')
            return
          }
          if (!entry.CategoryId) {
            // 如果entry入口不存在品类id,那么判断他是否是照片墙,如果是照片墙则取返回数据的第一项,不是则...
            entry = categoryId === dc.PhotoWall ? materials[0] :
              zeroEntry(categoryId === dc.Frames ? dc.Frame : categoryId)
          }
          if (categoryId === dc.PhotoWall) {
            // 如果品类id等于照片墙id
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
            // 非照片墙
            if (!(categoryId === entry.CategoryId || (categoryId === dc.Frames && [dc.Frame, dc.Matless, dc.MultiHole].indexOf(entry.CategoryId) >= 0))) {
              rejectMessage('单品品类不匹配哦')
              return
            }
            // 选中的物料
            
            let selects = freshEntry(materials, entry)
            // 构造一个entry单品
            return buildEntry(entry.CategoryId, selects).then(entry => {
              if (!uninitialized) {
                let e = that.current.entry
                if (e.CategoryId !== entry.CategoryId ||
                  e.ProductId !== entry.ProductId) that.resetType()
              }
              // vue实例上绑定一个entries属性,将entry传递过去, 序列化后的数据
              that.entries = [{
                index: -1,
                categoryId: categoryId,
                entry: entry,
                materials: materials,
                selects: selects,
                pictures: entries.length > 0 ? entries[0].pictures : []
              }]
              that.xi = 0
              that.xn = entry.ProductId ? entry.Outputs.length : 1
              that.status = uninitialized ? Initialized : Loaded
              callback && callback(that.entries, that.current)
            }, reject)
          }
        }, reject)
      },
      changeSize(s, noSquare = false) {
        let c = this.current
        let e = c.entry
        if (!isDecorate(e.CategoryId) ||
          (noSquare && e.Decorative.Size[0] === e.Decorative.Size[1])) {
          return
        }
        let cat = window.$categories.get(e.CategoryId)
        if (!cat || !cat.DPI) {
          this.message = cry('DPI缺失')
          return
        }
        let a = []
        const floor = Math.floor
        const push = (material, size) => {
          let f = fitSize({
            Size: size,
            Full: Fulls.Always
          }, s, cat.DPI)
          if (!f) return
          size = getVirtualSize(size, cat.DPI)
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
                push({
                  Type: 'mat',
                  mat: i,
                  angle: Angles.Up,
                  options: o
                }, h)
                if (h[0] !== h[1]) {
                  push({
                    Type: 'mat',
                    mat: i,
                    angle: Angles.Left,
                    options: o
                  }, swapSize(h))
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
          case dc.Magnet:
            for (let i of c.materials) {
              if (i.Type === mt.Size) {
                push(i, i.Size)
                if (i.Size[0] !== i.Size[1]) {
                  let j = {
                    Type: mt.Size,
                    Size: swapSize(i.Size)
                  }
                  push(j, j.Size)
                }
              }
            }
            a = sort()
            if (a) {
              if (c.categoryId === dc.Frames) {
                let x = getByProperty(c.selects, 'mat')
                if (!equalSize(x.mat.Size, a.Size)) {
                  return {
                    Type: 'mat',
                    mat: a,
                    angle: x.angle,
                    options: x.options
                  }
                }
              } else if (!equalSize(getByProperty(c.selects, mt.Size).Size, a.Size)) {
                return a
              }
            }
            break
        }
      },
      /**
       *
       * @param {* Object} image 图片对象
       * @param {* function} callback 回调
       * 回调为-1表示DPI缺失 0表示图片不合适 1表示图片合适
       */
      selectImage(image, callback) {
        let that = this
        let c = that.current
        let e = c.entry
        const f = s => {
          that.message = ''
          that.$nextTick(() => {
            that.message = s
          })
        }
        let cat = window.$categories.get(e.CategoryId)
        if (!cat || !cat.DPI) {
          f(cry('DPI缺失'))
          return
        }
        const a = [cry('图片不合适哦'), '图片填完了哦^_^']
        const o = () => {
          for (let i = 0; i < e.Outputs.length; i++) {
            let p = getByProperty(c.pictures, i, 'Index')
            if (p) continue
            p = newPicture(i, e.Outputs[i], image, cat.DPI)
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
            p = newPicture(i, e.Outputs[i], image, cat.DPI)
            if (p) {
              setByProperty(c.pictures, p, 'Index')
              callback && callback(1)
              return
            } else {
              f(a[0])
            }
          } else {
            p = newPicture(i, e.Outputs[i], image, cat.DPI)
            if (p) {
              c.pictures.push(p)
            } else {
              f(a[0])
            }
            callback && callback()
          }
        }
      },
      /**
       *
       * @param {* Object} material 需要传递的物料类型
       * image图片 {Type: 'iamge', Value: v}
       * mat 物料 直接传递物料类型
       * @param {*} triggerBom 暂时不清楚有什么用
       * @param {* function} callback 回调函数
       */
      selectMaterial(material, triggerBom, callback) {
        // 选择物料
        if (!this.done) {
          this.message = cry('状态未结束')
          return
        }
        let image
        let t = material.Type
        if (t === 'image') {
          image = material.Value
          let s = parseImageSize(image)
          material = this.changeSize(s)
          if (material) {
            t = material.Type
          } else {
            callback && callback.constructor === Function ? this.selectImage(image, callback) : this.selectImage(image)
            return
          }
        }
        let c = this.current
        let selects = [getByProperty(c.selects, t)]
        if (!selects[0]) {
          this.message = cry('类型不存在')
          callback && callback(0)
          return
        }
        let i = this.index
        if (i === 0) {
          this.initialize(c.categoryId, c.materials, material)
        } else {
          setByProperty(c.selects, material)
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
                setByProperty(c.selects, {
                  Type: 'blank',
                  Value: zeroArray()
                })
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
          console.log(c)
          if ((c.categoryId === dc.Frame || c.categoryId === dc.Frames) && t === 'mat' && material.options.length === 0) {
            //  设置无卡纸 切换 有卡=>无卡
            id = dc.Matless
            let size
            if (material.mat.Type === mt.Mat) {
              size = material.mat.Properties.Size
            } else if (material.mat.Type === mt.Size) {
              size = material.mat.Size
            }
            // let size = selects[0].mat.Properties.Size
            // if (selects[0].angle === Angles.Left) {
            //   size = swapSize(size)
            // }
            if (material.angle === Angles.Left || material.angle === Angles.Right) {
              size = swapSize(size)
            }
            //  初始化无卡画selects, 二者物料必须完全一致
            c.selects.push({
              Type: mt['Size'],
              Size: size
            })
          } else if (c.categoryId === dc.Matless && t === 'mat') {
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
          // 初始化Buile
          this.$then(buildEntry(id, c.selects), entry => {
            c.entry = entry
            if (i === -1) {
              this.xn = entry.ProductId ? entry.Outputs.length : 1
              if (this.xi >= this.xn) {
                this.xi = 0
              }
              // callback && callback(1)
            }
            if (image) {
              callback ? this.selectImage(image, callback) : this.selectImage(image)
            } else {
              let a = []
              for (let p of c.pictures) {
                let o = entry.Outputs[p.Index]
                let rotateVal = p.Rotate // 记录操作前的图片旋转状态
                if (o) {
                  if (equalSize(o.Size, p.Output.Size) &&
                    o.Full === p.Output.Full) {
                    a.push(p)
                    // callback && callback(2)
                  } else {
                    let cat = window.$categories.get(entry.CategoryId)
                    if (cat && cat.DPI) {
                      p = newPicture(p.Index, o, p.Image, cat.DPI)
                      if (p) {
                        p.Rotate = rotateVal // 应用此前记录的图片旋转状态
                        a.push(p)
                      } else {
                      }
                    }
                  }
                }
              }
              c.pictures = a
              callback && callback()
            }
          }, () => {
            selects.forEach(v => setByProperty(c.selects, v))
          }, () => {
            this.status = Loaded
          })
        }
      },
      selectMaterial2(material, triggerBom, callback) {
        if (!this.done) {
          this.message = cry('状态未结束')
          return
        }

        let image
        let t = material.Type
        if (t === 'image') {
          image = material.Value
          let s = parseSize(image.File)
          if (image.Info.Rotate / 90 % 2 === 1) s = swapSize(s)
          material = this.changeSize(s)
          if (material) {
            t = material.Type
          } else {
            this.selectImage(image)
            return
          }
        }

        let c = this.current
        let selects = [getByProperty(c.selects, t)]
        if (!selects[0]) {
          this.message = cry('类型不存在')
          return
        }

        let i = this.index
        if (i === 0) {
          this.initialize(c.categoryId, c.materials, material)
        } else {
          setByProperty(c.selects, material)
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
                setByProperty(c.selects, {
                  Type: 'blank',
                  Value: zeroArray()
                })
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
          this.status = Loading
          this.message = ''
          this.$then(buildEntry(id, c.selects), entry => {
            c.entry = entry
            if (i === -1) {
              this.xn = entry.ProductId ? entry.Outputs.length : 1
              if (this.xi >= this.xn) this.xi = 0
            }
            if (image) {
              // this.selectImage(image)
              callback ? this.selectImage(image, callback) : this.selectImage(image)
            } else {
              let a = []
              for (let p of c.pictures) {
                let o = entry.Outputs[p.Index]
                if (o) {
                  if (equalSize(o.Size, p.Output.Size) &&
                    o.Full === p.Output.Full) {
                    a.push(p)
                    callback && callback()
                  } else {
                    let cat = window.$categories.get(entry.CategoryId)
                    if (cat && cat.DPI) {
                      p = newPicture(p.Index, o, p.Image, cat.DPI)
                      if (p) {
                        a.push(p)
                        callback && callback()
                      }
                    }
                  }
                }
              }
              c.pictures = a
            }
          }, () => {
            selects.forEach(v => setByProperty(c.selects, v))
          }, () => {
            this.status = Loaded
          })
        }
      },
      getboms() {
        // 获得每个品类对应物料的数组
        let catId = this.current.categoryId
        //  每个品类初始化物料 对象数组  :type :key
        let boms = []
        let tabsArr = tabs.has(catId) ? tabs.get(catId).slice() : [product]
        let keys = this.getkeys()
        if (tabsArr.length) {
          tabsArr.forEach((v) => {
            let name = this.initType(v.code).type
            let len = boms.length
            boms.push({
              name: name,
              cat: catId + len
            })
          })
          if (indexOfProperty(boms, 'image', 'name') === -1) {
            let len = boms.length
            boms.unshift({
              name: 'image',
              cat: catId + len
            })
          }
        }
        if (keys.length) {
          keys.forEach((v) => {
            let name = this.initType('key', v).type
            let key = this.initType('key', v).key
            let l = boms.length
            boms.push({
              name: name,
              prokey: key,
              cat: catId + l
            })
          })
        }
        return boms
      },
      getboms2() {
        let catId = this.current.categoryId
        let tabsArr = tabs.has(catId) ? tabs.get(catId).slice() : [product]
        return tabsArr
      },
      getkeys() {
        let c = this.current
        let e = c.entry
        let a = []
        if (e.ProductId) {
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
        if (type === 'image') {
          let e = c.entry
          let i = e.ProductId ? this.xi : (e.CategoryId === dc.MultiHole ? this.hole : 0)
          let p = getByProperty(c.pictures, i, 'Index')
          return {
            Type: type,
            Value: (p ? p.Image : {})
          }
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
            switch (e.CategoryId) {
              case dc.Rimless:
                break
              case dc.Magnet:
                t = mt.MagnetLine
                break
              default:
                t = mt.Line
                break
            }
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
        // 初始化右侧编辑区域名称
        let f = type => type + '-scroller'
        if (type === mt.Size) return f('size')
        if (type === 'key') return f('property')
        if (_.isNumber(type)) return f('material')
        if (_.isString(type)) return f(type)
      },
      initBomTplName2(type) {
        // 尺寸
        if (type === mt.Size) {
          return 'edit-size'
        }
        // 常量
        if (type === 'key') {
          return 'edit-property'
        }
        // 如果是物料
        if (typeof type === 'number') {
          return 'edit-material'
        }
        // 图片等其他类型
        if (typeof type === 'string') {
          return 'edit-' + type
        }
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
        let item = {
          Packets: zeroArray(2),
          Entries: [],
          Pictures: []
        }
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
          item.Pictures.push(serializePictures(e.pictures))
        }
        return item
      },
      initUrlParams(type, o) {
        // 对传入的数据进行初始化custom操作
        switch (type) {
          case 'item':
            let p = reversePicturesData(o.p)
            this.initialize(o.e.CategoryId, undefined, o.e, undefined, () => {
              //修改图片
              this.entries[0].pictures = p
            })
            break
          case 'entry':
            let e = resolveEntry(o)
            this.initialize(o.CategoryId, undefined, e, undefined)
            break
          case 'image':
            this.initialize(o.CategoryId, undefined, undefined, undefined, () => {
              let m = {
                Type: 'image',
                Value: o.Image
              }
              this.selectMaterial(m)
            })
            break
        }
      }
    }
  })
}
