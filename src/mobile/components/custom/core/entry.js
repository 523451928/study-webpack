// Copyright 2016 Chen Xianren. All rights reserved.

import { DecorativeCategories as dc, MaterialTypes as mt,
  Angles, StackLines as sl, DefaultSize } from 'scripts/utils/custom/consts.js'
import { zeroArray, indexOfProperty, getByProperty, setByProperty,
  cleanBlank, equalOption, equalSize, similarSize, copySize, isDecorate, getTypes } from 'scripts/utils/custom/utils.js'
import { allMaterials } from './material'
import { ngParamSerializer } from 'scripts/tools/_serializer'

function alert(title) {
  layer.toast({
    title: title + '(T_T)',
    noBtn: '知道了',
    slot: Array.prototype.slice.call(arguments, 1).filter(
      v => !!v).join(', ')
  })
}

export function zeroEntry(categoryId = 0) {
  return {
    CategoryId: categoryId,
    ProductId: 0,
    Properties: [],
    Materials: [],
    Options: [],
    Decorative: {
      Size: zeroArray(2),
      Angle: Angles.Up,
      Stack: 0,
      Blank: zeroArray()
    }
  }
}

export function freshEntry(materials, entry) {
  return isDecorate(entry.CategoryId) ? freshDecorative(materials, entry)
    : freshProduct(materials, entry)
}

export function freshProductOptions(o, p) {
  let a = []
  let f = i => indexOfProperty(a, i.Key, 'Key') === -1 && a.push(i)
  if (o.length > 0) {
    for (let i of p.Properties) {
      if (o.indexOf(i.OptionId) >= 0) f(i)
    }
  }
  for (let i of p.Properties) f(i)
  return a
}

function freshProduct(materials, entry) {
  const ci = entry.CategoryId
  const pi = entry.ProductId
  let p = materials[0]

  if (pi) {
    for (let i of materials) {
      if (i.Id === pi) {
        p = i
        break
      }
    }
  }

  if (p && p.CategoryId === ci) {
    return [{
      Type: 'product',
      product: p,
      options: freshProductOptions(entry.Options, p)
    }]
  }

  alert('没有找到产品哦', `category: ${ci}`, pi && `product: ${pi}`)
}

function freshSize(s, a = []) {
  let x, i
  for (i of a) {
    if (i.Type === mt.Size) {
      if (similarSize(i.Size, s)) {
        x = copySize(s)
        break
      } else if (!x || (!similarSize(x, DefaultSize) &&
        similarSize(i.Size, DefaultSize))) {
        x = copySize(i.Size)
      }
    }
  }
  if (x) return {Type: mt.Size, Size: x}
}

function freshMaterial(t, a = [], ids = []) {
  let x, i
  for (i of a) {
    if (i.Type === t) {
      if (ids.length === 0 || ids.indexOf(i.Id) >= 0) {
        x = i
        break
      } else if (!x) {
        x = i
      }
    }
  }
  if (x) return x
}

export function freshMatOptions(a, b = []) {
  let c = []
  if (a && a.length > 0) {
    let o, i, j
    for (i of b) {
      o = false
      for (j of a) {
        if (equalOption(i, j, true)) {
          o = true
          c.push(j)
          break
        }
      }
      if (!o) c.push(a[0])
    }
    if (c.length === 0) c.push(a[0])
  }
  return c
}

export function freshScrollCanvas(a, materials) {
  let t = getByProperty(a, mt.Template)
  let c = getByProperty(a, mt.Canvas)
  let b = t.Properties.Materials
  if (b.length > 0) {
    if (c.Id && b.indexOf(c.Id) >= 0) return
    for (c of materials) {
      if (c.Type === mt.Canvas && b.indexOf(c.Id) >= 0) {
        setByProperty(a, c)
        return
      }
    }
    alert('没有找到卷轴画画布哦', `template: ${t.Id}`)
  }
}

