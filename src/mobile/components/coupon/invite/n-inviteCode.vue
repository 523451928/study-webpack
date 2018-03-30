<template>
  <div class="warp">
    <div class="ticket">
      <div class="info">
        <div class="title">邀请优惠</div>
        <div class="name">全场通用</div>
        <div class="time">长期有效</div>
      </div>
      <div class="money">￥
        <span>{{coupon.Amount / 100}}</span>
      </div>
    </div>
    <h3 class="prop">定制礼物不用愁 送你墙蛙优惠券</h3>
    <img :src="Avatar" alt="头像" class="invite-avatar"/>
    <span class="invite-author">{{Nickname}}</span>
    <p class="mt1">
      <a href="javascript:void(0)" class="btn btn-primary btn-lg" @click="getCoupon">点击领取</a>
    </p>
    <div class="desc-tips">分享我的优惠码<span>{{coupon.Code}}</span>给小伙伴们，定制成功即可获得实付金额<span v-text="returnMoney(coupon)"></span>的返现，返现进入蛙币账户</div>
    <img src="~images/share/1.jpg" alt="img01" class="w100"/>
    <img src="~images/share/2.jpg" alt="img02" class="w100"/>
    <img src="~images/share/3.jpg" alt="img03" class="w100"/>
    <div class="wallwa-content">墙蛙网 wallwa.com，是一个提供优质个性定制印品的网站。孩子的涂鸦、旅行的风景、亲密的合影，手机里定格下的美好瞬间，在这里通通都能变成有品质的艺术衍生品，走入你的家，唤醒你的生活。</div>
    <div class="other-tips">与自己合作  给生活不同<br />WAKE UP U LIFE</div>
    <div>
      <span clas="f16">长按下方二维码  关注墙蛙</span>
      <img src="~images/share/share-wx.jpg" alt="" class="erweima"/>
    </div>
  </div>
</template>
<script>
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  export default {
    data() {
      return {
        Avatar: '',
        Nickname: '',
        coupon: {},
        code: ''
      }
    },
    mounted() {
      let self = this
      let search = window.location.search
      let code = search.split('=')[1]
      self.code = code
      request({url: Interf.queryUserInfo + code}).then(res => {
        self.coupon = res.take('Data')
        if (self.coupon) {
          self.Nickname = self.coupon['Nickname']
          self.Avatar = 'http://192.168.1.6:8000/thumbnail/avatar/' + self.coupon['UserId'] + '/100/' + self.coupon['Avatar']
          console.log(self.coupon)
        } else {
          layer.toast(res.take['Error'])
        }
      })
    },
    methods: {
      returnMoney(coupon) {
        // ReturnScale === true 返现金额为折扣 ReturnScale === false 返现金额为固定金额
        if (coupon.ReturnScale) {
          let r = coupon['Return']
          return r + '%'
        } else {
          let money = coupon['Return'] / 100
          return money + '元'
        }
      },
      getCoupon() {
        request({ url: Interf.getCodeGetCoupon + this.code }).then(res => {
          layer.toast('领取成功')
          setTimeout(function() {
            window.location.href = '../../customlist.html'
          }, 1000)
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
