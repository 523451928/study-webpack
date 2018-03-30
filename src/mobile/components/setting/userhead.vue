<template>
  <div class="user-hear-warp">
  <!--问题联系浮动二维码开始-->
    <div class="contact-wechat" v-show="seen">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)" v-on:click="seen=false">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--//问题结束-->
    <!--用户背景图片开始-->
    <div class="user-head-bnr" :style="{backgroundImage: 'url('+$thumb('banner', bgId, 1920, bgImage)+')'}">
      <div class="link-container">
        <a href="javascript:void(0)" class="set-link btn btn-default pull-right mr10" id="change-bnr-btn" @click="changePhoto">
          <span class="wa wa-picture-o"></span> 更换背景图
        </a>
        <a href="/setting.html" class="set-link btn btn-default  pull-right mr10"><span class="wa wa-pencil"></span>  账号编辑</a>
        <a href="javascript:void(0)" class="btn btn-primary bnr-set w120 mr10" id="set-bnr-posBtn" v-show="viewDefault" @click="saveDefaultPhoto">保存</a>
      </div>
      <div class="user-bnr-info">
        <a class="head-icon layout-avatar" href="setting.html#/avatar">
          <div class="hover-layout">
            <span class="wa wa-camera"></span><br/>
            更换头像
          </div>
          <img class="item" :src="Avatar">
        </a>
        <div class="text-center user-info-name" v-text="Nickname"></div>
      </div>
    </div>
    <!--//用户背景图片结束-->
    <!--更换背景提示框开始-->
    <div class="modal" id="change-bnr-dialog" tabindex="-1" role="dialog" v-show="aria">
      <div class="modal-backdrop in"></div>
      <div class="modal-dialog">
        <div class="modal-content user-defined-bg">
          <div class="modal-body clearfix">
            <div class="change-bnr clearfix">
              <h2 class="change-bnr-title">修改店招
                <a class="close close-light" data-dismiss="modal" aria-label="Close" href="javascript:void(0)" v-on:click="close">
                  <span aria-hidden="true">×</span>
                </a>
              </h2>
              <div class="change-bnr-list row">
                <div class="col-md-6 select-img-area">
                  <div class="album-select">
                    <span class="wa wa-caret-down"></span>
                    <ul class="album-text-sel">
                      <li class="album-item" data-id="0">墙蛙推荐</li>
                    </ul>
                  </div>
                  <div class="img-list-wrap">
                    <h4>墙蛙推荐</h4>
                    <div class="img-list-area clearfix">
                      <ul class="list-unstyled cont-list proImg-chs-list clearfix">
                        <li v-for="(item,index) in images" :class="index==liIndex?'active':''" v-on:click="choice(item,index)">
                          <a class="face-img-list" :style="{backgroundImage: 'url('+$thumb('banner', item.Id, 480, item.Image)+')'}">
                            <div class="mask">
                              <i class="wa wa-check-tri"></i>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 upload-area">
                  <div class="upload-box">
                    <h4>自定义上传</h4>
                    <div class="upload-loading"></div>
                      <span class="loading-percent"></span>
                    <a href="javascript:void(0)" id="upload-bnr-btn" class="bnr-link custom-link">
                      <span class="img-wrap"></span>
                      <i class="wa wa-cloud-upload"><input type="file" class="file-upload" accept="image/jpeg, image/jpg" @change="uploadBanner($event)"/></i>
                      <span class="upload-msg"> 添加本地图片</span>
                      <span class="upload-tips" v-show="!error">建议上传1920x200像素及以上的图片<br/>文件大小小于1M，以达到最佳效果</span>
                      <span class="error-msg error" v-show="error">上传失败，你的图片过小，需要上传1920x200像素以上的图片</span>
                       <span class="wa-hover-layout">
                          <span class="wa wa-cloud-update"></span>
                          <span class="change-tips">更换作品</span>
                       </span>
                    </a>
                  </div>
                </div>
              </div>
              <a href="javascript:void(0)" class="btn btn-primary pull-right" v-show="viewPre" id="bnr-save-btn" @click="saveChangePhoto">保存</a>
              <a href="javascript:void(0)" class="btn btn-default pull-right mr10 w120" aria-label="Close" v-on:click="close">取消</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--//更换背景提示框结束-->
    <!--用户导航nav开始-->
    <div class="user-nav">
      <ul class="user-nav-ul clearfix">
        <li class="user-pro-list-list" :class="{active:reg=='/work.html'}"><a href="/work.html">我的产品</a></li>
        <li class="user-intro" :class="{active:reg=='/introduction.html'}"><a href="/introduction.html">简介</a></li>
        <li class="user-like" :class="{active:reg=='/like.html'}"><a href="/user/like.html">喜欢</a></li>
        <li class="user-follow" :class="{active:reg=='/follow.html'}"><a href="/user/follow.html">关注</a></li>
        <li class="user-coupon" :class="{active:reg=='/preferential.html'}"><a href="/preferential.html">我的优惠</a></li>
        <li class="user-album" :class="{active:reg=='/album.html'}"><a href="/album.html">作品集</a></li>
        <li class="user-income" :class="{active:reg=='/income.html'}"><a href="/income.html">我的收入</a></li>
      </ul>
    </div>
    <!--//用户导航nav结束-->
  </div>
