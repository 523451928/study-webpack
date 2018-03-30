// Copyright 2016 CHEN Xianren. All rights reserved.
require('css/bootstrap')
require('css/font-awesome')
require('css/animate')
require('css/layer')
require('styles/public/flex.css')
require('styles/_global')
require('styles/scss/ww-base.scss')
require('styles/scss/atom.scss')
require('css/validationEngine')

require('polyfills/classList')
require('polyfills/closest')
require('polyfills/html5-dataset')
require('polyfills/placeholders')
require('es5-shim/es5-shim')
require('es6-shim/es6-shim')

require('lazysizes/lazysizes') // lazySizes
require('js/layer') // layer

layer.toast = s => layer.open({ skin: 'msg', content: s, time: 3 })

require('lodash') // _
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

window.$ = require('js/jquery') // $

require('scripts/app/_vue') // Vue, VueRouter, request
