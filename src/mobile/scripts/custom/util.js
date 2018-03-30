/*eslint-disable */
// Copyright 2016 Chen Xianren. All rights reserved.


const max = Math.max
const min = Math.min

const MinCanvasLength = 240
const MaxCanvasLength = 960
const CanvasPadding = 15 * 2

export function getThumbnailLength(l = 480, a = [120, 240, 480, 720, 960]) {
  a = a.slice().sort()
  for (let i of a) {
    if (l <= i) return i
  }
  return a[a.length - 1]
}

export function zeroArray(length = 4, fill = 0) {
  return new Array(length).fill(fill)
}

export function indexOfProperty(a, v, k = 'Type') {
  for (let i = 0; i < a.length; i++) {
    if (a[i][k] === v) return i
  }
  return -1
}

export function getByProperty(a, v, k) {
  return a[indexOfProperty(a, v, k)]
}

export function setByProperty(a, v, k = 'Type') {
  let i = indexOfProperty(a, v[k], k)
  if (i >= 0) a.$set(i, v)
}

export function cleanBlank(s, a) {
  if (s && a) {
    let x = s[0] / 3
    let y = s[1] / 3
    return a.map((v, k) => Math.floor(max(
      0, min(v, k % 2 === 0 ? y : x))))
  }
}

export function equalOption(a, b, p = false) {
  if (p) {
    a = a && a.Property
    b = b && b.Property
  }
  return a && b && a.OptionId === b.OptionId &&
    a.Key === b.Key && a.Value === b.Value
}

export function equalSize(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1]
}

export function similarSize(a, b) {
  return equalSize(a, b) || equalSize(swapSize(a), b)
}

export function formatSize(s) {
  if (s) return (s[0] / 10) + 'x' + (s[1] / 10) + 'cm'
}

export function sizeShape(s) {
  if (s) {
    if (s[0] < s[1]) return 'v'
    if (s[0] > s[1]) return 'h'
    return 's'
  }
}

export function copySize(s) {
  if (s) return [s[0], s[1]]
}

export function swapSize(s) {
  if (s) return [s[1], s[0]]
}

export function addUnit(n, u = 'px') {
  return Math[n < 0 ? 'ceil' : 'floor'](n) + u
}

export function isColor(s) {
  return s[0] === '#'
}

export function parseSize(s) {
  let i = s.indexOf('-')
  let j = s.slice(i).indexOf('x')
  let w = parseInt(s.slice(i + 1, i + j))
  let h = parseInt(s.slice(i + j + 1, isColor(s) ? s.length : s.indexOf('.')))
  return [w, h]
}
