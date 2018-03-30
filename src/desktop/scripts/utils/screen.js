// Copyright 2016 CHEN Xianren. All rights reserved.

const win = window
const doc = document
const bd = doc.body
const de = doc.documentElement

const f = h => h ? 'Height' : 'Width'

function getViewportLength(h) {
  let s = f(h)
  return Math.max(de[`client${s}`], win[`inner${s}`])
}

function getDocumentLength(h) {
  let s = f(h)
  return Math.max(bd[`scroll${s}`], bd[`offset${s}`],
    de[`client${s}`], de[`scroll${s}`], de[`offset${s}`])
}

export function getViewportWidth() {
  return getViewportLength()
}
export function getViewportHeight() {
  return getViewportLength(true)
}

export function getDocumentWidth() {
  return getDocumentLength()
}
export function getDocumentHeight() {
  return getDocumentLength(true)
}

const breakpoints = { // bootstrap
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
}

function getBreakpoint(h, o = breakpoints) {
  let l = getViewportLength(h)
  let s
  for (let k in o) {
    if (o.hasOwnProperty(k) && l >= o[k] && !(s && o[s] >= o[k])) s = k
  }
  return s
}

export function getBreakpointX(o) {
  return getBreakpoint(false, o)
}
export function getBreakpointY(o) {
  return getBreakpoint(true, o)
}

function checkBreakpoint(s, down, exclude, h, o = breakpoints) {
  if (!o.hasOwnProperty(s)) return false

  let u
  const f = () => {
    for (let k in o) {
      if (o.hasOwnProperty(k) && o[k] > o[s] && !(u && o[u] <= o[k])) u = k
    }
  }

  let l = getViewportLength(h)
  if (down) {
    if (exclude) return l < o[s]
    f()
    if (u) return l < o[u]
    return true
  } else if (exclude) {
    f()
    if (u) return l >= o[u]
    return false
  } else {
    return l >= o[s]
  }
}

export function geBreakpointX(s, o) {
  return checkBreakpoint(s, false, false, false, o)
}
export function gtBreakpointX(s, o) {
  return checkBreakpoint(s, false, true, false, o)
}
export function leBreakpointX(s, o) {
  return checkBreakpoint(s, true, false, false, o)
}
export function ltBreakpointX(s, o) {
  return checkBreakpoint(s, true, true, false, o)
}
export function geBreakpointY(s, o) {
  return checkBreakpoint(s, false, false, true, o)
}
export function gtBreakpointY(s, o) {
  return checkBreakpoint(s, false, true, true, o)
}
export function leBreakpointY(s, o) {
  return checkBreakpoint(s, true, false, true, o)
}
export function ltBreakpointY(s, o) {
  return checkBreakpoint(s, true, true, true, o)
}
