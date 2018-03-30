<template>
  <div class="recieve-wrapper">
    <wa-head title="优惠券" class="scale-1px"></wa-head>
    <ticket :ticketArr="ticketArr" ></ticket>
    <div class="receive-btn" @click="receiveCoupon">
      点击领取
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import WaHead from '../../public/Wahead.vue'
  import ticket from '../../public/ticket.vue'
  import { mixin } from 'scripts/tools/reciveCoupon'
  import { InterfaceMap } from 'scripts/interfaceConst'
  export default{
    mixins: [mixin],
    data() {
      return {
        ticketArr: [],
        couponArr: []
      }
    },
    mounted() {
      let str = location.search.substr(1)
      if (str) {
        let paramArr = str.split('&')
        let couponArr = []
        paramArr.forEach((item) => {
          if (item.split('=')[0] === 'couponCode') {
            couponArr.push(item.split('=')[1])
          }
        })
        this.couponArr = couponArr
        console.log(couponArr)
        let params = {Code: couponArr}
        request({url:`${InterfaceMap.base}/coupon/task`, params}).then((res) => {
          console.log(res.body.Data)
          let data = res.body.Data
          for (let key in data) {
            let obj = {}
            if (data[key]) {
              obj.deadline = data[key].End
              obj.remark = data[key].Tag
              obj.name = data[key].Name
              obj.money = data[key].AmountScale ? 0 : data[key].Amount
              obj.discount = data[key].AmountScale ? `${data[key].Amount / 10}折` : ''
              this.ticketArr.push(obj)
            }
          }
        })
      }
    },
    methods: {

    },
    components: {
      WaHead,
      ticket
    }
  }
</script>
