/* eslint-disable */
// Copyright 2016 Chen Xianren. All rights reserved.

//  import { getViewportWidth, getViewportHeight} from 'scripts/utils/screen'
import { getRealPxSize, getMmSize } from '../image'
import { DecorativeCategories as dc, MaterialTypes as mt, dt, notHandledCatList,
  MinCanvasLength, MaxCanvasLength, CanvasPadding, dpis } from 'scripts/utils/custom/consts.js'

export function rejectImage(src) {
  console.error(src)
//  openDialog({
//    title: '加载图片失败',
//    noBtn: '知道了',
//    slot: src
//  })
}

const max = Math.max
const min = Math.min

export function getThumbnailLength(l = 480, a = [120, 240, 480, 720, 960]) {
  a = a.slice().sort()
  for (let i of a) {
    if (l <= i) return i
  }
  return a[a.length - 1]
}

export function zeroArray(length = 4, fill = 0) {
  return new Array(length).fill(fill)
}

export function indexOfProperty(a, v, k = 'Type') {
  for (let i = 0; i < a.length; i++) {
    if (a[i][k] === v) {
      return i
    }
  }

  return -1
}
export function getTypes(categoryId) {
  return dt.has(categoryId) ? dt.get(categoryId).slice() : [mt.Template]
}

export function getByProperty(a, v, k) {
  return a[indexOfProperty(a, v, k)]
}

export function setByProperty(a, v, k = 'Type') {
  let i = indexOfProperty(a, v[k], k)
  if (i >= 0) Vue.set(a, i, v)
}

export function cleanBlank(s, a) {
  if (s && a) {
    let x = s[0] / 3
    let y = s[1] / 3
    return a.map((v, k) => Math.floor(max(
      0, min(v, k % 2 === 0 ? y : x))))
  }
}

export function equalOption(a, b, p = false) {
  if (p) {
    a = a && a.Property
    b = b && b.Property
  }
  return a && b && a.OptionId === b.OptionId &&
    a.Key === b.Key && a.Value === b.Value
}

export function equalSize(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1]
}

export function similarSize(a, b) {
  return equalSize(a, b) || equalSize(swapSize(a), b)
}

export function formatSize(s) {
  if (s) return (s[0] / 10) + 'x' + (s[1] / 10) + 'cm'
}

export function sizeShape(s) {
  if (s) {
    if (s[0] < s[1]) return 'v'
    if (s[0] > s[1]) return 'h'
    return 's'
  }
}
export function categoryPath(categoryId) {
  let a = [categoryId]
  if (isDecorate(categoryId)) {
    switch (categoryId) {
      case dc.Decorate:
        break
      case dc.Frames:
        a.push(dc.Decorate)
        break
      default:
        if (isFrames(categoryId)) a.push(dc.Frames)
        a.push(dc.Decorate)
        break
    }
  }
  return a
}

/**
  * 判断是否为装饰画
  * @param  {Number}  categoryId 品类编号
  * @return {Boolean}            是否为装饰画
  */
export function isDecorate(categoryId) {
  let dcList = Object.values(dc)
  return dcList.indexOf(categoryId) > -1
}

/**
 * 判断是否为有框画品类，有框画包括：单孔画，无卡画，多孔画，有框画
 * @param  {Number}  categoryId 品类编号
 * @return {Boolean}            是否为有框画品类
 */
export function isFrames(categoryId) {
  let frameList = [dc.Frame, dc.Matless, dc.MultiHole, dc.Frames]
  return frameList.indexOf(categoryId) >= 0
}


export function copySize(s) {
  if (s) return [s[0], s[1]]
}

export function swapSize(s) {
  if (s) return [s[1], s[0]]
}

export function addUnit(n, u = 'px') {
  return Math[n < 0 ? 'ceil' : 'floor'](n) + u
}

export function isColor(s) {
  return s[0] === '#'
}

export function parseImageSize(image) {
  let s = parseSize(image.File)
  return image.Info.Rotate / 90 % 2 === 1 ? swapSize(s) : s
}

export function parseSize(s) {
  let i = s.indexOf('-')
  let j = s.slice(i).indexOf('x')
  let w = parseInt(s.slice(i + 1, i + j))
  let h = parseInt(s.slice(i + j + 1, isColor(s) ? s.length : s.indexOf('.')))
  return [w, h]
}

export function strMapToJson(strMap) {
  // map转JSON
  let json = []
  for (let [k, v] of strMap) {
    let obj = Object.create(null)
    obj[k] = v
    json.push(obj)
  }
  return json
}

export function objToStrMap(obj) {
  // 对象转map
  let strMap = new Map()
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k])
  }
  return strMap
}

export function invalidSize(item, image) {
  let cat = item.category
  let sizes = item.sizes
  let res = {}
  let imageSizePx = getRealPxSize(image.File)
  let imageSizeMm = getMmSize(imageSizePx, dpis[cat])
  let fSizes
  let frSizes
  let shape = sizeShape(imageSizeMm)
  let defSizes = []
  let minDif
  let def
  switch (cat) {
    case 'Frame':
      //   有框画按照Hole的size计算
      let holeSizes = item.holeSizes
      frSizes = sizes[shape]
      fSizes = _.map(holeSizes[shape], 'holeSize')
      break
    case 'Rimless':
      console.log(imageSizeMm)
      fSizes = sizes[shape]
      break
    default :
      fSizes = sizes
  }
  _.each(fSizes, (s, i) => {
    if (imageSizeMm[0] > s[0] && imageSizeMm[1] > s[1]) {
      let thisDif = imageSizeMm[0] + imageSizeMm[1] - s[0] - s[1]
      let ns
      if (cat === 'Frame') {
        ns = frSizes[i]
      } else {
        ns = s
      }
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

