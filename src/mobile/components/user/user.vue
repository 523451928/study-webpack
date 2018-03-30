<template>
  <div class="warp">
    <!--头部-->
    <div class="user-head-bnr">
      <div class="user-bnr-info">
        <a href="./editor.html">
          <span class="head-icon">
            <img v-if="Avatar" :src="Avatar" alt="头像" class="item"/>
          </span>
          <span class="user-info-name" v-text="Nickname"></span>
          <span class="wa-right"></span>
        </a>
      </div>
    </div>
    <!--详情-->
    <div class="user-center-wrap ">
      <div class="row order-row">
        <div class="col-xs-12">
          <a href="../order.html#/0" class="user-order-link">
            <span class="user-order-tag pull-right">全部订单
              <i class="wa wa-right" style="font-size:12px;"></i>
            </span>
            <span class="user-order-text">我的订单</span>
          </a>
        </div>
      </div>
      <div class="row order-sort text-center">
        <div class="col-xs-3">
          <a href="../order.html#/1" class="order-sort-link">
            <i class="wa wa-wallet"></i><br/>待付款
          </a>
        </div>
        <div class="col-xs-3">
          <a href="../order.html#/2" class="order-sort-link">
            <i class="wa wa-delivery"></i><br/>待收货
          </a>
        </div>
      </div>
    </div>
    <div class="user-center-wrap">
      <div class="item-title">
        我的优惠
      </div>
      <div class="row order-sort text-center">
        <div class="col-xs-3">
          <a href="javascript:void(0);"  @click="codeHref" class="order-sort-link red-dot-wrap">
            <i class="wa wa-invitation"></i><br/>邀请返现
            <span class="red-dot"></span>
          </a>
        </div>
        <div class="col-xs-3">
          <a href="./active-coupon.html" class="order-sort-link">
            <i class="wa wa-coupons"></i><br/>优惠券
          </a>
        </div>
      </div>
    </div>
    <div class="user-center-wrap">
      <div class="item-title">
        我的服务
      </div>
      <div class="row order-sort text-center bottom-border">
        <div class="col-xs-3">
          <a href="./editor.html?isAdd=true"  @click="codeHref" class="order-sort-link">
            <i class="wa wa-address"></i><br/>地址管理
          </a>
        </div>
        <div class="col-xs-3">
          <a href="./like.html" class="order-sort-link">
            <i class="wa wa-heart"></i><br/>喜欢商品
          </a>
        </div>
        <div class="col-xs-3">
          <a href="./follow-fans.html#/follow" class="order-sort-link">
            <i class="wa wa-follow"></i><br/>我的关注
          </a>
        </div>
        <div class="col-xs-3">
          <a href="./follow-fans.html#/fans" class="order-sort-link">
            <i class="wa wa-fans"></i><br/>我的粉丝
          </a>
        </div>
      </div>
      <div class="row order-sort text-center ">
        <div class="col-xs-3">
          <a href="javascript:void(0);"  @click="contactService" class="order-sort-link">
            <i class="wa wa-customer-service"></i><br/>联系客服
          </a>
        </div>
        <div class="col-xs-3">
          <a href="../static/about.html" class="order-sort-link">
            <i class="wa wa-about2"></i><br/>关于墙蛙
          </a>
        </div>
        <div class="col-xs-3">
          <a href="./work.html" class="order-sort-link">
            <i class="wa wa-my-shop"></i><br/>我的店铺
          </a>
        </div>
      </div>
    </div>
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
      },
      contactService() {
        request({url: 'user/improve'}).then((res) => {
          let data = res.body.Data
          ysf.config({
            uid: data.Id, // 用户ID
            name: data.Nickname, // 昵称
            email: data.Email, // 信箱
            mobile: data.Mobile // 手机
          })
          window.url = function(){
            location.href = ysf.url()
          }
          window.openSDK = function(){
            ysf.open()
          }
          location.href = ysf.url()
        })
      }
    }
  }
</script>
