<template>
  <div class="nav-wrapper">
    <nav class="m-nav" id="m-nav">
      <div class="nav-item" @click="navToggle(1)">
        <a :href="homeHref" class="nav-link" :class="{active: activeFlag === '1'}">
          <i class="wa wa-home" :class="{'wa-home-pressed': activeFlag === '1'}"></i><br/><span>首页</span>
        </a>
      </div>
      <div class="nav-item" @click="navToggle(3)">
        <a :href="workHref" class="nav-link" :class="{active: activeFlag === '3'}">
          <i class="wa wa-new-store" :class="{'wa-new-store-pressed': activeFlag === '3'}"></i><br/><span>商店</span>
        </a>
      </div>
      <div class="nav-item" @click="showNav">
        <div class="m-nav-custom">
          <a href="javascript: void(0)" class="nav-link" :class="{active: activeFlag === '2'}">
            <i class="wa wa-pencil wa-pencil-special"></i><br/><span>定制</span>
          </a>
        </div>
        <div class="white-mask"></div>
      </div>
      <div class="nav-item" @click="navToggle(5)">
        <a :href="cartHref" class="nav-link" :class="{active: activeFlag === '5'}">
          <i class="wa wa-shopping-cart" :class="{'wa-shopping-cart-fill': activeFlag === '5'}"></i><br/><span>购物车</span>
        </a>
      </div>
      <div class="nav-item" @click="navToggle(4)">
        <a :href="userHref" v-add-url class="nav-link" :class="{active: activeFlag === '4'}">
          <i class="wa wa-man" :class="{'wa-man-pressed': activeFlag === '4'}"></i><br/><span>我的</span>
        </a>
      </div>
    </nav>
    <custom-nav ref="customNav"></custom-nav>
  </div>
</template>

<script>
/* eslint-disable */
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import customNav from './walllife/customNav.vue'
export default {
  components: {
    customNav
  },
  data() {
    let flag = sessionStorage.getItem('navFlag') || '1'
    return {
      activeFlag: flag,
      user: false,
      homeHref: '/',
      workHref: '/work',
      cartHref: '/cart.html?hasNav=true',
      userHref: '/user/user.html'
    }
  },
  created() {
    switch (window.location.pathname) {
      case '/':
        this.activeFlag = '1'
        this.homeHref = 'javascript: void(0);'
        break
      case '/customlist.html':
        this.activeFlag = '2'
        break
      case '/work':
        this.activeFlag = '3'
        this.workHref = 'javascript: void(0);'
        break
      case '/user/user.html':
        this.activeFlag = '4'
        this.userHref = 'javascript: void(0);'
        break
      case '/cart.html':
        this.activeFlag = '5'
        this.cartHref = 'javascirp: void(0);'
        break
      default:
        this.activeFlag = '0'
    }
  },
  methods: {
    showNav() {
      this.$refs.customNav.show()
      $('.bd').addClass('filter')
      $('html').addClass('scroll-hidden')
    },
    navToggle(flag) {
      let prevNavFlag = sessionStorage.getItem('navFlag') || '1'
      sessionStorage.setItem('prev-navFlag', prevNavFlag)
      sessionStorage.setItem('navFlag', flag)
      if (flag === 4 && !this.$user.IsLogin) {
        request({url: Interf.getUserHead}).then(res => {
          let data = res.data
          if (data['UserId'] ) {
            this.user = true
            window.location.href = '/user/user.html'
          } else {
            window.location.href = '/login.html'
          }
        })
      }
    }
  }
}
</script>

<style lang="sass">
  #m-nav {
    position: fixed;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 999;
    background-color: rgba(255,255,255, 1);
    color: #565a5c;
    display: flex;
    border-top: 1px solid #dce0e0;
    box-shadow: 0 -2px 19px rgba(0, 0, 0, 0.2);
    .nav-item {
      position: relative;
      .white-mask{
        width: 80px;
        height: 45px;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
      }
      .m-nav-custom{
        text-align: center;
        margin: -1px auto;
        box-shadow: 0 -2px 19px rgba(0, 0, 0, 0.2);
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #fff;
        position: relative;
        top: -22px;
        span{
          font-size: 12px;
          color: #565a5c;
          position: relative;
          z-index: 1;
        }
        .wa-pencil-special{
          color: #fff;
          display: inline-block;
          width: 40px;
          height: 40px;
          line-height: 38px;
          border-radius: 50%;
          background-color: #26a7c7;
          box-shadow: 0px 2px 7px #7adef7;
          font-size: 22px;
          margin-top: 7px;
          margin-bottom: 2px;
          position: relative;
          z-index: 100;
        }
      }
      flex: 1;
      >a {
        color: inherit;
        display: block;
        width: auto;
        margin: 0 auto;
        text-align: center;
        font-size: 12px;
        padding: 5px 0;
        i{
          font-size: 20px;
          margin-right: 2px;
        }
        &.active {
          color: #26a7c7;
        }
      }
    }
  }
</style>
