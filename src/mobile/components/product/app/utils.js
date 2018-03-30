import { getRealPxSize } from 'scripts/utils/image'
import { buildEntry } from 'scripts/utils/custom/entry'
import { MaterialTypes as mt, DecorativeCategories as dc, proBomsCount as pbCount, Angles } from 'scripts/utils/custom/consts'
import { serializePictures } from 'components/public/display/app/picture'
import { initListEntryObj } from 'components/public/display/app/display-util'
export function initImages(data) {
  _.each(data, i => {
    let size = getRealPxSize(i.File)
    // 图片的形状 横 tran  竖形 vert  用于图片填满画布时按那一边显示（最短）
    i.shape = size[0] >= size[1] ? 'tran' : 'vert'
    i.src = request.thumb('image', i.Id, 480, i.File)
  })
  return data
}

export function initSelects(boms, Packets, fireType) {
  let selects = []
  _.each(boms, b => {
    let defBom = {}
    let proObj
    switch (b.type) {
      case mt.Mat:
        let activeMat = _.find(b.total, m => {
          return m.Id === Packets[0]
        })
        let w = activeMat.Properties.Size[0]
        let h = activeMat.Properties.Size[1]
        defBom['Type'] = 'mat'
        defBom['mat'] = activeMat
        defBom['angel'] = w > h ? Angles.Left : Angles.Up
        defBom['options'] = [b.using]
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
export function initMatlessSelects(item) {
  let boms = item.boms
  let selects = []
  _.each(boms, b => {
    if (b.type === mt['Mat']) {
      let selMat = b.selectMat
      let size = selMat.Properties.Size
      selects.push({
        Type: mt['Size'],
        Size: size
      })
    } else {
      selects.push(b.using)
    }
  })
  return selects
}
function initTags(tags) {
  let tagsObj = {
    type: [],
    tag: [],
    color: []
  }
  //  TYPE 1类型 2标签 3颜色
  _.each(tags, t => {
    t.selected = false
    switch (t.Type) {
      case 1:
        tagsObj.type.push(t)
        break
      case 2:
        tagsObj.tag.push(t)
        break
      case 3:
        tagsObj.color.push(t)
        break
    }
  })
  return tagsObj
}
export function getProduct(id) {
  return request.get('work/manage', id).then(res => {
    let data = res.data
    return data
  })
}
export function renderById(details, ids) {
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
        _.each(incomes, inc => {
          matsIds.push(inc.Packets[0])
        })
        matSelects = _.filter(total, t => {
          return matsIds.indexOf(t.Id) >= 0
        })
        Pros = _.map(matSelects, 'Properties')
        selSizes = _.map(Pros, 'Size')
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
          b.selects = _.filter(total, t => {
            return materials.indexOf(t.Id) >= 0
          })
          b.using = _.find(b.selects, tt => {
            return entry.Materials.indexOf(tt.Id) >= 0
          })
        }
        break
      default :
        b.selects = _.filter(total, t => {
          return materials.indexOf(t.Id) >= 0
        })
        b.using = _.find(b.selects, tt => {
          return entry.Materials.indexOf(tt.Id) >= 0
        })
        if (b.type === mt.OuterLine) {
          b['selects'].unshift({
            Id: 0,
            Type: mt.OuterLine,
            Name: '无框'
          })
          if (!b.using) {
            b.using = b['selects'][0]
          }
        }
    }
  })
}
export function selectMaterialUtil(item, material, type, cb) {
  let self = this
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
        if (item.categoryId === dc.Matless) {
          item.categoryId = dc.Frame
        }
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
      let keys = this.getkeys(item)
      keys.forEach((v) => {
        let total = self.filterMaterialsByKey(selMat, v)
        boms.push({
          type: 'productMat',
          name: v,
          total: total,
          selects: total.length > pbCount ? total.slice(0, pbCount) : total,
          using: total[0]
        })
      })
      Packets = [actB.Id, 0]
      selectIncomes(thisItem, Packets, cb)
      break
    case 'productMat':
      actB = _.find(boms, b => {
        return b.type === 'productMat'
      })
      actB['using'] = material
      reBuildEntry(thisItem, 'fresh', cb)
      break
    case 'matLess':
      changeMatType(item, 'matLess', material, cb)
      break
  }
}
function reBuildEntry(item, fireType, cb) {
  // 换图时只有装饰画需要重新build Entry, 初始entries[0]的selects
  // fireType * init 初始化（布艺画 初始无outerline） *refresh 根据实际的
  let selects
  let catId = item.categoryId
  let Packets
  let selMat
  switch (catId) {
    case dc['Frame']:
    case dc['Matless']:
      selMat = _.find(item.boms, b => {
        return b.type === mt['Mat']
      }).selectMat
      Packets = [selMat.Id, 0]
      break
    case dc['Rimless']:
      _.each(item.boms, (b) => {
        if (b.type === mt['Size']) {
          Packets = b.using
        }
      })
      break
    case dc['Scroll']:
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
  if (catId === dc['Matless']) {
    selects = initMatlessSelects(item)
  } else {
    selects = initSelects(item.boms, Packets, fireType)
  }
  buildEntry(catId, selects).then(entry => {
    let activeIcome = getIcomeByPackets(item, Packets)
    activeIcome.Entries[0] = entry
    if (catId === dc['Frame']) {
      activeIcome.hasMat = true
    }
    item.entries[0].entry = entry
    initDisplayParam(item)
    if (_.isFunction(cb)) {
      cb(item)
    }
  })
}
function selectIncomes(item, Packets, cb) {
  let activeIcome = getIcomeByPackets(item, Packets)
  let thisEntry = activeIcome.Entries[0]
//  let image
//  let p
  let Materials = thisEntry.Materials
  let boms = item.boms
  //  切换income时初始化entry 各物料的选中状态
  _.each(boms, b => {
    let selects = b.selects
    let newUsing
    _.each(Materials, id => {
      if (_.isUndefined(newUsing)) {
        newUsing = _.find(selects, b => {
          return b.Id === id
        })
      }
    })
    if (!_.isUndefined(newUsing)) {
      b.using = newUsing
    }
  })
  item.entries[0].entry = thisEntry
  initDisplayParam(item)
  item.pictures = activeIcome.Pictures[0]
  item.Packets = Packets
  if (_.isFunction(cb)) {
    cb(item)
  }
}
function changeMatType(item, type, material, cb) {
  if (type === 'matLess') {
    let actB = _.find(item.boms, b => {
      return b.type === mt.Mat
    })
    let selMat = actB.selectMat
    actB.using = material
    let Packets = [selMat.Id, 0]
    item.categoryId = dc.Matless
    let selects = initMatlessSelects(item)
    buildEntry(dc.Matless, selects).then(entry => {
      let activeIncome = getIcomeByPackets(item, Packets)
      activeIncome.Entries[0] = entry
      activeIncome.hasMat = false
      item.entries[0].entry = entry
      initDisplayParam(item)
      if (_.isFunction(cb)) {
        cb(item)
      }
    })
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
  _.each(boms, b => {
    switch (b.type) {
      case mt['Mat']:
        options = b.selects
        break
      case mt['Template']:
      case 'product':
      case mt['Size']:
        break
      case 'productMat':
        options = _.concat(options, b.selects)
        break
      default:
        materials = _.concat(materials, b.selects)
    }
  })
  if (item.category === 'Scroll') {
    materials = []
  }
  _.each(item.Incomes, i => {
    i.Materials = _.map(materials, 'Id')
    //  删除0（无卡纸、无框等Id为0的数据）
    i.Materials = _.compact(i.Materials)
    if (item.category === 'Frame') {
      i.Options = _.map(_.map(options, 'Property'), 'OptionId')
    } else {
      i.Options = _.map(options, 'OptionId')
    }
  })
}
export function initDisplayParam(item) {
  let iniEntry = item.entries[0].entry
  let initE = initListEntryObj(iniEntry)
  item.displayer = initE.displayer
  item.displays = initE.displays
  item.entry = initE.entry
}
export function getIcomeByPackets(item, Packets) {
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
export function initSubmitData(pic, pieces, detail) {
  let res = {}
  let Pieces = []
  let matlessItem = {
    CategoryId: dc.Matless,
    Incomes: [],
    Pause: false
  }
  res.ImageId = pic.Id
  res.ImageFile = pic.File
  res.Title = detail.title
  res.Description = detail.description
  res.Tags = detail.tags
  _.each(pieces, item => {
    let initItem = {}
    //  默认是无卡画时，合并到有框画ID
    initItem.CategoryId = item.categoryId === dc.Matless ? dc.Frame : item.categoryId
    initItem.Incomes = _.filter(item.Incomes, i => {
      return i.status
    })
    let rate = item.pictures[0].rate
    _.each(initItem.Incomes, income => {
      delete income.def
      delete income.status
      delete income.size
      delete income.tpl
      income.Entries = _.map(income.Entries, 'Id')
      let pics = income.Pictures[0]
      _.each(pics, p => {
        p.rate = rate
      })
      income.Pictures = [serializePictures(pics)]
      if (initItem.CategoryId === dc.Frame) {
        //  分离无卡画数据
        if (!income.hasMat) {
          matlessItem.Incomes.push(income)
        }
      }
    })
    if (initItem.CategoryId === dc.Frame) {
      _.remove(initItem.Incomes, income => {
        //  删除有框画数据中保存的无卡画数据
        return !income.hasMat
      })
    }
    if (item.canFire) {
      initItem.Pause = !item.active
      Pieces.push(initItem)
    }
  })
  if (matlessItem.Incomes.length > 0) {
    Pieces.push(matlessItem)
  }
  res.Pieces = Pieces
  return res
}

