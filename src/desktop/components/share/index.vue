<template>
  <div class="share-wrapper">
    <!-- 分享按钮 -->
    <div class="share-pop" v-show="isShare" @click="onShare(false)"> 
      <img src="~images/share/wx-share.png" alt="share">
    </div>
    <div class="loading" v-if="loading">
      <img src="~images/loading/loading-128.gif"/>
    </div>
    <div class="wrapper">
      <div class="page-1 page" ref="homePage" :style="bgStyle">
        <div class="background">
          <viewer v-if="Entries!==undefined" :entries="Entries" :pictures="Pictures" :length="initPorcuteWidth" ref="display" :isClick="false"></viewer>
          <div class="product-info">
            <h5 class="product-name"></h5>
            <p class="author-name">{{userName}}</p>
          </div>
        </div>
        <div class="more icon">
          <img src="~images/icon/ic-bottom-next.png">
        </div>
      </div>
      <div class="page-2 page" ref="page2">
        <share-coupon v-if="isCoupon"></share-coupon>
        <section class="avatar-wrap">
          <div class="avatar" v-if='avatarUrl===""'></div>
          <div class="avatar" v-else>
            <img :src="avatarUrl" />
          </div>
          <div class="line"></div>
        </section>
        <h5 class="author-name">{{userName}}</h5>
        <div class="info-wrap" v-if="status===0&&isCoupon">
          <p>我在墙蛙网定制了一件宝贝</p>
          <p>领取我的优惠券首单立减<span>5</span>元</p>
          <p>你也来马上试试呗</p>
        </div>
        <div class="info-wrap" v-if="status===1&&isCoupon">
          <p>分享你的定制作品即可获得<span>5</span>元返现</p>
          <p>赶快分享给你的朋友吧</p>
        </div>
        <div class="wx-code" v-if="status===1">
          <img src="~images/share-wx-logo.jpg">
        </div>
        <div class="share-btn" v-if="status===0" @click="onShare(true)">
          立即分享
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
const DEV = `//192.168.1.6:8000/thumbnail/image/`
const PRO = `//wallwa.com/thumbnail/image/`
import ShareProduct from './components/share-product.vue'
import ShareCoupon from './components/share-coupon.vue'
import Viewer from '../custom/display/viewer.vue'
import { getDisplayer } from '../custom/display/display-util'
import { wxShare } from '../../scripts/utils/wx-utils.js'
export default {
  data() {
    return {
      status: -1, //判断身份 0为分享者 1为观看者
      entry: undefined, // display所用
      bgStyle: '', // 背景色
      windowH: '', // 窗口高度
      initH: false, // 初始化高度
      loading: true, // 是否正在加载
      isShare: false, // 是否展开弹窗
      background: '', // 背景颜色
      shareInfo: {}, // 分享的URL
      shareUrl: '', // 分享url
      avatarUrl: '', // 头像url
      userName: '', // 用户名称
      isCoupon: false, // 是否有优惠券
      wxConfig: {}, // wxconfig,
      Pictures: undefined, // Pictures数据
      Entries: undefined, // Entries数据
      initPorcuteWidth: 220, // 初始化宽度
      imgUrl: '',
      windW: '' // 窗口宽度
    }
  },
  components: {
    ShareProduct,
    ShareCoupon,
    Viewer
  },
  mounted() {
    this.testStatus()
    this.initWidth()
    let self = this
    // 为分享者
    if (this.status === 0) {
      this.getUserData().then(res => {
        this.getPreShareData().then(() => {
          this.$nextTick(() => {
            self.initBackground()
          })
        })
        this.initPageHeight()
        this.getCouponData()
        this.getUserData()
        this.getShareUrl(this.$route.query.ItemId).then(res => {
          this.shareUrl = res.url
          this.getWxConfig().then(r => {
            this.wxConfig = r
            // wx.config( this.wxConfig,this.wxConfig)
            let wxObj = {
              title: '你的好友分享了新的宝贝',
              desc: '分享的好东西哦',
              link: self.shareUrl,
              imgUrl: ''
            }
            // 调用微信分享
            wxShare(this.wxConfig, wxObj)
          })
        })
      }).catch(err => {
        setTimeout(function() {
          window.location.href = '/login'
        }, 1000)
      })
    } else if (this.status === 1) {
      // 观察者
      this.initPageHeight()
      this.getShareData().then(res => {
        // todo 处理照片墙逻辑
        let data = res
        self.Entries = data.Item.Entries
        self.Pictures = data.Item.Pictures
        self.userName = data.User.Nickname
        self.avatarUrl = data.User.Avatar !=="" || require('../../assets/images/activity/pet-guide/1.jpg')
        // 请求分享的url
        self.getShareUrl(data.Item.Id).then(res => {
          self.shareUrl = res.url
          this.getWxConfig().then(r => {
            this.wxConfig = r
            let wxObj = {
              title: '你的好友分享了新的宝贝',
              desc: '分享的好东西哦',
              link: self.shareUrl,
              imgUrl: ''
            }
            // 调用微信分享
            wxShare(this.wxConfig, wxObj)
          })
        })
        self.$nextTick(() => {
          self.initBackground()
        })
      })
    }
    $(window).resize(function() {
      self.windW = document.body.clientWidth
      self.bgStyle = document.body.clientHeight
      $('.bd').css('width', self.windW)
    })
  },
  methods: {
    // 根据路由判断用户身份
    testStatus() {
      let path = this.$route.path
      if (/(\/preshare)/.test(path)) {
        this.status = 0
      } else {
        this.status = 1
      }
    },
    // 获取分享者数据数据
    getPreShareData() {
      let id = this.$route.query.ItemId      
      let self = this
      return new Promise((resolve) => {
        this.getItemData(id).then(res => {
         // 处理照片墙逻辑, 如果不是照片墙,index=-1
         this.Entries = res.Entries
         this.Pictures = res.Pictures
         this.imgUrl = res.Pictures[0][0].ImageFile
         resolve()
        })
      })
    },
    // 获得ItemID上的数据
    getItemData(id) {
      return new Promise((resolve, reject) => {
        this.$request.do('GET', `item/get/${id}`).then(res => {
          resolve(res.take('Data'))
        })
      })
    },
    // 初始化比例
    initWidth() {
      let w = window.innerWidth
      const SCALE = 1 - (320/w) 
      this.initPorcuteWidth = this.initPorcuteWidth + (this.initPorcuteWidth * SCALE)
    },
    // 获取用户数据
    getUserData() {
      return new Promise((resolve, reject) => {
        this.$request.do('GET', '_header').then(res => {
          let data = res.body
          if (Object.getOwnPropertyNames(data).length>1) {
            this.avatarUrl = data.Avatar !== "" || require('../../assets/images/activity/pet-guide/1.jpg')
            this.userName = data.Nickname
            resolve()
          } else {
            reject()
          } 
        })
      })
    },
    // 获取优惠券数据
    getCouponData() {
      return new Promise(resolve => {
        console.log(this)
      })
    },
    // 获取微信数据
    getWxConfig() {
      return new Promise((resolve) => {
        this.$request.submit('share/sign', {
          Debug: false,
          Link: this.shareUrl
        }).then(res => {
          resolve(res.take('Data'))
        })
      })
    },
    // 获得entry数据
    getItemEntry(id) {
      return new Promise(resolve => {
        this.$request.get('entry', id).then(res => {
          resolve(res.take('Data'))
        })
      })
    },
    // 获得分享接口
    getShareData() {
      let self = this
      const shareId = (this.$route.params.id).toString()
      return new Promise((resolve, reject) => {
        self.$request.get(`share`, shareId).then(res => {
          resolve(res.take('Data'))
        }).catch(err => {
          reject()
        })
        // self.$http.get(`share/get/${shareId}`).then(res => {
        //   resolve(res.take('Data'))
        // }).catch(res => {
        //   reject()
        // })
      })
    },
    // 初始化背景高度
    initPageHeight() {
      let homePage = this.$refs.homePage
      let page2 = this.$refs['page2']
      let h = document.body.clientHeight
      this.bgStyle = `height: ${h}px`
      if (page2.clientHeight < h) {
        this.initH = true
        this.windowH = `height: ${h}px`
      }
      this.$onBus('setBackground', res => {
        this.bgStyle += `; background: linear-gradient(to right, ${res[0]}, ${res[1]})`
      })
    },
    // 获得当前用户的优惠信息
    getUserCoupon() {
      return new Promise(resolve => {
        this.$request.do('GET', '/coupon/user', {}).then(res => {
          resolve(res.take('Data'))
        })
      })
    },
    // 点击分享
    onShare(type) {
      // 弹出分享层
      this.isShare = type
      console.log(this.wxConfig)
      console.log(this.shareUrl)
    },
    // 调用分享接口api
    getShareUrl(id) {
      return new Promise(resolve => {
        this.$request.submit('share', {
          Platform: 'weixin',
          Target: 'item',
          ItemId: id
        }).then(res => {
          this.shareInfo['url'] = res.take('Data')
          resolve(this.shareInfo)
        })
      })
    },
    initBackground() {
      let display = this.$refs.display.$el
      let $display = $(display)
      let self = this
      let timer
      self.imgUrl = $(display.getElementsByTagName('img')[0]).attr('src') !==undefined  ? $(display.getElementsByTagName('img')[0]).attr('src') : ''
      timer = setInterval(function() {
        if (self.imgUrl !== '') {
          clearInterval(timer)
          window.RGBaster.colors(self.imgUrl, {
            success: function(p) {
              self.bgStyle += `;background: linear-gradient(to left, ${p.dominant}, ${p.secondary})`
              self.loading = false
            }
          })
        } else {
          self.initBackground()
        }
      }, 17)
    },
    log() {
      this.isShare = true
    }
  }
}
</script>
