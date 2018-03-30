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
              <button class="btn btn-default" @click="sendCoupon">使用</button>
              <span class="coupon-code-tips">（兑换成功后优惠券会显示在未使用里）</span>
            </div>
          </div>
          <div class="nav-wrap">
            <a href="/message.html?messages=3" class="pull-right" target="_blank">常见问题</a>
            <ul class="list-unstyled tickets-nav">
              <li :class='{active:active==1}' @click="tabli(1)">
                <a href="###">未使用</a>
              </li>
              <li :class='{active:active==2}' @click="tabli(2)">
                <a href="###">已使用</a>
              </li>
              <li :class='{active:active==3}' @click="tabli(3)">
                <a href="###">已过期</a>
              </li>
            </ul>
          </div>
          <div class="coupon-ticket-con" id="no-used" :class="{active:active==1}">
            <p class="no-tickets" v-show="notCoupon">暂无优惠券 (╥﹏╥)</p>
            <ul class="list-unstyled ticket-list" v-show="!notCoupon">
              <li v-for="(item,index) in couponObj">
                <div class="ticket">
                  <div class="info">
                    <span class="name">{{item.Name}}</span>
                    <span class="title">{{item.Tag}}</span>
                    <span class="time" v-text="dateChange(item.End)"></span>
                  </div>
                  <div class="money">￥<span v-text="realAmount(item)"></span></div>
                </div>
              </li>
            </ul>
          </div>
          <div class="coupon-ticket-con" id="already-used" :class="{active:active==2}">
            <p class="no-tickets" v-show="notCoupon2">暂无优惠券 (╥﹏╥)</p>
            <ul class="list-unstyled ticket-list" v-show="!notCoupon2">
              <li v-for="(item,index) in couponObj2">
                <div class="ticket">
                  <div class="info">
                    <span class="name">{{item.Name}}</span>
                    <span class="title">{{item.Tag}}</span>
                    <span class="time" v-text="dateChange(item.End)"></span>
                  </div>
                  <div class="money">￥<span v-text="realAmount(item)"></span></div>
                </div>
              </li>
            </ul>
          </div>
          <div class="coupon-ticket-con" id="Expired" :class="{active:active==3}">
            <p class="no-tickets" v-show="notCoupon3">暂无优惠券 (╥﹏╥)</p>
            <ul class="list-unstyled ticket-list" v-show="!notCoupon3">
              <li v-for="(item,index) in couponObj3">
                <div class="ticket">
                  <div class="info">
                    <span class="name">{{item.Name}}</span>
                    <span class="title">{{item.Tag}}</span>
                    <span class="time" v-text="dateChange(item.End)"></span>
                  </div>
                  <div class="money">￥<span v-text="realAmount(item)"></span></div>
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
export default {
  data() {
    return {
      active: 1,
      couponCode: '',
      couponObj: [],
      couponObj2: [],
      couponObj3: [],
      notCoupon: false,
      notCoupon2: false,
      notCoupon3: false
    }
  },
  mounted() {
    this.noUsed()
  },
  methods: {
    tabli(num) {
      this.active = num
      if (num === 2) {
        this.alreadyUsed()
      } else if (num === 3) {
        this.outDate()
      }
    },
    sendCoupon() {
      let self = this
      let Code = this.couponCode
      request({ url: 'tc/coupon/getbycode?Code=' + Code }).then(res => {
        self.couponObj = res.take('Data')
        layer.toast('领取成功')
        this.noUsed()
        this.couponCode = ''
      }, res => {
        res.hide()
        layer.toast('该优惠券不存在')
        this.couponCode = ''
      })
    },
    dateChange(t) {
      let str = t.substr(0, t.indexOf('T'))
      return '有效期至：' + str
    },
    realAmount(item) {
      // Way == 1:固额优惠 2：折扣优惠
      if (item.Way === 1) {
        let money = item.Amount / 100
        return money
      } else if (item.Way === 2) {
        let a = (item.Amount / 100) * 10
        return a + '折'
      }
    },
    noUsed() {
      //      this.showLoading = false
      let self = this
      const params = {'Status': 1}
      request({ url: 'tc/coupon/list', params }).then(res => {
        self.couponObj = res.take('Data')
        if (self.couponObj.length === 0) {
          this.notCoupon = true
        }
      })
    },
    alreadyUsed() {
//      this.showLoading = false
      let self = this
      const params = {'Status': 2}
      request({ url: 'tc/coupon/list', params }).then(res => {
        self.couponObj2 = res.take('Data')
        if (self.couponObj2.length === 0) {
          this.notCoupon2 = true
        }
      })
    },
    outDate() {
      //      this.showLoading = false
      let self = this
      const params = {'Status': 3}
      request({ url: 'tc/coupon/list', params }).then(res => {
        self.couponObj3 = res.take('Data')
        if (self.couponObj3.length === 0) {
          this.notCoupon3 = true
        }
      })
    }
  }
}
</script>
