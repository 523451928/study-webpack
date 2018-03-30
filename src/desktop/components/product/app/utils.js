import { getRealPxSize } from 'scripts/utils/image'
import { buildEntry, freshEntry } from 'components/custom/core/entry.js'
import { MaterialTypes as mt, DecorativeCategories as dc, proBomsCount as pbCount, Angles, tagsIdMap } from 'scripts/utils/custom/consts.js'
import { serializePictures, getVirtualSize, newPicture } from 'components/custom/picture/picture.js'
import { initListEntryObj } from 'components/custom/display/display-util.js'
import { parseImageSize, sizeShape, swapSize, equalSize, getByProperty } from 'scripts/utils/custom/utils.js'

export function initImages(data = []) {
  data.forEach(item => {
    let size = getRealPxSize(item.File)
    // 图片的形状 横 tran  竖形 vert  用于图片填满画布时按那一边显示（最短）
    item.shape = size[0] >= size[1] ? 'tran' : 'vert'
    item.src = request.thumb('image', item.Id, 480, item.File)
  })
  return data
}
export function invalidSize(item, image) {
  let catId = item.categoryId
  let sizes = item.sizes
  let imageSizePx = parseImageSize(image)
  let shape = sizeShape(imageSizePx)
  let defSizes = []
  let res = {}
  let fSizes
  let frSizes
  let minDif
  let def
  switch (catId) {
    case dc.Frame:
      // 有框画按照Hole的size计算
      let holeSizes = item.holeSizes
      frSizes = sizes[shape]
      fSizes = _.map(holeSizes[shape], 'holeSize')
      break
    case dc.Rimless:
    case dc.Magnet:
      fSizes = sizes[shape]
      break
    default :
      fSizes = sizes
  }
  _.each(fSizes, (s, i) => {
    let sPx = getVirtualSize(s, item.DPI)
    if (imageSizePx[0] > sPx[0] && imageSizePx[1] > sPx[1]) {
      // 图片的尺寸要大于hole的尺寸
      let thisDif = imageSizePx[0] + imageSizePx[1] - sPx[0] - sPx[1]
      let ns
      if (catId === dc.Frame) {
        ns = frSizes[i]
      } else {
        ns = s
      }
      // 找出最接近图片原始尺寸的hole
      if (_.isUndefined(minDif)) {
        minDif = thisDif
        def = ns
        defSizes.push(ns)
      } else {
        if (minDif >= thisDif) {
          // 最合适的SIZE 放到首位
          minDif = thisDif
          def = ns
          defSizes.unshift(ns)
        } else {
          defSizes.push(ns)
        }
      }
    }
  })
  if (defSizes.length === 0) {
    res = {
      canFire: false
    }
  } else {
    res = {
      canFire: true,
      defaultSizes: defSizes,
      defaultSize: def
    }
  }
  return res
}

