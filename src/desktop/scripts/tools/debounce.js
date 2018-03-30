export function debounce(fn, delay) {
  let timer
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      fn.apply(this, args)
    }, delay)
  }
}
