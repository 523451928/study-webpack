/* eslint-disable */
let wx = require('weixin-js-sdk')
export let wxShare = (c, o) => {
  // 配置默认的参数
  let d = {
    title: '墙蛙生活',
    desc: '墙蛙生活',
    link: 'http://www.wallwa.com',
    success() {
      alert('分享成功')
    },
    cancel() {
      alert('取消分享')
    }
  }
  let m = Object.assign(d, o)
  let s = {}
  wx.config(c)
  wx.ready(function() {
    wx.onMenuShareTimeline(m)
    wx.onMenuShareAppMessage(m)
  })
}
