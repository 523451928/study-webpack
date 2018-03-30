<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="image-area">
    <overflow-box :bom-length="images.length" ref="overflower">
      <div class="bom-list-area">
        <div class="scroller-header clearfix">
          图片
        </div>
        <ul class="scroll-list scroll-icon-list clearfix">
          <li class="bom-item img-item" v-for="(i, index) of images" :class="getClass(i)" @click="select2(i)">
            <a href="javascript:void(0)" class="del-image" @click.stop="delImage(i, index)"><i class="wa wa-times-circle"></i></a>
            <img v-if="i.Id" :src="icon(i)" :style="getStyle(i)">
            <img v-if="i._src" :src="i._src" :style="getStyle(i)">
          </li>
        </ul>
        <!--//图片做了后台分页 不能直接用BOM分页组件  这里单独写-->
        <div class="pagination-area" v-if="pager.Count === count">
          <div class="center">
            <a class="ctr-label"  :class="{ 'disable':isMinPage}"  @click="changePage('minus')" href="javascript:void(0)"><i class="wa wa-caret-left"></i></a>
            <input class="form-control" readonly v-model="inputPage">
            <a class="ctr-label"  :class="{ 'disable':isMaxPage}" @click="changePage('plus')" href="javascript:void(0)"><i class="wa wa-caret-right"></i></a>
          </div>
        </div>
      </div>
      <loading :show="loading"></loading>
      <toast :show.sync="show" :message="message" :time="3"
        :icon="false" :mask="false" :cancel="true"></toast>
    </overflow-box>
    <a class="upload-img-btn btn btn-block btn-primary">
      上传图片
      <input type="file" class="weui_uploader_input"
        name="uploader" multiple="multiple"
        @change="upload($event)">
    </a>
    <p class="cate-tips">
      <span class="error">* </span>建议上传尺寸：≥ <span id="size-tips">{{this.suggestSize}} 像素</span>
    </p>
  </div>
</template>

