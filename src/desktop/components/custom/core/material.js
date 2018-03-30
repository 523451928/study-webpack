// Copyright 2016 Chen Xianren. All rights reserved.

import { DecorativeCategories as dc, MaterialTypes as mt } from 'scripts/utils/custom/consts.js'
import { isFrames, isDecorate, categoryPath, getTypes } from 'scripts/utils/custom/utils.js'

let materials = []
let types = new Map()

function filterMaterials(categoryId) {
  let a = categoryPath(categoryId)
  let b = getTypes(categoryId)
  if (categoryId === dc.Frames) a.push(dc.Frame, dc.Matless, dc.MultiHole)
  return Promise.resolve(materials.filter(i => {
    switch (i.Type) {
      case mt.Size:
        return i.Categories && i.Categories.indexOf(
          categoryId === dc.Frames ? dc.Matless : categoryId) >= 0
      case mt.Paper:
      case mt.Canvas:
        let p = i.Properties
        return p && p.Categories && p.Categories.indexOf(
          isFrames(categoryId) ? dc.Frames : categoryId) >= 0
    }
    return a.indexOf(i.CategoryId) >= 0 && (isDecorate(categoryId)
      ? b.indexOf(i.Type) >= 0 : !i.hasOwnProperty('Type'))
  }))
}

function filterTypes(categoryId) {
  let a = getTypes(categoryId)
  for (let k = 0; k < a.length; k++) {
    let v = a[k]
    if (types.has(v)) {
      let s = types.get(v)
      let y = true
      switch (v) {
        case mt.Mat:
          y = s.has(categoryId) || s.has(dc.Frames) ||
            (s.has(dc.Frame) && s.has(dc.MultiHole))
          break
        case mt.Template:
          y = s.has(categoryId)
          break
      }
      if (y) {
        a.splice(k, 1)
        k--
      }
    }
  }
  return a
}

export function allMaterials(categoryIds) {
  let p = Promise.resolve(categoryIds.length)
  let a = []
  categoryIds.forEach(categoryId => {
    p = p.then(() => getMaterials(categoryId))
    a.push(p)
  })
  return Promise.all(a)
}

export function getMaterials(categoryId) {
  let a = filterTypes(categoryId)
  if (a.length === 0) return filterMaterials(categoryId)
  let id = categoryId
  if (id === dc.Frames && a.indexOf(mt.Mat) >= 0 && types.has(mt.Mat)) {
    let s = types.get(mt.Mat)
    if (s.has(dc.Frame)) {
      id = dc.MultiHole
    } else if (s.has(dc.MultiHole)) {
      id = dc.Frame
    }
  }

  return request.list('material', {
    params: {CategoryId: id, Type: a}
  }).then(res => {
    for (let i of a) {
      types.has(i) ? types.get(i).add(categoryId)
      : types.set(i, new Set([categoryId]))
    }
    // materials = res.data
    materials = materials.concat(res.data)
    return filterMaterials(categoryId)
  })
}
