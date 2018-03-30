// Copyright 2016 CHEN Xianren. All rights reserved.
/* eslint-disable */
import Vue from 'vue'
Vue.config.silent = true
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueTouch from 'vueTouch'
import Infinite from '../directives/infinitscroll'
import { _user } from './user.js'
let VueLazyload = require('../directives/vue-lazyload')
let FastClick = require("../tools/fastclick")
document.addEventListener("DOMContentLoaded", () => {
  FastClick.attach(document.body)
}, false)
Vue.use(Infinite)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueTouch)
Vue.use(VueLazyload, {
  error: 'dist/error.png',
  loading: require('../../assets/images/lightbox/loading.gif'),
  dispatchEvent: true,
  listenEvents: ['scroll', 'transitionend', 'touchmove']
})
import top from 'components/top.vue'
import footer from 'components/footer.vue'
import navBar from 'components/navBar.vue'
import topBar from 'components/topBar.vue'

// 注册全局组件：navBar,topBar
Vue.component('top', top)
Vue.component('foot', footer)
Vue.component('nav-bar', navBar)
Vue.component('top-bar', topBar)
// vue 指令
// Vue.directive('lazy', require('scripts/directives/lazy'))

const BaseUrl = 'http://m.wallwa.xxx/'
const Application = 'c618540aded26e685f0838a29ec6fa06'

import { ngParamSerializer, jQueryLikeParamSerializer } from 'scripts/tools/_serializer'
Vue.url.jQueryParams = jQueryLikeParamSerializer
Vue.url.defaultParams = Vue.url.params
Vue.url.params = ngParamSerializer

Vue.http.options.root = BaseUrl
Vue.http.interceptors.push((req, next) => {
  req.credentials = true
  req.headers.set('X-Requested-With', 'XMLHttpRequest') // always
  req.headers.set('Application', Application)
  next(res => {
    if (res.ok) {
      res.take = (k = 'Data') => res.data[k]
      const s = 'Error'
      if (res.data.hasOwnProperty(s)) {
        res.ok = false
        res.errorType = 'warning'
        res.errorMessage = res.take(s)
      }
    } else {
      res.errorType = 'danger'
      res.errorMessage = [res.status, res.statusText].join(' ')
    }
  })
})
Vue.http.interceptors.push((req, next) => {
  next(res => {
    if (res.ok) return
    let t, i
    res.hide = () => {
      if (t != null) {
        clearTimeout(t)
        t = null
      }
      if (i != null) {
        layer.close(i)
        i = null
      }
    }
    res.show = () => {
      res.hide()
      t = setTimeout(() => {
        t = null
        i = layer.open({
          shadeClose: false,
          title: [res.errorMessage, 'bg-' + res.errorType],
          content: [req.method, res.url].join(' '),
          btn: '知道了'
        })
      })
    }
    res.show()
  })
})

const isTinyString = s => _.isString(s) && s.length > 0 && s.length <= 255
const isSegment = s => isTinyString(s) && s.indexOf('/') === -1
const isSegments = s => isTinyString(s) && s[0] !== '/' && s[s.length - 1] !== '/'
const isOne = (i, s) => i > 0 && isSegments(s)
const isAll = (a, s) => Array.isArray(a) && a.length > 0 && a.length <= 100 && isSegments(s)

function setProperty(o = {}, k, v) {
  o[k] = v
  return o
}
function setId(o = {}, v) {
  o.params = setProperty(o.params, 'Id', v)
  return o
}
function emulate(o, k = 'JSON') {
  o = setProperty(o, 'emulate' + k, true)
  return o
}

const request = options => Vue.http(options)

function thumb(name, id, length, file) {
  if (isSegment(name) && id >= 0 && length >= 0 && isSegment(file)) {
    return `${BaseUrl}/thumbnail/${name}/${id}/${length}/${file}`
  }
}

function upload($event, name, o, k, image = true) {
  const t = $event.target
  const f = t.files[0]
  t.value = ''
  if (!f) return
  if (image && !/^image\//i.test(f.type)) {
    layer.toast(`文件${f.name}不是图片哦`)
    return
  }
  request.upload(name, f).then(res => Vue.set(o, k, res.take()))
}

request.BaseUrl = BaseUrl
request.Application = Application
request.thumb = thumb
request.upload = (name, file, options) => {
  if (isSegment(name) && file instanceof window.File) {
    const fd = new window.FormData()
    fd.append('File', file)
    return Vue.http.post('upload/' + name, fd, options)
  }
}
request.do = (method, url, body, options) => {
  let o = { method, url }
  if (/^(POST|PUT|PATCH)$/i.test(method)) {
    o.body = body
  } else {
    options = body
  }
  return Vue.http(_.assign(options, o))
}
request.submit = (model, body, options) => {
  if (isSegments(model) && _.isObjectLike(body)) {
    return Vue.http.post(model, body, emulate(options))
  }
}
request.list = (model, options) => {
  if (isSegments(model)) {
    return Vue.http.get(model + '/list', options)
  }
}
request.save = (model, body, options) => {
  if (isSegments(model)) {
    return Vue.http.post(model + '/save', body, options)
  }
}
request.get = (model, id, options) => {
  if (isAll(id, model)) {
    return Vue.http.get(model + '/get', setId(options, id))
  } else if (isOne(id, model)) {
    return Vue.http.get(`${model}/get/${id}`, options)
  }
}
request.getEntry = (model, id, costStatus, options) => {
  // entry 会传是否获取价格的参数
  if (costStatus) {
    options = {}
    options.params = setProperty(options.params, 'Cost', costStatus)
  }
  if (isAll(id, model)) {
    return Vue.http.get(model + '/get', setId(options, id))
  } else if (isOne(id, model)) {
    return Vue.http.get(`${model}/get/${id}`, options)
  }
}
request.set = (model, id, body, options) => {
  if (isAll(id, model)) {
    return Vue.http.post(model + '/set', body, setId(emulate(options), id))
  } else if (isOne(id, model)) {
    return Vue.http.post(`${model}/set/${id}`, body, emulate(options))
  }
}
request.remove = (model, id, options) => {
  if (isAll(id, model)) {
    return Vue.http.delete(model + '/remove', setId(options, id))
  } else if (isOne(id, model)) {
    return Vue.http.delete(`${model}/remove/${id}`, options)
  }
}
request.move = (model, id, body, options) => {
  if (isAll(id, model)) {
    return Vue.http.post(model + '/move', body, setId(emulate(options), id))
  } else if (isOne(id, model)) {
    return Vue.http.post(`${model}/move/${id}`, body, emulate(options))
  }
}

// 添加全局的工具类库
import _ from 'lodash'
Object.defineProperty(Vue.prototype, '$lodash', { value: _ })

Vue.prototype.$request = request
Vue.prototype.$thumb = thumb
Vue.prototype.$upload = upload
Vue.prototype.$user = _user(request)
Vue.prototype.$bus = new Vue()
Vue.prototype.$onBus = function(event, callback) {
  this.$bus.$on(event, callback)
  return () => this.$bus.$off(event, callback)
}
Vue.prototype.$then = function(p, y, n, f) {
  return p.then(function() {
    if (y) y.apply(this, arguments)
    if (f) f.apply(this, arguments)
  }.bind(this), function() {
    if (n) n.apply(this, arguments)
    if (f) f.apply(this, arguments)
  }.bind(this))
}
_.forOwn({ Vue, VueRouter, request }, (v, k) => { window[k] = v })
