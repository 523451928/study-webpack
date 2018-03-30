<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="m-material">
    <div class="image-area" v-show="!isUpload">
        替换图片
        <input type="file" id="input_file" class="upload_file" accept="image/jpeg,image/png" @change="onUploadImg($event)">
    </div>
    <div class="progress-wrap" v-show="isUpload">
      <div class="progress" :style="progress"></div>
      <p>{{getProgress}}%</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import { loadImage } from 'scripts/utils/image'
// import { mixin } from './scroller-util.js'
// import { getTransform, getOrientation } from 'scripts/utils/custom/orientation.js'
// import { SuggestSize as ss, ListParam } from 'scripts/utils/custom/consts.js'

const MinSize = 10 * (1 << 10)
const MaxSize = 100 * (1 << 20)

export default {
  // mixins: [mixin],
  data() {
    return {
      isUpload: false, // 进度条是否加载
      imgData: undefined,
      progress: {
        width: '0px'
      }
    }
  },
  mounted() {
  },
  beforeDestroy() {
    
  },
  computed: {
    getProgress() {
      let w = Math.floor(parseInt(this.progress.width.match(/\d*/g)[0]) / 2.8)
      return w
    }
  },
  methods: {
    onUploadImg(e) {
      const f = e.target.files[0]
      const self = this
      if (!f) return
      if (f.size < MinSize) {
          layer.toast('图片尺寸太小,请重新选择')
          return
      }
      if (f.size > MaxSize) {
          layer.toast('图片尺寸太大,请重新选择')
          return
      }
      let formData = new FormData()
      formData.append("action", "UploadVMKImagePath")
      formData.append('Image', f)
      this.$http.post('image/upload', formData, {
        progress(e) {
          self.isUpload = true
          let t = e.total; // 总长度
          let c = e.loaded; // 当前进度
          let p = Math.floor(c / t * 100); // 百分比
          self.progress.width = (2.8 * p) + 'px'
        }
      }).then(res => {
        const imgData = res.body
        self.isUpload = false
        self.progress.width = '0px'
        delete imgData.Duplicate
        self.imgData = imgData
        this.$emit('select-image', self.imgData)
      })
    }
  }
}
</script>

