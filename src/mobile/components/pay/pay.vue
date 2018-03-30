<template>
  <div class="pay-box">
    <Loading v-show="showLoading"></Loading>
    <div class="weixin-pay-box" v-show="closeBtn"></div>
    <div class="modal-dialog" v-show="closeBtn">
      <div class="modal-content no-shadow">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title text-center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网络通信出现问题？</h4>
        </div>
        <div class="modal-body text-center">
          <p class="pay-type alipay-part">长按识别二维码，完成支付</p>
          <img :src="wechatEwm" alt="微信支付码" class="weixin-erweima mb15" width="200px"/>
          <button class="btn btn-default btn-lg mb15" @click="payOk">已经支付成功</button>
          <p @click="why = !why" class="why mb0" id="why">为什么会出错？</p>
          <p v-show="why">因为微信的限制，只要是未认证的微信公众号进入下单，都无法使用微信支付。您可以扫描二维码完成购买^_^</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script>
/* eslint-disable */
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import Loading from 'components/public/loading.vue'
export default {
  components: {Loading},
  beforeRouteEnter(to, from, next) {
    const id = to.params.id
    const f = that => {
      that.initOrderDetail(parseInt(id))
      that.Id = parseInt(id)
    }
    next(f)
  },
  data() {
    return {
      orderDetail: {},
      showLoading: true,
      closeBtn: false,
      why: false,
      wechatEwm: '',
      Id: undefined
    }
  },
  watch: {
    '$route'(to, from) {
      const id = to.params.id
      this.payOk(parseInt(id))
      this.goOrder(parseInt(id))
    }
  },
  methods: {
    close() {
      this.closeBtn = !this.closeBtn
      this.goOrder(id)
    },
    initOrderDetail(id) {
      let self = this
      if (id && /[0-9]*[1-9][0-9]*/.test(id)) {
        self.orderId = id
        request.do('GET', Interf.getOrderDetail + id).then(res => {
          self.orderDetail = res.take('Data')
          self.showLoading = false
          // 提交错误判断
          if (res.take('Error')) {
            this.handleError(res.take('Error'))
          }
          // 如果订单成功支付，则直接返回到交易管理页面
          if (self.orderDetail['Status'] !== 1) {
            window.location.href = '/order.html'
          }
          let navstr = navigator.userAgent.toLowerCase()

          if (/MicroMessenger/i.test(navstr)) {
            self.weixinOff(id)
          } else { // 支付宝
            self.payAil(id)
          }
        })
      }
    },
    weixinOff(id) {
      let self = this
      self.showLoading = false
      request.do('POST', Interf.weixinofficial + id).then(res => {
        let data = res.take('Data')
        if (data) {
          this.showLoading = false
          self.weixinPay(data, id)
        } else {
          layer.toast('请在微信中重新登录以完成授权')
        }
      })
    },
    /* eslint-disable no-new */
    weixinPay(data, id) {
      let self = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        data,
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok" ) {
            layer.toast('恭喜你已经完成订单')
            self.goOrder();
          } else {
            if (Device.iOS()) {
              request({url: Interf.payWeixin + id}).then(res => {
                let data = res.take('Data')
                let imgBase = data.QR
                self.wechatEwm = 'data:image/png;base64,' + imgBase
                self.closeBtn = true
              })
            } else {
              self.goOrder(id);
            }
          }
        })
    },
    payOk(id) {
      let self = this
      let params = {TradeId: id}
      request({url: Interf.payOk, params}).then(res => {
        let data = res.take('Data')
        if (data) {
          self.goOrder(id)
        } else {
          layer.toast('支付失败, 请确认您已完成付款')
          self.goOrder(id)
        }
      })
    },
    payAil(id) {
      let self = this
      request.do('POST', Interf.aliPay + id).then(res => {
        let data = res.take('Data')
        if (data) {
          window.location.href = data.URL
        } else {
          self.goOrder(id)
        }
      })
    },
    handleError() {
      this.showLoading = true
    },
    goOrder(id) {
      setTimeout(function() {
        window.location.href = '/order-detail.html#/' + id
      }, 1000)
    }
  }
}
</script>
