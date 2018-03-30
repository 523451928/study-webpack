// Copyright 2016 Chen Xianren. All rights reserved.

import { Fulls } from 'scripts/utils/custom/consts.js'
import { copySize, swapSize, parseImageSize } from 'scripts/utils/custom/utils.js'

const { abs, ceil, floor, min, max } = Math

export function getVirtualLength(mm, dpi) {
  if (!dpi) {
    throw new Error(dpi)
  }
  return floor(mm / 25.4 * dpi) // px
}

export function getVirtualSize(s, dpi) {
  return [getVirtualLength(s[0], dpi), getVirtualLength(s[1], dpi)]
}

// 适配尺寸,判断图片是否能做.
export function fitSize(o, s, dpi, isRotate) {
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

export function getInitFitScaleMin(output, image, dpi) {
  if (!output || !image) return
  let s = parseImageSize(image)
  let f = fitSize(output, s, dpi, true)
  if (f) return ceil(f[0] / s[0] * 100)
}

export function newPicture(index, output, image, dpi) {
  let p = getInitFitScaleMin(output, image, dpi)
  if (p) {
    return {
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
  }
}

export function initPicture(index, output, pic) {
  // 编辑产品或定制产品时重新初始化图片
  let res
  let imageObj = {
    File: pic.ImageFile,
    Id: pic.ImageId,
    Info: {
      TranslateX: pic.TranslateX,
      TranslateY: pic.TranslateY,
      Rotate: pic.Rotate
    }
  }
  let s = parseImageSize(imageObj)
  imageObj.RealWidth = s[0]
  imageObj.RealHeight = s[1]
  let f = fitSize(output, s, pic.DPI)
  let imgRealSize = f  //  原图 按照实际画芯的形状适应后的尺寸
  if (!imgRealSize) return
  let maxScale = f['scaleMax']  //  根据DPI算出来  最大的缩放比例*100
  let scaleRate = Math.ceil(imgRealSize[0] / s[0] * 100)
  //  p = Math[output.Full === Fulls.Aways ? 'ceil' : 'floor'](p)
  res = {
    Index: index,
    DPI: pic.DPI,
    Output: output,
    Image: imageObj,
    TranslateX: pic.TranslateX,
    TranslateY: pic.TranslateY,
    scaleMax: maxScale,
    // SkewX: 0,
    // SkewY: 0,
    Rotate: pic.Rotate,
    SizeScale: scaleRate,
    // ScaleX: parseInt(pic.ScaleX * 100 / scaleRate),
    // ScaleY: parseInt(pic.ScaleY * 100 / scaleRate),
    // 不明白为何要进行这样（pic.ScaleX * 100 / scaleRate）的计算，
    // 但在编辑页面pic.ScaleX的值应该是要表示为图片真实的缩放值。
    ScaleX: pic.ScaleX,
    ScaleY: pic.ScaleY,
    EditStatus: true
  }
  return res
}

export function changePicture(p, a, b, n = 1) {
  let full = p.Output.Full === Fulls.Always
  let imageSize = parseImageSize(p.Image)
  let outputSize = getVirtualSize(p.Output.Size, p.DPI)
  switch (a) {
    case 'drag':
      if (_.isTypedArray(b) || b.length !== 3) return
      p.TranslateX += b[0] * (outputSize[0] / b[2][0])
      p.TranslateY += b[1] * (outputSize[1] / b[2][1])
      break
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
        case 'in': // 放大图片
          p.ScaleX = p.ScaleX < 0 ? max(p.ScaleX - n, -100) : min(p.ScaleX + n, 100)
          p.ScaleY = p.ScaleY < 0 ? max(p.ScaleY - n, -100) : min(p.ScaleY + n, 100)
          break
        case 'out': // 缩小图片
          p.ScaleX = p.ScaleX < 0 ? min(p.ScaleX + n, -1) : max(p.ScaleX - n, 1)
          p.ScaleY = p.ScaleY < 0 ? min(p.ScaleY + n, -1) : max(p.ScaleY - n, 1)
          break
        default:
          if (_.isNumber(b)) {
            p.ScaleX = b
            p.ScaleY = b
          }
          break
      }
      break
    case 'set':
      let o = copy(p.Output)
      if (full) {
        o.Full = Fulls.Always
        switch (b) {
          case 'fill':
            o.Full = Fulls.Once
            break
          case 'vMid':
            p.TranslateY = 0
            break
          case 'hCenter':
            p.TranslateX = 0
            break
        }
      } else {
        switch (b) {
          case 'fill':
            o.Full = Fulls.Once
            break
          case 'fit':
            o.Full = Fulls.Auto
            break
          case 'vMid':
            p.TranslateY = 0
            break
          case 'hCenter':
            p.TranslateX = 0
            break
        }
      }
      let setImgAfter = function() {
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
      }
      if (b === 'fill' || b === 'fit') {
        setImgAfter()
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
  }
}

export function resetPicture(pic, type) {
  let full = pic.Output.Full === Fulls.Always
  let imageSize = parseImageSize(pic.Image)
  let outputSize = getVirtualSize(pic.Output.Size, pic.DPI)
  if (full) {
    switch (type) {
      case 'overstep':
        let translateX = floor(abs(pic.ScaleX) / 100 * imageSize[0] - outputSize[0]) / 2
        let translateY = floor(abs(pic.ScaleY) / 100 * imageSize[1] - outputSize[1]) / 2
        pic.TranslateX = min(max(pic.TranslateX, -translateX), translateX)
        pic.TranslateY = min(max(pic.TranslateY, -translateY), translateY)
        break
    }
  }
}

function copy(o) {
  return JSON.parse(JSON.stringify(o))
}

export function serializePicture(p) {
  return {
    Index: p.Index,
    Output: {Full: p.Output.Full, Size: copySize(p.Output.Size)},
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
