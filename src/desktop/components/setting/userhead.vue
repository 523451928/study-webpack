<template>
  <div class="user-hear-warp">
  <!--问题联系浮动二维码开始-->
    <div class="contact-wechat" v-show="seen">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)" @click="contact">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--//问题结束-->
    <!--用户背景图片开始-->
    <div class="user-head-bnr" :style="userBanner" v-if="userData">
      <div class="user-content">
        <!--<div v-show="bannerPos" style="height:100%;width:100%;position:absolute" :style="{backgroundImage: 'url('+$thumb('banner', bgId, 1920, bgImage)+')',transform:'translateY('+ disY +'px)'}"></div>-->
        <!--<div v-show="!bannerPos" style="height:100%;width:100%;position:absolute;" :style="{backgroundImage: 'url('+$thumb('banner', bgId, 1920, bgImage)+')',transform:'translateY('+ disY +'px)'}" @mousedown.prevent="evStart($event)" @mouseleave.prevent="evEnd($event)" @mousemove.prevent.stop="evMove($event)" @mouseup.prevent="evEnd($event)"></div>-->
        <div class="link-container">
          <a href="javascript:void(0)" id="change-bnr-btn" @click="changePhoto">
            <span class="wa wa-picture-o"></span>
            <span>更换封面</span>
          </a>
          <a href="/user/setting.html" target="_blank">
            <span class="wa wa-pencil"></span>
            <span>编辑个人资料</span>
          </a>
        </div>
        <a href="/product.html" target="_blank" class="create-product u-primary-btn">
          <span>发布新产品</span>
        </a>
        <!-- 编辑状态 -->
        <div class="user-bnr-info">
          <a class="head-icon layout-avatar" href="/user/setting.html#/avatar" target="_blank">
            <div class="hover-layout" flex="dir:top main:center">
              <span class="wa wa-camera"></span><br/>
              更换头像
            </div>
            <img class="item" :src="$user.Avatar">
          </a>
          <div class="user-info">
            <div class="line">
              <div class="user-info-name" v-text="userData.nickname"></div>
              <div class="user-date" >{{userData.joinDate}}加入墙蛙</div>
            </div>
            <p class="user-introduction" v-text="userData.introduction!==''?userData.introduction:'这个人太酷了,什么介绍都没有...'"></p>
          </div>
        </div>
      </div>
    </div>
    <!--//用户背景图片结束-->
    <!--更换背景提示框开始-->
    <transition name="scale">
      <div class="modal" id="change-bnr-dialog" tabindex="-1" role="dialog" v-show="aria">
        <div class="modal-backdrop in"></div>
        <div class="modal-dialog">
          <div class="modal-content user-defined-bg" v-drag>
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
                          <li @dblclick="saveChangePhoto" v-for="(item,index) in images" :class="index==liIndex?'active':''" v-on:click="choice(item,index)">
                            <a class="face-img-list" :style="{backgroundImage: 'url('+$thumb('banner', item.Id, 100, item.Image)+')'}">
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
                <a href="javascript:void(0)" class="btn btn-primary pull-right" v-show="!viewPre" id="bnr-save-default-btn" @click="saveDefaultPhoto()">保存</a>
                <a href="javascript:void(0)" class="btn btn-default pull-right mr10 w120" aria-label="Close" v-on:click="close">取消</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
