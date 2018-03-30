<template>
  <div class="receive-wrapper">
    <div class="user-info" v-if="couponObj.User">
      <img class="avatar" :src="avartaSrc"/>
      <span class="nike-name">{{couponObj.User.Nickname}}</span>
    </div>
    <div class="text-info">
      <p>我在墙蛙网定制了一个宝贝</p>
      <p>领取我的优惠券下单还能<i v-if="!couponObj.AmountScale">立减</i><i v-if="couponObj.AmountScale">享</i><span>{{amountText}}</span><i v-if="!couponObj.AmountScale">元</i><i v-if="couponObj.AmountScale">优惠</i>
      </p>
      <p>你也快来试试吧!</p>
    </div>
    <ticket :couponObj="couponObj" :hasReceive="true" @receiveTicket="receiveTicket"></ticket>
    <hr>
    <div class="wall-intro">
      墙蛙网 wallwa.com，是一个提供优质个性定制印品的网站。孩子们的涂鸦、旅行的风景、亲密的合影，手机里定格下的美好瞬间，在这里，通通都能变成有品质的艺术衍生品，走入你的家，唤醒你的生活。
    </div>
    <div class="logo">
      <img src="~images/share-wx-logo.jpg"/>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  import ticket from '../public/ticket/ticket.vue'
  export default{
    components: {
      ticket
    },
    data() {
      return {
        couponObj: {},
        avartaSrc: ''
      }
    },
    mounted() {
      this.getCoupon()
    },
    methods: {
      receiveTicket() {
        if (!this.$user.UserId) {
          this.$toast.center('您还未登录', 3000 , () => {
            window.location.href = '/login'
          }).then((res) => {
          })
          return
        }
        let Code = [this.couponObj.Code]
        let body = {Code: Code}
        let emulateObj = {'emulateJSON': true}
        request.do('POST', 'http://192.168.1.6/coupon/take', body, emulateObj).then((res) => {
          let data = res.body.Data
          let receiveObj = {}
          for (let key in data) {
            if (data[key] === 'Success') {
              receiveObj.status = 'success'
              break
            } else {
              receiveObj.status = 'erorr'
              receiveObj.errorCode = data[key]
            }
          }
          console.log(receiveObj)
          if (receiveObj.status === 'success') {
            this.$dialog({
              title: '领取成功',
              content: '恭喜你,成功领取优惠券!',
              btnArr: [
                {
                  text: '点击查看',
                  className: 'view-btn',
                  callback: function() {
                    this.close()
                  }
                },
                {
                  text: '立即使用',
                  className: 'use-btn',
                  callback: function() {
                    this.close()
                    window.location.href = '/'
                  }
                }
              ]
            })
          } else {
            setTimeout(() => {
              let content = ''
              switch (receiveObj.errorCode) {
                case 'InvalidCode' :
                  content = '优惠错误，请联系客服'
                  break
                case 'AlreadyTaken' :
                  content = '你已领到优惠券'
                  break
                default :
                  content = '很抱歉，你来晚了，优惠券已被抢光'
              }
              if (content === '你已领到优惠券') {
                this.$dialog({
                  title: '你已领到优惠券',
                  content: '优惠券已经在你的账户了,记得使用哦',
                  btnArr: [
                    {
                      text: '点击查看',
                      className: 'view-btn',
                      callback: function() {
                        this.close()
                        window.location.href = '/user/active-coupon.html'
                      }
                    },
                    {
                      text: '立即使用',
                      className: 'use-btn',
                      callback: function() {
                        this.close()
                        window.location.href = '/'
                      }
                    }
                  ]
                })
              } else {
                this.$dialog({
                  title: '领取失败',
                  content: content,
                  btnArr: [
                    {
                      text: '确认',
                      className: 'confirm-btn',
                      callback: function() {
                        this.close()
                      }
                    }
                  ]
                })
              }
            }, 100)
          }
        })
      },
      getCoupon() {
        let userId = this.$router.currentRoute.params.id
        request ({url: `http://192.168.1.6/coupon/user/${userId}`}).then (res => {
          this.couponObj = res.take ('Data')
          this.avartaSrc = this.couponObj['User']['Avatar'] ? `${Interf.baseUrl}/thumbnail/avatar/${this.couponObj['User']['Id']}/100/${this.couponObj['User']['Avatar']}` : require('assets/images/user/default-profile.jpg')
        })
      }
    },
    computed: {
      amountText() {
        if (this.couponObj.AmountScale) {
          return this.couponObj['Amount'] / 10
        } else {
          return this.couponObj['Amount'] / 100
        }
      }
    },
  }
</script>
