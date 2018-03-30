<template>
  <div class="pay-box">
    <!--购物车banner开始-->
    <div class="m-shop-hd-wrap">
      <ul class="step-wrap">
        <li class="step step-cart curr"><span>购物车</span></li>
        <li class="hr"></li>
        <li class="step step-order curr"><span>填写订单</span></li>
        <li class="hr"></li>
        <li class="step step-pay curr"><span>等待支付</span></li>
        <li class="hr"></li>
        <li class="step step-ok"><span>支付成功</span></li>
      </ul>
      <!--<loading v-show="showLoading"></loading>-->
    </div>
    <div class="cont-wrap shop-cont-wrap container">
      <ul class="u-crumbs">
        <li class="crumbs-item">
          <a href="/home.html" target="_blank">首页</a>
        </li>
        <li class="crumbs-item">
          <a href="/cart.html">购物车</a>
        </li>
        <li class="crumbs-item">填写订单</li>
        <li class="crumbs-item">支付订单</li>
      </ul>
      <!-- u-crumbs END -->
      <div class="order-status">
        <p class="order-text">订单提交成功,仅差一步完成购物,请您尽快支付!</p>
        <p class="order-pay-money">
          实付金额 <span class="money" v-if="PayMoney">¥{{PayMoney/100}}</span>
        </p>
      </div>
      <!-- order-status END -->
      <div class="line u-line"></div>
      <!-- select-pay -->
      <div class="select-pay-mode">
        <h5>请选择支付方式:</h5>
        <div class="ali-pay pay-mode" @click="onSelectPayMode('alipay')">
          <i class="radio" :class="PayMode==='alipay'&&'active'">
            <span class="circle"></span>
          </i>
          <img class="icon" src="../../assets/images/icon/ic-ali-pay.png" alt="支付宝" />
        </div>
        <div class="wx-pay pay-mode" @click="onSelectPayMode('weixin')">
          <i class="radio" :class="PayMode==='weixin'&&'active'">
            <span class="circle"></span>
          </i>
          <img class="icon" src="../../assets/images/icon/ic-wx-pay.png" alt="微信支付"/>
        </div>
      </div>
      <!-- select-pty END -->
      <div class="btn pay-btn" @click="onPay">立即支付</div>
      <!-- pay-btn END -->
    </div>
    <transition name="fade">
      <div class="m-popup-content" v-if="WxPopus||AliPopus">
        <!-- 微信弹窗 -->
        <section class="wx-popup popup" v-if="WxPopus">
          <div class="popup-head">
            <h5>微信支付</h5>
            <i class="wa-close close" @click="onClosePop('weixin')"></i>
          </div>
          <div class="popup-content">
            <div class="wx-code-wrap">
              <div class="code-img">
                <img :src="returnBase64Img">
              </div>
              <p>请用微信扫一扫,进行支付</p>
            </div>
            <!-- 微信二维码 END -->
            <div class="button-wrap">
              <div class="success-btn-wrap">
                <p>支付成功请点击</p>
                <div class="btn wx-btn success-btn" @click="onSubmit('weixin')">
                  已完成付款
                </div>
              </div>
              <div class="error-btn-wrap">
                <p>遇到问题请点击</p>
                <div class="btn wx-btn error-btn">
                  重新付款
                </div>
              </div>
            </div>
            <!-- button-wrap END -->
            <div class="help">
              <a @click="contact" href="javascript:void(0)">仍未解决?请咨询客服</a>
            </div>
          </div>
        </section>
        <!-- 支付宝弹窗 -->
        <section class="ali-popup popup" v-if="AliPopus">
          <div class="popup-head">
            <h5>支付宝支付</h5>
            <i class="wa-close close" @click="onClosePop('ali')"></i>
          </div>
          <div class="popup-content">
            <p class="info">付款完成前请不要关闭窗口。</p>
            <div class="button-wrap">
              <div class="success-btn-wrap">
                <p>支付成功请点击</p>
                <div class="btn wx-btn success-btn" @click="onSubmit('ali')">
                  已完成付款
                </div>
              </div>
              <div class="error-btn-wrap">
                <p>遇到问题请点击</p>
                <div class="btn wx-btn error-btn">
                  重新付款
                </div>
              </div>
            </div>
            <!-- button END -->
            <div class="help">
              <a @click="contact" href="javascript:void(0)">仍未解决?请咨询客服</a>
            </div>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>
<script>
/*eslint-disable*/
import { UrlUtils } from 'scripts/utils/url-utils.js'
import { mixin as contactMixin } from '../contactMixin'
let urlUtils = new UrlUtils()
export default {
  mixins: [ contactMixin ],
  data() {
    return {
      PayStatus: false,  // 支付状态
      PayMoney: undefined, // 支付金额
      PayMode: 'alipay', // 支付方式
      TradeId: undefined, // 订单Id
      WxCode: '', // 微信支付url
      WxPopus: false, // 微信弹出层
      AliPopus: false // 支付宝支付
    }
  },
  created() {
    this.TradeId = urlUtils.getParams('TradeId')
    this.detectionPaySurroundings().then(() => {
      if (this.PayStatus!=0) {
        window.location.href = '/'
      }
    })
  },
  methods: {
    // 检测支付环境
    detectionPaySurroundings() {
      let self = this
      return new Promise((resolve, reject) => {
        self.$request.do('GET', 'pay/get', {
          params: {
            TradeId: self.TradeId
          }
        }).then(res => {
          self.PayStatus = res.take('Data').PayStatus
          self.PayMoney = res.take('Data').PayMoney
          resolve()
        })
      })
    },
    // 选择支付方式
    onSelectPayMode(t) {
      this.PayMode = t
    },
    // 关闭弹窗
    onClosePop(t) {
      switch(t) {
        case 'weixin':
          this.WxPopus = false
          break
        case 'ali':
          this.AliPopus = false
          break
      }
    },
    // 提交支付
    onPay() {
      let params = {
        TradeId: this.TradeId,
        Platform: this.PayMode,
        Wap: false,
        Jump: false
      }
      let url = 'pay/for?'
      for (let i in params) {
       if (url.endsWith('?')) {
         url += `${i}=${params[i]}`
       } else if (url.endsWith('&')) {
         url += `${i}=${params[i]}`
       } else {
         url += `&${i}=${params[i]}`
       }
      }
      if (this.PayMode === 'weixin' && !params.Wap) {
        this.$request.do('GET', url).then(res => {
          this.WxCode = res.take('Data')
          this.WxPopus = true
        })
      } else {
        this.$request.do('GET', url).then(res => {
          let _url = res.take('Data')
          window.open(_url)
          this.AliPopus = true
        })
      }
    },
    onSubmit(type) {
      // 检测支付环境
      this.detectionPaySurroundings().then(res => {
        this.onClosePop(type)
        switch(this.PayStatus) {
          case 0:
            layer.toast('请重新支付')
            break
          case 1:
            layer.toast('支付成功')
            break
          case 2:
            layer.toast('无需支付')
            break
          case 3:
            layer.toast('无法支付')
            break
        }
        if (this.PayStatus != 0) {
          setTimeout(function() {
            window.location.href = '/'
          }, 3000)
        }

        // if (this.PayStatus === ) {
        //   window.location.href = '/'
        // } else {
        //   layer.toast('支付失败,请重新支付')
        //   this.onClosePop(type)
        // }
      })
    }
  },
  computed: {
    // 转换为base64格式的图片
    returnBase64Img() {
      let img = this.WxCode
      return `data:image/png;base64,${img}`
    }
  }
}
</script>
