<template>
  <header id="header" class="fixed-hd home-header top-navbar navbar-fixed-top h64">
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-12 h64">
                <div class="wm-nav-big clearfix h64"  @mouseenter.prevent="tophover">
                    <a class="navbar-brand paddrn" href="/">
                        <img src="~images/logo/logo-wallwa-normal.png" alt="墙蛙 - 唤醒你的墙" class="home-log-img">
                    </a>
                    <div class="list-menu" v-on:mouseenter.prevent='listToggle' v-on:mouseleave.prevent='listToggle'>
                        <span class="ww-icon pack-menu"></span>
                        <transition name="fade-in">
                          <ul class="wm-dropdown-menu wp-dropdown" v-show='listmenu'>
                            <li>
                              <a target="_blank" href="/guide.html">开店引导</a>
                            </li>
                            <li>
                              <a target="_blank" href="http://blog.wallwa.com/article/34/wallwa15.html">
                                <img src="~images/logo/disney-nav.png" class="disney-nav" alt="迪士尼正版授权"/>
                              </a>
                            </li>
                            <li>
                              <a target="_blank" href="http://blog.wallwa.com">墙蛙博客</a>
                            </li>
                            <li>
                              <a target="_blank" href="//wallwa.tmall.com">墙蛙旗舰店</a>
                            </li>
                            <li>
                              <a target="_blank" href="//wallwa.jiyoujia.com">墙蛙淘宝店</a>
                            </li>
                          </ul>
                        </transition>
                    </div>
                    <ul class="md-menu nav navbar-nav h64">
                        <li class="menu">
                            <a class="def-menu" href="/custom/8" target="_blank">
                                定制
                            </a>
                        </li>
                        <li class="toplist dropdown menu h75">
                            <a target="_blank" class="def-menu discovery" :href="`${baseUrl}/work`">
                                <i class="red-point"></i>
                                发现
                            </a>
                        </li>
                        <template v-if="$user.IsLogin">
                            <li class="menu last" id="new-pro" v-if="false" data-indentify="">
                                <a target="_blank" href="/product.html" class="btn btn-ghost btn-xs">创建新产品</a>
                            </li>
                            <li class="menu last" id="new-pro" v-else data-indentify="">
                                <a target="_blank" href="/product.html" class="btn btn-ghost btn-xs">创建新产品</a>
                            </li>
                            <!--<li @click="receiveCoupon" id="receiveCoupon" >-->
                              <!--领取优惠券-->
                            <!--</li>-->
                        </template>
                        <template v-else>
                            <li class="menu last" id="new-pro" data-indentify="">
                                <a class="btn btn-ghost btn-xs link" href="/login.html">创建新产品</a>
                            </li>
                        </template>
                    </ul>
                    <div class="sm-menu" v-on:mouseenter.prevent='smToggle' v-on:mouseleave.prevent='smToggle'>
                        <span class="ww-icon pack-menu"></span>
                        <transition  name="fade-in">
                          <ul class="wm-dropdown-menu wp-dropdown" v-show='smDrop'>
                            <li>
                              <a target="_blank" href="/custom.html#!/category/8">开始定制</a>
                            </li>
                            <li>
                              <a target="_blank" href="/public/list">发现</a>
                            </li>
                            <li>
                              <a target="_blank" href="/about">关于我们</a>
                            </li>
                            <li>
                              <a target="_blank" href="https://wallwa.tmall.com/?spm=a220o.1000855.w9378884-9436674517.14.HUmbeG">墙蛙旗舰店</a>
                            </li>
                            <li>
                              <a target="_blank" href="https://wallwa.jiyoujia.com/shop/view_shop.htm?spm=a1z10.1-c.w9263053-9619899774.11.rtTpKG">墙蛙淘宝店</a>
                            </li>
                            <li>
                              <a target="_blank" href="http://blog.wallwa.com">墙蛙博客</a>
                            </li>
                            <li>
                              <a target="_blank" href="/issue">常见问题</a>
                            </li>
                          </ul>
                        </transition>
                    </div>
                    <ul class="nav navbar-nav navbar-right h64">
                        <div class="nav-search-open-btn" @click='searchopen' v-show='searchbtn'>
                          <i class="wa wa-search mr4"></i>搜索
                        </div>
                        <div class="nav-search" v-show='!searchbtn'>
                            <i class="wa wa-search"></i>
                            <div class="search-hidden">
                                <input class="nav-search-content" ref="serch-input" id="serch-input" type="text" placeholder="搜索wallwa网" v-model="searchContent" @keyup.esc="btnclose" @keyup.up.stop.prevent="upFn" @keyup.down.stop.prevent="downFn" @keyup.enter="searchThings" autocomplete="off"/>
                                <i class="wa wa-close" @click='btnclose'></i>
                                <div class="search-tips" v-if="searchContent != '' && filterArr.length == 0">
                                    点击回车键进行搜索
                                </div>
                                <div class="nav-search-result ww-search" v-show='!searchbtn '>
                                    <ul v-show="filterArr.length > 0">
                                      <li v-for="(item, index) in queryArr" :class="{'active':index === activeIndex}" @mouseenter="activeIndex=index" @click="toQuery(item)">
                                        <a>{{item.text}}</a>
                                      </li>
                                    </ul>
                                    <!--<transition-group name="flip-list" tag="ul">-->
                                        <!--<li :key="item.text" v-show="filterArr.length == 0" v-for="(item, index) in searchHistory" :class="{'active':index === historyIndex}" @mouseenter="historyIndex=index" @click="toQuery(item)">-->
                                          <!--<a>{{item.text}} <span class="pull-right del" @click.stop="delHistory(index)">删除</span></a>-->
                                        <!--</li>-->
                                    <!--</transition-group>-->
                                    <!--<transition-group name="list-complete" tag="ul">-->
                                      <!--<li class="list-complete-item" :key="item.text" v-show="filterArr.length == 0" v-for="(item, index) in searchHistory" :class="{'active':index === historyIndex}" @mouseenter="historyIndex=index" @click="toQuery(item)">-->
                                        <!--<a>{{item.text}} <span class="pull-right del" @click.stop="delHistory(index)">删除</span></a>-->
                                      <!--</li>-->
                                    <!--</transition-group>-->
                                    <ul>
                                      <li class="list-complete-item" :key="item.text" v-show="filterArr.length == 0" v-for="(item, index) in searchHistory" :class="{'active':index === historyIndex}" @mouseenter="historyIndex=index" @click="toQuery(item)">
                                        <a>{{item.text}} <span class="pull-right del" @click.stop="delHistory(index)">删除</span></a>
                                      </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <template v-if="$user.IsLogin">
                            <li class="md-msg-btn">
                                <a target="_blank" href="/user/message.html" class="message-link"><span class="wa wa-e-mail"><i class="red-point"></i></span> 消息</a>
                            </li>
                            <li class="dropdown avatar-item" @mouseenter.prevent="menutoggle" @mouseleave.prevent="menutoggle">
                                <a target="_blank" href="/user/setting.html" id="userid" class="user-item">
                                    <img class="item" :src="$user.Avatar">
                                    <span class="item name" v-text="$user.Nickname"></span>
                                    <span class="item caret"></span>
                                </a>
                                <transition name="fade-in">
                                  <ul class="ww-dropdown-menu" role="menu" v-show="userToggle">
                                    <li>
                                      <a target="_blank" href="/user/work.html">个人中心</a>
                                    </li>
                                    <li>
                                      <a target="_blank" href="/user/coupon.html#/selfCoupon">专属优惠码</a>
                                    </li>
                                    <li>
                                      <a target="_blank" href="/order.html">订单管理</a>
                                    </li>
                                    <li class="sm-msg-btn">
                                      <a target="_blank" href="/user/message"> 消息</a>
                                    </li>
                                    <li class="bottom" @click="onLogout">
                                      <a>退出</a>
                                    </li>
                                  </ul>
                                </transition>
                            </li>
                        </template>
                        <template v-else>
                            <li>
                                <a href="/login" v-add-url>登录</a>
                            </li>
                            <li class="dropdown reg-item" v-on:mouseenter.prevent='regToggle' v-on:mouseleave.prevent='regToggle'>
                                <a href="/register" v-add-url>
                                    <i class="wa wa-discount nav-discount-icon"></i>
                                    <span>注册有礼</span>
                                </a>
                                <div class="ww-dropdown-menu" v-show='regItem'>
                                    体验优惠无需理由！<br>
                                    <span class="color-d1">7折</span>包邮 + <span class="color-d1">5元</span>体验券 <br>
                                    分享个人优惠码还可返现<span class="color-d1">10元</span>
                                </div>
                            </li>
                        </template>
                        <li class="cart-item">
                            <a target="_blank" href="/cart.html" class="cart-itema">
                                <span class="add-cart-count" v-text='$user.CartCount'></span>
                                <i class="wa wa-shopping-cart-fill cart-icon"></i>
                            </a>
                            <div class="cart-wrap">
                                <div class="load-wrap loading"><div class="ww-loading"></div></div>
                                <ul class="cart-wrap-ul clearfix">
                                </ul>
                                <ul class="cart-wrap-none clearfix disn">
                                    <li class="bdn">您的购物车中暂时没有商品<i class="wa wa-shopping-cart-fill"></i></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <input type="hidden" class="hide" id="login-status" :value="userId" :data-id="userId" />
    <input type="hidden" id="selfAvatar" :value="Avatar"/>
    <input type="hidden" id="selfNickname" :value="Nickname"/>
    <div class="search-zzc" v-show='!searchbtn' @click="searchbtn = !searchbtn"></div>
  </header>
