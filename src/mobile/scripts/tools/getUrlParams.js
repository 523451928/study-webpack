export function getUrlParams() {
  let url = location.search
  let strs = ''
  let theRequest = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1)
    strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = encodeURIComponent(strs[i].split('=')[1])
    }
  }
  return theRequest
}
