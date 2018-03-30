<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="image-area">
    <!--对应图片列表-->
    <overflow-box :class="'horizontal'" ref="overflowBox">
      <div class="upload-img-btn">
        <span class="wa wa-plus"></span>
        <input type="file" multiple="multiple" accept="image/jpeg,image/jpg,image/png" ref="upload-img-real-btn" class="upload-img-real-btn" @change="upload($event)">
      </div>
      <ul class="img-list clearfix">
        <li class="img-item img-upload-process" v-show="percent != 100">{{percent}}%</li>
        <li :class="{'active': index === imageActiveIndex}" class="img-item" v-for="(img, index) of images" @click="select2(img, index)">
          <img v-if="img.Id" :src="icon(img)" class="img-item-img" :style="getStyle(img)">
          <img v-if="img._src" :src="img._src" :style="getStyle(img)">
        </li>
      </ul>
      <div v-if="images.length > 5" class="upload-img-btn" @click="list">
        <span class="wa wa-all-product" ></span>
      </div>
    </overflow-box>
  </div>
</template>
<style lang='sass'>
  .image-area {
    background-color: #fff;
    height: 80px;
    /*border-top: 1px solid #dce0e0;*/
    .upload-img-btn {
      position: relative;
      height: 100%;
      width: 70px;
      border: 1px solid rgb(220, 224, 224);
      text-align: center;
      margin-left: 5px;
      margin-right: 5px;
      display: inline-block;
      vertical-align: top;
      .upload-img-real-btn {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        display: block;
        width: 100%;
        height: 100%;
      }
      .wa {
        font-size: 35px;
        line-height: 70px;
        color: #DCE0E0;
      }
    }
    .img-list {
      width: auto;
      height: 100%;
      list-style-type: none;
      display: inline-block;
      margin: 0;
      padding: 0;
      background-color: #fff;
      overflow-x: auto;
      white-space: nowrap;
      .img-item {
        margin-right: 5px;
        cursor: pointer;
        width: 70px;
        height: 70px;
        border: 1px solid #dce0e0;
        overflow: hidden;
        display: inline-block;
        .img-item-img {
          outline: none;
          .active {
            border: 1px solid #26a7c7;
          }
        }
        &.active{
          border: 2px solid #26A7C7;
        }
      }
      .img-upload-process{
        text-align: center;
        line-height: 70px;
        border: 1px solid #26A7C7;
        color: #26A7C7;
      }
    }
  }
</style>
<script>
/* eslint-disable */
import { loadImage } from 'scripts/utils/image'
import { mixin } from './app/scroller-util'
import { getTransform, getOrientation } from 'scripts/utils/custom/orientation'
import { ListParam } from 'scripts/utils/custom/consts'

const MinSize = 10 * (1 << 10)
const MaxSize = 100 * (1 << 20)

