// Copyright 2016 CHEN Xianren. All rights reserved.

// require('css/bootstrap')
require('css/font-awesome')
require('css/animate')
require('css/layer')
require('styles/_global.styl')
require('styles/scss/ww-base.scss')
require('styles/scss/atom.scss')
require('css/validationEngine')
require('polyfills/classList')
require('polyfills/closest')
require('polyfills/html5-dataset')
require('polyfills/placeholders')
require('es5-shim/es5-shim')
require('es6-shim/es6-shim')
require('styles/theme-chalk/index.css')
require('lazysizes/lazysizes') // lazySizes，图片懒加载
require('js/layer') // layer

layer.toast = s => layer.open({ skin: 'msg', content: s, time: 3 })
layer.shortToast = (str, time = 1) => layer.open({skin: 'msg', content: str, time: 1})

// 设置工具库为全局window对象上的属性
import _ from 'lodash' // lodash
import $ from 'js/jquery' // jQuery
import 'styles/public/flex.css'

let toolObj = { _, $ }
for (var tool in toolObj) {
  if (toolObj.hasOwnProperty(tool)) {
    window[tool] = toolObj[tool]
  }
}

// import 'js/jquery.lazyload.js'  // 图片懒加载

_.mixin({
  addEvent: (target, type, listener, useCapture) => {
    let a = type.match(/(\S+)/g)
    const f = s => v => target[s + 'EventListener'](v, listener, useCapture)
    a.forEach(f('add'))
    return () => a.forEach(f('remove'))
  },
  mergeFuncs: (...funcs) => {
    return () => funcs.forEach(func => func())
  }
})
window.log = function(x) {
  if (_.isObject(x)) {
    x = _.omit(x)
  }
  console.log(x)
}
window.dir = function(x) {
  if (_.isObject(x)) {
    x = _.omit(x)
  }
  console.dir(x)
}

require('scripts/app/_vue') // Vue, VueRouter, request,导入vue的用户全局配置