/* eslint-disable */
// `${Interf.base}/thumbnail/avatar/${v['UserId']}/100/${v['Avatar']}`
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import { UrlUtils } from 'scripts/utils/url-utils.js'
import { mixin as contactMixin} from '../contactMixin'
let urlUtils = new UrlUtils()
export default {
  mixins: [ contactMixin ],
  data() {
    return {
      navArr: [
        {text: '我的产品', url: '/user/work.html'},
        {text: '我的收入', url: '/user/income.html'},
//        {text: '简介', url: '/user/introduction.html'},
        {text: '喜欢', url: '/user/like.html'},
        {text: '关注', url: '/user/follow.html'},
        {text: '我的优惠', url: '/user/coupon.html'},
        {text: '作品集', url: '/user/album.html'},
      ],
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
      error: false,
      disY: 0,
      lBanner: '',
      offsetArr: [],
      movingStatus: false,
      bannerPos: true,
      userData: undefined // 用户信息
    }
  },
  created() {
    this.getUser()
  },
  mounted() {
    this.reg = window.location.pathname
    this.$onBus('refreshProfile',() => {
      this.getUser()
    })
  },
  computed: {
    /**
     * 获取用户注册时间
     */
    userJoinDate() {
      let date = String(this.userData.joinDate)
      const y = 4
      const m = 6
      return `${date.slice(0, y)}.${date.slice(y, m)}.${date.slice(m)}加入墙蛙`
    },
    /**
     * 返回用户的背景图
     */
    userBanner() {
      return {
        backgroundImage: `url(${this.userData.banner})`
      }
    }
  },
  methods: {
    getUser() {
      this.getUserData().then(id => {
        this.$request.do('GET', 'profile/si', {
          params: {
            UserId: id
          }
        }).then(res => {
          let data = res.take('Data')
          let userData = new Object()
          userData['avatar'] = data.Avatar !== '' ? `${Interf.base}/thumbnail/avatar/${data.Id}/100/${data.Avatar}` : '/static/images/user/default-profile.jpg'
          userData['introduction'] = data.Introduction !== '' ? data.Introduction : '这个人太懒了,什么介绍都没有......'
          userData['joinDate'] = data.JoinDate
          userData['nickname'] = data.Nickname !== '' ? data.Nickname : data.Id
          userData['banner'] = `${Interf.base}/thumbnail/banner/${data.Banner.Id}/1920/${data.Banner.Image}`
          this.userData = userData
          this.$bus.$emit('profileData', userData)
        })
      })
    },
    getUserBanner() {
      request({url: Interf.getDefaultBanner}).then(res => {
        this.bannerItem = res.take('Data')
        this.bgImage = this.bannerItem['Image']
        this.bgId = this.bannerItem['Id']
      })
    },
    evStart(e) {
      this.movingStatus = true
      this.offsetArr = e.pageY
    },
    evEnd(e) {
      this.movingStatus = false
      this.offsetArr = []
    },
    evMove(e) {
      if (!this.movingStatus) return
      this.disY = e.pageY - this.offsetArr
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
        this.bgId = this.bannerItem['Id']
        this.bgImage = res.take('Data')
        this.viewPre = false
      }, res => {
        res.hide()
        this.error = true
      })
    },
    saveDefaultPhoto() {
      let params = { Image: this.bgImage, Left: 0, Top: this.disY }
      request.save('banner', params).then(res => {
        this.getUser()
        this.bannerPos = false
        this.viewDefault = true
        this.bgId = res.take('Data')
        this.bannerItem['Id'] = this.bgId
        this.bannerItem['Image'] = this.bgImage
        this.aria = false
        this.viewPre = true
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
          this.getUser()
          this.bgImage = this.bannerItem['Image']
          this.bgId = this.bannerItem['Id']
          this.aria = false
        }, res => {
        res.hide()
      }).then(res => {
        this.bannerPos = true
        this.viewDefault = false
      })
    },
    isIncludeUrl(url) {
      let reg = window.location.pathname
      let _url
      if (url.indexOf('?') !== -1) {
        let index = url.indexOf('?')
        _url = url.slice(0, index)
      } else {
        _url = url
      }
      return reg.includes(_url)
    },
    /**
     * 获取作者的信息
     */
    getUserData() {
      let timer = null
      const self = this
      return new Promise(resolve => {
        timer = setInterval(function() {
          if (self.$user.UserId) {
            clearInterval(timer)
            return resolve(self.$user.UserId)
          }
        }, 10)
      })
    },
    pull() {
//      let self = this
//      const url = '_header'
//      request({url}).then(res => {
//        let data = res.data
//        self.userId = data['UserId']
//        if (data['UserId']) { self.user = false }
//        if (data['Avatar']) {
//          self.Avatar = `${Interf.baseUrl}/thumbnail/avatar/${data['UserId']}/100/${data['Avatar']}`
//        } else {
//          self.Avatar = '/static/images/user/default-profile.jpg'
//        }
//        self.Nickname = data['Nickname']
//      }).then(res => {
//
//      })
      //        this.getUserBanner(res)
    }
  }
}
</script>

<style lang="sass">
  @import "../../styles/scss/user-head.scss";
</style>
