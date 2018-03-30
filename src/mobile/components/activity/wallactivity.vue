<template>
  <div class="wall-activity">
    <img class="top-img" :src="activiData.BackgroundImage"/>
    <div class="activity-wrapper" :style="{background:activiData.BackgroundColor}">
      <div class="activity-content">
        <img class="avatar" :src="activiData.InviterAvatar">
        <p class="activity-info">{{activiData.InviteContent}}</p>
        <ticket :ticketArr="ticketArr" :hasBtn="true" @receiveCoupon="receiveCoupon"></ticket>
        <a class="wa-link" :href="activiData.Link">{{activiData.LinkTitle}}</a>
      </div>
      <div class="info-title">
        {{activiData.ExplainTitle}}
      </div>
      <div class="info-content" v-html="activiData.Explain"></div>
      <span class="receive-btn" @click="receiveCoupon">立即领取</span>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import ticket from '../public/ticket.vue'
  import { getURLParameters } from 'scripts/tools/getURLParameters'
  import { mixin as methods} from 'scripts/tools/reciveCoupon'
  export default{
    mixins : [methods],
    data() {
      return {
        activiData: {
          PageTitle: '墙蛙的小礼物',
          BackgroundImage: require('../../assets/images/assist/join/1.png'),
          InviterAvatar: require('../../assets/images/assist/join/2.png'),
          InviteContent: '邀请人送给你2张优惠券',
          BackgroundColor: '#625e6f',
          CouponCode: ['23424', '2354343'],
          ticketArr: [
            {
              remark: '冬季特惠',
              deadline: new Date().getTime(),
              money: 2000,
              name: '消费满88减20',
              code: 123458
            },
            {
              remark: '冬季特惠',
              deadline: new Date().getTime(),
              money: 2000,
              name: '消费满88减20',
              code: 323442
            }
          ],
          Link: '/',
          LinkTitle: '去墙蛙网首页逛逛',
          ExplainTitle: '使用说明',
          Explain: '1.士大夫撒发的胜多负少地狱公寓声第一季六六大顺士大夫撒发的胜多负少地狱公寓声第一季六六大顺<br>2.暗室逢灯施工方的广泛地第三方<br>3.暗室逢灯施工方的广泛地第三方'
        },
        ticketArr: []
      }
    },
    methods: {
    },
    directives: {
      addurl: {
        bind: (el, binding) => {
          let key = encodeURIComponent(binding.arg || 'Next') + '='
          let url = encodeURIComponent(window.location.href)
          let i = el.href.lastIndexOf('?')
          if (i === -1) {
            el.href += '?' + key + url
          } else {
            let j = el.href.indexOf(key, i)
            if (j === -1 || !(j === i + 1 || el.href[j - 1] === '&')) {
              el.href += '&' + key + url
            }
          }
        }
      }
    },
    mounted() {
      let activityId = getURLParameters(window.location.href).activityId
      request({url:`http://m.wallwa.xxx/coupon/activity/${activityId}`}).then((res) => {
        this.activiData = res.data.Data
        document.title = this.activiData.PageTitle
        let params = {Code: this.activiData.CouponCode}
        request({url:'http://m.wallwa.xxx/coupon/task', params}).then((res) => {
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
      }).catch((err) => {
        console.log(err)
      })
    },
    components: {
      ticket
    }
  }
</script>
