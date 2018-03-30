/* eslint-disable */
// Copyright 2016 CHEN Xianren. All rights reserved.

// 品类编码 categoryId <=> Name
export const catNameIdMap = [
  {
    id: 1,
    cnName: '单孔画',
    enName: 'frame'
  },
  {
    id: 2,
    cnName: '布艺画',
    enName: 'rimless'
  },
  {
    id: 3,
    cnName: '照片墙',
    enName: 'photoWall'
  },
  {
    id: 4,
    cnName: '卷轴画',
    enName: 'scroll'
  },
  {
    id: 5,
    cnName: '海报',
    enName: 'poster'
  },
  {
    id: 6,
    cnName: '无卡画',
    enName: 'matless'
  },
  {
    id: 7,
    cnName: '多孔画',
    enName: 'multiHole'
  },
  {
    id: 8,
    cnName: '有框画',
    enName: 'frames'
  },
  {
    id: 10,
    cnName: 'iPhone壳',
    enName: 'case'
  },
  {
    id: 11,
    cnName: '抱枕',
    enName: 'bolster'
  },
  {
    id: 12,
    cnName: '旅行杯',
    enName: 'cup'
  },
  {
    id: 14,
    cnName: '男士T恤',
    enName: 'shirtMan'
  },
  {
    id: 15,
    cnName: '女士T恤',
    enName: 'shirtWoman'
  },
  {
    id: 16,
    cnName: '儿童T恤',
    enName: 'shirtChild'
  },
  {
    id: 17,
    cnName: '帆布包',
    enName: 'bag'
  },
  {
    id: 18,
    cnName: 'iPad壳',
    enName: 'pad'
  },
  {
    id: 19,
    cnName: '笔记本',
    enName: 'notebook'
  },
  {
    id: 20,
    cnName: '拼图',
    enName: 'puzzle'
  },
  {
    id: 21,
    cnName: '挂钟',
    enName: 'clock'
  },
  {
    id: 24,
    cnName: '磁贴画',
    enName: 'magnet'
  }
]

export const catgoryIdList = catNameIdMap.map(item => item.id)
export const categoryNameList = catNameIdMap.map(item => item.enName)

export const product = {code: 'product', name: '产品'}
const size = {code: 'size', name: '尺寸'}
const mat = {code: 'mat', name: '卡纸'}
const line = {code: 'line', name: '画框'}
const paper = {code: 'paper', name: '画纸'}
const canvas = {code: 'canvas', name: '画布'}
const texture = {code: 'texture', name: '材质'}
const template = {code: 'template', name: '模板'}
const glass = {code: 'glass', name: '玻璃'}
const outerLine = {code: 'outerLine', name: '外框'}
const innerLine = {code: 'innerLine', name: '内框'}
const magnetLine = {code: 'magnetLine', name: '画框'}
const blank = {code: 'blank', name: '白边'}

export const DecorativeCategories = {
  Frame: 1, // :单孔画
  Rimless: 2, // 布艺画
  PhotoWall: 3, // 照片墙
  Scroll: 4, // 滚轴画
  Poster: 5, // 海报
  Matless: 6, // :无卡画
  MultiHole: 7, // 多孔画
  Frames: 8, // :有框画
  Decorate: 9, // 装饰画 父类
  Magnet: 24 // :磁贴画
}
const dc = DecorativeCategories

export const notDisplayCatIdList = [dc.Frame, dc.PhotoWall, dc.Poster, dc.Matless, dc.MultiHole]
// 在产品页面不处理相应的品类
export const notHandledCatList = [dc.PhotoWall, dc.Poster, dc.Matless, dc.MultiHole, dc.Frames, dc.Decorate]

export let tabs = new Map()
tabs.set(dc.Frame, [line, mat, paper, glass])
tabs.set(dc.Rimless, [size, line, canvas])
tabs.set(dc.Magnet, [size, line, canvas])
tabs.set(dc.PhotoWall, [template])
tabs.set(dc.Scroll, [template, canvas])
tabs.set(dc.Poster, [size, texture, blank])
tabs.set(dc.Matless, [line, mat, paper, glass])
tabs.set(dc.MultiHole, [line, mat, paper, glass])
tabs.set(dc.Frames, [line, mat, paper, glass])
tabs.set(dc.Decorate, [])

//  建议上传尺寸
export let SuggestSize = new Map()
SuggestSize.set(dc.Frame, '1580 x 1580')
SuggestSize.set(dc.Frames, '1580 x 1580')
SuggestSize.set(dc.Rimless, '1120 x 1120')
SuggestSize.set(dc.Scroll, '1120 x 1660')
SuggestSize.set('pro', '400 x 400')

export let tabsProduct = new Map()
tabsProduct.set(dc.Frame, [line, mat, paper, glass])
tabsProduct.set(dc.Frames, [line, mat, paper, glass])
tabsProduct.set(dc.Rimless, [size, outerLine, innerLine, canvas])
tabsProduct.set(dc.Magnet, [size, magnetLine, canvas])
tabsProduct.set(dc.Scroll, [template, canvas])
tabsProduct.set(dc.PhotoWall, [template])
tabsProduct.set(dc.Poster, [size, texture, blank])
tabsProduct.set(dc.Matless, [size, line, paper, glass])
tabsProduct.set(dc.MultiHole, [line, mat, paper, glass])
tabsProduct.set(dc.Decorate, [])

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

