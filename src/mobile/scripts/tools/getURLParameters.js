/* eslint-disable */
export let getURLParameters = url => {
  if (url.match(/([^?=&]+)(=([^&]*))/g)) {
    return url.match(/([^?=&]+)(=([^&]*))/g).reduce(
      (a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {}
    )
  } else {
    return {}
  }
}