<script>
// import { loadImage } from 'scripts/utils/image'
import { mixin } from './scroller-util.js'
import { getTransform, getOrientation } from 'scripts/utils/custom/orientation.js'
import { SuggestSize as ss, ListParam } from 'scripts/utils/custom/consts.js'

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
      count: ListParam.Count,
      isMinPage: true,
      isMaxPage: false
    }
  },
  mounted() {
    this.list(this.page, this.count)
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
//    if (this._s) {
//      this._s.destroy()
//      this._s = null
//    }
  },
  computed: {
    inputPage: {
      get: function() {
        return this.page
      },
      set: function(newValue) {
        this.page = newValue.replace(/[^\d]/g, '') || this.page
      }
    },
    suggestSize() {
      let catId = this.catId
      return ss.get(catId) || ss.get('pro')
    }
  },
  methods: {
    refresh(next = true) {
      let s = this.$refs.scroller
      if (s) {
        let f = () => s.refresh()
        next ? this.$nextTick(f) : f()
      }
    },
    scrollTo(c = 'active') {
      let s = this.$refs.scroller
      if (s) {
        s.refresh()
        let el = this.$els.scroller.querySelector('li.' + c)
        if (el) s.scrollToElement(el, 250, 0, 0)
      }
    },
    icon(i) {
      return this.$request.thumb('image', i.Id, 120, i.File)
    },
    list(page, count) {
      // 获取用户图片
      if (this.loading) return
      this.loading = true
      this.$then(this.$request.list('image', {
        params: {Mode: 0, Page: page, Count: count}
      }), res => {
        let p = res.data.Pager
        let d = res.data.Data
        p.N = d.length
        if (p.N === 0 && p.Page > 1) {
          layer.toast('没有更多图片了哦')
          this.page --
        } else {
          this.pager = p
          this.images = this.images.filter(v => !v.Id).concat(d)
          this.isMaxPage = p.N < count
          // this.initImagesSize()
          this.refresh()
        }
      }, undefined, () => {
        this.loading = false
      })
    },
    initImagesSize(imgs) {
      // 不知道干嘛的函数 处理图片的把
      //  从图片FILE字符串获取图片实际大小 并判断图片的形状类型 （方  长 宽）
      // let images = imgs || this.images
      // if (images.length < 1) return
      // images.forEach((image) => {
      //   if (image.hasOwnProperty('RealWidth')) return
      //   let fileStrArray = image.File.split('-')[1].split('.')[0].split('x')
      //   image['RealWidth'] = parseInt(fileStrArray[0])
      //   image['RealHeight'] = parseInt(fileStrArray[1])
      //   if (image['RealWidth'] === image['RealHeight']) {
      //     image['Shape'] = 'square'
      //   } else {
      //     image['Shape'] = image['RealWidth'] > image['RealHeight'] ? 'horizontal' : 'vertical'
      //   }
      // })
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
      let marginOffset = [i.RealHeight, i.RealWidth]
      switch (i.Shape) {
        //  按短边填满显示 居中
        case 'square':
        case 'horizontal':
          style['height'] = '100%'
          style['margin-left'] = Math.trunc((marginOffset[0] - marginOffset[1]) / marginOffset[1] * 100 * 2 / 3) + '%'
          break
        case 'vertical':
          style['width'] = '100%'
          style['margin-top'] = Math.trunc((marginOffset[1] - marginOffset[0]) / marginOffset[0] * 100 * 2 / 3) + '%'
          break
      }
      style['transform'] = [
        `rotate(${info.Rotate}deg)`,
        `scaleX(${info.ScaleX})`,
        `scaleY(${info.ScaleY})`
      ].join(' ')
      return style
    },
    select2(i) {
      // 选中图片
      if (this.no) return
      if (i.Id) {
        this.select(i)
        let a = []
        // if (i.Info.Resolution) a.push('分辨率较低')
        // if (i.Info.Colorspace) a.push('颜色可能失真')
        if (a.length > 0) {
          // layer.toast(`图片提示：${a.join('，')} !`)
          this.showMessage(`图片提示：${a.join('，')} !`)
        }
      } else if (i.message) {
        layer.toast(`${i.name}上传失败：${i.message}`)
        this.images.$remove(i)
        this.refresh()
        i.$destroy()
      } else {
        layer.toast('图片还在上传哦')
      }
    },
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
          self._promise = () => self.$http.post('image/upload', fd, {
            progress(e) {
              self.percent = Math.floor(e.loaded / e.total * 100)
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
        if (this.isMaxPage) return layer.shortToast('没有更多图片了哦', 1.5)
        this.page += 1
        this.isMinPage = false
      } else if (action === 'minus') {
        if (this.isMinPage) return layer.shortToast('前边是没有图片的', 1.5)
        this.page = this.page - 1
        this.isMinPage = this.page <= 1
        this.isMaxPage = false
      }
      this.list(this.page, ListParam.Count)
    },
    delImage(i, index) {
      let self = this
      layer.open({
        content: '确认要删除这幅图片吗？',
        btn: ['确认[Y]', '取消[N]'],
        yes: function() {
          request.remove('image', i['Id']).then(res => {
            if (res.take('Data')) {
              self.images.splice(index, 1)
              layer.toast('图片删除成功')
            }
          }, res => {
            res.hide()
            layer.toast(res.take('Error'))
          })
        }
      })
    }
  }
}
</script>

<style lang='sass'>
  .upload-img-btn{
    margin-top: 10px;
    line-height: 1.5;
    font-size: 18px;
    position: relative;
  },
  .image-mask{
    position: absolute;
    width: 100%;
    height:100%;
    top:0;
    left:0;
    line-height: 53px;
    color:#fff;
    background: rgba(0,0,0,.6);
    text-align: center;
  }
</style>
