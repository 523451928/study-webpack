// Copyright 2016 CHEN Xianren. All rights reserved.

const win = window
const doc = document
const bd = doc.body
const de = doc.documentElement
const raf = win.requestAnimationFrame ||
  win.mozRequestAnimationFrame ||
  win.webkitRequestAnimationFrame ||
  win.msRequestAnimationFrame

export default (ms = 250) => {
  let top = Math.max(bd.scrollTop, de.scrollTop)
  let start
  const step = time => {
    if (!start) start = time
    top -= ((time - start) / ms) * top
    if (top < 0) top = 0
    bd.scrollTop = top
    de.scrollTop = top
    if (top > 0) raf(step)
  }
  raf(step)
}
