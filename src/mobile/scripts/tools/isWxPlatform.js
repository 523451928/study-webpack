export function isWxPlatform() {
  var ua = navigator.userAgent.toLowerCase()
  var isWeixin = ua.indexOf('micromessenger') !== -1
  if (isWeixin) {
    return true
  } else {
    return false
  }
}
