<template>
  <div class="main-cont tab-content col-md-10" id="head-img-setting">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">头像编辑</div>
        <div class="ww-uphead-tips">
          请上传小于5M的JPG、GIF或PNG图片；改头像会对外显示，请不要上传私密头像。
        </div>
        <a href="javascript:;" class="a-upload">
          修改头像
          <input type="file" accept="image/gif, image/jpeg, image/png" class="weui_uploader_input" name="uploader"
                   multiple="multiple" @change="upload($event)">
        </a>
        <div class="panel-body panel-body-avatar">
          <div class="ww-uphead-container" v-if="percent">
            <div class="row">
              <div class="col-sm-7 ww-uphead-imgbox">
                <!--<span v-show="percent" v-text="percent +'%'"></span>-->
                <!--<el-progress v-show="percent" :percentage="percent" status="success"></el-progress>-->
                <div class="ww-uphead-img">
                </div>
              </div>
              <!--<div class="col-sm-5 ww-uphead-thumbox">-->
                <!--<h3 class="preview-tit">头像预览：</h3>-->
                <!--<div class="ww-uphead-thum">-->
                  <!--<img src="">-->
                <!--</div>-->
              <!--</div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="save-container">
        <a href="javascript:void(0)" id="save-head-img" @click="submit" class="btn btn-primary btn-lg btn-submit">保存</a>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
  .holder-item >img{
    display: none;
  }
  .a-upload {
    width: 140px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 15px;
    color: rgba(86,90,92,1);
    position: relative;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 2px;
    overflow: hidden;
    display: inline-block;
    box-sizing: border-box;
    *display: inline;
    *zoom: 1;
    margin-left: 20px;
    &:hover{
      color: rgba(86,90,92,1);
    }
    input {
        position: absolute;
        font-size: 0;
        right: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
        filter: alpha(opacity=0);
    }
  }
  .a-upload:hover {
    border-color: #ccc;
    text-decoration: none
  }
  .panel-body-avatar{
    padding: 30px 20px;
  }
</style>
<script>
  /* eslint-disable */
import 'js/jquery.Jcrop.js'
import { InterfaceMap as Interf } from 'scripts/interfaceConst.js'
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
  },
  methods: {
    upload($event) {
      let self = this
      let a = $event.target.files[0]
      if (!a) {
        layer.toast('没有选择文件哦')
        return
      }
      if (!/^image\//i.test(a.type)) {
        this.$notify({
          'text': `文件 ${a.name} 不是图片哦`
        })
        return
      } else if (a.size < MinSize) {
        this.$notify({
          'text': `图片 ${a.name} 太小哦`
        })
        return
      } else if (a.size > MaxSize) {
        this.$notify({
          'text': `图片 ${a.name} 太大哦`
        })
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
//          self.percent = 0
          self.crop.Original = data
          self.crop.Rotate = 0
          $('.ww-uphead-img').css('background', '#fff').html(
            `
            <div class="holder-item">
              <img src="" id="originalImg">
            </div>
            `
          )

          let src = `${Interf.baseUrl}/thumbnail/avatar-original/${this.$user.UserId}/480/${data}`
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
              let itemW = 300
              let itemH = 300
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
              } else {
                showW = itemW
                showH = itemH
              }
              $img.Jcrop({
                boxWidth: showW,
                boxHeight: showH,
                allowSelect: false,
                aspectRatio: 1,
                setSelect: [0, 0, 220, 220],
                minSize: [80, 80],
                onChange: updatePreview
              })
              function updatePreview(c) {
                if (parseInt(c.w) > 0 && parseInt(c.w) > 70) {
                  let rx = xsize / c.w
                  let ry = ysize / c.h
                  let scalex = realSize[0] / $img.width()
                  let scaley = realSize[1] / $img.height()
                  let final = Math.min(Math.floor(c.w * (scalex)), Math.floor(c.h * (scaley)), 2160)
                  self.crop.Geometry = final + 'x' + final + '+' + Math.floor(c.x * (scalex)) + '+' + Math.floor(c.y * (scaley))
                  $thumImg.css({
                    width: Math.round(rx * $img.width()) + 'px',
                    height: Math.round(ry * $img.height()) + 'px',
                    marginLeft: '-' + Math.round(rx * c.x) + 'px',
                    marginTop: '-' + Math.round(ry * c.y) + 'px'
                  })
                } else {
                  layer.toast('图片太小哦，建议100*100像素以上')
                }
              }
            })
          })
        }, res => {
          res.hide()
          const err = res.take('Error')
          if (err === 'NotLogin') {
            setTimeout(function() {
              window.location.href = 'login.html?next=' + encodeURIComponent('/user/setting.html#/avatar')
            })
          } else {
            layer.toast(err)
          }
        })
    },
    submit() {
      if (!this.crop['Geometry']) {
        return
      }
      request.submit('user/avatar/crop', this.crop).then((res) => {
        if (res.take('Data')) {
          this.$notify({
            type: 'wa-success',
            text: '上传成功'
          })
          request({url: '_header'}).then(res => {
            this.$user.Avatar = `${Interf.baseUrl}/thumbnail/avatar/${res.data['UserId']}/100/${res.data['Avatar']}`
          })
        }
      }, res => {
        layer.toast('上传失败请重试')
      })
    }
  }
}
</script>
