<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div style="position: relative;">
  <div class="scroller" v-el:scroller>
    <div>
      <ul class="weui_uploader_files">
        <li>
          <div class="weui_uploader_input_wrp">
            <input type="file" class="weui_uploader_input"
              name="uploader" multiple="multiple"
              v-on:change="upload($event)">
          </div>
        </li>
        <li class="weui_uploader_file weui_uploader_status"
          v-for="i of images" :class="getClass(i)" @tap="select2(i)">
          <img v-if="i.Id" class="lazyload"
            :data-src="icon(i)" :style="getStyle(i)">
          <img v-if="i._src" :src="i._src" :style="getStyle(i)">
          <div v-if="getContent(i)" class="weui_uploader_status_content">
            {{{getContent(i)}}}
          </div>
        </li>
        <!-- <li class="weui_uploader_file weui_uploader_status"
          v-for="i of images" v-lazyload="i"
          :class="getClass(i)" :style="getStyle(i)" @tap="select2(i)">
          <div v-if="getContent(i)" class="weui_uploader_status_content">
            {{{getContent(i)}}}
          </div>
        </li> -->
      </ul>
    </div>
  </div>
  <loading :show="loading"></loading>
  <toast :show.sync="show" :message="message" :time="3"
    :icon="false" :mask="false" :cancel="true"></toast>
</div>
</template>

<script>
import { loadImage } from 'utils/image'
import { mixin } from './scroller-util'
import { getTransform, getOrientation } from './orientation'

const MinSize = 10 * (1 << 10)
const MaxSize = 100 * (1 << 20)

