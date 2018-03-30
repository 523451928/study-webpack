<template>
  <div class="warp">
    <div class="profile-head">
      <a href="./user.html" class="pull-left back">
        <i class="wa wa-left"></i>
      </a>活动优惠券
    </div>
    <div class="form-wrap">
      <div class="panel panel-default" v-infinite="getCouponList" infinite-scroll-disabled="infiniteDisable" infinite-scroll-distance="10">
        <div class="panel-heading">我的优惠券</div>
        <div class="panel-body profile-panel-body">
          <div id="coupon-code" class="coupon-code-con">
            <div class="gift-form">
              <div class="pull-left gift-form-input">
                <input type="text" id="coupon-key" v-model="couponCode" class="form-control" placeholder="请输入兑换码"/>
              </div>
              <button class="btn btn-primary pull-right" id="submit-coupon" @click="sendCoupon">使用</button>
            </div>
            <span class="coupon-code-tips">注：兑换成功后优惠券会显示在未使用里</span>
          </div>
          <div class="nav-wrap">
            <ul class="list-unstyled tickets-nav">
              <li v-for="(item,index) in tabArr" :class='{active:active==item.status}' @click="changeTab(item.status)">
                <a href="javascript:void(0);">{{item.text}}</a>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { InterfaceMap } from 'scripts/interfaceConst.js'
import { padLeftZero } from '../../scripts/tools/padLeftZero'
export default {
  data() {
    return {
      active: 0,
      couponCode: '',
      couponArr: [],
      couponObj: {},
      notCoupon: false,
      pageId: 1,
      tabArr: [
        {'text': '未使用', 'status': 0},
        {'text': '已使用', 'status': 2},
        {'text': '已过期', 'status': 1}
      ],
      infiniteDisable: true
    }
  },
  mounted() {
    this.getCouponList()
  },
  methods: {
    changeTab(status) {
      if (this.active !== status) {
        this.active = status
        this.pageId = 1
        this.couponArr = []
        this.getCouponList()
      }
    },
    sendCoupon() {
      let Code = [this.couponCode]
      let body = {Code: Code}
      let emulateObj = {'emulateJSON': true}
      request.do('POST', 'coupon/take', body, emulateObj).then((res) => {
        let data = res.body.Data
        console.log(data)
        for (let key in data) {
          layer.toast(data[key])
          if (data[key] === 'Success') {
            this.getCouponList()
          }
        }
      })
    },
    getCouponList() {
      const params = {'Status': this.active, 'Page': this.pageId, 'Count': 10}
      this.infiniteDisable = true
      request({ url: 'coupon/list', params }).then((res) => {
        let couponArr = res.body.Data === null ? [] : res.body.Data
        this.couponArr = this.couponArr.concat(couponArr)
        if (couponArr.length > 0) {
          setTimeout(() => {
            this.pageId++
            this.infiniteDisable = false
          }, 1000)
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
    }
  }
}
</script>