function freshDecorative(materials, entry, fix) {
  let ci = entry.CategoryId
  let cs = `category: ${ci}`
  switch (ci) {
    case dc.PhotoWall:
    case dc.Frames:
    case dc.Decorate:
      alert('品类不正确哦', cs)
      return
  }

  let o, i, j
  let ids = entry.Materials
  let d = entry.Decorative
  let z = equalSize(d.Size, [0, 0])
  let a = getTypes(ci)
  let b = a.map(v => {
    switch (v) {
      case mt.Size:
        if (fix) return {Type: mt.Size, Size: copySize(fix)}
        s = freshSize(d.Size, materials)
        if (s) return s
        s = z ? DefaultSize : d.Size
        alert('没有找到尺寸哦', cs, `size: ${s.join('x')}`)
        break
      case mt.Mat:
        let f = s => {
          return v => similarSize(v.Properties.Size, s)
        }
        let s = fix || (!z && d.Size)
        o = materials.filter(v => v.Type === mt.Mat && v.CategoryId === ci)
        i = s ? o.filter(f(s)) : []
        if (ids.length > 0) {
          j = (fix || i.length > 0 ? i : o).filter(v => ids.indexOf(v.Id) >= 0)
        } else {
          j = []
        }
        if (fix) {
          o = j.length > 0 ? j[0] : i[0]
        } else {
          if (i.length === 0) {
            s = DefaultSize
            i = o.filter(f(s))
          }
          o = j.length > 0 ? j[0] : (i.length > 0 ? i[0] : o[0])
        }
        if (o) {
          i = equalSize(o.Properties.Size, s) ? [Angles.Up, Angles.Down]
            : [Angles.Left, Angles.Right]
          i = i.indexOf(d.Angle) >= 0 ? d.Angle : i[0]
          j = freshMatOptions(o.Properties.Options, entry.Options)
          return {Type: 'mat', mat: o, angle: i, options: j}
        }
        alert('没有找到卡纸哦', cs, s && `size: ${s.join('x')}`)
        break
      default:
        s = freshMaterial(v, materials, ids)
        if (s) return s
        o = []
        switch (ci) {
          case dc.Rimless:
            o.push(mt.InnerLine, mt.OuterLine)
            break
          case dc.Magnet:
            o.push(mt.MagnetLine)
            break
          case dc.Poster:
            o.push(mt.Paper, mt.Canvas)
            break
        }
        if (o.indexOf(v) === -1) alert('没有找到物品哦', cs, `type: ${v}`)
        break
    }
  })
  switch (ci) {
    case dc.Rimless:
      i = b[a.indexOf(mt.InnerLine)]
      j = b[a.indexOf(mt.OuterLine)]
      if (i && j) {
        switch (d.Stack) {
          case sl.Both:
            break
          case sl.Outer:
            i = null
            break
          case sl.Inner:
          default:
            j = null
            break
        }
      } else if (!i && !j) {
        alert('没有找到画框哦', cs)
        return
      }
      b.push({
        Type: 'line',
        inner: i || {Type: mt.InnerLine},
        outer: j || {Type: mt.OuterLine}
      })
      b = b.filter(v => [mt.InnerLine, mt.OuterLine].indexOf(v.Type) === -1)
      break
    case dc.Magnet:
      i = b[a.indexOf(mt.MagnetLine)]
      if (!i) {
        alert('没有找到画框哦', cs)
        return
      }
      b.push({
        Type: mt.MagnetLine,
        magnet: i || {Type: mt.MagnetLine}
      })
      b.splice(1, 1)
      break
    case dc.Scroll:
      freshScrollCanvas(b, materials)
      break
    case dc.Poster:
      i = b[a.indexOf(mt.Paper)]
      j = b[a.indexOf(mt.Canvas)]
      if (i && ids.indexOf(i.Id) >= 0) {
        o = i
      } else if (j && ids.indexOf(j.Id) >= 0) {
        o = j
      } else if (i) {
        o = i
      } else if (j) {
        o = j
      } else {
        alert('没有找到材质哦', cs)
        return
      }
      b.push({
        Type: 'texture',
        Value: o})
      b.push({
        Type: 'blank',
        Value: cleanBlank(b[a.indexOf(mt.Size)].Size, d.Blank)})
      b = b.filter(v => [mt.Paper, mt.Canvas].indexOf(v.Type) === -1)
      break
  }

  return b
}