export function initSelects(boms, Packets, fireType) {
  let selects = []
  _.each(boms, b => {
    let defBom = {}
    let proObj
    switch (b.type) {
      case mt.Mat: // 卡纸物料
        let activeMat = b.total.find(m => m.Id === Packets[0])
        defBom['Type'] = 'mat'
        defBom['mat'] = activeMat
        defBom['angle'] = b.angle
        if (b.using.Property.OptionId === 0) {
          defBom['options'] = [activeMat.Properties.Options[0]]
        } else {
          defBom['options'] = [b.using]
        }
        break
      case mt.Size:
        defBom['Type'] = b.type
        defBom['Size'] = Packets
        break
      case mt.OuterLine:
        let lineObj = _.find(selects, s => {
          return s.Type === 'line'
        })
        if (lineObj) {
          if (fireType === 'init' || _.isEmpty(b.using)) {
            lineObj['outer'] = {
              Type: mt.OuterLine
            }
          } else {
            lineObj['outer'] = b.using
          }
        } else {
          defBom['Type'] = 'line'
          if (fireType === 'init' || _.isEmpty(b.using)) {
            defBom['outer'] = {
              Type: mt.OuterLine
            }
          } else {
            defBom['outer'] = b.using
          }
        }
        break
      case mt.InnerLine:
        let nlo = _.find(selects, s => {
          return s.Type === 'line'
        })
        if (nlo) {
          nlo['inner'] = b.using
        } else {
          defBom['Type'] = 'line'
          defBom['inner'] = b.using
        }
        break
      case mt.Template:
        defBom = _.find(b.selects, s => {
          return s.Id === Packets[0]
        })
        break
      case 'product':
        //  初始化
        let usingProduct = _.find(b.selects, s => {
          return s.Id === Packets[1]
        })
        proObj = _.find(selects, s => {
          return s.Type === 'product'
        })
        if (proObj) {
          proObj.product = usingProduct
        } else {
          defBom.Type = 'product'
          defBom.product = usingProduct
        }
        break
      case 'productMat':
        //  初始化
        proObj = _.find(selects, s => {
          return s.Type === 'product'
        })
        if (proObj) {
          if (proObj.hasOwnProperty('options')) {
            proObj.options.push(b.using)
          } else {
            proObj.options = [b.using]
          }
        } else {
          defBom.Type = 'product'
          defBom.options = [b.using]
        }
        break
      default:
        defBom = b.using
        break
    }
    if (!_.isEmpty(defBom)) {
      selects.push(defBom)
    }
  })
  return selects
}
export function initMatlessSelects(selects) {
  let matlessSelects = []
  let size
  _.each(selects, s => {
    if (s.hasOwnProperty('mat')) {
      size = s.mat.Properties.Size
      if (s.angle === Angles.Left) {
        size = swapSize(size)
      }
    } else {
      matlessSelects.push(s)
    }
  })
  matlessSelects.push({
    Type: mt['Size'],
    Size: size
  })
  return matlessSelects
}
function initTags(tags = []) {
  let tagsObj = {
    type: [],
    tag: [],
    color: []
  }
  tags.forEach(t => {
    t.selected = false
    tagsObj[tagsIdMap[t.Type]].push(t)
  })
  return tagsObj
}
export function getProduct(id) {
  return request.get('work/manage', id).then(res => {
    let data = res.data
    return data
  })
}
export function renderById(details, ids = []) {
  let renders = []
  _.each(ids, id => {
    let det = _.find(details, d => {
      if (d.hasOwnProperty('Property')) {
        return d.Property.OptionId === id
      } else {
        return d.Id === id
      }
    })
    renders.push(det)
  })
  return renders
}
export function initEditBoms(item) {
  //  初始化编辑页面的初始物料
  let incomes = item.Incomes
  let boms = item.boms
  let defIncome = incomes[0]
  let materials = defIncome.Materials
  let entry = defIncome.Entries[0]
  let matSelects
  let catId = item.categoryId
  let tplsIds
  _.each(boms, b => {
    let total = b.total
    switch (b.type) {
      case mt.Mat:
        let matsIds = []
        let Pros
        let selSizes
        let defSize = item.Incomes[0].size
        let angel = defSize[0] > defSize[1] ? Angles.Left : Angles.Up
        _.each(incomes, inc => {
          matsIds.push(inc.Packets[0])
        })
        matSelects = _.filter(total, t => {
          return matsIds.indexOf(t.Id) >= 0
        })
        Pros = _.map(matSelects, 'Properties')
        selSizes = _.map(Pros, 'Size')
        if (angel === Angles.Left) {
          let swipeSizes = []
          _.each(selSizes, s => {
            swipeSizes.push(swapSize(s))
          })
          selSizes = swipeSizes
        }
        item.selectSizes = selSizes
        b['selectMat'] = _.find(matSelects, m => {
          return entry.Materials.indexOf(m.Id) >= 0
        })
        item.defaultSize = b['selectMat'].Properties.Size
        b['optionsTotal'] = b.selectMat.Properties.Options
        b['selects'] = renderById(b['optionsTotal'], defIncome.Options)
        b['using'] = _.find(b['selects'], s => {
          return entry.Options[0] === s['Property']['OptionId']
        })
        b['angle'] = angel
        console.log(b['angle'])
        break
      case mt.Size:
        let rmSizes = []
        _.each(incomes, inc => {
          rmSizes.push(inc.Packets)
        })
        b['selects'] = rmSizes
        b['using'] = defIncome.Packets
        break
      case mt.Template:
        tplsIds = []
        _.each(incomes, inc => {
          tplsIds.push(inc.Packets[0])
        })
        b['selects'] = _.filter(total, tt => {
          return tplsIds.indexOf(tt.Id) >= 0
        })
        b['using'] = b['selects'][0]
        break
      case 'product':
        tplsIds = []
        _.each(incomes, inc => {
          tplsIds.push(inc.Packets[1])
        })
        b['selects'] = _.filter(total, tt => {
          return tplsIds.indexOf(tt.Id) >= 0
        })
        b['using'] = _.find(b['selects'], bs => {
          return bs.Id === defIncome.Packets[1]
        })
        break
      case 'productMat':
        tplsIds = []
        _.each(incomes, inc => {
          tplsIds.push(inc.Packets[1])
        })
        b['selects'] = _.filter(total, tt => {
          return defIncome.Options.indexOf(tt.OptionId) >= 0
        })
        b['using'] = _.find(b['selects'], bs => {
          return entry.Options.indexOf(bs.OptionId) >= 0
        })
        break
      case mt.Canvas:
        if (catId === dc.Scroll) {
          //  卷轴画画布不可设置
          b['selects'] = b.total
          b['using'] = b.using = _.find(b.selects, tt => {
            return entry.Materials.indexOf(tt.Id) >= 0
          })
        } else {
          b['selects'] = _.filter(total, t => {
            return materials.indexOf(t.Id) >= 0
          })
          b['using'] = _.find(b.selects, tt => {
            return entry.Materials.indexOf(tt.Id) >= 0
          })
        }
        break
      case mt.OuterLine:
      case mt.MagnetLine:
        b['selects'] = _.filter(total, t => {
          return materials.indexOf(t.Id) >= 0
        })
        b['using'] = _.find(b.selects, tt => {
          return entry.Materials.indexOf(tt.Id) >= 0
        })
        if (b['selects'][0].Name !== '无框') {
          b['selects'].unshift({
            Id: 0,
            Type: b.type,
            Name: '无框'
          })
          if (!b.using) {
            b.using = b['selects'][0]
          }
        }
        break
      default :
        b['selects'] = _.filter(total, t => {
          return materials.indexOf(t.Id) >= 0
        })
        b['using'] = _.find(b.selects, tt => {
          return entry.Materials.indexOf(tt.Id) >= 0
        })
    }
  })
}
export function selectMaterialUtil(item, material, type, cb) {
  let thisItem = item
  let boms = thisItem.boms
  let actB
  let Packets = []
  switch (type) {
    case 'material':
      //  常用物料内 如果type等于0 说明是卡纸的option选项
      let mType = material.Type
      if (material.hasOwnProperty('Property')) {
        mType = mt['Mat']
        item.hasMat = true
      }
      actB = _.find(boms, b => {
        return b.type === mType
      })
      actB.using = material
      reBuildEntry(thisItem, 'fresh', cb)
      break
    case 'size':
      actB = _.find(boms, b => {
        return b.type === mt['Size']
      })
      actB.using = material
      Packets = material
      selectIncomes(thisItem, Packets, cb)
      break
    case 'frameSize':
      //  size的时候需要初始化 卡纸
      let selectMatCat
      actB = _.find(boms, b => {
        return b.type === mt['Mat']
      })
      let total = actB.total
      thisItem.defaultSize = material
      //  为了展示其他物料数据一致
      selectMatCat = _.find(total, (t) => {
        let matSize = t.Properties.Size
        return (matSize[0] === material[0] && matSize[1] === material[1]) || (matSize[0] === material[1] && matSize[1] === material[0])
      })
      //  *selectMat 当前选中的卡纸尺寸对象（对应选中尺寸，下面含各种颜色类型）
      //  *optionsTotal 当前所有可用的卡纸颜色（对应尺寸下所有可用各种卡纸颜色）
      //  *selects 当前设置的可选卡纸分组（对应设置的可用各种卡纸颜色）
      //  *using 当前选中的卡纸option
      actB['selectMat'] = selectMatCat
      actB['optionsTotal'] = selectMatCat.Properties.Options
      updateMatOption(actB['optionsTotal'], actB['selects'])
      Packets = [selectMatCat.Id, 0]
      selectIncomes(thisItem, Packets, cb)
      break
    case 'product':
      actB = _.find(boms, b => {
        return b.type === 'product'
      })
      actB['using'] = material
      boms = []
      boms.push(actB)
      let selMat = material
      let keys = getkeys(item)
      keys.forEach((v) => {
        let total = filterMaterialsByKey(selMat, v)
        boms.push({
          type: 'productMat',
          name: v,
          total: total,
          selects: total.length > pbCount ? total.slice(0, pbCount) : total,
          using: total[0]
        })
      })
      Packets = [0, actB.using.Id]
      selectIncomes(thisItem, Packets, cb)
      break
    case 'productMat':
      actB = _.find(boms, b => {
        return b.name === material.Key
      })
      actB['using'] = material
      reBuildEntry(thisItem, 'fresh', cb)
      break
    case 'matLess':
      changeMatType(item, 'matLess', material, cb)
      break
  }
}
export function getkeys(item) {
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
      for (let item of p.Properties) {
        if (a.indexOf(item.Key) === -1) a.push(item.Key)
      }
    }
  }
  return a
}
export function filterMaterialsByKey(material, value) {
  let res
  res = _.filter(material.Properties, (p) => {
    return p.Key === value
  })
  return res
}
function reBuildEntry(item, fireType, cb) {
  // 换图时只有装饰画需要重新build Entry, 初始entries[0]的selects
  // fireType * init 初始化（布艺画 初始无outerline） *refresh 根据实际的
  let selects
  let catId = item.categoryId
  let Packets
  let selMat
  switch (catId) {
    case dc.Frame: // 1
    case dc.Frames: // 8 有框画
      selMat = _.find(item.boms, b => {
        return b.type === mt['Mat']
      }).selectMat
      Packets = [selMat.Id, 0]
      break
    case dc.Rimless: // 布艺画
    case dc.Magnet: // 磁贴画
      _.each(item.boms, (b) => {
        if (b.type === mt['Size']) {
          Packets = b.using
        }
      })
      break
    case dc['Scroll']: // 卷轴画
      _.each(item.boms, (b) => {
        if (b.type === mt['Template']) {
          Packets = [b.using.Id, 0]
        }
      })
      break
    default :
      _.each(item.boms, (b) => {
        if (b.type === 'product') {
          Packets = [0, b.using.Id]
        }
      })
  }
  selects = initSelects(item.boms, Packets, fireType)
  buildEntry(catId, selects).then(entry => {
    let activeIcome = getIncomeByPackets(item, Packets)
    activeIcome.Entries[0] = entry
    item.Packets = Packets
    if (item.type === 'Product') {
      _.each(activeIcome.Pictures[0], p => {
        p.Outputs = entry.Outputs[0]
      })
      _.each(activeIcome.Pictures[0], (p, i) => {
        let iniP
        let dpi = window.$categories.get(catId).DPI
        if (p.hasOwnProperty('Image')) {
          if (!p.Image.Info) {
            p.Image.Info = {
              Rotate: p.Roate
            }
          }
          iniP = newPicture(0, entry.Outputs[0], p.Image, dpi)
          activeIcome.Pictures[0][i] = iniP
        } else {
          p.Outputs = entry.Outputs[0]
        }
      })
    }
    if (catId === dc.Frame) {
      let matlessSelects = initMatlessSelects(selects)
      let size = _.find(matlessSelects, s => {
        return s.Type === mt.Size
      }).Size
      let activeMatlessInc = findMatLessIncome(item, size)
      activeIcome.selects = selects
      buildEntry(dc.Matless, matlessSelects).then(mtlEntry => {
        activeMatlessInc.Entries[0] = mtlEntry
        if (item.hasMat) {
          item.entries[0].entry = entry
        } else {
          item.entries[0].entry = mtlEntry
        }
        initDisplayParam(item)
        if (_.isFunction(cb)) {
          cb(item)
        }
      })
    } else {
      item.entries[0].entry = entry
      initDisplayParam(item)
      if (_.isFunction(cb)) {
        cb(item)
      }
    }
  })
}
function selectIncomes(item, Packets, cb) {
  let activeIcome
  let thisEntry
  let Materials
  let boms = item.boms
  let OptionId
  activeIcome = getIncomeByPackets(item, Packets)
  thisEntry = activeIcome.Entries[0]
  Materials = thisEntry.Materials || []
  //  切换income时初始化entry 各物料的选中状态
  if (item.type === 'Product') {
    _.each(boms, b => {
      if (b.type === 'product') {
        b.using = b.selects[0]
      }
    })
  } else {
    _.each(boms, b => {
      let selects = b.selects
      let newUsing
      if (b.type !== mt.Mat) {
        if (b.type === mt.Size) {
          newUsing = selects.find(li => equalSize(li, Packets))
        } else {
          Materials.forEach(id => {
            if (!newUsing) {
              newUsing = selects.find(li => li.Id === id)
            }
          })
        }
      } else {
        OptionId = thisEntry.Options[0]
        newUsing = selects.find(li => li.Property.OptionId === OptionId)
      }
      b.using = newUsing
    })
  }

  item.entries[0].entry = thisEntry
  initDisplayParam(item)
  item.pictures = activeIcome.Pictures[0]
  item.Packets = Packets
  if (_.isFunction(cb)) {
    cb(item)
  }
}
function findMatLessIncome(item, size) {
  let activeMatlessInc
  let mtlIncomes = item.matlessItem.Incomes
  activeMatlessInc = _.find(mtlIncomes, mtl => {
    return (mtl.Packets[0] === size[0] && mtl.Packets[1] === size[1]) ||
      (mtl.Packets[0] === size[1] && mtl.Packets[1] === size[0])
  })
  return activeMatlessInc
}
function changeMatType(item, type, material, cb) {
  if (type === 'matLess') {
    let actB = _.find(item.boms, b => {
      return b.type === mt.Mat
    })
    actB.using = material
    let selMat = actB.selectMat
    let size = selMat.Properties.Size
    let mtlIncomes = item.matlessItem.Incomes
    let activeIncome = _.find(mtlIncomes, minc => {
      return (minc.Packets[0] === size[0] && minc.Packets[1] === size[1]) ||
        (minc.Packets[0] === size[1] && minc.Packets[1] === size[0])
    })
    item.entries[0].entry = activeIncome.Entries[0]
    item.hasMat = false
    initDisplayParam(item)
    cb(item)
  }
}
export function getTags() {
  return request.list('tag', {}).then(res => {
    let data = res.data
    return initTags(data.Data)
  })
}
export function updateIncomeMateria(item) {
  let boms = item.boms
  let options = []
  let materials = []
  let materialsIds = []
  _.each(boms, b => {
    switch (b.type) {
      case mt['Mat']:
        options = b.selects
        break
      case mt['Template']:
      case mt['Size']:
      case 'product':
        break
      case 'productMat':
        options = _.concat(options, b.selects)
        break
      default:
        materials = _.concat(materials, b.selects)
    }
  })
  if (item.categoryId === dc.Scroll) {
    materials = []
  }
  //  删除0（无卡纸、无框等Id为0的数据）
  materialsIds = _.compact(_.map(materials, 'Id'))
  _.each(item.Incomes, i => {
    //  现阶段所有income对应的物料一致
    i.Materials = materialsIds
    if (item.categoryId === dc.Frame) {
      i.Options = _.map(_.map(options, 'Property'), 'OptionId')
    } else {
      i.Options = _.map(options, 'OptionId')
    }
  })
  if (item.categoryId === dc.Frame) {
    _.each(item.matlessItem.Incomes, ic => {
      ic.Materials = materialsIds
    })
  }
}
export function initDisplayParam(item) {
  let iniEntry = item.entries[0].entry
  let initE = initListEntryObj(iniEntry)
  item.displayer = initE.displayer
  item.displays = initE.displays
  item.entry = initE.entry
}
export function getIncomeByPackets(item, Packets) {
  let incomes = item.Incomes
  let activeIcome = _.find(incomes, i => {
    return i.Packets[0] === Packets[0] && i.Packets[1] === Packets[1]
  })
  return activeIcome
}