export function categoryPath(categoryId) {
  let a = [categoryId]
  if (isDecorate(categoryId)) {
    switch (categoryId) {
      case dc.Decorate:
        break
      case dc.Frames: // 有框画
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

let i = 0
export const MaterialTypes = {
  Line: ++i, // 1
  Mat: ++i, // 2
  Size: ++i, // 3
  Paper: ++i, // 4
  Glass: ++i, // 5
  InnerLine: ++i, // 6
  OuterLine: ++i, // 7
  Canvas: ++i, // 8
  Template: ++i, // 9
  MagnetLine: ++i // 10
}

const mt = MaterialTypes
export let dt = new Map()
dt.set(dc.Frame, [mt.Line, mt.Mat, mt.Paper, mt.Glass])
dt.set(dc.Frames, [mt.Size, mt.Line, mt.Mat, mt.Paper, mt.Glass])
dt.set(dc.Rimless, [mt.Size, mt.OuterLine, mt.InnerLine, mt.Canvas]) // 去除内框：mt.InnerLine
dt.set(dc.PhotoWall, [mt.Template])
dt.set(dc.Scroll, [mt.Template, mt.Canvas])
dt.set(dc.Poster, [mt.Size, mt.Paper, mt.Canvas])
dt.set(dc.Matless, [mt.Size, mt.Line, mt.Paper, mt.Glass])
dt.set(dc.MultiHole, [mt.Line, mt.Mat, mt.Paper, mt.Glass])
dt.set(dc.Magnet, [mt.Size, mt.MagnetLine, mt.Canvas])

export function getTypes(categoryId) {
  return dt.has(categoryId) ? dt.get(categoryId).slice() : [mt.Template]
}

i = 0
export const Angles = {
  Up: i++,
  Down: i++,
  Left: i++,
  Right: i++
}

export const Degrees = [0, 180, 270, 90]
export const Directions = ['N', 'S', 'W', 'E']

i = 0
export const DisplayTypes = {
  Default: i++,
  Edit: i++,
  List: i++
}

i = 0
export const StackLines = {
  Inner: i++,
  Outer: i++,
  Both: i++
}

i = 0
export const Fulls = {
  Auto: i++, // 0
  Once: i++, // 1
  Always: i++ // 2
}

export const ListParam = {
  // 物料分页规定每页显示的数量
  Count: 12
}

export const PicParm = {
  ScaleMax: 500,
  ScaleMin: 20
}

export const Canvas = {
  Custom: 430, // 原尺寸为520
  Cart: 180,
  ProRow: 248,
  WorkRow: 200,
  MobileWorkRow: 148,
  MobileLikeRow: 160,
  ProBox: 520,
  ProDetail: 520,
  OrderList: 200
}

export const InitBonus = 20 // 初始化分成

export const proBomsCount = 6
// util.js中使用的常量
export const MinCanvasLength = 240

export const MaxCanvasLength = 960

export const CanvasPadding = 15 * 2

//  TYPE 1类型 2标签 3颜色
export const tagsIdMap = {
  1: 'type',
  2: 'tag',
  3: 'color'
}

export const DefaultSize = [400, 400]

// jxc
// 每个品类对应的导航栏
export const headerMap = new Map()
headerMap.set(9, '装饰画')
headerMap.set(8, '装饰画')
headerMap.set(6, '装饰画')
headerMap.set(7, '装饰画')
headerMap.set(1, '装饰画')
headerMap.set(2, '装饰画')
headerMap.set(3, '装饰画')
headerMap.set(4, '装饰画')
headerMap.set(5, '装饰画')
headerMap.set(24, '装饰画')
headerMap.set(11, '家居用品')
headerMap.set(20, '家居用品')
headerMap.set(12, '家居用品')
headerMap.set(20, '家居用品')
headerMap.set(13, 'T恤')
headerMap.set(14, 'T恤')
headerMap.set(15, 'T恤')
headerMap.set(16, 'T恤')
headerMap.set(10, '电子产品')
headerMap.set(18, '电子产品')
headerMap.set(17, '时尚配饰')
headerMap.set(19, '文教用品')

// jxc 每个品类对应的合适的图片尺寸
export let categoryImgSize = new Map()
categoryImgSize.set(4, '1120像素×1660像素')
categoryImgSize.set(11, '1360像素×1360像素')
categoryImgSize.set(14, '400像素×400像素')
categoryImgSize.set(15, '400像素×400像素')
categoryImgSize.set(16, '400像素×400像素')
categoryImgSize.set(17, '400像素×400像素')
categoryImgSize.set(2, '1120像素×1120像素')
categoryImgSize.set(12, '400像素×400像素')
categoryImgSize.set(10, '280像素×560像素')
categoryImgSize.set(19, '505像素×760像素')
categoryImgSize.set(20, '1100像素×1100像素')
categoryImgSize.set(21, '805像素×1155像素')
categoryImgSize.set(19, '505像素×760像素')
categoryImgSize.set(18, '570像素×800像素')
categoryImgSize.set(8, '1580像素×1580像素')
categoryImgSize.set(1, '1580像素×1580像素')
categoryImgSize.set(6, '1580像素×1580像素')
categoryImgSize.set(7, '1580像素×1580像素')

// 根据子品类, 返回父品类的id
export let parentCatId = (id) => {
  let parentId
  switch(id){
    case dc.Frames:
    case dc.Frame:
    case dc.Matless:
    case dc.MultiHole:
      parentId = dc.Frames
      break
    default:
      parentId = id
      break
  }
  return parentId
}





















