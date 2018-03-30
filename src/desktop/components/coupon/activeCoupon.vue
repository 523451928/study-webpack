<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">我的优惠券</div>
        <div class="panel-body profile-panel-body">
          <div id="coupon-code" class="coupon-code-con">
            <div class="gift-form form-inline">
              <label for="coupon-key">使用兑换码：</label>
              <input type="text" id="coupon-key" v-model="couponCode" class="form-control" placeholder="请输入兑换码"/>
              <button class="btn btn-default">使用</button>
              <span class="coupon-code-tips">（兑换成功后优惠券会显示在未使用里）</span>
            </div>
          </div>
          <div class="nav-wrap">
            <a href="/faq.html" class="pull-right" target="_blank">常见问题</a>
            <ul class="list-unstyled tickets-nav">
              <li v-for="(item, index) in tabArr" :class='{"active" : active===index}' @click="changeTab(index)">
                <a>{{item.text}}</a>
              </li>
            </ul>
          </div>
          <div id="no-used" class="clearfix">
            <p class="no-tickets" v-show="couponArr.length==0">暂无优惠券 (╥﹏╥)</p>
            <ul class="list-unstyled ticket-list" v-show="couponArr.length>0">
              <li v-for="(item,index) in couponArr">
                <div class="ticket">
                  <div class="info">
                    <span class="name">{{item.Name}}</span>
                    <span class="title">{{item.Tag}}</span>
                    <span class="time"></span>
                  </div>
                  <div class="money">￥<span></span></div>
                </div>
              </li>
            </ul>
            <div class="pull-right" v-show="couponArr.length>0">
              <pagination @updatePage="updatePage" :pager="pager"></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
import { InterfaceMap } from 'scripts/interfaceConst.js'
import pagination from '../public/Pager.vue'
export default {
  data() {
    return {
      active: 0,
      couponCode: '',
      couponArr: [],
      tabArr: [
        {text: '正常'},
        {text: '已禁用'},
        {text: '已使用'}
      ],
      page: 1,
      count: 10,
      pager: {}
    }
  },
  components: {
    pagination
  },
  mounted() {
    this.getCoupon()
  },
  methods: {
    updatePage(num) {
      this.page = num
//      this.getCoupon()
    },
    changeTab(index) {
      this.active = index
      this.getCoupon()
    },
    getCoupon() {
      const params = {
        Status: this.active,
        Page: this.page,
        Count: this.count
      }
      request({ url: 'coupon/list', params }).then((res) => {
        this.couponArr = res.body.Data === null ? [] : res.body.Data
        this.pager = res.body.Pager
      })
    },
    dateChange(item) {
      let date = new Date(item.Detail.End)
      let timeStr
      if (item.End === 0) {
        return '长期有效'
      } else {
        timeStr = date.getFullYear() + '-' +
          (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' +
          (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
        return '有效期至: ' + timeStr
      }
    },
    realAmount(item) {
      if (item.Detail.AmountScale) {
        let z = 10 - item.Detail.Amount / 10
        return z + '折'
      } else {
        let m = item.Detail.Amount / 100
        return m + '元'
      }
    }
  }
}
</script>
