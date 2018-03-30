<template>
  <transition name="slide-pay">
    <div class="pay-wrapper" :style="payStyle" v-show="payShow" @touchstart="startFn($event)"
         @touchmove="moveFn($event)" @touchend="endFn($event)">
      <div class="user-head scale-1px">
        <a class="pull-left back" @click="payShow = false">
          <i class="wa wa-left"></i>
        </a>
        <h2 class="title">选择支付方式</h2>
      </div>
      <div class="pay-list">
        <div class="pay-item" v-for="(item, index) in payList"  @click="changeIndex(index)">
          <span class="ww-icon icheck cb" :class="{'checked' : index === activeIndex}" ></span>
          <span :class="item.className"></span>
          {{item.name}}
      </div>
      </div>
      <span class="confirm-pay" @click="confirmPay">确认付款</span>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable */
  export default {
    props: {
      tradeId: {
        type: Number
      }
    },
    data() {
      return {
        payList: [
          {
            className: 'wa-alipay',
            name: '支付宝'
          },
          {
            className: 'wa-wechat-pay',
            name: '微信'
          }
        ],
        activeIndex: 0,
        payShow: false,
        touchObj: {
          moveX: 0
        }
      }
    },
    computed: {
      payStyle() {
        if (this.touchObj.moveX) {
          if (this.touchObj.isStart) {
            return {
              transform: `translateX(${this.touchObj.moveX}px)`
            }
          } else {
            if (typeof (this.touchObj.moveX) === 'number') {
              return {
                transform: `translateX(${this.touchObj.moveX}px)`,
                transition: 'all .3s'
              }
            } else {
              return {
                transform: `translateX(${this.touchObj.moveX})`,
                transition: 'all .3s'
              }
            }
          }
        }
      }
    },
    methods: {
      startFn(e) {
        this.touchObj.startX = e.touches[0].clientX
        this.touchObj.isStart = true
      },
      moveFn(e) {
        e.preventDefault()
        if (this.touchObj.isStart) {
          this.touchObj.moveX = e.touches[0].clientX - this.touchObj.startX
          if (this.touchObj.moveX <= 0) {
            this.touchObj.moveX = 0
          }
        }
      },
      endFn(e) {
        this.touchObj.isStart = false
        if (this.touchObj.moveX > 50) {
          this.touchObj.moveX = '100%'
          this.payShow = false
        } else {
          this.touchObj.moveX = 0
        }
      },
      show() {
        this.touchObj.moveX = 0
        this.payShow = true
      },
      changeIndex(index) {
        this.activeIndex = index
      },
      confirmPay() {
        let params = {
          TradeId: this.tradeId,   // 交易Id
          Wap: true,       // 是否移动端支付
          Jump: true      // 是否自动跳转
        }
        if (this.activeIndex === 0) {
          params.Platform = 'alipay'
        } else {
          params.Platform = 'weixin'
        }
        request({url: 'pay/for', params}).then((res) => {
          console.log(res)
        })
      }
    }
  }
</script>

<style lang="sass">
  .pay-wrapper{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: #f5f5f5;
    z-index: 1100;
  }
  .slide-pay-enter-active, .slide-pay-leave-active {
      transition: all .3s;
  }
  .slide-pay-enter, .slide-pay-leave-active {
      transform: translateX(100%);
  }
  .ww-icon {
    position: relative;
    top: 3px;
    margin-right: 4px;
    &.icheck {
      width: 18px;
      height: 18px;
      &.cb {
            background: url('~images/icon/icheck-cb.png') no-repeat;
            background-position: 0 0;
            background-size: cover;
            &.checked {
              background: url('~images/icon/icheck.png') no-repeat;
              background-position: 0 0;
              background-size: cover;
          }
        }
      }
    .icheck-input {
        width:18px;
        height: 18px;
        cursor: pointer;
        display: none;
    }
  }
  .pay-wrapper{
    .user-head{
      position: relative;
      top: 0;
      width: 100%;
      text-align: center;
      height: 45px;
      line-height: 45px;
      z-index: 1001;
      background: #fff;
      margin-bottom: 10px;
      border-bottom: none;
    }
    .user-head .wa-left{
      font-size: 17px;
      color: #82888a;
    }
    .user-head .back{
      position: absolute;
      left: 10px;
    }
    .pay-list{
      padding: 0px 0px 0px 15px;
      background: #fff;
    }
    .pay-list .pay-item{
      padding: 10px 0;
      border-bottom: 1px solid #dce0e0;
      color: #565A5C;
    }
    .pay-list .pay-item:last-child{
      border-bottom: none;
    }
    h2{
      font-size: 16px;
      color: #565A5C;
      padding: 0;
      margin: 0;
      line-height: 49px;
    }
    .wa-wechat-pay{
      color: #62b900;
      font-size: 20px;
      position: relative;
      top: 3px;
      margin-right: 3px;
    }
    .wa-alipay{
      color: #2da8c3;
      font-size: 20px;
      position: relative;
      top: 3px;
      margin-right: 3px;
    }
    .confirm-pay{
      position: fixed;
      bottom: 20px;
      display: inline-block;
      left: 2%;
      width: 96%;
      line-height: 46px;
      text-align: center;
      border-radius: 2px;
      color: #fff;
      background: #76a549;
    }
  }
</style>
