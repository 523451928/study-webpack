function isUndefined(value) {
  return typeof value === 'undefined'
}

function isNumber(value) {
  return typeof value === 'number'
}

function isObject(value) {
  return value !== null && typeof value === 'object'
}

function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]'
}

function toJsonReplacer(key, value) {
  let val = value
  if (typeof key === 'string' && key.charAt(0) === '$') {
    val = undefined
  } else if (value) {
    if (value.window === value) {
      val = '$WINDOW'
    } else if (window.document === value) {
      val = '$DOCUMENT'
    } else if (value._isVue) {
      val = '$VUE'
    }
  }
  return val
}

function toJson(obj, pretty) {
  if (isUndefined(obj)) return undefined
  if (!isNumber(pretty)) {
    pretty = pretty ? 2 : null
  }
  return JSON.stringify(obj, toJsonReplacer, pretty)
}

function forEachSorted(obj, iterator, context) {
  let keys = Object.keys(obj).sort()
  for (let i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i])
  }
  return keys
}

function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
}

function serializeValue(v) {
  if (isObject(v)) {
    return isDate(v) ? v.toISOString() : toJson(v)
  }
  return v
}

export function ngParamSerializer(params) {
  if (!params) return ''
  let parts = []
  forEachSorted(params, function(value, key) {
    value = toJsonReplacer(key, value)
    if (value === null || isUndefined(value)) return
    if (Array.isArray(value)) {
      value.forEach(function(v) {
        parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(v)))
      })
    } else {
      parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(value)))
    }
  })
  return parts.join('&')
}

export function jQueryLikeParamSerializer(params) {
  if (!params) return ''
  let parts = []
  let serialize = (toSerialize, prefix, topLevel) => {
    if (toSerialize === null || isUndefined(toSerialize)) return
    if (Array.isArray(toSerialize)) {
      toSerialize.forEach(function(value, index) {
        serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']')
      })
    } else if (isObject(toSerialize) && !isDate(toSerialize)) {
      forEachSorted(toSerialize, function(value, key) {
        serialize(value, prefix + (topLevel ? '' : '[') + key + (topLevel ? '' : ']'))
      })
    } else {
      parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)))
    }
  }
  serialize(params, '', true)
  return parts.join('&')
}
