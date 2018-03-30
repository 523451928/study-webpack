/*eslint-disable*/
// Copyright 2016 CHEN Xianren. All rights reserved.
/**
 * 
 * 
 * @export
 * @param {any} src 
 * @returns 
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = document.createElement('img')
    const f = (fn, arg) => {
      img.onload = null
      img.onerror = null
      fn(arg)
    }
    img.src = src
    img.onload = () => f(resolve, img)
    img.onerror = () => f(reject, src)
  })
}

function loadImages(srcs, seq = false) {
  let imgs = []
  let f, p
  if (seq) {
    p = Promise.resolve(seq)
    f = v => {
      p = p.then(() => loadImage(v))
      imgs.push(p)
    }
  } else {
    f = v => imgs.push(loadImage(v))
  }
  srcs.forEach(v => Array.isArray(v) ? v.forEach(f) : f(v))
  return Promise.all(imgs)
}

export function loadImages1(...srcs) {
  return loadImages(srcs, true)
}

export function loadImages2(...srcs) {
  return loadImages(srcs)
}

export function getImageInfo(id) {
  return request({url: `image/info/${id}`}).then(res => res.take())
}

export function getRealPxSize(file) {
  // 从file 获取size  [] 0:width 1:height
  let size = file.split('-')[1].split('.')[0].split('x')
  size[0] = parseInt(size[0])
  size[1] = parseInt(size[1])
  return size
}
export function getPxSize(sizes, dpi) {
  sizes[0] = Math.round(sizes[0] = sizes[0] / 25.4 * dpi)
  sizes[1] = Math.round(sizes[1] = sizes[1] / 25.4 * dpi)
  return sizes
}
export function getMmSize(sizes, dpi) {
  sizes[0] = Math.round(sizes[0] / dpi * 25.4)
  sizes[1] = Math.round(sizes[1] / dpi * 25.4)
  return sizes
}
export function getImgShape(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return
  if (arr[0] === arr[1]) {
    return 's'
  } else if (arr[0] > arr[1]) {
    return 'h'
  } else {
    return 'v'
  }
}
/**
 * 后台请求返回图片信息后,通过图片名称,返回图片的尺寸
 */
export function matchImgSize(name) {
  let r = []
  if (typeof name !== 'string') {
    return r
  } else {
    let reg = /-.*\./g
    let d = name.match(reg)[0]
    const w = d.match(/\d{1,}/g)[0]
    const h = d.match(/\d{1,}/g)[1]
    r.push(parseInt(w))
    r.push(parseInt(h))
    return r
  }

}
/**
 * 比较屏幕的宽高
 */