</template>

<style lang='sass'>
@import '~styles/scss/top.scss'
</style>
<script>
/* eslint-disable */
import addUrl from 'scripts/directives/add-url.js'
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import { removeRepeat } from 'scripts/tools/removeRepeat.js'
export default {
  directives: {addUrl},
  data() {
    return {
        listmenu: false,
        regItem: false,
        smDrop: false,
        searchbtn: true,
        user: false,
        userId: undefined,
        Avatar: '',
        Nickname: '',
        userToggle: false,
        cartCount: 0,
        searchContent: '',
        baseUrl: Interf.baseUrl,
        queryArr:[
          {text:'动物',url:''},
          {text:'风景',url:''},
          {text:'花草',url:''},
          {text:'人物',url:''}
        ],
        activeIndex: -1,
        historyIndex: -1,
        searchHistory: [],
        url: ''
    }
  },
  computed: {
    filterArr() {
      return this.queryArr.filter((item) => {
        return item.text.indexOf(this.searchContent) != -1
      })
    }
  },
  created() {
    // this.personalUrl()
  },
  mounted() {
    let localSearch = window.localStorage.getItem('search_history')
    this.searchHistory = localSearch ? JSON.parse(localSearch) : []
  },
  watch: {
    activeIndex(newVal) {
      this.queryArr[newVal] ? this.searchContent = this.queryArr[newVal].text : ''
    },
    historyIndex(newVal) {
      this.searchHistory[newVal] ? this.searchContent = this.searchHistory[newVal].text : ''
    }
  },
  methods: {
    receiveCoupon() {
      this.$bus.$emit('showCoupon')
    },
    downFn() {
      if (this.filterArr.length>0) {
        if (this.activeIndex < this.queryArr.length - 1) {
          this.activeIndex++
        } else {
          this.activeIndex = 0
        }
      } else {
        if (this.historyIndex < this.searchHistory.length - 1) {
          this.historyIndex++
        } else {
          this.historyIndex = 0
        }
      }
    },
    upFn() {
      if (this.filterArr.length > 0) {
        if (this.activeIndex > 0) {
          this.activeIndex--
        } else {
          this.activeIndex = this.queryArr.length - 1
        }
      } else {
        if (this.historyIndex > 0) {
          this.historyIndex--
        } else {
          this.historyIndex = this.searchHistory.length - 1
        }
      }
    },
    toQuery(item) {
      this.setSearchHistoryStorage()
    },
    searchThings() {
      this.setSearchHistoryStorage()
//      if (this.searchContent !== '') {
//        this.setSearchHistoryStorage()
//        this.searchContent = ''
//      }
    },
    delHistory(index) {
      this.searchHistory.splice(index, 1)
      window.localStorage.setItem('search_history', JSON.stringify(this.searchHistory))
    },
    setSearchHistoryStorage() {
      let flag = true
      this.queryArr.forEach((item) => {
        if (item.text === this.searchContent) {
          flag = false
        }
      })
      if (flag) {
        this.searchHistory.unshift({
          text: this.searchContent,
          tampStamp: new Date().getTime()
        })
        this.searchHistory = removeRepeat(this.searchHistory).length > 4 ? removeRepeat(this.searchHistory).slice(0,4) : removeRepeat(this.searchHistory)
        window.localStorage.setItem('search_history', JSON.stringify(this.searchHistory))
      }
      window.location.href = `${Interf.baseUrl}/work?Query=${this.searchContent}`
    },
    listToggle() {
      this.listmenu = !this.listmenu
    },
    regToggle() {
      this.regItem = !this.regItem
    },
    smToggle() {
      this.smDrop = !this.smDrop
    },
    searchopen() {
      this.searchbtn = !this.searchbtn
      Vue.nextTick(() => {
        this.$refs['serch-input'].focus()
      })
    },
    menutoggle() {
      this.userToggle = !this.userToggle
    },
    btnclose() {
      this.searchbtn = !this.searchbtn
      this.searchContent = ''
      this.activeIndex = -1
      this.historyIndex =-1
    },
    tophover() {
      this.$bus.$emit('tophover')
    },
    onLogout() {
      window.sessionStorage.removeItem('userId')
      window.location.href = '/logout'
    },
    personalUrl() {
      // let timer = null
      // let self = this
      // let id
      // timer = setInterval(function() {
      //   if (self.$user.UserId) {
      //     clearInterval(timer)
      //     id = self.$user.UserId
      //     self.url = `/user/setting.html?ArtistId=${id}`
      //   }
      // },10)
    }
  }
}
</script>
<style>
  .list-complete-item {
    transition: all .3s;
  }
  .list-complete-enter, .list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  .list-complete-leave-active {
    position: absolute;
    width: 238px;
  }

  .flip-list-move {
    transition: transform .3s;
  }

  .folding-enter,.folding-leave-active {
    height: 0;
  }
  .folding-enter-active,.folding-leave {
    height: 120px;
  }
  .folding-leave-active {
    animation: folding-out .3s ease;
    animation-fill-mode: forwards;
  }
  .folding-enter-active {
    animation: folding-in .3s ease;
    animation-fill-mode: forwards;
  }


  @keyframes folding-in {
    0%{
      opacity: 0;
      height: 0;
    }
    100%{
      opacity: 1;
      height: 100%;
    }
  }
  @keyframes folding-out {
    0%{
      opacity: 1;
      height: 100%;
    }
    100%{
      opacity: 0;
      height: 0;
    }
  }
</style>
