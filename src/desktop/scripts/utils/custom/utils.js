// Copyright 2016 Chen Xianren. All rights reserved.

import { getViewportWidth, getViewportHeight } from 'scripts/utils/screen.js'
import { DecorativeCategories as dc, MaterialTypes as mt, dt, notHandledCatList,
  MinCanvasLength, MaxCanvasLength, CanvasPadding } from 'scripts/utils/custom/consts.js'

const { min, max } = Math

export function rejectImage(src) {
  layer.toast(src)
}

export function getCanvasLength() {
  return max(MinCanvasLength, min(MaxCanvasLength,
    getViewportWidth() - CanvasPadding, getViewportHeight() - CanvasPadding))
}

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

/**
 * 返回给定值所在目标数组中符合k:v键值对的对象元素的索引
 * @param  {Array} a          Array
 * @param  {String} v          Value
 * @param  {String} [k='Type'] Key
 * @return {Number}            Array->index,如没有找到则返回-1.
 */
export function indexOfProperty(a, v, k = 'Type') {
  for (let i = 0; i < a.length; i++) {
    if (a[i][k] === v) return i
  }
  return -1
}

/**
 * 通过给定的值查询到(由对象组成)数组中符合k:v键值对的对象元素，并返回查询到的对象。
 * @param  {Array} a Array
 * @param  {String} v Value
 * @param  {String} k key
 * @return {Object}   返回数组中查询到的对象元素；
 *                    如果都没有符合给定键值对的对象，则返回a[-1]:undefined
 */
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

/**
 * 通过一个存放尺寸信息的数组返回是何形状
 * @param  {Array} s 存放尺寸信息的数组
 * @return {String}   return三种结果：v->竖向;h->横向;s->方形
 */
export function sizeShape(s) {
  if (s) {
    if (s[0] < s[1]) return 'v'
    if (s[0] > s[1]) return 'h'
    return 's'
  }
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

export function isColor(str) {
  return str && str[0] === '#'
}

/**
 * 通过符合格式的文件名字符串返回该文件尺寸信息的数组
 * @param  {String} s 符合格式的文件名: hash-widthxheight.(jpg|png)
 * @return {Array}   返回该文件的尺寸信息，返回形式为数组[width,height]
 */
export function parseSize(s) {
  let i = s.indexOf('-')
  let j = s.slice(i).indexOf('x')
  let w = parseInt(s.slice(i + 1, i + j))
  let h = parseInt(s.slice(i + j + 1, isColor(s) ? s.length : s.indexOf('.')))
  return [w, h]
}

export function parseImageSize(image) {
  let s = parseSize(image.File)
  return image.Info.Rotate / 90 % 2 === 1 ? swapSize(s) : s
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
/**
 * 在产品页面判断该品类是否不要处理
 * @param  {Number}  categoryId 品类编码
 * @return {Boolean}            是否不要处理
 */
export function isNotHandledCat(categoryId) {
  return notHandledCatList.indexOf(categoryId) >= 0
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

 /**
  * 判断是否为装饰画
  * @param  {Number}  categoryId 品类编号
  * @return {Boolean}            是否为装饰画
  */
export function isDecorate(categoryId) {
  let dcList = Object.values(dc)
  return dcList.indexOf(categoryId) > -1
}

export function getTypes(categoryId) {
  return dt.has(categoryId) ? dt.get(categoryId).slice() : [mt.Template]
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

// 处理反序列化图片数据
export function reversePicturesData(pictures) {
  // 因为Pictures是二维数组,我们处理数据只需要拿到他第0项的第1张图就可以
  let p = pictures[0][0]
  let _p = [
    {
      DPI: p['DPI'],
      Image: {
        File: p['ImageFile'],
        Id: p['ImageId'],
        Info: {
          Rotate: p['Rotate'],
          Colorspace: false,
          Resolution: true,
          ScaleX: 1,
          ScaleY: 1
        },
        Shape: 'horizontal'
      },
      Index: p['Index'],
      Output: p['Output'],
      Rotate: p['Rotate'],
      ScaleX: p['ScaleX'],
      ScaleY: p['ScaleY'],
      TranslateX: p['TranslateX'],
      TranslateY: p['TranslateY']
    }
  ]
  return _p
}
// 处理反序列化的entrt数据
export function resolveEntry(o) {
  if (Object.getOwnPropertyNames(o).length > 0) {
    let _e = {
      CategoryId: o['CategoryId'],
      Decorative: o['Decorative'],
      Displays: o['Displays'],
      Icon: o['Icon'],
      Id: o['Id'],
      Materials: o['Materials'],
      Name: o['Name'],
      Options: o['Options'],
      ProductId: o['ProductId'],
      Properties: o['Properties'],
      Selects: o['Selects'] ? o['Selects'] : [],
      Price: o['Price'] ? o['Price'] : -1
    }
    return _e
  } else {
    return false
  }
}

/**
 * 得到品类相应的归类
 * @param  {number} id 品类编号
 * @return {string}    归类结果
 */
export function getSortPicById(id) {
  if (!(/^\d/g.test(id))) {
    throw new Error('invalid parameter!')
  }
  let catId = parseInt(id)
  let sortPic = ''
  switch (catId) {
    case 1:
    case 2:
    case 4:
    case 8:
      sortPic = 'frames' // 装饰画
      break
    case 11:
    case 12:
      sortPic = 'furniture' // 家具用品
      break
    case 14:
    case 15:
    case 16:
      sortPic = 'shirt' // T恤
      break
    case 10:
    case 18:
      sortPic = 'digital' // 电子产品
      break
    case 17:
      sortPic = 'fashion' // 时尚佩饰
      break
    case 19:
      sortPic = 'wencuang' // 文创用品
      break
    default:
      sortPic = 'frames'
  }
  return sortPic
}