export default {
  mixins: [mixin],
  data() {
    return {
      type: 'image',
      value: true,
      show: false,
      message: '',
      loading: false,
      images: [],
      pager: {},
      page: 1,
      isMinPage: true,
      isMaxPage: false,
      count: ListParam.Count,
      imageActiveIndex: -1,
      curentIndex: -1,
      isAuto: true,
      percent: 100
    }
  },
  mounted() {
    this.list()
    this.horizontalInstance = new Loadmore({
        el: this.$refs.overflowBox.$el,
        scrollDirection: 'horizontal',
        elasticRolling: true
      })
    this.$onBus('changeActive', (index) => {
//      this.imageActiveIndex = index || this.curentIndex
      this.isAuto = false
      this.imageActiveIndex = index
      if (this.imageActiveIndex > 3) {
        this.$nextTick(() => {
          this.$refs.overflowBox.$el.scrollLeft = (this.imageActiveIndex - 1) * 72
        })
      }
    })
    var mult = function() {
      var a = 1
      for (var i = 0;i < arguments.length; i++) {
        a *= arguments[i]
      }
      return a
    }
    var plus = function() {
      var n = 0
      for (var i = 0;i < arguments.length;i++) {
        n += arguments[i]
      }
      return n
    }
    var proxyFunC = function(fn) {
      var cache = {}
      return function() {
        var args = Array.prototype.join.call(arguments, ',')
        if (args in cache) {
          return cache[args]
        }
        return cache[args] = fn.apply(this, arguments)
      }
    }
    var proxyMult = proxyFunC(mult)
    proxyMult(1,2,3)
    proxyMult(1,2,3)
    var proxyPlus = proxyFunC(plus)
    proxyPlus(1,2,3)
    var SingleTon = function(name) {
      this.name = name
    }
    SingleTon.prototype.getName = function () {
      return this.name
    }
    var getInstance = (function() {
      var instance = null
      return function(name) {
        if (!instance) {
          return instance = new SingleTon(name)
        }
        return instance
      }
    })()
    var a = getInstance('单体模式')
    var b = getInstance('other')
    var arr = [5,3,6,1,4,9]
    function bubbleSort(arr) {
      var len = arr.length
      for (var i = 1;i < len; i++) {
        for (var j = 0;j < len - i;j++) {
          if (arr[j] > arr[j+1]) {
            [arr[j+1], arr[j]] = [arr[j], arr[j+1]]
          }
        }
      }
      return arr
    }
    var str = 'hello world'
    function findMax(str){
      var tmp = {}
      for (var i = 0;i < str.length;i++) {
        if (!tmp[str[i]]) {
          tmp[str[i]] = 1
        } else {
          tmp[str[i]] += 1
        }
      }
      var maxStr,maxNum =  1
      for (var key in tmp) {
        if (tmp[key] > maxNum) {
          maxNum = tmp[key]
          maxStr = key
        }
      }
      console.log(`出现最多次数的${maxStr} 出现${maxNum}次`)
    }
    var arr = [2,4,6,3,1,2,4,1,2]
    function removeRepeat(arr) {
      var newArr = []
      var tmp = {}
      for (var i = 0;i < arr.length;i++) {
        if (!tmp[arr[i]]) {
          newArr.push(arr[i])
          tmp[arr[i]] = arr[i]
        }
      }
      return newArr
    }
  },
  computed: {
    inputPage: {
      get: function() {
        return this.page
      },
      set: function(newValue) {
        this.page = newValue.replace(/[^\d]/g, '') || this.page
      }
    }
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
    if (this._s) {
//      this._s.destroy()
      this._s = null
    }
  },
  methods: {
    refresh(next = true) {
      let s = this._s
//      if (s) {
//        let f = () => s.refresh()
//        next ? this.$nextTick(f) : f()
//      }
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
      return request.thumb('image', i.Id, 120, i.File)
    },
    list() {
      if (this.loading) {
        layer.toast('没有更多图片了哦')
        return
      }
      this.$loading()
      this.loading = true
      request.list('image', {
        params: {Mode: 0, Page: this.page, Count: this.count}
      }).then(res => {
        let p = res.data.Pager
        let d = res.data.Data
        p.N = d.length
        this.$loading.close()
        if (p.N === 0 && p.Page > 1) {
          layer.toast('没有更多图片了哦')
        } else {
          this.page++
          this.loading = false
          this.pager = p
          this.images = this.images.concat(d)
          if (this.images.length === 0) {
            this.$tip({
              message: '上传张图片试试',
              style: {
                bottom: '60px',
                left: '90px'
              },
              triangleDirection: 'left'
            })
          }
          this.isMaxPage = p.N < this.count
          this.initImagesSize()
//          this.refresh()
        }
      })
    },
    initImagesSize() {
      //  从图片FILE字符串获取图片实际大小 并判断图片的形状类型 （方  长 宽）
      if (this.images.length < 1) return
      this.images.forEach((image, index) => {
        let fileStrArray = image.File.split('-')[1].split('.')[0].split('x')
        image['RealWidth'] = parseInt(fileStrArray[0])
        image['RealHeight'] = parseInt(fileStrArray[1])
        image['Index'] = index
        if (image['RealWidth'] === image['RealHeight']) {
          image['Shape'] = 'square'
        } else {
          image['Shape'] = image['RealWidth'] > image['RealHeight'] ? 'tran' : 'vertical'
        }
        if (this.isAuto === true) {
          this.select2(image, index, true)
        }
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
      let info = i.Info
      let style = {}
      switch (i.Shape) {
        //  按短边填满显示 居中
        case 'square':
        case 'tran':
          style['height'] = '100%'
          style['margin-left'] = Math.trunc((i.RealHeight - i.RealWidth) * 100 / i.RealWidth) + '%'
          break
        case 'vertical':
          style['width'] = '100%'
          style['margin-top'] = Math.trunc((i.RealWidth - i.RealHeight) * 100 / i.RealHeight) + '%'
          break
      }
      style['transform'] = [
        `rotate(${info.Rotate}deg)`,
        `scaleX(${info.ScaleX})`,
        `scaleY(${info.ScaleY})`
      ].join(' ')

      return style
    },
//    底部状态栏图片点击事件
    select2(i, index, flag) {
      if (this.no) return
      this.curentIndex = index
      if (i.Id) {
        this.select(i, index, flag)
        let a = []
        if (i.Info.Resolution) a.push('分辨率较低')
        if (i.Info.Colorspace) a.push('颜色可能失真')
        if (a.length > 0) this.showMessage('图片提示：' + a.join('，'))
      } else if (i.message) {
        this.showMessage(`${i.name}上传失败：${i.message}`)
        this.images.$remove(i)
        this.refresh()
        i.$destroy()
      } else {
        this.showMessage('图片还在上传哦')
      }
    },
//    图片上传
    upload($event) {
      let a = $event.target.files
      if (a.length === 0) {
        layer.toast('没有选择文件哦')
        return
      }
      let b = []
      for (let i = 0; i < a.length; i++) {
        let f = a[i]
        if (!/^image\//i.test(f.type)) {
          layer.toast(`文件${f.name}不是图片哦`)
        } else if (f.size < MinSize) {
          layer.toast(`图片${f.name}太小哦`)
        } else if (f.size > MaxSize) {
          layer.toast(`图片${f.name}太大哦`)
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
          self._promise = () => self.$http.post('http://m.wallwa.xxx/image/upload', fd, {
            progress(e) {
              self.percent = Math.floor(e.loaded / e.total * 100)
              that.percent = self.percent
            }
          }).then(res => {
            let b = res.body
            if (!b.Duplicate) {
              let r = {}
              for (let i in b) {
                switch (i) {
                  case 'Id':
                  case 'File':
                  case 'Info':
                    r[i] = b[i]
                    break
                }
              }
              that.images = [r].concat(that.images)
              that.imageActiveIndex++
              that.initImagesSize()
              layer.toast('上传成功')
              that.showMessage(self.name + '上传成功')
            } else {
              layer.toast('请不要上传重复文件')
              that.showMessage(self.name + '重复文件')
            }
            // that.showMessage(self.name + (b.Duplicate ? '重复文件' : '上传成功'))
            self.loading = true
          }, res => {
            res.hideAlert()
            self.message = res.errorMessage
          })
        }
      }))
      that.refresh()

      b = a.map(v => v._promise)
      let p = Promise.resolve(b.length)
      for (let i = 0; i < b.length; i++) {
        p = p.then(b[i])
        b[i] = p
      }
      Promise.all(b)
    },
    changePage(action) {
      if (action === 'plus') {
        if (this.isMaxPage) return
        this.page += this.page
        this.isMinPage = false
      } else if (action === 'minus') {
        if (this.isMinPage) return
        this.page = this.page - 1
        this.isMinPage = this.page <= 1
        this.isMaxPage = false
        this.page = this.page === 0 ? 1 : this.page
      }
      this.list(this.page, ListParam.Count)
    }
  }
}
</script>
