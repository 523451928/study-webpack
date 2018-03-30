/**
 * Created by admin on 2016/11/14.
 */
export function jump() {
  // const search = window.location.search
  // let idx
  // let href = '/'
  // if (search.length > 0) {
  //   idx = search.indexOf('Next=')
  //   href = decodeURIComponent(search.substring(idx + 5))
  // }
  setTimeout(function() { window.history.back() }, 1000)
}

