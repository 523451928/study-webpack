// Copyright 2016 Chen Xianren. All rights reserved.

import { Fulls } from './consts'
import { copySize, swapSize, parseSize, parseImageSize } from 'scripts/utils/custom/utils'

const DPI = 100
const { abs, ceil, floor, min, max } = Math

export function getVirtualLength(mm) {
  return floor(mm / 25.4 * DPI) // px
}

export function getVirtualSize(s) {
  return [getVirtualLength(s[0]), getVirtualLength(s[1])]
}

export function fitSize(o, s) {
  let v = getVirtualSize(o.Size)
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

export function newPicture(index, output, image) {
  let s = parseImageSize(image)
  let f = fitSize(output, s)
  if (!f) return
  let p = f[0] / s[0] * 100
  // p = Math[output.Full === Fulls.Always ? 'ceil' : 'floor'](p)
  p = ceil(p)
  return {
    Index: index,
    Output: output,
    Image: image,
    TranslateX: 0,
    TranslateY: 0,
    // SkewX: 0,
    // SkewY: 0,
    Rotate: image.Info.Rotate,
    ScaleX: p * image.Info.ScaleX,
    ScaleY: p * image.Info.ScaleY
  }
}

export function initPicture(index, output, image) {
  // 编辑产品或定制产品时重新初始化图片
  let res
  let s = parseSize(image.ImageFile)
  let f = fitSize(output, s)
  // let imgRealSize = f['imgSize']  //  原图 按照实际画芯的形状适应后的尺寸
  let imgRealSize = f  //  原图 按照实际画芯的形状适应后的尺寸
  let maxScale = f['scaleMax']  //  根据DPI算出来  最大的缩放比例*100
  if (!imgRealSize) return
  let p = imgRealSize[0] / s[0] * 100
  //  p = Math[output.Full === Fulls.Aways ? 'ceil' : 'floor'](p)
  p = Math.ceil(p)
  res = {
    Index: index,
    Output: output,
    Image: {
      File: image.ImageFile,
      Id: image.ImageId,
      RealWidth: s[0],
      RealHeight: s[1],
      Info: {
        TranslateX: image.TranslateX,
        TranslateY: image.TranslateY,
        Rotate: image.Rotate
      }
    },
    TranslateX: image.TranslateX,
    TranslateY: image.TranslateY,
    scaleMax: maxScale,
    // SkewX: 0,
    // SkewY: 0,
    Rotate: image.Rotate,
    SizeScale: p,
    ScaleX: parseInt(image.ScaleX * 100 / p),
    ScaleY: parseInt(image.ScaleY * 100 / p),
    EditStatus: true
  }
  return res
}

export function changePicture(p, a, b, n = 2) {
  let full = p.Output.Full === Fulls.Always
  let imageSize = parseSize(p.Image.File)
  if (p.Rotate / 90 % 2 === 1) {
    imageSize = swapSize(imageSize)
  }
  let outputSize = getVirtualSize(p.Output.Size)
  switch (a) {
    case 'move':
      let t = outputSize.map(v => floor(v * n / 100))
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
          if (full && !fitSize(p.Output, imageSize)) {
            p.Rotate = (p.Rotate + 270) % 360
            imageSize = swapSize(imageSize)
          }
          break
        case 'right':
          p.Rotate = (p.Rotate + 90) % 360
          imageSize = swapSize(imageSize)
          if (full && !fitSize(p.Output, imageSize)) {
            p.Rotate = (p.Rotate + 90) % 360
            imageSize = swapSize(imageSize)
          }
          break
      }
      break
    case 'scale':
      switch (b) {
        case 'x':
          p.ScaleX *= -1
          p.TranslateX = -p.TranslateX
          break
        case 'y':
          p.ScaleY *= -1
          p.TranslateY = -p.TranslateY
          break
        case 'in':
          p.ScaleX = min(p.ScaleX + n, 100)
          p.ScaleY = min(p.ScaleY + n, 100)
          break
        case 'out':
          p.ScaleX = max(p.ScaleX - n, 1)
          p.ScaleY = max(p.ScaleY - n, 1)
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
      o = newPicture(p.Index, o, img)
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
    Output: {Full: p.Output.Full, Size: copySize(p.Output.Size)},
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