export function freshPhotoWall(template, entries = []) {
  return new Promise((resolve, reject) => {
    let photos = template.Properties.Photos
    if (!photos) {
      return []
    }
    allMaterials(photos.map(v => v.CategoryId)).then(data => {
      let i, p, s, d, a, e
      for (i = 0; i < photos.length; i++) {
        p = photos[i]
        s = p.Hole.slice(0, 2)

        d = p.Materials
        a = data[i].filter(v => {
          if (v.Type === mt.Size) return similarSize(s, v.Size)
          if (v.Type === mt.Mat && !(p.CategoryId === v.CategoryId &&
            similarSize(s, v.Properties.Size))) return false
          if (v.Type === mt.Template && p.CategoryId === dc.Scroll &&
            !equalSize(v.Properties.Hole.slice(0, 2), s)) return false
          return d.length === 0 || d.indexOf(v.Id) >= 0
        })

        e = entries[i]
        if (!e || e.CategoryId !== p.CategoryId) e = zeroEntry(p.CategoryId)
        d = e.Decorative
        d.Size = s
        d.Angle = p.Angle
        d.Stack = p.Stack

        data[i] = {
          categoryId: p.CategoryId,
          materials: a,
          selects: freshDecorative(a, e, s)
        }
      }
      p = Promise.resolve(data.length)
      a = []
      data.forEach((v, k) => {
        p = p.then(() => buildEntry(v.categoryId, v.selects, template.Id, k))
        a.push(p)
      })
      Promise.all(a).then(res => {
        for (i = 0; i < data.length; i++) {
          data[i].entry = res[i]
        }
        resolve(data)
      }, reject)
    }, reject)
  })
}

let _entries = new Map()
export function buildEntry(categoryId, selects, photoWall, photoIndex) {
  let b = {CategoryId: categoryId}
  let a = []
  for (let i of selects) {
    switch (i.Type) {
      case 'mat':
        if (i.options.length > 0) {
          if (i.mat.Type === mt.Size) {
            b.Size = i.mat.Size
          } else {
            a.push(i.mat.Id)
            b.Angle = i.angle
            b.OptionId = i.options.map(v => v.Property.OptionId)
          }
        }
        break
      case 'line':
        if (i.outer && i.outer.Id) a.push(i.outer.Id)
        if (i.inner && i.inner.Id) a.push(i.inner.Id)
        break
      case 'texture':
        a.push(i.Value.Id)
        break
      case 'blank':
        b.Blank = i.Value
        break
      case 'product':
        b.ProductId = i.product.Id
        b.OptionId = i.options.map(v => v.OptionId)
        b.OptionId.sort()
        break
      case mt.Size:
        b.Size = i.Size
        break
      case mt.MagnetLine:
        if (i.Id) a.push(i.Id)
        break
      default:
        a.push(i.Id)
        break
    }
  }
  a.sort()
  b.MaterialId = a
  if (b.Size) b.Size = b.Size.join('x')
  let s = ngParamSerializer(b)
  if (_entries.has(s)) return Promise.resolve(_entries.get(s))
  if (photoWall) {
    b.PhotoWall = photoWall
    b.PhotoIndex = photoIndex
  }
  return Vue.http.get('entry/build', {params: b}).then(res => {
    if (_entries.size > 100) _entries.clear()
    let e = res.take()
    e.selects = selects
    _entries.set(s, e)
    return e
  })
}

