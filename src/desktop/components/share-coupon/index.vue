<template>
  <div class="share-wrapper">
    <ticket :couponObj="couponObj"  @receiveTicket="receiveTicket"></ticket>
    <h3 class="invit-text">邀请好友得现金奖励</h3>
    <!--<div class="avatar" v-if="couponObj.User">-->
      <!--<img :src="avartaSrc">-->
      <!--<p class="user-name">{{couponObj.User.Nickname}}</p>-->
    <!--</div>-->
    <div class="share-info">
      分享你的专属优惠码（价值 <span><i v-if="!couponObj.AmountScale">￥</i>{{amountText}}</span>）给身边小伙伴，TA下单成功后，你可<i v-if="!couponObj.RewardScale">获得￥</i>{{rewardText}}。邀请越多，奖励越多。蛙币可下单时叠加使用或提现。
    </div>
    <div class="btn-wrapper">
      <div class="btn-share" @click="showShareTip">
        分享我的专属优惠
      </div>
    </div>
    <share-tip ref="shareTip"></share-tip>
    <!--<div class="to-bottom">-->
      <!--<i class="wa wa-angle-down"></i>-->
    <!--</div>-->
    <!--<div class="logo">-->
      <!--<img src="~images/share-wx-logo.jpg"/>-->
    <!--</div>-->
  </div>
</template>

<script>
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  import { wxShare } from '../../scripts/utils/wx-utils.js'
  import ShareTip from './ShareTip.vue'
  import ticket from '../public/ticket/ticket.vue'
  export default{
    beforeRouteEnter(to, from, next) {
      const status = to.params.id
      let f
      f = that => that.getCoupon(status)
      next(f)
    },
    components: {
      ShareTip, ticket
    },
    data() {
      return {
        couponObj: {},
        avartaSrc: '',
        shareInfo: {}, // 分享的URL
        shareUrl: window.location.href
      }
    },
    methods: {
      receiveTicket() {
      },
      getCoupon() {
        let userId = this.$router.currentRoute.params.id
        request({ url: `http://192.168.1.6/coupon/user/${userId}` }).then(res => {
          this.couponObj = res.take('Data')
          this.avartaSrc = `${Interf.baseUrl}/thumbnail/avatar/${this.couponObj['User']['Id']}/100/${this.couponObj['User']['Avatar']}`
        })
      },
      // 获得分享接口
      getShareData() {
        const shareId = (this.$route.params.id).toString()
        return this.$request.get(`share`, shareId).then(res => {
          return Promise.resolve(res.take('Data'))
        })
      },
      // 调用分享接口api
      getShareUrl(id) {
        return new Promise(resolve => {
          this.$request.submit('share', {
            Platform: 'weixin',
            Target: 'person',
            ItemId: id
          }).then(res => {
            this.shareInfo['url'] = res.take('Data')
            resolve(this.shareInfo)
          })
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
      showShareTip() {
        this.$refs.shareTip.showTip()
      }
    },
    computed: {
      rewardText() {
        if (this.couponObj.RewardScale) {
          return '享受' + this.couponObj['Reward'] / 10 + '折优惠'
        } else {
          return this.couponObj['Reward'] / 100 + '元返现'
        }
      },
      amountText() {
        if (this.couponObj.AmountScale) {
          return this.couponObj['Amount'] / 10 + '折'
        } else {
          return this.couponObj['Amount'] / 100
        }
      }
    },
    mounted() {
//      this.getCoupon()
      this.getShareData().then(res => {
        let data = res
        console.log(data)
        this.getWxConfig().then(r => {
          this.wxConfig = r
          let wxObj = {
            title: '你的好友分享了优惠券',
            desc: '分享的好东西哦',
            link: this.shareUrl,
            imgUrl: ''
          }
          // 调用微信分享
          wxShare(this.wxConfig, wxObj)
        })
        // 请求分享的url
//        this.getShareUrl(data.Item.Id).then(res => {
//          this.shareUrl = res.url
//          this.getWxConfig().then(r => {
//            this.wxConfig = r
//            let wxObj = {
//              title: '你的好友分享了优惠券',
//              desc: '分享的好东西哦',
//              link: this.shareUrl,
//              imgUrl: ''
//            }
//            // 调用微信分享
//            wxShare(this.wxConfig, wxObj)
//          })
//        })
      })
      console.log(this.$router.currentRoute.params.id)
    }
  }
</script>