export default {
  mixins: [mixin],
  // directives: {
  //   lazyload: {
  //     update(i) {
  //       let that = this.vm
  //       if (that.no) return
  //       let el = this.el
  //       if (this._d) {
  //         this._d()
  //         el.classList.remove('lazyload', 'lazyloading', 'lazyloaded')
  //       }
  //       if (i.Id) {
  //         el.classList.add('lazyload')
  //         // el.dataset.bg = that.icon(i)
  //         this._d = that.$lodash.addEvent(el, 'lazybeforeunveil', e => {
  //           if (!e.defaultPrevented && e.target === el) {
  //             if (el.preload === 'none') el.preload = 'auto'
  //             e.detail.firesLoad = true
  //             loadImage(that.icon(i)).then(img => {
  //               el.style.backgroundImage = `url(${img.src})`
  //               e.detail.firesLoad = false
  //               lazySizes.fire(el, '_lazyloaded', {}, true, true)
  //             })
  //           }
  //         })
  //       } else {
  //         el.style.backgroundImage = `url(${i._src})`
  //       }
  //     },
  //     unbind() {
  //       if (this._d) {
  //         this._d()
  //         this._d = null
  //       }
  //     }
  //   }
  // },
  data() {
    return {type: 'image', value: true, show: false, message: '', loading: false, images: [], pager: {}}
  },
  ready() {
    let that = this
    that.list()
    let s = new this.$IScroll(this.$els.scroller, {
      scrollX: true,
      scrollY: false,
      // disableMouse: false,
      // disablePointer: false,
      // disableTouch: false,
      mouseWheel: true,
      eventPassthrough: true,
      click: false,
      tap: true,
      probeType: 2,
      bounceTime: 250,
      bounceEasing: 'quadratic'
    })
    let start, prev, next
    s.on('scrollStart', () => {
      start = s.x
      prev = false
      next = false
    })
    s.on('scroll', () => {
      if (start === 0 && s.x === 0) {
        s.hasHorizontalScroll = true
      } else {
        const g = 79 * 2
        if (s.x > g) {
          prev = true
          next = false
        } else if (s.x - s.maxScrollX < -g) {
          prev = false
          next = true
        }
      }
    })
    s.on('scrollEnd', () => {
      s.hasHorizontalScroll = s.options.scrollX && s.maxScrollX < 0
      let p = that.pager
      if (prev && p.Page > 1) that.list(p.Page - 1)
      if (next && p.N === p.Count) that.list(p.Page + 1)
    })
    that._s = s
    that._d = that.$lodash.addEvent(window, 'resize', () => {
      that.refresh(false)
    })
    // that._d = that.$lodash.addEvent(document, 'lazybeforeunveil', e => {
    //   if (e.defaultPrevented) return
    //   if (e.target.preload === 'none') e.target.preload = 'auto'
    //   let el = e.target
    //   let bg = el.dataset.bg
    //   if (bg) {
    //     e.detail.firesLoad = true
    //     loadImage(bg).then(img => {
    //       el.style.backgroundImage = `url(${img.src})`
    //       e.detail.firesLoad = false
    //       lazySizes.fire(el, '_lazyloaded', {}, true, true)
    //     })
    //   }
    // })
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
    if (this._s) {
      console.log(this._s)
      this._s.destroy()
      this._s = null
    }
  },
  methods: {
    refresh(next = true) {
      let s = this._s
      if (s) {
        let f = () => s.refresh()
        next ? this.$nextTick(f) : f()
      }
    },
    scrollTo(c = 'active') {
      let s = this._s
      if (s) {
        s.refresh()
        let el = this.$els.scroller.querySelector('li.' + c)
        if (el) s.scrollToElement(el, 250, 0, 0)
      }
    },
    icon(i) {
      return this.$request.thumbnail('image', i.Id, 120, i.File)
    },
    list(page, count) {
      if (this.loading) return
      this.loading = true
      this.$then(this.$request.list('image', {
        params: {Mode: 0, Page: page, Count: count}
      }), res => {
        let p = res.data.Pager
        let d = res.data.Data
        p.N = d.length
        if (p.N === 0 && p.Page > 1) {
          this.showMessage('没有更多图片了哦')
        } else {
          if (page) this.showMessage(`第${p.Page}页`)
          this.pager = p
          this.images = this.images.filter(v => !v.Id).concat(d)
          this.refresh()
        }
      }, undefined, () => {
        this.loading = false
      })
    },
    showMessage(s) {
      let that = this
      let f = () => {
        that.message = s
        that.show = true
      }
      if (that.show) {
        that.show = false
        that.$nextTick(f)
      } else {
        f()
      }
    },
    getClass(i) {
      if (this.no || !i.Id) return
      return this.isActive(i) ? 'active' : 'inactive'
    },
    getContent(i) {
      if (this.no) return
      let f = s => `<i class="weui_icon_${s}"></i>`
      if (i.Id) {
        if (this.isActive(i)) return f('success_no_circle')
      } else {
        return i.message ? f('warn') : (i.loading ? f('waiting') : i.percent + '%')
      }
    },
    getStyle(i) {
      if (this.no || !i.Info) return
      i = i.Info
      return {transform: [
        'translateX(-50%)',
        'translateY(-50%)',
        `rotate(${i.Rotate}deg)`,
        `scaleX(${i.ScaleX})`,
        `scaleY(${i.ScaleY})`
      ].join(' ')}
    },
    select2(i) {
      if (this.no) return
      if (i.Id) {
        this.select(i)
        let a = []
        if (i.Info.Resolution) a.push('分辨率较低')
        if (i.Info.Colorspace) a.push('颜色可能失真')
        // if (a.length > 0) this.showMessage('图片提示：' + a.join('，'))
      } else if (i.message) {
        this.showMessage(`${i.name}上传失败：${i.message}`)
        this.images.$remove(i)
        this.refresh()
        i.$destroy()
      } else {
        this.showMessage('图片还在上传哦')
      }
    },
    upload($event) {
      let a = $event.target.files
      if (a.length === 0) {
        this.showMessage('没有选择文件哦')
        return
      }
      let b = []
      for (let i = 0; i < a.length; i++) {
        let f = a[i]
        if (!/^image\//i.test(f.type)) {
          this.showMessage(`文件${f.name}不是图片哦`)
        } else if (f.size < MinSize) {
          this.showMessage(`图片${f.name}太小哦`)
        } else if (f.size > MaxSize) {
          this.showMessage(`图片${f.name}太大哦`)
        } else {
          b.push(f)
        }
      }
      if (b.length === 0) return
      let that = this
      a = b.map(v => new Vue({
        data: { Info: {Rotate: 0, ScaleX: 1, ScaleY: 1}, name: v.name, percent: 0, loading: false, message: '' },
        beforeDestroy() {
          URL.revokeObjectURL(this._src)
          this._src = null
          this._promise = null
        },
        methods: {
          setInfo(f) {
            let self = this
            let r = new FileReader()
            r.onload = e => {
              self.Info = getTransform(getOrientation(e.target.result))
            }
            r.readAsArrayBuffer(f)
          }
        },
        created() {
          let self = this
          self._src = URL.createObjectURL(v)
          self.setInfo(v)
          let fd = new FormData()
          fd.append('Image', v)
          self._promise = () => self.$http.post('image/upload', fd, {
            progress(e) {
              self.percent = Math.floor(e.loaded / e.total * 100)
            }
          }).then(res => {
            let b = res.body
            that.showMessage(self.name + (b.Duplicate ? '重复文件' : '上传成功'))
            self.loading = true
            loadImage(that.icon(b)).then(img => {
              self.loading = false
              let a = that.images
              if (b.Duplicate) {
                for (let i = 0; i < a.length; i++) {
                  if (b.Id === a[i].Id) {
                    a.splice(i, 1)
                    break
                  }
                }
              }
              a.$set(a.indexOf(self), b)
              that.refresh()
              self.$destroy()
            })
          }, res => {
            res.hideAlert()
            self.message = res.errorMessage
          })
          // self._promise = new Promise((resolve, reject) => {
          //   let xhr = new XMLHttpRequest()
          //   xhr.upload.addEventListener('progress', e => {
          //     self.percent = Math.floor(e.loaded / e.total * 100)
          //   }, false)
          //   xhr.onreadystatechange = () => {
          //     if (xhr.readyState < 4) return
          //     if (xhr.status === 200) {
          //       let res = JSON.parse(xhr.responseText)
          //       if (res.Error) {
          //         self.message = res.Error
          //       } else {
          //         that.showMessage(self.name + (res.Duplicate ? '重复文件' : '上传成功'))
          //         self.loading = true
          //         loadImage(that.icon(res)).then(img => {
          //           self.loading = false
          //           let a = that.images
          //           if (res.Duplicate) {
          //             for (let i = 0; i < a.length; i++) {
          //               if (res.Id === a[i].Id) {
          //                 a.splice(i, 1)
          //                 break
          //               }
          //             }
          //           }
          //           a.$set(a.indexOf(self), res)
          //           // that.refresh()
          //           self.$destroy()
          //         })
          //       }
          //     } else {
          //       self.message = xhr.status + ' ' + xhr.statusText
          //     }
          //     resolve()
          //   }
          //   xhr.open('POST', this.$request.BaseUrl + '/image/upload', true)
          //   xhr.withCredentials = true
          //   xhr.setRequestHeader('Application', this.$request.Application)
          //   let fd = new FormData()
          //   fd.append('Image', v)
          //   xhr.send(fd)
          // })
        }
      }))
      that.images = a.concat(that.images)
      that.refresh()

      b = a.map(v => v._promise)
      let p = Promise.resolve(b.length)
      for (let i = 0; i < b.length; i++) {
        p = p.then(b[i])
        b[i] = p
      }
      Promise.all(b)
    }
  }
}
</script>

<style lang='stylus'>
.weui_uploader_input_wrp,
.weui_uploader_file
  background-size contain
  box-sizing content-box
  float none
  margin 0
  & > img
    border 0
    max-width 100%
    max-height 100%
    position absolute
    top 50%
    left 50%
.weui_uploader_status:before
  content none
.weui_uploader_status:after
  content ' '
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(0, 0, 0, 0.1)
  z-index 1
.weui_uploader_status.inactive:after
  background-color transparent
.weui_uploader_status_content
  z-index 2
</style>
