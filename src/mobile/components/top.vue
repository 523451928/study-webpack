<template>
  <header id="header" class="fixed-hd home-header top-navbar navbar-fixed-top h64">
    <div class="container-fluid">
        <div class="row">
            <div class="col-xs-12 h64">
                <div class="wm-nav-big clearfix h64">
                <div class="wm-nav-big clearfix h64">
                    <a class="navbar-brand paddrn" href="/">
                        <img src="~images/logo/logo-wallwa-normal.png" alt="墙蛙 - 唤醒你的墙" class="home-log-img">
                    </a>
                    <div class="list-menu" v-on:mouseenter.prevent='listToggle' v-on:mouseleave.prevent='listToggle'>
                        <span class="ww-icon pack-menu"></span>
                        <ul class="wm-dropdown-menu wp-dropdown" v-show='listmenu'>
                            <li>
                                <a target="_blank" href="/shopGuide">开店引导</a>
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
                                <a target="_blank" href="https://wallwa.tmall.com/?spm=a220o.1000855.w9378884-9436674517.14.HUmbeG">墙蛙旗舰店</a>
                            </li>
                            <li>
                                <a target="_blank" href="https://wallwa.jiyoujia.com/shop/view_shop.htm?spm=a1z10.1-c.w9263053-9619899774.11.rtTpKG">墙蛙淘宝店</a>
                            </li>
                        </ul>
                    </div>
                    <ul class="md-menu nav navbar-nav h64">
                        <li class="menu">
                            <a class="def-menu" href="/custom.html#/category/8" target="_blank">
                                定制
                            </a>
                        </li>
                        <li @mouseenter.prevent="tophover" class="toplist dropdown menu h75">
                            <a target="_blank" class="def-menu discovery" href="/work?CategoryId=1">
                                <i class="red-point"></i>
                                发现
                            </a>
                        </li>
                        <template v-if="user">
                            <li class="menu last" id="new-pro" v-if="false" data-indentify="">
                                <a target="_blank" href="/product.html" class="btn btn-ghost btn-xs">创建新产品</a>
                            </li>
                            <li class="menu last" id="new-pro" v-else data-indentify="">
                                <a target="_blank" href="/product.html" class="btn btn-ghost btn-xs">创建新产品</a>
                            </li>
                        </template>
                        <template v-else>
                            <li class="menu last" id="new-pro" data-indentify="">
                                <a class="btn btn-ghost btn-xs link" href="/login.html">创建新产品</a>
                            </li>
                        </template>
                    </ul>
                    <div class="sm-menu" v-on:mouseenter.prevent='smToggle' v-on:mouseleave.prevent='smToggle'>
                        <span class="ww-icon pack-menu"></span>
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
                    </div>
                    <ul class="nav navbar-nav navbar-right h64">
                        <div class="nav-search-open-btn" @click='searchopen' v-show='searchbtn'>
                            <i class="wa wa-search mr4"></i>搜索
                        </div>
                        <div class="nav-search" v-show='!searchbtn'>
                            <i class="wa wa-search"></i>
                            <div class="search-hidden">
                                <input class="nav-search-content" type="text" placeholder="搜索wallwa网"/>
                                <i class="wa wa-close" @click='btnclose'></i>
                                <div class="search-tips">
                                    点击回车键进行搜索
                                </div>
                                <div class="nav-search-result">
                                    <ul>
                                        <li>动物</li>
                                        <li>风景</li>
                                        <li>花草</li>
                                        <li>人物</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <template v-if="user">
                            <li class="md-msg-btn">
                                <a target="_blank" href="/user/message" class="message-link"><span class="wa wa-e-mail"><i class="red-point"></i></span> 消息</a>
                            </li>
                            <li class="dropdown avatar-item" @mouseenter.prevent="menutoggle" @mouseleave.prevent="menutoggle">
                                <a target="_blank" href="/setting.html" id="userid" class="user-item">
                                    <img class="item" :src="Avatar">
                                    <span class="item name" v-text="Nickname"></span>
                                    <span class="item caret"></span>
                                </a>
                                <ul class="ww-dropdown-menu" role="menu" v-show="userToggle">
                                    <li>
                                        <a target="_blank" href="/setting.html">个人中心</a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="/preferential.html#/selfCoupon">专属优惠码</a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="/order.html">订单管理</a>
                                    </li>
                                    <li>
                                        <a target="_blank" href="/setting.html">账号管理</a>
                                    </li>
                                    <li class="sm-msg-btn">
                                        <a target="_blank" href="/user/message"> 消息</a>
                                    </li>
                                    <li class="bottom">
                                        <a href="/logout.html">退出</a>
                                    </li>
                                </ul>
                            </li>
                        </template>
                        <template v-else>
                            <li>
                                <a href="/login.html" class="link">登录</a>
                            </li>
                            <li class="dropdown reg-item" v-on:mouseenter.prevent='regToggle' v-on:mouseleave.prevent='regToggle'>
                                <a href="/register.html">
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
                                <span class="add-cart-count" v-text='9'></span>
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
    <div class="search-zzc" @click='searchopen' v-show='!searchbtn'></div>
  </header>
</template>

<style lang='sass'>
@import '~styles/scss/top.scss'
</style>

<script>
export default {
  data() {
    return {
      listmenu: false,
      regItem: false,
      smDrop: false,
      searchbtn: true,
      user: false,
      userId: '',
      Avatar: '',
      Nickname: '',
      userToggle: false
    }
  },
  mounted() {
    let self = this
    const url = 'header'
    request({url}).then(res => {
      let data = res.data
      if (data['UserId']) {
        self.userId = data['UserId']
        self.user = true
      }
      if (data['Avatar'] !== '') {
        self.Avatar = 'http://192.168.1.6:8000/thumbnail/avatar/' + data['UserId'] + '/100/' + data['Avatar']
      } else {
        self.Avatar = '/static/images/user/default-profile.jpg'
      }
      if (data['Nickname']) {
        self.Nickname = data['Nickname']
      } else {
        self.Nickname = 'U' + data['UserId']
      }
    })
  },
  methods: {
    listToggle: function() {
      this.listmenu = !this.listmenu
    },
    regToggle: function() {
      this.regItem = !this.regItem
    },
    smToggle: function() {
      this.smDrop = !this.smDrop
    },
    searchopen: function() {
      this.searchbtn = !this.searchbtn
    },
    menutoggle: function() {
      this.userToggle = !this.userToggle
    },
    btnclose: function() {
      this.searchbtn = !this.searchbtn
      $('.nav-search-content').val('')
    },
    tophover() {
      this.$bus.$emit('tophover')
    }
  }
}

</script>
