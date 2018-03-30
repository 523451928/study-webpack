<template>
  <div class="warp">
    <!--头部-->
    <div class="profile-head">
      <a href="./user.html" class="pull-left back">
        <i class="wa wa-left"></i>
      </a>账号编辑
    </div>
    <!--编辑选项-->
    <div class="user-fixed-head-wrap cont-wrap container">
      <div class="row user-profile-menu">
        <div class="col-xs-12">
          <a class="head-link clearfix" id="local-upload" data-type="headImg" href="javascript:void(0)">
            <i class="wa wa-right pull-right"></i>
            <span class="pull-right">
              <img :src="Avatar" v-if="Avatar" >
            </span>
            头像
            <div class="input-file">
            <input type="file" accept="image/gif, image/jpeg, image/png" name="uploader" multiple="multiple" class="weui_uploader_input" @change="uploadPhoto($event)">
          </div>
          </a>
          <a class="profile-nav-link clearfix" data-type="nickName" href="javascript:void(0)" @click="tab(1)">
            <i class="wa wa-right pull-right"></i>
            <span class="pull-right">{{nickName}}</span>
            昵称
          </a>
          <a class="profile-nav-link clearfix" data-type="password" href="javascript:void(0)" @click="tab(3)">
            <i class="wa wa-right pull-right"></i>
            修改密码
          </a>
          <!--<a class="profile-nav-link last clearfix" data-type="address" href="javascript:void(0)" @click="tab(4)">-->
            <!--<i class="wa wa-right pull-right"></i>-->
            <!--收货地址-->
          <!--</a>-->
        </div>
      </div>
    </div>
    <!--资料编辑-->
    <div class="profile-tab-cont" :class="{active: seen}">
      <!--昵称-->
      <div class="profile-cont" :class="{active:active===1}" id="nickName-cont">
        <div class="profile-head">
          <a @click="hideEditer" class="back profile-back">
            <i class="wa wa-left"></i>
          </a>修改昵称
        </div>
        <div class="user-fixed-head-wrap cont-wrap container">
          <form class="row user-profile-form" id="nameForm">
            <div class="col-xs-12">
              <div class="form-group">
                <div class="form-cont last">
                  <input type="text" class="form-control validate[required]" id="nickname" placeholder="昵称" v-model="Nickname"/>
                </div>
              </div>
            </div>
          </form>
        </div>
        <a href="javascript:void(0)" class="btn btn-primary fixed-bottom-btn" @click="nameSubmit()">保存修改</a>
      </div>
      <!--头像-->
      <div class="profile-cont" :class="{active:active===2}" id="headImg-cont">
        <div class="profile-head">
          <a @click="hideEditer" class="back profile-back">
            <i class="wa wa-left"></i>
          </a>头像编辑
        </div>
        <div class="user-fixed-head-wrap cont-wrap container">
          <div class="form-wrap head-wrap">
            <div class="ww-uphead-container">
              <div class="ww-uphead-imgbox">
                <span v-show="percent" v-text="percent +'%'"></span>
                <div class="ww-uphead-img">
                </div>
              </div>
              <div class="save-container clearfix">
                <a href="javascript:void(0)" class="btn btn-primary profile-back" @click="hideEditer">取消</a>
                <a href="javascript:void(0)" class="btn btn-primary" @click="savePhoto">保存</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--密码-->
      <div class="profile-cont"  :class="{active:active===3}" id="password-cont">
        <div class="profile-head">
          <a @click="hideEditer" class="back profile-back">
            <i class="wa wa-left"></i>
          </a>修改密码
        </div>
        <div class="user-fixed-head-wrap pt-45 cont-wrap container">
          <div class="row user-profile-form">
            <div class="main-cont tab-content col-xs-12">
              <div class="form-wrap">
                <div class="form form-base user-form" id="passwordForm">
                  <div class="panel panel-default">
                    <div class="panel-body profile-panel-body">
                      <div class="form-group">
                        <div class="form-cont">
                          <input type="password" v-model="Oldpassword" class="form-control validate[required,minSize[6]]" id="oldpwd" placeholder="旧密码">
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="form-cont">
                          <input type="password" v-model="Newpassword" class="form-control validate[required,minSize[6]]" id="newpwd" placeholder="新密码">
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="form-cont last">
                          <input type="password" v-model="Confirmpassword" class="form-control validate[equals[newpwd]]" id="cfmpwd" placeholder="确认密码">
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href="javascript:void(0);" class="btn btn-primary fixed-bottom-btn" id="submit-btn" @click='passwordsubmit'>保存修改</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--收货地址-->
      <div class="profile-cont" :class="{active:active===4}" id="address-cont">
        <add @hideAdd="hideEditer" ref="addr"></add>
      </div>
    </div>
    <!--<div class="action-sheet-mask">-->
      <!--<div class="action-sheet-content">-->
        <!--<div class="action-title scale-1px">确认删除吗?</div>-->
        <!--<div class="action-confirm">删除</div>-->
        <!--<div class="action-cancel">取消</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--底部-->
    <a href="/logout.html" class="fixed-bottom-btn logout-btn">退出账号</a>
  </div>
