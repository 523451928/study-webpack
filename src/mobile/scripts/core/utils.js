/* eslint-disable */
import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
  Angles as as
} from "scripts/utils/custom/consts.js"
import { equalOption, equalSize, copySize, swapSize,
  formatSize, sizeShape } from 'scripts/custom/util.js'

/**
 * 合并品类id,将1,6,7,8物料id合并为8返回
 * @param {Number} id 品类id 
 */
export let mergeCategory = (id) => {
  switch(id) {
    case dc.Frame:
    case dc.Frames:
    case dc.Matless:
    case dc.MultiHole:
      return dc.Frames
      break
    default:
      return id
      break
  }
}
/**
 * 根据incomes数组,过滤一次物料
 * @param {Number} id 品类id 
 * @param {Array} m 物料数组
 * @param {Array} inc incomes数组 
 */
export let filterIncomeMat = (id, m, inc) => {
  // 当品类为8时,需要过滤一次无卡纸的选项
  let m1
  switch(id) {
    case dc.Frame:
    case dc.Frames:
    case dc.MultiHole:
    case dc.Matless:
      m1 = filterFrames(m, inc)
      break
  }
}

// 过滤有框画
export let filterFrames = (m, inc) => {
  let m1 // 非卡纸
  let m2 = []
  m1 = m.filter(v => {
    let _Mat = inc[0].Materials
    if (_Mat.some(k => k === v.Id)) {
      return v
    }
  })
  inc.forEach(v => {
    for (let k of m) {
      if (v.Packets[0] === k.Id) {
        m2.push(k)
      }
    }
  })
  // 过滤颜色
  m2.forEach(v => {
    for (let k of inc) {
      if (v.Id === k.Packets[0]) {
        let opts = k.Options
        v.Properties.Options = v.Properties.Options.filter(j => {
          for (let item of opts) {
            if (j.Property.OptionId === item) {
              return j
            }
          }
        })
        break
      }
    }
  })
  // 暂时没有处理无卡画
  
  // 针对长宽不同的卡纸, 做一个旋转操作
  return [...m1, ...m2]
}
// 过滤尺寸
export let filterSize = () => {

}

// 图片序列化, 将后台所需要的图片格式转成我们项目中所需要的数据格式

export let picVersaSerialization = (pictures) => {
  let p
  if (Array.isArray(pictures)) {
    if (Array.isArray(pictures[0])) {
      p = pictures[0][0]
    } else {
      p = pictures[0]
    }
  } else {
    p = pictures
  }
  let _p = {
    DPI: p.DPI,
    Image: {
      File: p.ImageFile,
      Id: p.ImageId,
      Info: {
        Rotate: p.Rotate
      },
      Shape: 'horizontal'
    },
    Rotate: p.Rotate,
    Index: p.Index,
    Output: p.OutPut ? p.OutPut : p.Output,
    ScaleX: p.ScaleX,
    ScaleY: p.ScaleY,
    TranslateX: p.TranslateX,
    TranslateY: p.TranslateY
  }
  return [_p]
}

/**
 * 根据entrys过滤出当前卡纸所需要的尺寸
 * @param {Array || Object} sizes 已经合并好的尺寸 
 * @param {Array} entrys 对应卡纸entrys组成的数组 
 */
export let filterFramesSize = (sizes, entrys) => {
  let s
  let r = []
  // 判断是否是数组,如果是数组表示是已经合并好方向的尺寸,如果是对象则是需要我们将它做一次合并
  if (sizes.constructor == Array) {
    s = sizes
  } else if (sizes.constructor === Object) {
    // 做一个合并操作
    s = []
    for (let i in sizes) {
      s = [...s, ...sizes[i]]
    }
  }
  entrys.forEach(item => {
    let flag = item.CategoryId // 标识是无卡画还是有卡画
    // 如果是单孔画
    if (flag === dc.Frame) {
      // 首先先找到原始的尺寸
      let size = item.Decorative.Size
      for (let k of s) {
        if (k[0] === size[0] && k[1] === size[1]) {
          r.push(k)
        }
      }
    } else if (flag === dc.Matless || flag === dc.Rimless || flag === dc.Magnet) {
      let size = item.Decorative.Size
      for (let k of s) {
        if (k[0] === size[0] && k[1] === size[1]) {
          r.push(k)
        }
      }
    }
  })
  console.log(r)
  return r
}

/**
 * 给传入的物料id做排序,合并后id为8的排在最前面
 * @param {Array} catList 包含物料id的数组,每一个值为number类型 
 */
export let formCategoryList = (catList) => {
  if (!Array.isArray(catList)) return false
  for (let i = 0; i < catList.length; i++) {
    if (catList[i] === dc.Frames && catList.indexOf(catList[i]) !== 0) {
      let k = catList[0]
      catList[0] = catList[i]
      catList[i] = k
      break
    }
  }
  return catList
}