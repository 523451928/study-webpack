<template>
  <transition name="scale">
    <div class="coupon-mask" v-if="couponShow" @click="couponShow=false">
      <div class="coupon-wrapper" @click.stop>
        <span class="close-btn" @click="couponShow=false">&times;</span>
        <div class="title">领取优惠券</div>
        <div class="ticket-content">
          <ul>
            <li v-for="(item,index) in ticketArr">
              <div class="ticket-item">
                <div class="ticket-info fl">
                  <p class="ticket-remark">{{item.remark}}</p>
                  <h3>{{item.name}}</h3>
                  <p class="deadline">
                    有效期至:<span>{{item.deadline | formatDate}}</span>
                  </p>
                </div>
                <div class="ticket-money fr">
                  <i v-if="item.money">￥</i>{{item.money ? item.money / 100 : item.discount}}
              </div>
              </div>
            </li>
          </ul>
        </div>
        <span class="receive-btn" @click="receiveCoupon">点击领取</span>
      </div>
    </div>
    <!--<div class="wa-tips-mask">-->
      <!--<div class="tips-container">-->
        <!--<span class="tips-close-btn">&times;</span>-->
        <!--<div class="tips-title">你已领到优惠券</div>-->
        <!--<div class="tips-content">优惠券备注已经到你的账户</div>-->
        <!--<div class="tips-btn-group">-->
          <!--<span class="view-btn">点击查看</span>-->
          <!--<span class="use-btn">立即使用</span>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </transition>
</template>

<script>
/* eslint-disable */
import { padLeftZero } from '../../scripts/tools/padLeftZero'
export default {
  data() {
    return {
      ticketArr: [

      ],
      couponArr: ['ABCDEFGH', 'DVIBNG'],
      couponShow: false
    }
  },
  mounted() {
    this.$onBus('showCoupon', (action, parm) => {
      this.couponShow = true
      if (this.ticketArr.length > 0) {
        return
      }
      let params = {Code: this.couponArr}
      request({url:'http://192.168.1.6:8000/coupon/task', params}).then((res) => {
        let data = res.body.Data
        for (let key in data) {
          if (data[key]) {
            let obj = {}
            obj.deadline = data[key].End
            obj.remark = data[key].Tag
            obj.name = data[key].Name
            obj.money = data[key].AmountScale ? 0 : data[key].Amount
            obj.discount = data[key].AmountScale ? `${data[key].Amount / 10}折` : ''
            this.ticketArr.push(obj)
          }
        }
      })
    })
  },
  methods: {
    receiveCoupon() {
      this.couponShow = false
      if (this.$user.IsLogin) {
        let body = {Code: this.couponArr}
        let receiveObj = {}
        let emulateObj = {'emulateJSON': true}
        request.do ('POST', 'http://192.168.1.6:8000/coupon/take', body, emulateObj).then ((res) => {
          let data = res.body.Data
          for (let key in data) {
            console.log (data[key])
            if (data[key] === 'Success') {
              receiveObj.status = 'success'
              break
            } else {
              receiveObj.status = 'erorr'
              receiveObj.errorCode = data[key]
            }
          }
          console.log (receiveObj)
          if (receiveObj.status === 'success') {
            this.$dialog ({
              title: '领取成功',
              content: '恭喜你,成功领取优惠券!',
              btnArr: [
                {
                  text: '点击查看',
                  className: 'view-btn',
                  callback: function () {
                    console.log (this)
                    this.close ()
                  }
                },
                {
                  text: '立即使用',
                  className: 'use-btn',
                  callback: function () {
                    this.close ()
                    window.location.href = '/'
                  }
                }
              ]
            })
          } else {
            setTimeout (() => {
              let content = ''
              switch (receiveObj.errorCode) {
                case 'InvalidCode' :
                  content = '优惠错误，请联系客服'
                  break;
                case 'AlreadyTaken' :
                  content = '你已领到优惠券'
                  break;
                default :
                  content = '很抱歉，你来晚了，优惠券已被抢光'
              }
              if (content === '你已领到优惠券') {
                this.$dialog ({
                  title: '你已领到优惠券',
                  content: '优惠券已经在你的账户了,记得使用哦',
                  btnArr: [
                    {
                      text: '点击查看',
                      className: 'view-btn',
                      callback: function () {
                        this.close ()
                        window.location.href = 'user/coupon.html#/activeCoupon'
                      }
                    },
                    {
                      text: '立即使用',
                      className: 'use-btn',
                      callback: function () {
                        this.close ()
                        window.location.href = '/'
                      }
                    }
                  ]
                })
              } else {
                this.$dialog ({
                  title: '领取失败',
                  content: content,
                  btnArr: [
                    {
                      text: '确认',
                      className: 'confirm-btn',
                      callback: function () {
                        this.close ()
                      }
                    }
                  ]
                })
              }
            }, 100)
          }
        })
      } else {
        this.$toast ('请先登录')
        setTimeout (() => {
          window.location.href = '/login.html'
        }, 2000)
      }
    }
  },
  components: {
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return '长期有效'
      }
      let date = new Date(time)
      return date.getFullYear() + '-' +
        padLeftZero(date.getMonth() + 1) + '-' +
        padLeftZero(date.getDate())
    }
  }
}
</script>

<style lang='sass'>
  @import '~styles/scss/wallwa/coupon.scss'
</style>
