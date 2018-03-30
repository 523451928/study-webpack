// Copyright 2016 CHEN Xianren. All rights reserved.

const c = 'lazyload'
const f = (el, binding) => {
  if (el.classList.contains(c)) el.classList.remove(c)
  if (binding.value) {
    el.dataset.src = binding.value
    el.classList.add(c)
  } else {
    el.removeAttribute('data-src')
    el.removeAttribute('src')
  }
}

export default { bind: f, update: f, componentUpdated: f }
