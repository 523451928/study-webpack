<template>
  <transition name="fade-in">
    <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">我的优惠券</div>
        <div class="panel-body profile-panel-body">
          <div id="coupon-code" class="coupon-code-con">
            <div class="gift-form form-inline">
              <label for="coupon-key">使用兑换码：</label>
              <input type="text" id="coupon-key" @keyup.enter="sendCoupon" v-model="couponCode" class="form-control" placeholder="请输入兑换码"/>
              <button class="btn btn-default" @click="sendCoupon">兑换</button>
              <span class="coupon-code-tips">（兑换成功后优惠券会显示在未使用里）</span>
            </div>
          </div>
          <div class="nav-wrap">
            <a href="/faq.html" class="pull-right" target="_blank">常见问题</a>
            <ul class="list-unstyled tickets-nav">
              <li v-for="(item, index) in tabArr" :class='{active:active==item.status}' @click="changeTab(item.status)">
                <a href="javascript:void (0);">{{item.text}}</a>
              </li>
            </ul>
          </div>
          <div class="clearfix">
            <p class="no-tickets" v-show="couponArr.length==0">暂无优惠券 (╥﹏╥)</p>
            <ul class="list-unstyled ticket-list" v-show="couponArr.length>0">
              <li v-for="(item,index) in couponArr">
                <div class="ticket">
                  <div class="info">
                    <span class="title">{{item.Type==1?item.Detail.Name:
                      item.Type==2?'注册优惠':
                        item.Type==3?'个人优惠':item.Detail.Name}}</span>
                    <span class="name" v-if="item.Type==1">{{item.Detail.LimitScope==0?'全站':
                      item.Detail.LimitScope==1?'定制':item.Detail.LimitScope==2?'商店':''}}</span>
                    <span class="name" v-if="item.Type!=1">全场通用</span>
                    <span class="time" v-text="dateText(item)"></span>
                  </div>
                  <div class="money"><i v-if="!item.Detail.AmountScale">￥</i><span v-text="amountText(item)"></span></div>
                </div>
              </li>
            </ul>
            <div class="page-wrapper clearfix" v-show="couponArr.length>0">
              <pagination :nextDisable="nextDisable" class="pull-right" :pager="pager" @updatePage="updatePageIndex"></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>
<script>
import { InterfaceMap } from 'scripts/interfaceConst.js'
import { padLeftZero } from '../../scripts/tools/padLeftZero'
import { codeObj } from 'scripts/tools/couponCode'
import Pagination from 'components/public/Pager.vue'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      active: 0,
      couponCode: '',
      couponArr: [],
      couponObj: {},
      notCoupon: false,
      pageId: 1,
      pager: [],
      tabArr: [
        {'text': '未使用', 'status': 0},
        {'text': '已使用', 'status': 2},
        {'text': '已过期', 'status': 1}
      ]
    }
  },
  mounted() {
    this.getCouponList()
  },
  methods: {
    changeTab(status) {
      if (this.active !== status) {
        this.active = status
        this.getCouponList()
      }
    },
    updatePageIndex(index) {
      this.pageId = index
      this.getCouponList()
    },
    sendCoupon() {
      if (!this.couponCode) {
        this.$notify({
//          type: 'wa-primary',
          text: '请输入兑换码'
        })
        return
      }
      let Code = [this.couponCode]
      let body = {Code: Code}
      let emulateObj = {'emulateJSON': true}
      request.do('POST', 'http://192.168.1.6:8000/coupon/take', body, emulateObj).then((res) => {
        let data = res.body.Data
        for (let key in data) {
          this.$notify(codeObj[data[key]])
          if (data[key] === 'Success') {
            this.getCouponList()
          }
        }
      })
    },
    dateText(item) {
      let date = new Date(item.Detail.End)
      let timeStr
      if (item.Detail.End === 0 || !item.Detail.End) {
        return '长期有效'
      } else {
        timeStr = date.getFullYear() + '-' +
          padLeftZero(date.getMonth() + 1) + '-' +
          padLeftZero(date.getDate())
        return '有效期至: ' + timeStr
      }
    },
    amountText(item) {
      let obj = item.Detail
      if (obj.AmountScale) {
        return obj.Amount / 10 + '折'
      } else {
        return obj.Amount / 100
      }
    },
    getCouponList() {
      const params = {'Status': this.active, 'Page': this.pageId, 'Count': 10}
      request({ url: 'coupon/list', params }).then((res) => {
        this.couponArr = res.body.Data === null ? [] : res.body.Data
        this.pager = res.body.Pager
        console.log(JSON.stringify(res.body))
      })
    },
    agency() {
      let self = this
      request({ url: InterfaceMap.bindAgency }).then(res => {
        let data = res.take('Data')
        if (data !== null) {
          self.couponObj.unshift(data)
          console.log(self.couponObj)
          data.End = data.ValidDate
          data.AgencyId = data.UserId
        }
      })
    }
  },
  computed: {
    nextDisable() {
      return this.couponArr.length < 10
    }
  }
}
</script>
