/**
 * Created by admin on 2017/1/3.
 */
export function semanticTime(time) {
  // 后端返回的时间被UTC化,需要反转
  var d = (+new Date()) - Date.parse(time.replace('Z', '+0800'))
  d = ~~(d / 1000)
  if(d < 0){
    return 'Unknown'
  }
  var h = ~~(d / 3600)

  if (h === 0) {
    return '刚刚'
  } else if (h < 24) {
    return h + '小时前'
  }

  var day = ~~(d / (24 * 3600))
  if (day < 30) {
    return day + '天前'
  }

  var year = ~~(d / (24 * 3600 * 365))
  if (year > 0) {
    return year + '年前'
  } else {
    var mouth = ~~(d / (24 * 3600 * 30))
    return mouth + '个月前'
  }
}