export function updateMatOption(options, matSelects) {
  _.each(matSelects, ms => {
    let value = ms.Property.Value
    let filterOption
    filterOption = _.find(options, o => {
      return o.Property.Value === value
    })
    if (filterOption) {
      ms = filterOption
    } else {
      ms.removeStatus = true
    }
  })
  _.remove(matSelects, ms => {
    return ms.removeStatus
  })
}
export function initSubmitData(pic, pieces = [], detail, cb) {
  let res = {}
  let Pieces = []
  res.ImageId = pic.Id
  res.ImageFile = pic.File
  res.Title = detail.title
  res.Description = detail.description
  res.Tags = detail.tags
  pieces = pieces.filter(item => item.canFire)
  _.each(pieces, item => {
    let initItem = {}
    let initMtlItem = {}
    let initIncomes
    let initMtlIncomes
    // 默认是无卡画时，合并到有框画ID
    initIncomes = _.filter(item.Incomes, i => {
      return i.status
    })
    initItem.Incomes = []
    let rate = item.pictures[0].rate
    initItem.CategoryId = item.categoryId
    _.each(initIncomes, income => {
      let inc = {}
      inc.Packets = income.Packets
      inc.Materials = income.Materials
      inc.Options = income.Options
      inc.Bonus = income.Bonus
      inc.Entries = _.map(income.Entries, 'Id')
      let pics = income.Pictures[0]
      _.each(pics, p => {
        p.rate = rate
      })
      inc.Pictures = [serializePictures(pics)]
      initItem.Incomes.push(inc)
    })
    if (item.canFire) {
      initItem.Pause = !item.active
      if (item.categoryId === dc.Frame) {
        initMtlItem.CategoryId = dc.Matless
        initMtlIncomes = item.matlessItem.Incomes.filter(v => v.status)
        initMtlItem.Incomes = []
        //  物料继承有框画的物料
        let ms = initItem.Incomes[0].Materials
        _.each(initMtlIncomes, iic => {
          let inc = {}
          let pics = iic.Pictures[0]
          inc.Packets = iic.Packets
          inc.Materials = ms
          inc.Options = iic.Options
          inc.Bonus = iic.Bonus
          inc.Entries = _.map(iic.Entries, 'Id')
          _.each(pics, p => {
            p.rate = rate
          })
          inc.Pictures = [serializePictures(pics)]
          initMtlItem.Incomes.push(inc)
        })
        initMtlItem.Pause = !item.active
        if (item.hasMat) {
          Pieces.push(initItem)
          Pieces.push(initMtlItem)
        } else {
          Pieces.push(initMtlItem)
          Pieces.push(initItem)
        }
      } else {
        Pieces.push(initItem)
      }
    }
  })
  res.Pieces = Pieces
  return res
}

export function initMatlessIncomes(incomes, cb) {
   //  重新初始化需要异步操作  build每一个INCOME下的**无卡画**Entry
  let matlessIncomes = []
  let entryPromises = []
  let catId = dc.Matless
  _.each(incomes, inc => {
    let initInc = {}
    let selects = inc.selects
    let size
    initInc.Packets = inc.Packets
    initInc.Materials = inc.Materials
    initInc.Bonus = inc.Bonus
    initInc.Pictures = inc.serializePic
    _.each(selects, s => {
      if (s.hasOwnProperty('mat')) {
        size = s.mat.Properties.Size
      }
    })
    selects.push({
      Type: mt['Size'],
      Size: size
    })
    _.remove(selects, s => {
      return s.hasOwnProperty('mat')
    })
    matlessIncomes.push(initInc)
    entryPromises.push(buildEntry(catId, selects))
  })

  return Promise.all(entryPromises).then(entriesDetail => {
    _.each(matlessIncomes, (ic, index) => {
      ic.Entries = entriesDetail[index]
    })
    return matlessIncomes
  })
}
