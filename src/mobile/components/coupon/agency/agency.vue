<template>
  <div class="warp">
    <div class="ticket">
      <div class="info">
        <div class="title">{{coupon.Name}}</div>
        <div class="name">{{coupon.Tag}}</div>
        <div class="time">有效期至: {{coupon.ValidDate || '长期有效'}} </div>
      </div>
      <div class="money">
        <span>{{couponAmount}}</span>
      </div>
    </div>
    <h3 class="prop">定制礼物不用愁 送你墙蛙优惠券</h3>
    <img :src="Avatar" alt="头像" class="invite-avatar"/>
    <span class="invite-author" v-text="Nickname"></span>
    <p class="mt1">
      <a href="javascript:void(0)" class="btn btn-primary btn-lg" @click="share">求分享</a>
    </p>
    <div class="desc-tips">分享我的优惠码<span v-text="moneyChange(coupon)"></span>给小伙伴们，定制成功即可获得实付金额<span v-text="returnMoney(coupon)"></span>的返现，返现进入蛙币账户</div>
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
/* eslint-disable */
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
export default {
  data() {
    return {
      Avatar: '',
      Nickname: '',
      userId: '',
      coupon: {},
      couponAmount: ''
    }
  },
  mounted() {
    this.getUserInfo()
    this.useCoupon()
  },
  methods: {
    useCoupon() {
      let self = this
      request({url: 'coupon/user'}).then(res => {
        self.coupon = res.take('Data')
        console.log(self.coupon)
        // 机构优惠券判断是否是折扣 true:折扣 false: 固额
        if (self.coupon['AmountScale']) {
          self.couponAmount = 10 - self.coupon.Amount / 10
          self.couponAmount = self.couponAmount + '折'
          return self.couponAmount
        } else {
          self.couponAmount = self.coupon.Amount / 100
          self.couponAmount = self.couponAmount + '元'
          return self.couponAmount
        }
      })
    },
    getUserInfo() {
      let self = this
      request({url: Interf.getUserHead}).then(res => {
        let data = res.data
        if (data['Avatar'] !== '') {
          self.Avatar = 'http://192.168.1.6:8000/thumbnail/avatar/' + data['UserId'] + '/100/' + data['Avatar']
        } else {
          self.Avatar = '/static/images/user/default-profile.jpg'
        }
        if (data['Nickname']) {
          self.Nickname = data['Nickname']
        } else {
          self.Nickname = 'U' + data['UserId']
        }
      })
    },
    returnMoney(coupon) {
      // ReturnScale === true 返现金额为折扣 ReturnScale === false 返现金额为固定金额
      if (coupon.RewardScale) {
        let r = coupon['Reward']
        return r + '%'
      } else {
        let money = coupon['Reward'] / 100
        return money + '元'
      }
    },
    moneyChange(coupon) {
      // AmountScale === true 折扣 AmountScale ==== flase 固定金额
      if (coupon.AmountScale) {
        let z = 10 - coupon['Amount'] / 10
        return z + '折'
      } else {
        let money = coupon['Amount'] / 100
        return money + '元'
      }
    },
    share() {
      window.location.href = 'n-agency.html?Agency=' + this.coupon['User']['Id'] 
    }
  }
}
</script>
