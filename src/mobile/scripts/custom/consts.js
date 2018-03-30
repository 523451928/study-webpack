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
  Decorate: ++i,
  Magnet: 24
}

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
  Line: ++i,  //  画框
  Mat: ++i, //  卡纸
  Size: ++i,  //  尺寸
  Paper: ++i, //  画纸
  Glass: ++i, //  玻璃
  InnerLine: ++i,
  OuterLine: ++i,
  Canvas: ++i,
  Template: ++i,
  MagnetLine: ++i
}

const dc = DecorativeCategories
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
  Auto: i++,
  Once: i++,
  Always: i++
}
