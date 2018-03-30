<template>
  <div class="m-upload-img">
    <input type="file" accept="image/jpeg,image/png" name="upload" @change='onUploadImg($event)'>
  </div>
</template>

<script>
/*eslint-disable*/
import { MinSize, MaxSize } from 'scripts/utils/const'// 一些常量 最小的图片大小和最大的图片大小
export default {
  data() {
    return {
      rotate: '0 377', // 进度条旋转的角度
      progress: '0%', // 上传的进度,
      imageInfo: false, // 图片数据,如果失败则传false,
    }
  },
  created() {
    const self = this
    self.$emit('init-progress', {
      rotate: self.rotate,
      progress: self.progress
    })
  },
  methods: {
    /**
     * @param {Object} event
     */
    onUploadImg(e) {
      const self = this
      let file = e.target.files[0]
      let formData = new FormData()
      if (file) {
					// 验证图片尺寸
					if (file.size < MinSize) {
						this.$notify({
							type: 'wa-warning',
							text: '图片尺寸太小,请重新选择'
						})
						return
					}
					if (file.size > MaxSize) {
						this.$notify({
							type: 'wa-warning',
							text: '图片尺寸太大,请重新选择'
						})
						return
          }
          formData.append("action", "UploadVMKImagePath")
          formData.append('Image', file)
          self.$emit('open-progress', true)
          self.$http.post('image/upload', formData, {
            progress(e){
							let t = e.total; // 总长度
							let c = e.loaded; // 当前进度
              let p = Math.floor(c / t * 100); // 百分比
							self.rotate = `${p * 3.77} 377`;
							self.progress = `${p}%`;
              self.$emit('porssgress-info', {
                rotate: self.rotate,
                progress: self.progress
              })
						}
          }).then(res => {
            let data = res.body
            delete data.Duplicate
            self.$emit('close-progress', {
              imageData: data,
              rotate: '0 377',
              progress: '0%',
              isProgress: false
            })
          })
      }

      // self._initCategoryList().then(() => {
      //   let file = e.target.files[0]
      // })
    }
  }
}
</script>

<style lang="sass" scoped>
 .m-upload-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  >input[name="upload"] {
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
 }

</style>


