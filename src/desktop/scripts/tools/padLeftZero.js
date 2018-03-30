export function padLeftZero(str) {
  if (str.length > 2) {
    return str
  }
  return ('00' + str).substr((str + '').length)
}