</template>
<script>
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
export default {
  data() {
    return {
      seen: true,
      Avatar: '',
      Nickname: '',
      user: false,
      aria: false,
      viewPre: true,
      viewDefault: false,
      images: [],
      bgId: '',
      bgImage: '',
      bannerItem: {},
      liIndex: -1,
      active: 1,
      reg: '',
      userId: '',
      error: false
    }
  },
  created() {
    this.pull()
  },
  mounted() {
    const str = location.href
    this.reg = str.match(/\/\w+.html/)[0]
  },
  methods: {
    getUserBanner() {
      let params = {
        ArtistId: this.userId
      }
      request({url: 'profile/si', params}).then(res => {
        this.bannerItem = res.take('Data')
        this.bgImage = this.bannerItem['Banner']['Image']
        this.bgId = this.bannerItem['Banner']['Id']
      })
    },
    changePhoto() {
      if (this.aria === false) {
        this.aria = true
      }
      request({url: Interf.getBannerList}).then(res => {
        this.images = res.take('Data')
      })
    },
    uploadBanner($event) {
      let self = this
      let a = $event.target.files[0]
      if (!a) {
        layer.toast('没有选择文件哦')
        return
      }
      if (!/^image\//i.test(a.type)) {
        layer.toast(`文件 ${a.name} 不是图片哦`)
        return
      }
      const fd = new window.FormData()
      fd.append('File', a)
      request.submit('upload/banner', fd, {
        progress(e) {
          self.percent = Math.floor(e.loaded / e.total * 100)
        }
      }).then(res => {
        this.bgId = this.bannerItem['Banner']['Id']
        this.bgImage = res.take('Data')
        this.aria = false
        if (!this.error) {
          this.viewDefault = true
        }
      }, res => {
        res.hide()
        this.error = true
      })
    },
    saveDefaultPhoto() {
      let params = { Image: this.bgImage, Left: 0, Top: 0 }
      request.save('banner', params).then(res => {
      })
    },
    close() {
      if (this.aria === true) {
        this.aria = false
      }
    },
    choice(item, index) {
      this.bannerItem = item
      this.liIndex = index
    },
    saveChangePhoto() {
      request.submit(Interf.setBannerDefault + this.bannerItem['Id'], {}).then(
        res => {
          this.bgImage = this.bannerItem['Image']
          this.bgId = this.bannerItem['Id']
          this.aria = false
          console.log(this.bgId)
        }, res => {
        res.hide()
      })
    },
    pull() {
      let self = this
      const url = 'header'
      request({url}).then(res => {
        let data = res.data
        self.userId = data['UserId']
        if (data['UserId']) { self.user = false }
        if (data['Avatar']) {
          self.Avatar = 'http://192.168.1.6:8000/thumbnail/avatar/' + data['UserId'] + '/100/' + data['Avatar']
        } else {
          self.Avatar = '/static/images/user/default-profile.jpg'
        }
        self.Nickname = data['Nickname']
      }).then(res => {
        this.getUserBanner(res)
      })
    }
  }
}
</script>

<style>
  @import "../../styles/scss/user-head.scss";
</style>
