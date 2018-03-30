export const mixin = {
  methods: {
    receiveCoupon() {
      if (this.$user.IsLogin) {
        let couponCode = this.couponArr ? this.couponArr : this.activiData.CouponCode
        let body = {Code: couponCode}
        let receiveObj = {}
        let emulateObj = {'emulateJSON': true}
        request.do('POST', 'http://m.wallwa.xxx/coupon/take', body, emulateObj).then((res) => {
          let data = res.body.Data
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
                    console.log(this)
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
      } else {
        this.$toast('请先登录')
        setTimeout(() => {
          window.location.href = '/login.html'
        }, 2000)
      }
    }
  }
}
