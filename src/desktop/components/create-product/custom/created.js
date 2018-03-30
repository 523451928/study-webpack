/*eslint-disable*/
import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
  Fulls
} from "scripts/utils/custom/consts.js" 
import { copySize, swapSize, parseImageSize } from 'scripts/utils/custom/utils.js'
import {
  serializePicture
} from 'components/custom/picture/picture.js'
const { abs, ceil, floor, min, max } = Math
export function getVirtualSize(s, dpi) {
  return [getVirtualLength(s[0], dpi), getVirtualLength(s[1], dpi)]
}
export function getVirtualLength(mm, dpi) {
  if (!dpi) {
    throw new Error(dpi)
  }
  return floor(mm / 25.4 * dpi) // px
}
export let setIncomeName = (size) => {
  return `${size[0] / 10}x${size[1] / 10}cm`
}
/**
 * 获得对应卡纸id下的颜色数据
 * @param {*Array} matList 卡纸数组 
 * @param {*Number} matId 卡纸id 
 * @param {*Array} opts 颜色id组成的数组 
 */
export let getOptions = (matList, matId, opts) => {
  let _options = []
  let f
  let m = new Map()
  for (let i of matList) {
    if (i.Id === matId) {
      i.Properties.Options.forEach(item => {
        m.set(item.Property.OptionId, item)
      })
      break
    }
  }
  opts.forEach(item => {
    if (m.get(item)) {
      _options.push(m.get(item))
    }
  })
  return _options
}
// list 颜色数组
// id 颜色id
export let isColorExist = (list, id) => {
  let r = []
  let t = list.forEach(item => {
    if (item.Property.OptionId === id) {
      r.push(item)
    }
  })
  return r.length > 0 ? r : list[0]
}
/**
 * 在所有的物料中筛选出匹配的尺寸
 * @param {Number} catId 品类id
 * @param {Array} materials 物料数组
 * @param {Number/Array} match 当品类为dc.Magnet || dc.Rimless 时为尺寸数组  
 */
export let filterMaterial = (catId, materials, match) => {
  const id = catId
  const m = materials
  for (let k of m) {
    switch(id) {
      case dc.Frame:
      case dc.Frames:
      case dc.Matless:
      case dc.Scroll:
        if (k.Id && k.Id === match) {
          return k
        }
        break
      case dc.Magnet:
      case dc.Rimless:
        if (k.Type === mt.Size && (k.Size[0] === match[0] && k.Size[1] === match[1]) || (k.Size[0] === match[1] && k.Size[1] === match[0])) {
          return k
        }
        break
    }
  }

}
// 检测图片是否可用
export let fitPictures = (pic, entry) => {
  let p = JSON.parse(JSON.stringify(pic))
  let full = p.Output.Full === Fulls.Always
  let output = entry.Outputs[0]
  p.Output.Size = output.Size
  // 图片尺寸
  let imageSize = parseImageSize(p.Image)
  let outputSize = getVirtualSize(p.Output.Size, p.DPI)
  if (full) {
    if (abs(p.ScaleX) / 100 * imageSize[0] < outputSize[0]) {
      let scaleX = min(ceil(outputSize[0] / imageSize[0] * 100), 100)
      p.ScaleX = p.ScaleX < 0 ? -scaleX : scaleX
      p.ScaleY = p.ScaleY < 0 ? -scaleX : scaleX
    }
    if (abs(p.ScaleY) / 100 * imageSize[1] < outputSize[1]) {
      let scaleY = min(ceil(outputSize[1] / imageSize[1] * 100), 100)
      p.ScaleY = p.ScaleY < 0 ? -scaleY : scaleY
      p.ScaleX = p.ScaleX < 0 ? -scaleY : scaleY
    }
    let translateX = floor(abs(p.ScaleX) / 100 * imageSize[0] - outputSize[0]) / 2
    let translateY = floor(abs(p.ScaleY) / 100 * imageSize[1] - outputSize[1]) / 2
    p.TranslateX = parseInt(min(max(p.TranslateX, -translateX), translateX))
    p.TranslateY = parseInt(min(max(p.TranslateY, -translateY), translateY))
  }
  // switch (entry.CategoryId) {
  //   case dc.Frame:
  //   case dc.Frames:
  //   case dc.Magnet:
  //   case dc.Matless:
  //   case dc.Scroll:
  //   case dc.Rimless:
  //     break
  //   default:
  //     console.log(p)
  //     break
  // }
  return p
}
/**
 * 当前custom所展示的物料
 * @param {*Number} id 当前品类id 
 * @param {*Array} m1 主物料列表 
 * @param {*Array} s1 选择的参数
 * @return {Array} 返回一个数组, 数组0为materilas 数组1为options 
 */
