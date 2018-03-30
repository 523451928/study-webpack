<template>
  <div class="warp">
    <!--头部-->
    <div class="user-head-bnr">
      <a href="./editor.html" class="user-set-link">
        <span class="wa wa-setting"></span>
      </a>
      <div class="user-bnr-info">
        <a href="./editor.html" class="head-icon">
          <img :src="Avatar" alt="头像" class="item"/>
        </a>
        <div class="user-info-name" v-text="Nickname"></div>
      </div>
      <div class="user-social-links">
        <a href="./like.html" class="user-like-btn">喜欢
          <span class="link-count">{{likeCount}}</span>
        </a>
        <a href="./follow.html" class="user-follow-btn">关注
          <span class="follow-count">{{followCount}}</span>
        </a>
      </div>
    </div>
    <!--详情-->
    <div class="user-center-wrap ">
      <div class="row order-row">
        <div class="col-xs-12">
          <a href="../order.html#/0" class="user-order-link">
            <span class="user-order-tag pull-right">查看全部订单
              <i class="wa wa-right" style="font-size:12px;"></i>
            </span>
            <span class="user-order-text">我的订单</span>
          </a>
        </div>
      </div>
      <div class="row order-sort text-center">
        <div class="col-xs-3">
          <a href="../order.html#/4" class="order-sort-link">
            <i class="wa wa-order-completed"></i><br/>已完成
          </a>
        </div>
        <div class="col-xs-3">
          <a href="../order.html#/1" class="order-sort-link">
            <i class="wa wa-order-not-pay"></i><br/>未支付
          </a>
        </div>
        <div class="col-xs-3">
          <a href="../order.html#/5" class="order-sort-link">
            <i class="wa wa-order-closed"></i><br/>已关闭
          </a>
        </div>
        <div class="col-xs-3">
          <a href="../order.html#/income" class="order-sort-link">
            <i class="wa wa-order-income"></i><br/>收入订单
          </a>
        </div>
      </div>
      <div class="row shop-row">
        <div class="col-xs-12">
          <a href="./work.html" class="user-shop-link">
            <span class="user-shop-tag pull-right">查看全部商品
              <i class="wa wa-right"></i>
            </span>
            <span class="user-shop-text">我的店铺</span>
          </a>
        </div>
      </div>
      <div class="row coupon-row">
        <div class="col-xs-12">
          <div class="coupon-area">
            <a  @click="codeHref" class="user-coupon-link border-bottom clearfix">
              <span class="user-coupon-tag pull-right">
                <span class="user-coupon-value">{{userCode}}</span>
                <i class="wa wa-right"></i>
              </span>
              <span class="user-coupon-text">专属优惠码</span>
            </a>
            <a href="./active-coupon.html" class="user-coupon-link border-bottom clearfix">
              <span class="user-coupon-tag pull-right">
                <span class="user-ticket-count">{{couponCount}}</span>张
                <i class="wa wa-right"></i>
              </span>
              <span class="user-coupon-text">活动优惠券</span>
            </a>
            <a href="./wa-bin.html" class="user-coupon-link clearfix">
              <span class="user-coupon-tag pull-right">
                <span class="user-balance-value">{{waCoin}}</span>元
                <i class="wa wa-right"></i>
              </span>
              <span class="user-coupon-text">蛙币</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!--购物车logo-->
    <a href="../cart.html" class="fixed-cart-btn">
      <i class="point active"></i>
      <i class="wa wa-shopping-cart"></i>
    </a>
  </div>
</template>
<script>
  /* eslint-disable */
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  export default {
    data() {
      return {
        Avatar: '',
        Nickname: '',
        userCode: '',
        couponCount: 0,
        likeCount: 0,
        followCount: 0,
        waCoin: 0
      }
    },
    created() {
      this.getUserCoupon()
//      this.getLikeAndFollow()
    },
    methods: {
      getUserCoupon() {
        request({url: 'coupon/user'}).then((res) => {
          console.log(res)
          let data = res.take('Data')
          let user = data.User
          this.Avatar = 'http://192.168.1.6:8000/thumbnail/avatar/' + user['Id'] + '/100/' + user['Avatar']
          this.Nickname = user.Nickname
          this.userCode = data.Code
        }, (res) => {
          window.location.href = '/login.html'
        })
        const params = {'Status': 0, 'Page': 1, 'Count': 100}
        request({ url: 'coupon/list', params }).then((res) => {
          let couponArr = res.body.Data === null ? [] : res.body.Data
          this.couponCount = couponArr.length
        }, (res) => {
        })
      },
      getLikeAndFollow() {
        request({url: 'like/list'}).then((res) => {
          console.log(res.body)
          if (res.body.Data) {
            this.likeCount = res.body.Data.length
          }
        })
        let params = {Passive: true}
        request({url: 'follow/list', params}).then((res) => {
          if (res.body.Data) {
            this.followCount = res.body.Data.length
          }
        })
      },
      codeHref() {
        if (true) {
          window.location.href = '../coupon/agency/agency.html'
        } else {
          window.location.href = '../coupon/invite/inviteCode.html'
        }
      }
    }
  }
</script>
