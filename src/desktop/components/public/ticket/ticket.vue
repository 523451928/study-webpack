<template>
  <div class="ticket-bg">
    <div class="ticket-info" v-if="couponObj.User">
      <p class="nickname">{{couponObj.User.Nickname}}<span v-if="hasReceive">送你</span>的</p>
      <p class="ticket-type">好友邀请优惠</p>
      <p class="dead-line">有效期至 : {{deadLine}}</p>
    </div>
    <div class="money" :class="{'hasReceive': hasReceive}" v-if="amountText" @click="receiveTicket">
      <span><i v-if="!couponObj.AmountScale">￥</i>{{amountText}}</span>
      <span v-if="hasReceive" class="receive-btn">点击领取</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      couponObj: {
        type: Object,
        default() {
          return {}
        }
      },
      hasReceive: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      amountText() {
        if (this.couponObj.AmountScale) {
          return (this.couponObj['Amount'] / 10) + '折'
        } else {
          return this.couponObj['Amount'] / 100
        }
      },
      deadLine() {
        let str = ''
        if (this.couponObj.End && this.couponObj.End > 0) {
          let date = new Date(this.couponObj.End)
          str = date.getFullYear() + '-' +
            this.padLeftZero(date.getMonth() + 1) + '-' +
            this.padLeftZero(date.getDate())
        } else {
          str = '长期有效'
        }
        return str
      }
    },
    methods: {
      receiveTicket() {
        if (this.hasReceive) {
          this.$emit('receiveTicket')
        }
      },
      padLeftZero(str) {
        return ('00' + str).substr((str + '').length)
      }
    }
  }
</script>

<style lang="sass">
  .ticket-bg{
    width: 80%;
    height: 1.2rem;
    position: relative;
    background: url("../../../assets/images/coupon-bg.png") no-repeat;
    background-size: contain;
    margin: 0 auto;
    padding: .1rem;
    box-sizing: border-box;
    .ticket-info{
      border: 1px solid #fff;
      text-align: center;
      position: relative;
      height: 86%;
      width: 1.62rem;
      color: #fff;
      .nickname{
        margin-top: .1rem;
        min-height: .2rem;
      }
      .ticket-type{
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 2px;
        white-space: nowrap;
      }
      .dead-line{
        border-top: 1px solid #fff;
        position: absolute;
        font-size: 10px;
        width: 100%;
        bottom: 0;
        height: .2rem;
        line-height: .16rem;
      }
    }
    .money{
      position: absolute;
      width: 1rem;
      height: 1.1rem;
      font-size: .4rem;
      text-align: right;
      color: #f05950;
      top: 0rem;
      right: 0rem;
      padding-right: .2rem;
      padding-top: .18rem;
      .receive-btn{
        width: .7rem;
        font-size: 14px;
        color: #fff;
        height: .24rem;
        line-height: .24rem;
        border-radius: .15rem;
        background: #f05950;
        text-align: center;
        display: inline-block;
        margin-top: 0rem;
        position: relative;
        top: -.26rem;
        left: .04rem;
      }
      i{
        font-size: 16px;
        font-style: normal;
      }
    }
    .hasReceive{
      padding-top: .1rem;
    }
  }
</style>
