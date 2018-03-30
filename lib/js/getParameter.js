/**
 * Created by admin on 2017/1/3.
 */
export function getParameter(name) {
  var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)')
  var m = location.href.match(r)
  return (!m ? '' : decodeURIComponent(m[2]))
}
