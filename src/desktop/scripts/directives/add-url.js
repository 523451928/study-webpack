
const f = (el, binding) => {
  let key = encodeURIComponent(binding.arg || 'Next') + '='
  let url = encodeURIComponent(window.location.href)
  let i = el.href.lastIndexOf('?')
  if (i === -1) {
    el.href += '?' + key + url
  } else {
    let j = el.href.indexOf(key, i)
    if (j === -1 || !(j === i + 1 || el.href[j - 1] === '&')) {
      el.href += '&' + key + url
    }
  }
}

export default { bind: f }