</template>

<script>
  /* eslint-disable */
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  import { getUrlParams } from 'scripts/tools/getUrlParams'
  import 'js/jquery.Jcrop.js'
  import add from './add.vue'
  const MinSize = (1 << 10)
  const MaxSize = 5 * (1 << 20)
  export default {
    components: {add},
    data() {
      return {
        Nickname: '',
        Avatar: '',
        active: 0,
        percent: 0,
        seen: false,
        Oldpassword: '',
        Newpassword: '',
        Confirmpassword: '',
        crop: {},
        id: 0
      }
    },
    mounted() {
      this.getUserInfo()
      if (getUrlParams().isAdd) {
        this.active = 4
        this.seen = true
      }
    },
    methods: {
      hideEditer() {
        this.seen = false
        this.active = 0
      },
    getUserInfo() {
        request({url: Interf.getUserHead}).then(res => {
          let data = res.data
          this.id = res.data['UserId']
          if (data['Avatar'] !== '') {
            this.Avatar = 'http://m.wallwa.xxx/thumbnail/avatar/' + data['UserId'] + '/100/' + data['Avatar']
          } else {
            this.Avatar = '/static/images/user/default-profile.jpg'
          }
          if (data['Nickname']) {
            this.Nickname = data['Nickname']
            this.nickName = data['Nickname']
          } else {
            this.Nickname = 'U' + data['UserId']
            this.nickName = 'U' + data['UserId']
          }
        })
      },
      tab(num) {
        this.seen = true
        this.active = num
        if (this.active === 1) {
          this.Nickname = this.nickName  
        } else if (this.active === 3) {
        }
      },
      trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "")
      },
      nameSubmit() {
        let obj = {
          'Nickname': this.Nickname
        }
        if (this.trim(this.Nickname).length === 0) { 
          this.$toast.center('昵称不能为空')
          return 
        }
        request.submit(Interf.getUserList, obj).then(res => {
          let num = res.take('Data')
          if (num) {
            this.nickName = this.Nickname
            this.$toast.center('昵称修改成功')
          } else {
            this.$toast.center('已为你保存当前昵称')
          }
        }, res => {
          res.hide()
          this.$toast.center(res.take('Error'))
        })
      },
      passwordsubmit() {
        let obj = {
          'OldPassword': this.Oldpassword,
          'NewPassword': this.Newpassword
        }
        if (this.Oldpassword.length === 0) {
          this.$toast.center('旧密码不能为空')
          return
        }
        if (this.Newpassword.length < 6) {
          this.$toast.center('新密码最少为6位')
          return
        }
        if (this.Newpassword !== this.Confirmpassword) {
          this.$toast.center('两次密码输入不一致')
          return
        }
        request.submit(Interf.changePassWord, obj).then(res => {
          if (res.take('Data')) {
             this.$toast.center('密码重置成功')
//            setTimeout(function() { window.location.href = 'user.html' }, 1000)
          } else {
             this.$toast.center('输入有误，请重新输入')
          }
        }, res => {
          res.hide()
           this.$toast.center(res.take('Error'))
        })
      },
      uploadPhoto($event) {
        let self = this
        let a = $event.target.files[0]
        if (!a) {
           this.$toast.center('没有选择文件哦')
          return
        }
        self.tab(2)
        if (!/^image\//i.test(a.type)) {
           this.$toast.center(`文件 ${a.name} 不是图片哦`)
          return
        } else if (a.size < MinSize) {
           this.$toast.center(`图片 ${a.name} 太小哦`)
          return
        } else if (a.size > MaxSize) {
           this.$toast.center(`图片 ${a.name} 太大哦`)
          return
        }
        const fd = new window.FormData()
        fd.append('File', a)
        request.submit('upload/avatar-original', fd, {
          progress(e) {
            self.percent = Math.floor(e.loaded / e.total * 100)
          }
        }).then(res => {
          const data = res.take('Data')
          const realSize = data.split('-')[1].split('.')[0].split('x')
          self.percent = 0
          self.crop.Original = data
          self.crop.Rotate = 0
          $('.ww-uphead-img').html(
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
          this.hideEditer()
          this.$toast.center('上传失败请重试!')
        })
      },
      savePhoto() {
        let self = this
        if (!self.crop['Geometry']) {
          return
        }
        console.log(this.crop['Geometry'])
        request.submit('user/avatar/crop', self.crop).then(res => {
          if (res.take('Data')) {
            this.$toast.center('上传成功')
            this.Avatar = 'http://m.wallwa.xxx/thumbnail/avatar/' + this.id + '/100/' + res.take('Data')
          }
        }, res => {
          this.$toast.center('上传失败请重试')
        })
      }
    }
  }
</script>
