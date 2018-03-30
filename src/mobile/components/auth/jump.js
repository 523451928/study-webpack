/**
 * Created by admin on 2016/11/14.
 */
export function jump() {
  const search = window.location.search.substr(1)
  let idx
  let href = '/user/user.html'
  if (search.length > 0) {
    let html = ''
    idx = search.indexOf('next=')
    if (search.indexOf('.html') === -1) { html = '.html' }
    href = decodeURIComponent(search.substring(idx + 5)) + html
  }
  setTimeout(function() { window.location.href = href }, 1000)
}
