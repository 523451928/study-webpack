export function removeRepeat(arr, key) {
  let map = {}
  let newArr = []
  let keys = []
  arr.forEach((item, index) => {
    if (typeof item === 'object') {
      if (key) {
        if (!map[item[key]]) {
          newArr.push(item)
          map[item[key]] = item[key]
        }
      } else {
        for (let k in item) {
          keys.push(k)
          if (!map[item[keys[0]]]) {
            newArr.push(item)
            map[item[keys[0]]] = item[keys[0]]
          }
        }
      }
    } else {
      if (!map[item]) {
        newArr.push(item)
        map[item] = item
      }
    }
  })
  return newArr
}
