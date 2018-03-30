// Copyright 2016 Chen Xianren. All rights reserved.

import { Fulls } from './consts'
import { swapSize, parseSize } from './util'

const abs = Math.abs
const ceil = Math.ceil
const floor = Math.floor
const min = Math.min
const max = Math.max

export function getVirtualLength(mm, dpi) {
  if (!dpi) {
    throw new Error(dpi)
  }
  return floor(mm / 25.4 * dpi) // px
}

export function getVirtualSize(s, dpi) {
  return [getVirtualLength(s[0], dpi), getVirtualLength(s[1], dpi)]
}

export function fitSize(o, s, dpi) {
  let v = getVirtualSize(o.Size, dpi)
  let x = s[0] >= v[0]
  let y = s[1] >= v[1]
  let w, h
  if (x && y) {
    w = v[0]
    h = s[1] * w / s[0]
    switch (o.Full) {
      case Fulls.Auto:
        if (h > v[1]) {
          h = v[1]
          w = s[0] * h / s[1]
        }
        break
      case Fulls.Once:
      case Fulls.Always:
        if (h < v[1]) {
          h = v[1]
          w = s[0] * h / s[1]
        }
        break
      default:
        return
    }
  } else {
    switch (o.Full) {
      case Fulls.Auto:
      case Fulls.Once:
        if (x) {
          w = v[0]
          h = s[1] * w / s[0]
        } else if (y) {
          h = v[1]
          w = s[0] * h / s[1]
        } else {
          w = s[0]
          h = s[1]
        }
        break
      default:
        return
    }
  }
  return [floor(w), floor(h)]
}

export function newPicture(index, output, image, dpi) {
  let r = image.Info.Rotate / 90 % 2 === 1
  let s = parseSize(image.File)
  if (r) s = swapSize(s)
  let f = fitSize(output, s, dpi)
  if (!f) return
  let p = ceil(f[0] / s[0] * 100)
  p = {
    Index: index,
    Output: output,
    DPI: dpi,
    Image: image,
    TranslateX: 0,
    TranslateY: 0,
    // SkewX: 0,
    // SkewY: 0,
    Rotate: image.Info.Rotate,
    ScaleX: p * image.Info.ScaleX,
    ScaleY: p * image.Info.ScaleY
  }
  return p
}

export function changePicture(p, a, b) {
  let full = p.Output.Full === Fulls.Always
  let imageSize = parseSize(p.Image.File)
  if (p.Rotate / 90 % 2 === 1) {
    imageSize = swapSize(imageSize)
  }
  let outputSize = getVirtualSize(p.Output.Size, p.DPI)
  switch (a) {
    case 'move':
      let t = outputSize.map(v => floor(v * 1 / 100))
      switch (b) {
        case 'left':
          p.TranslateX -= t[0]
          break
        case 'right':
          p.TranslateX += t[0]
          break
        case 'up':
          p.TranslateY -= t[1]
          break
        case 'down':
          p.TranslateY += t[1]
          break
      }
      break
    case 'rotate':
      switch (b) {
        case 'left':
          p.Rotate = (p.Rotate + 270) % 360
          imageSize = swapSize(imageSize)
          if (full && !fitSize(p.Output, imageSize, p.DPI)) {
            p.Rotate = (p.Rotate + 270) % 360
            imageSize = swapSize(imageSize)
          }
          break
        case 'right':
          p.Rotate = (p.Rotate + 90) % 360
          imageSize = swapSize(imageSize)
          if (full && !fitSize(p.Output, imageSize, p.DPI)) {
            p.Rotate = (p.Rotate + 90) % 360
            imageSize = swapSize(imageSize)
          }
          break
      }
      break
    case 'scale':
      switch (b) {
        case 'x':
          if (p.Rotate / 90 % 2 === 0) {
            p.ScaleX *= -1
            p.TranslateX = -p.TranslateX
          } else {
            p.ScaleY *= -1
            p.TranslateY = -p.TranslateY
          }
          break
        case 'y':
          if (p.Rotate / 90 % 2 === 0) {
            p.ScaleY *= -1
            p.TranslateY = -p.TranslateY
          } else {
            p.ScaleX *= -1
            p.TranslateX = -p.TranslateX
          }
          break
        case 'in':
          p.ScaleX = p.ScaleX < 0 ? max(p.ScaleX - 1, -100) : min(p.ScaleX + 1, 100)
          p.ScaleY = p.ScaleY < 0 ? max(p.ScaleY - 1, -100) : min(p.ScaleY + 1, 100)
          break
        case 'out':
          p.ScaleX = p.ScaleX < 0 ? min(p.ScaleX + 1, -1) : max(p.ScaleX - 1, 1)
          p.ScaleY = p.ScaleY < 0 ? min(p.ScaleY + 1, -1) : max(p.ScaleY - 1, 1)
          break
      }
      break
    case 'set':
      let o = copy(p.Output)
      if (full) {
        o.Full = Fulls.Always
      } else {
        switch (b) {
          case 'fill':
            o.Full = Fulls.Once
            break
          case 'fit':
            o.Full = Fulls.Auto
            break
        }
      }
      let img = copy(p.Image)
      img.Info = {
        Rotate: p.Rotate,
        ScaleX: p.ScaleX < 0 ? -1 : 1,
        ScaleY: p.ScaleY < 0 ? -1 : 1
      }
      o = newPicture(p.Index, o, img, p.DPI)
      if (o) {
        for (let k in o) {
          if (k !== 'Output') p[k] = o[k]
        }
      }
      break
  }
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
    p.TranslateX = min(max(p.TranslateX, -translateX), translateX)
    p.TranslateY = min(max(p.TranslateY, -translateY), translateY)
  }
}

function copy(o) {
  return JSON.parse(JSON.stringify(o))
}

export function serializePicture(p) {
  return {
    Index: p.Index,
    Output: copy(p.Output),
    DPI: copy(p.DPI),
    ImageId: p.Image.Id,
    ImageFile: p.Image.File,
    TranslateX: p.TranslateX,
    TranslateY: p.TranslateY,
    // SkewX: p.SkewX,
    // SkewY: p.SkewY,
    Rotate: p.Rotate,
    ScaleX: p.ScaleX,
    ScaleY: p.ScaleY
  }
}

export function serializePictures(a) {
  let b = []
  for (let i of a) {
    b.push(serializePicture(i))
  }
  b.sort((i, j) => i.Index - j.Index)
  return b
}
