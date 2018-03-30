// Copyright 2016 Chen Xianren. All rights reserved.

import { Fulls, PicParm } from './consts'
import { copySize, swapSize, parseSize } from 'scripts/utils/custom/utils'

const floor = Math.floor
const min = Math.min
const max = Math.max

export function getVirtualLength(mm) {
  const DPI = window.DPI || 100
  return Math.ceil(mm / 25.4 * DPI) // px
}

export function getVirtualSize(s) {
  return [getVirtualLength(s[0]), getVirtualLength(s[1])]
}

export function fitSize(o, s) {
  //  默认都是填满画芯 两边都小于时按画的实际尺寸
  let v = getVirtualSize(o.Size)  //  画芯px
  let x = s[0] >= v[0]
  let y = s[1] >= v[1]
  let w, h
  let scaleMax
  let res = {}
  let canFire = true
  if (x && y) { //  两边都大于
    w = v[0]
    h = s[1] * w / s[0]
    switch (o.Full) { //  根据画芯的宽高SHAPE  设置图片的适应尺寸
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
    scaleMax = Math.ceil(s[0] * 100 / w)
  } else {
    switch (o.Full) {
      case Fulls.Always:
        canFire = false
        break
      case Fulls.Auto:
      case Fulls.Once:
        //  根据图片和画芯尺寸的比较判断怎么适应  ：一边超出 ：两边都小于画芯
        if (x) {
          w = v[0]
          h = s[1] * w / s[0]
          scaleMax = Math.ceil(s[0] * 100 / w)
        } else if (y) {
          h = v[1]
          w = s[0] * h / s[1]
          scaleMax = Math.ceil(s[0] * 100 / w)
        } else {
          w = s[0]
          h = s[1]
          scaleMax = 100
        }
        break
      default:
        return
    }
  }
  if (canFire) {
    res = {
      imgSize: [floor(w), floor(h)],
      scaleMax: scaleMax > PicParm.ScaleMax ? PicParm.ScaleMax : scaleMax
    }
  } else {
    res = false
  }
  return res
}

export function newPicture(index, output, image, dpi) {
  let i = image.Info
  let r = i.Rotate / 90 % 2 === 1
  let s = parseSize(image.File)
  if (r) s = swapSize(s)
  let f = fitSize(output, s)
  if (!f) {
    return false
  }
  let imgRealSize = f['imgSize']  //  原图 按照实际画芯的形状适应后的尺寸
  let maxScale = f['scaleMax']  //  根据DPI算出来  最大的缩放比例*100
  if (!imgRealSize) return
  let p = (imgRealSize[0] / s[0]) * 100
   // p = Math[output.Full === Fulls.Aways ? 'ceil' : 'floor'](p)
  p = Math.ceil(p)
  return {
    Index: index,
    Output: output,
    Image: image,
    TranslateX: 0,
    TranslateY: 0,
    DPI: dpi,
    scaleMax: maxScale,
    // SkewX: 0,
    // SkewY: 0,
    Rotate: i.Rotate,
    SizeScale: p,
    ScaleX: 100,
    ScaleY: 100
  }
}
export function initPicture(index, output, image) {
  // 编辑产品或定制产品时重新初始化图片
  let s = parseSize(image.ImageFile)
  let f = fitSize(output, s)
  let imgRealSize = f['imgSize']  //  原图 按照实际画芯的形状适应后的尺寸
  let maxScale = f['scaleMax']  //  根据DPI算出来  最大的缩放比例*100
  if (!imgRealSize) return
  let p = imgRealSize[0] / s[0] * 100
  //  p = Math[output.Full === Fulls.Aways ? 'ceil' : 'floor'](p)
  p = Math.ceil(p)
  image.SizeScale = p
  image.ScaleX = parseInt(image.ScaleX * 100 / p)
  image.ScaleY = parseInt(image.ScaleY * 100 / p)
  image.scaleMax = maxScale
}

export function changePicture(p, a, b, n = 2) {
  let s = getVirtualSize(p.Output.Size)
  switch (a) {
    case 'drag':
      if (_.isTypedArray(b) || b.length !== 2) return
      let diffX = b[0]
      let diffY = b[1]
      p.TranslateX += diffX
      p.TranslateY += diffY
      p.TranslateX = max(1 - s[0], p.TranslateX)
      p.TranslateY = min(s[1] - 1, p.TranslateY)
      p.Transition = 'all 0s'
      break
    case 'move':
      let t = s.map(v => floor(v * n / 100))
      switch (b) {
        case 'left':
          p.TranslateX -= t[0]
          p.TranslateX = max(1 - s[0], p.TranslateX)
          break
        case 'right':
          p.TranslateX += t[0]
          p.TranslateX = min(s[0] - 1, p.TranslateX)
          break
        case 'up':
          p.TranslateY -= t[1]
          p.TranslateY = max(1 - s[1], p.TranslateY)
          break
        case 'down':
          p.TranslateY += t[1]
          p.TranslateY = min(s[1] - 1, p.TranslateY)
          break
      }
      break
    case 'rotate':
      switch (b) {
        case 'left':
          p.Rotate += 270
          p.Transition = 'all .3s'
          break
        case 'right':
          p.Rotate += 90
          p.Transition = 'all .3s'
          break
        case 'half':
          p.Rotate += 180
          p.Transition = 'all .3s'
          break
      }
      break
    case 'scale':
      switch (b) {
        case 'x':
          p.ScaleX *= -1
          break
        case 'y':
          p.ScaleY *= -1
          break
        case 'in':
          p.ScaleX += n
          p.ScaleY += n
          p.ScaleX = min(p.ScaleX, p.scaleMax)
          p.ScaleY = min(p.ScaleY, p.scaleMax)
          break
        case 'out':
          p.ScaleX -= n
          p.ScaleY -= n
          p.ScaleX = max(p.ScaleX, PicParm.ScaleMin)
          p.ScaleY = max(p.ScaleY, PicParm.ScaleMin)
          break
        default:
          if (_.isNumber(b)) {
            p.ScaleX = b
            p.ScaleY = b
            p.ScaleX = max(p.ScaleX, PicParm.ScaleMin)
            p.ScaleY = max(p.ScaleY, PicParm.ScaleMin)
          }
          break
      }
      break
    case 'set':
      let o, k
      switch (b) {
        case 'fill':
          o = {Full: Fulls.Once, Size: p.Output.Size}
          break
        case 'fit':
          o = {Full: Fulls.Auto, Size: p.Output.Size}
          break
      }
      if (o) {
        o = newPicture(p.Index, o, p.Image)
        for (k in o) {
          if (k !== 'Output') p[k] = o[k]
        }
      }
      break
  }
}

export function isOverstep(p) {
  let s = getVirtualSize(p.Output.Size)
  let rate = p.rate
  //  画芯区域大小
  let holeRealSize
  //  图片适配后实际大小
  let imageRealSize = []
  let crossW, crossH
  let offsetX = p.TranslateX
  let offsetY = p.TranslateY
  holeRealSize = [Math.ceil(s[0] * rate[0]), Math.ceil(s[1] * rate[1])]
  imageRealSize.push(Math.ceil(p.Image.RealWidth * p.SizeScale / 100 * rate[0] * p.ScaleY / 100))
  imageRealSize.push(Math.ceil(p.Image.RealHeight * p.SizeScale / 100 * rate[0] * p.ScaleY / 100))
  if ((Math.abs(p.Rotate) / 90) % 2 === 1) {
    crossW = Math.floor((imageRealSize[1] - holeRealSize[1]) / 2)
    crossH = Math.floor((imageRealSize[0] - holeRealSize[0]) / 2)
  } else {
    crossW = Math.floor((imageRealSize[0] - holeRealSize[0]) / 2)
    crossH = Math.floor((imageRealSize[1] - holeRealSize[1]) / 2)
  }

  if (Math.abs(offsetX) >= crossW) {
    offsetX = offsetX >= 0 ? crossW : -crossW
    if (offsetX !== 0) {
      offsetX = offsetX > 0 ? offsetX - 1 : offsetX + 1
    }
  }

  if (Math.abs(offsetY) >= crossH) {
    offsetY = offsetY >= 0 ? crossH : -crossH
    if (offsetY !== 0) {
      offsetY = offsetY > 0 ? offsetY - 1 : offsetY + 1
    }
  }
  p.TranslateX = offsetX
  p.TranslateY = offsetY
}

export function serializePicture(p) {
  let id
  let file
  id = p.hasOwnProperty('Image') ? p.Image.Id : p.ImageId
  file = p.hasOwnProperty('Image') ? p.Image.File : p.ImageFile
  return {
    Index: p.Index,
    Output: {Full: p.Output.Full, Size: copySize(p.Output.Size)},
    ImageId: id,
    ImageFile: file,
    DPI: p.DPI,
    TranslateX: parseInt(p.TranslateX / p.rate[0]),
    TranslateY: parseInt(p.TranslateY / p.rate[1]),
    // TranslateX: parseInt(p.TranslateX),
    // TranslateY: parseInt(p.TranslateY),
    // SkewX: p.SkewX,
    // SkewY: p.SkewY,
    Rotate: p.Rotate % 360,
    ScaleX: parseInt(p.ScaleX * p.SizeScale / 100),
    ScaleY: parseInt(p.ScaleY * p.SizeScale / 100)
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
