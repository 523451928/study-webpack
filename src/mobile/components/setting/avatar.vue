<template>
  <div class="main-cont tab-content col-md-10" id="head-img-setting">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">上传图片</div>
        <div class="panel-body"><a href="javascript:;" class="a-upload">
          本地上传
          <input type="file" accept="image/gif, image/jpeg, image/png" class="weui_uploader_input" name="uploader"
                 multiple="multiple" @change="upload($event)">
        </a>
          <div class="ww-uphead-tips">
            请上传小于5M的JPG、GIF或PNG图片；改头像会对外显示，请不要上传私密头像。
          </div>
          <div class="ww-uphead-container">
            <div class="row">
              <div class="col-sm-7 ww-uphead-imgbox">
                <span v-show="percent" v-text="percent +'%'"></span>
                <div class="ww-uphead-img">
                </div>
              </div>
              <div class="col-sm-5 ww-uphead-thumbox">
                <h3 class="preview-tit">头像预览：</h3>
                <div class="ww-uphead-thum">
                  <img src="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="save-container">
        <a href="javascript:void(0)" id="save-head-img" @click="submit" class="btn btn-primary btn-lg">保存</a>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
  .holder-item >img{
    display: none;
  }
  .a-upload {
    padding: 0 50px;
    color: #565a5c;
    line-height: 26px;
    position: relative;
    cursor: pointer;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
  }

  .a-upload  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
  }

  .a-upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
  }
</style>
<script>
import 'js/jquery.Jcrop.js'
const MinSize = (1 << 10)
const MaxSize = 5 * (1 << 20)
export default {
  data() {
    return {
      percent: 0,
      crop: {},
      id: 0
    }
  },
  mounted() {
    let self = this
    const url = 'header'
    request({url}).then(res => {
      self.id = res.data['UserId']
    })
  },
  methods: {
    upload($event) {
      let self = this
      let a = $event.target.files[0]
      if (!a) {
        layer.toast('没有选择文件哦')
        return
      }
      $('.ww-uphead-img').css('background', '#efefef')
      if (!/^image\//i.test(a.type)) {
        layer.toast(`文件 ${a.name} 不是图片哦`)
        return
      } else if (a.size < MinSize) {
        layer.toast(`图片 ${a.name} 太小哦`)
        return
      } else if (a.size > MaxSize) {
        layer.toast(`图片 ${a.name} 太大哦`)
        return
      }
      const fd = new window.FormData()
      fd.append('File', a)
      request.submit('upload/avatar-original', fd, {
        progress(e) {
          self.percent = Math.floor(e.loaded / e.total * 100)
        }
      }).then(
        res => {
          const data = res.take('Data')
          const realSize = data.split('-')[1].split('.')[0].split('x')
          self.percent = 0
          self.crop.Original = data
          self.crop.Rotate = 0
          $('.ww-uphead-img').css('background', '#fff').html(
            `
            <div class="holder-item">
              <img src="" id="originalImg">
            </div>
            `
          )
          let src = 'http://192.168.1.6:8000/thumbnail/avatar-original/' + self.id + '/480/' + data

          $(function() {
            let $img = $('#originalImg')
            let $thum = $('.ww-uphead-thum')
            let $thumImg = $('.ww-uphead-thum img')
            $img.attr('src', src)
            $thumImg.attr('src', src)
            $img.on('load', function() {
              let imgW = $img.width()
              let imgH = $img.height()
              let mt = 0
              let ml = 0
              let itemW = 400
              let itemH = 400
              let xsize = $thum.width()
              let ysize = $thum.height()
              let showW
              let showH
              $img.parent().css({'padding-top': 0, 'padding-left': 0})
              if (imgW > imgH) {
                showW = itemW
                showH = imgH * itemW / imgW
                mt = (itemH - showH) / 2
                $img.parent().css('padding-top', mt)
              } else if (imgW < imgH) {
                showH = itemH
                showW = imgW * itemH / imgH
                ml = (itemW - showW) / 2
                $img.parent().css('padding-left', ml)
              }
              $img.Jcrop({
                boxWidth: showW,
                boxHeight: showH,
                allowSelect: false,
                aspectRatio: 1,
                setSelect: [0, 0, 220, 220],
                minSize: [100, 100],
                onChange: updatePreview
              })
              function updatePreview(c) {
                if (parseInt(c.w) > 0) {
                  let rx = xsize / c.w
                  let ry = ysize / c.h
                  let scalex = realSize[0] / imgW
                  let scaley = realSize[1] / imgH
                  let final = Math.min(Math.floor(c.w * (scalex)), Math.floor(c.h * (scaley)))
                  self.crop.Geometry = final + 'x' + final + '+' + Math.floor(c.x * (scalex)) + '+' + Math.floor(c.y * (scaley))
                  $thumImg.css({
                    width: Math.round(rx * imgW) + 'px',
                    height: Math.round(ry * imgH) + 'px',
                    marginLeft: '-' + Math.round(rx * c.x) + 'px',
                    marginTop: '-' + Math.round(ry * c.y) + 'px'
                  })
                }
              }
            })
          })
        }, res => {
          res.hide()
          const err = res.take('Error')
          if (err === 'NotLogin') {
            setTimeout(function() {
              window.location.href = 'login.html?next=' + encodeURIComponent('setting.html#/avatar')
            })
          } else {
            layer.toast(err)
          }
        })
    },
    submit() {
      let self = this
      if (!self.crop['Geometry']) {
        return
      }
      request.submit('user/avatar/crop', self.crop).then(
      res => {
        if (res.take('Data')) {
          layer.toast('上传成功')
          setTimeout(function() {
            location.href = 'setting.html'
          }, 1000)
        }
      }, res => {
        layer.toast('上传失败请重试')
      })
    }
  }
}
</script>
