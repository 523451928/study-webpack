// Copyright 2016 CHEN Xianren. All rights reserved.

let i = 0
export const DecorativeCategories = {
  Frame: ++i,
  Rimless: ++i,
  PhotoWall: ++i,
  Scroll: ++i,
  Poster: ++i,
  Matless: ++i,
  MultiHole: ++i,
  Frames: ++i,
  Decorate: ++i
}

export const product = {code: 'product', name: '产品'}
const size = {code: 'size', name: '尺寸'}
const mat = {code: 'mat', name: '卡纸'}
const line = {code: 'line', name: '画框'}
const paper = {code: 'paper', name: '画纸'}
const glass = {code: 'glass', name: '玻璃'}
const canvas = {code: 'canvas', name: '画布'}
const template = {code: 'template', name: '模板'}
const texture = {code: 'texture', name: '材质'}
const blank = {code: 'blank', name: '白边'}

const dc = DecorativeCategories
export const tabs = new Map()
tabs.set(dc.Frame, [line, mat, paper, glass])
tabs.set(dc.Rimless, [size, line, canvas])
tabs.set(dc.PhotoWall, [template])
tabs.set(dc.Scroll, [template, canvas])
tabs.set(dc.Poster, [size, texture, blank])
tabs.set(dc.Matless, [size, line, paper, glass])
tabs.set(dc.MultiHole, [line, mat, paper, glass])
tabs.set(dc.Frames, [line, mat, paper, glass])
tabs.set(dc.Decorate, [])

export function isFrames(categoryId) {
  return [dc.Frame, dc.Matless, dc.MultiHole, dc.Frames].indexOf(categoryId) >= 0
}

export function isDecorate(categoryId) {
  for (let p in dc) {
    if (dc.hasOwnProperty(p) && categoryId === dc[p]) return true
  }
  return false
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

i = 0
export const MaterialTypes = {
  Line: ++i,
  Mat: ++i,
  Size: ++i,
  Paper: ++i,
  Glass: ++i,
  InnerLine: ++i,
  OuterLine: ++i,
  Canvas: ++i,
  Template: ++i
}

const mt = MaterialTypes
const dt = new Map()
dt.set(dc.Frame, [mt.Line, mt.Mat, mt.Paper, mt.Glass])
dt.set(dc.Rimless, [mt.Size, mt.InnerLine, mt.OuterLine, mt.Canvas])
dt.set(dc.PhotoWall, [mt.Template])
dt.set(dc.Scroll, [mt.Template, mt.Canvas])
dt.set(dc.Poster, [mt.Size, mt.Paper, mt.Canvas])
dt.set(dc.Matless, [mt.Size, mt.Line, mt.Paper, mt.Glass])
dt.set(dc.MultiHole, [mt.Line, mt.Mat, mt.Paper, mt.Glass])
dt.set(dc.Frames, [mt.Size, mt.Line, mt.Mat, mt.Paper, mt.Glass])

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
  Auto: i++,
  Once: i++,
  Always: i++
}

export const ListParam = {
  Count: 12
}

export const PicParm = {
  ScaleMax: 500,
  ScaleMin: 20
}

export const Canvas = {
  Custom: 520,
  Cart: 180,
  ProRow: 248,
  WorkRow: 200,
  ProBox: 520,
  ProDetail: 520,
  OrderList: 200
}