export let saveMaterial = (id, mainCustom, custom) => {
  // 主custom上的物料数组
  let c1 = mainCustom.current.materials
  // 当前custom上的物料数组
  let c2 = custom.current.materials
  let c3 // 过滤出我们所需要的主custom上的物料
  let c4 // 过滤出我们所需要的当前custom上的物料
  let r = []
  switch(id) {
    case dc.Frame:
    case dc.Frames:
      c3 = c1.filter(v => v.Type !== mt.Mat && v.Type !== mt.Size)
      c4 = c2.filter(v => v.Type !== mt.Mat && v.Type !== mt.Size)
      c3.forEach(item => {
        for (let k of c4) {
          if (item.Id === k.Id) {
            r.push(k.Id)
            break
          }
        }
      })
      break
    case dc.Matless:
      c3 = c1.filter(v => v.Type !== mt.Mat && v.Type !== mt.Size)
      c4 = c2.filter(v => v.Type !== mt.Mat && v.Type !== mt.Size)
      c3.forEach(item => {
        for (let k of c4) {
          if (item.Id === k.Id) {
            r.push(k.Id)
            break
          }
        }
      })
      break
    case dc.Magnet:
    case dc.Rimless:
      c3 = c1.filter(v => v.Type !== mt.Size)
      c4 = c2.filter(v => v.Type !== mt.Size)
      c3.forEach(item => {
        for (let k of c4) {
          if (item.Id === k.Id) {
            r.push(k.Id)
            break
          }
        }
      })
      break
    case dc.Scroll:
      break
    default:
      break
  }
  return r
}
// 保存物料选项
// 返回选中的合适的尺寸
// m1是选中元素的options
// m2是所有的物料信息
export let saveMatOptions = (id, mainCustom, custom) => {
  let c1 = mainCustom
  let c2 = custom
  let c3
  let c4
  let r = []
  switch(id) {
    case dc.Frame:
    case dc.Frames:
      c3 = c1.current.selects.filter(v => v.Type === 'mat')[0].mat.Properties.Options
      c4 = c2.current.selects.filter(v => v.Type === 'mat')[0].mat.Properties.Options
      c3.forEach(item => {
        for (let k of c4) {
          if (item.Property.OptionId === k.Property.OptionId) {
            r.push(item.Property.OptionId)
          }
        }
      })
      break
    case dc.Matless:
      r = undefined
      break
    case dc.Magnet:
    case dc.Rimless:
      break
    case dc.Scroll:
      r = undefined
      break
    default:
      c3 = c1.current.selects.filter(v => v.Type === 'product')[0]
      c3.options.forEach(item => {
        r.push(item.OptionId)
      })
      break
  }
  return r
}
// 保存Packets
export let savePackets = (id, custom) => {
  let r
  switch(id) {
    case dc.Frame:
    case dc.Frames:
      r = [custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Id, 0]
      break
    case dc.Magnet:
    case dc.Rimless:
    case dc.Matless:
      r = custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
      break
    case dc.Scroll:
      r = [custom.current.selects.filter(v => v.Type === mt.Template)[0].Id, 0]
      break
    default:
      r = [0, custom.current.entry.ProductId]
      break
  }
  return r
  
}
/**
 * 生成一个绑定在window上的map对象,方便我们直接取卡纸的数据
 */
