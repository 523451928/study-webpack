import { padLeftZero } from '../tools/padLeftZero'
export function formatDate(order) {
  let time = order.Inserted ? order.Inserted : order
  let date = new Date(time)
  return date.getFullYear() + '-' +
    padLeftZero(date.getMonth() + 1) + '-' +
    padLeftZero(date.getDate()) + '  ' +
    padLeftZero(date.getHours()) + ':' +
    padLeftZero(date.getMinutes()) + ':' +
    padLeftZero(date.getSeconds())
}
export function formatPhone(str) {
  str = str + ''
  let reg = /^(\d{3})\d{4}(\d{4})$/
  return str.replace(reg, '$1****$2')
}
