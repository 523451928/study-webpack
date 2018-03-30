// Copyright 2016 Chen Xianren. All rights reserved.

const pi = Math.PI
const sin = Math.sin
const cos = Math.cos
const sqrt = Math.sqrt

function square(i) {
  return i * i
}

function sign(far) {
  return far ? 1 : -1
}

function d2a(degree) {
  return degree * pi / 180
}

export function nx(w, d, p, far = false) {
  let a = d2a(d)
  return w * cos(a) / (1 + sign(far) * w * sin(a) / p)
}

export function ny(w, h, d, p, far = false) {
  let a = d2a(d)
  return h * sqrt(square(nx(w, d, p)) + square(p)) / sqrt(
    square(w * cos(a)) + square(p + sign(far) * w * sin(a)))
}

export function fx(w, d, p, near = false) {
  return nx(w, d, p, !near)
}

export function fy(w, h, d, p, near = false) {
  return ny(w, h, d, p, !near)
}