export let initMatMap = (materials) => {
  let fs = materials.filter(v => v.Type === mt.Mat && v.CategoryId !== dc.MultiHole)
  let m = new Map()
  fs.forEach(item => {
    m.set(item.Id, item)
  })
  return m
}
// 生成对应custom所需要的物料数组
export let createdMaterial = (id, materilas) => {
  let _pm = []
  let z = []
  let f = []
  let m = [...materilas]
  switch (id) {
    case dc.Frame:
    case dc.Frames:
      m.forEach(v => {
        if (v.Type === mt.Mat && v.CategoryId !== dc.MultiHole) {
          z.push(v)
        } else {
          f.push(v)
        }
      })
      z.forEach(v => {
        _pm.push([v, ...f])
      })
      break
    case dc.Matless:
      m.forEach(v => {
        if (v.Type === mt.Size) {
          z.push(v)
        } else {
          f.push(v)
        }
      })
      z.forEach(v => {
        _pm.push([v, ...f])
      })
      break
    case dc.Rimless:
    case dc.Magnet:
      m.forEach(v => {
        if (v.Type === mt.Size) {
          z.push(v)
        } else {
          f.push(v)
        }
      })
      z.forEach(v => {
        _pm.push([v, ...f])
      })
      break
    case dc.Scroll:
      m.forEach(v => {
        if (v.Type === mt.Template) {
          z.push(v)
        } else {
          f.push(v)
        }
      })
      z.forEach(v => {
        _pm.push([v, ...f])
      })
      break
    default:
      _pm.push(m)
      break
  }
  return _pm
}
/**
 * 获取当前income的名称
 * @param {Number} id 品类id 
 * @param {Object} custom 当前income的custom对象 
 */
export let saveIncomeName = (id, custom) => {
  let name
  switch(id) {
    case dc.Frame:
    case dc.Frames:
      name = setIncomeName(custom.current.selects.filter(v => v.Type === 
      'mat')[0].mat.Properties.Size)
      break
    case dc.Rimless:
    case dc.Magnet:
    case dc.Matless:
      name = setIncomeName(custom.current.selects.filter(v => v.Type === mt.Size)[0].Size)
      break
    case dc.Scroll:
      name = custom.current.selects.filter(v => v.Type === mt.Template)[0].Name
      break
    default:
      name = custom.current.selects.filter(v => v.Type === 'product')[0].product.Name
      break
  }
  return name
}
/**
 * 生成我们要的数据结构,无论最后怎么切换物料,我们都是从主要的custom上找到对应的数据,然后替换掉当前custom
 * @param {Number} id 品类id 
 * @param {Object} mainCustom 主要的cusom, 根据主custom上的物料取数据
 * @param {Object} custom 每个incomes上的custom
 * @param {Number} income 当前incomes的Bonus  
 */
export let saveIncomes = (id, mainCustom, custom, Bonus = 20, Select = true) => {
  // Entries初始化,拿到主custom的select,然后进行操作buildEntry操作
  let income = {
    Packets: [0, 0], // 具体商品的数据
    Entries: [], // entryid
    Pictures: undefined, // 图片数据, 获取custom上的数据
    Materials: [], // 物料选项 获取主custom上的数据
    Options: [], // 卡纸 新品类选项 获取主custom上的Options数据
    Bonus: Bonus, // 初始化的价格
    Name: undefined, // 商品的名称
    Select: Select, // 是否选中
    custom: custom // 每一个income上对应一个属于他自己的income
  }
  let pic
  if (id === dc.Frames) {
    console.log(custom)
  }
  pic = fitPictures(custom.current.pictures[0], custom.current.entry)
  // pic.Rotate = mainCustom.current.pictures[0].Rotate
  // pic.ScaleX = mainCustom.current.pictures[0].ScaleX
  // pic.ScaleY = mainCustom.current.pictures[0].ScaleY
  income.Pictures = [[serializePicture(pic)]]
  income.Entries = [custom.current.entry.Id]
  income.Materials = saveMaterial(id, mainCustom, custom)
  income.Options = saveMatOptions(id, mainCustom, custom)
  income.Packets = savePackets(id, custom)
  income.Name = saveIncomeName(id, custom)
  return income
}

/**
 * 判断是否存在default参数,过滤一遍武林
 * @param {Array} m 物料数组 已经过滤好的
 */
export let filterDefault = (m) => {
  const MAX_SIZE = 6
  let _m1 = m.filter(v => v.Type === mt.Mat)
  let _m2 = m.filter(v => v.Type === mt.Line)
  let _m3 = m.filter(v => v.Type !== mt.Mat && v.Type !== mt.Line)
  if (_m2.some(v => v.Default)) {
    _m2 = _m2.filter(v => v.Default)
  } else {
    _m2 = _m2.slice(0, MAX_SIZE)
  }
  _m1.forEach(item => {
    if (item.Properties.Options.some(v => v.Default)) {
      item.Properties.Options = item.Properties.Options.filter(v => v.Default)
    } else {
      item.Properties.Options = item.Properties.Options.slice(0, MAX_SIZE)
    }
  })
  return [..._m1, ..._m2, ..._m3]

}
