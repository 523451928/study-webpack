<template>
  <div class="cart-box">
    <!----问题联系浮动微信二维码开始----->
    <div class="contact-wechat" v-show="seen">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)" v-on:click="contact">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <span class="close-btn" @click="seen=false"></span>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--问题联系及二维码浮动结束-->
    <!--购物车banner开始-->
    <div class="m-shop-hd-wrap">
      <ul class="step-wrap">
        <li class="step step-cart actived curr"><span>购物车</span></li>
        <li class="hr"></li>
        <li class="step step-order curr"><span>填写订单</span></li>
        <li class="hr"></li>
        <li class="step step-pay"><span>等待支付</span></li>
        <li class="hr"></li>
        <li class="step step-ok"><span>支付成功</span></li>
      </ul>
      <!--<loading v-show="showLoading"></loading>-->
    </div>
    <!--购物车banner结束-->
    <!--商品列表开始-->
    <div class="ww-wrap shop-wrap" >
      <div class="shop-cont-wrap cont-wrap">
        <ul class="u-crumbs">
          <li class="crumbs-item">
            <a href="/home.html" target="_blank">首页</a>
          </li>
          <li class="crumbs-item">
            <a href="/cart.html">购物车</a>
          </li>
          <li class="crumbs-item">填写订单</li>
        </ul>
        <!-- 填写订单商品 -->
        <add @getOrderAdressId="getAddId($event)" @currentAd="currentAd"></add>
        <!--填写并核对订单信息开始-->
        <!--填写并核对订单信息结束-->
        <div class="shop-cont cart-cont load-container">
          <div class="load-wrap">
            <div class="ww-loading"></div>
          </div>
          <div class="cart-list-wrap">
            <!-- 商品列表页 -->
            <produce :initCarts ="carts" v-if="carts.length>0" class="cart-table"></produce>
            <!--备注开始-->
            <div class="detail-item remark-item">
              <div class="rm mr10">
                <input type="text" class="form-control" id="remarks" name="remarks" v-model="orderTips" placeholder="选填，订单留言备注，限45个字"/>
              </div>
              <div class="rm">
                <a href="/cart.html" class="pull-right">返回购物车修改</a>
              </div>
            </div>
            <!--备注结束-->
            <!--发票开始-->
            <bill @updateInvoiceType="updateInvoiceType" @updateInvoiceId="updateInvoiceId"></bill>
            <!--//发票信息结束-->
            <!--信息综合开始-->
            <div class="order-summary">
              <!--优惠券开始-->
              <div class="order-coupon mb30">
                <div class="item-title" flex="dir:left cross:center main:justify">
                  <a href="javascript:void(0)" class="toggler" v-on:click="couponUse">
                    <b class="ww-icon pm-small plus-sm" :class="{minusSm:useCoupon}"></b>
                    使用优惠券
                  </a>
                  <a href="/faq.html#coupon-detail" target="_blank" class="brand-link coupon-faq">优惠券常见问题 FAQ</a>
                </div>
                <transition name="collapse" >
                  <div class="item-cont" v-show="useCoupon">
                    <div class="cbox mt15">
                      <!-- <ul class="list-unstyled coupon-tab-tit">
                        <li class="active">
                          <a href="javascript:void(0)">优惠码兑换</a>
                        </li>
                      </ul> -->
                      <div class="tab-content clear">
                        <div id="coupon-code" class="coupon-tab-con tab-pane fade in active ">
                          <div class="gift-form form-inline">
                            <label for="couponKey">请输入您手中的兑换码：</label>
                            <input type="text" id="couponKey" class="form-control" placeholder="请输入兑换码" @keyup.enter="sendCoupon" v-model="couponCode"/>
                            <button class="btn btn-default" id="submit-coupon" @click="sendCoupon">使用</button>
                            <!-- <a href="../faq.html" target="_blank" class="brand-link coupon-faq">常见问题 FAQ</a> -->
                          </div>
                          <div class="coupon-ticket-con" id="coupon-ticket">
                            <p class="no-tickets" v-show="notCoupon">暂无优惠券 (╥﹏╥)</p>
                            <ul class="list-unstyled ticket-list" v-show="!notCoupon">
                              <li v-for="(item,index) in couponObj.Data"  @click="couponLiCur(item,index)" :class="item['Id']===couponId?'active': ''">
                                <span class="item icon-item">
                                  <label class="ww-icon icheck ro"></label>
                                </span>
                                <span class="ticket-money item" v-text="amountText(item)"></span>
                                <span class="ticket-type item">{{item.Type==1?item.Detail.Name:
                                  item.Type==2?'注册优惠':
                                    item.Type==3?'个人优惠':item.Detail.Name}}</span>
                                <span class="ticket-type item" v-if="item.Type==1">{{item.Detail.LimitScope==0?'全站':
                                      item.Detail.LimitScope==1?'定制':item.Detail.LimitScope==2?'商店':''}}</span>
                                <span class="ticket-type item" v-if="item.Type!=1">全场通用</span>
                                <span class="item" v-text="dateText(item)"></span>
                              </li>
                            </ul>
                          </div>
                          <div class="total">
                            可以优惠
                            <strong id="coupon-price-small" class="color-d1">{{couponMoney / 100}}</strong>元
                          </div>
                          <pagination v-if="couponObj.Data" :nextDisable="nextDisable" @updatePage="getCouponList" class="pull-right" :pager="couponObj.Pager" ></pagination>
                          <!--<pagination @change="changePage" class="pull-right" :pageCount="couponObj.Pager.TotalPage" :currentPage="pageId"></pagination>-->
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <!--优惠券结束-->
              <!--使用蛙币开始-->
              <div class="user-balance">
                <div flex="dir:left cross:center main:justify">
                  <a href="javascript:void(0)" v-on:click="waCoin">
                    <b class="ww-icon pm-small plus-sm" :class="{minusSm:sendWa}"></b> 使用蛙币
                  </a>
                  <a href="../faq.html#wa-bin" class="pull-right" target="_blank">蛙币常见问题 FAQ</a>
                </div>
                <transition name="collapse">
                  <div class="balance-panel mt15" v-show="sendWa">
                    <div class="cont-wrap pre">
                      <div class="item pre-cont forbid">本次使用
                      <input  type="text"  class="wa-coin form-control" v-model.number="inputBalance" placeholder="请输入金额"/> 蛙币支付，可用蛙币
                      <span class="valid-money color-d1">{{totalBalance/100}}</span>元
                      <button class="btn mr10 ml10" @click="useBalance()" :class="[totalBalance > 0 ?  'btn-success' : 'btn-default']">使用</button>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <!--使用蛙币结束-->
              <div class="order-statistic">
                <div class="list">
                  <span class="tit">总商品金额:</span>
                  <span>￥{{totalMoney}} </span>
                </div>
                <div class="list">
                  <span class="tit">运费:</span>
                  <span class="freight-price">{{postage>0?'￥' + postage:'包邮'}}</span>
                </div>
                <div class="list">
                  <span class="tit">优惠:</span>
                  <span class="color-d1">￥{{(couponMoney + balanceMoney)/100}}</span>
                </div>
              </div>
            </div>
             <div class="buy-summary u-buttom-bar" ref="cartSummary" id="bottom_bar" :class="isFix?'fix':''">
              <div class="summary-cont">
                <p class="address">
                  寄送至:
                  <span>{{currentAdd}}</span>
                </p>
                <div class="check-num">
                  应付总额&nbsp;
                  <strong>{{payMoney}}</strong>
                  &nbsp;元
                </div>
              </div>
              <button id="submit-cart-btn" class="btn btn-success btn-lg" @click="submitOrder()">提交订单</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--商品列表结束-->
  </div>
</template>
<script>
/* eslint-disable */
import { mi as add, bill, list, produce } from './component'
import { mixin as displayComponents } from 'components/public/display/app/components'
import { mixin as contactMixin} from '../contactMixin'
import { InterfaceMap as interf } from 'scripts/interfaceConst.js'
import { isBottom } from 'components/gotop.js'
import { getEntries } from 'components/custom/display/entry'
import { padLeftZero } from 'scripts/tools/padLeftZero'
import { codeObj } from 'scripts/tools/couponCode'
import { orderFreshTotal } from 'components/cart/utils.js'
import pagination from 'components/public/Pager'
let mixinComponents = _.assign( add, bill, list, produce, displayComponents)
export default {
  mixins: [{components: mixinComponents}, contactMixin],
  components: {
    pagination
  },
  data() {
    return {
      showLoading: false,
      seen: true,
      useCoupon: true, // 优惠券展开
      notCoupon: false,
      couponActive: false,
      sendWa: true, // 蛙币展开
      couponCode: '',
      couponId: undefined,
      couponMoney: 0,
      flag: 1,
      couponWa: 1,
      totalBalance: 0,
      freightMoney: 0,
      balanceMoney: 0,
      inputBalance: 0,
      carts: [], // 购物车数据 addressId: 0,
      editStatus: false, // 是否在编辑状态
      noItem: false,
      couponObj: {},
      freshTotalObj: {},
      invoiceType: 0,
      invoiceId: 0,
      orderTips: '',
      isFix: false, // 底部bottombar是否悬浮
      currentAdrId: undefined, // 购物车地址id
      currentAdd: undefined, // 默认购物车地址
      postage: undefined, // 邮费
      InvoiceId: undefined, // 发票id
      InvoiceTitle: '', // 发票抬头
      windowH: document.body.scrollHeight,
      barH: undefined, // 默认高度
      pageId: 1
    }
  },
  mounted() {
    this.initCartsData().then(carts => {
      let _array = []
      carts[1].forEach((item, index) => {
        let o = {}
        o['Name'] = item.Name // 商品名称
        o['Properties'] = item.Properties // 商品的信息
        _array.push(Object.assign(o, carts[0][index]))
      })
      this.carts = _array
    })
    this.onScroll()
    this.getCouponList()
  },
  methods: {
    getCouponList(num) {
      if (num) {
        this.pageId = num
      }
      let params = {
        Status: 0,
        Page: this.pageId,
        Count: 10
      }
      this.$request({url: 'coupon/list', params}).then((res) => {
        this.couponObj = res.body
        if (!this.couponObj.Data) {
          this.notCoupon = true
        } else {
          this.notCoupon = false
        }
        console.log(this.couponObj.Data)
      })
    },
    dateText(item) {
      let date = new Date(item.Detail.End)
      let timeStr
      if (item.Detail.End === 0 || !item.Detail.End) {
        return '有效期至: 长期有效'
      } else {
        timeStr = date.getFullYear() + '-' +
          padLeftZero(date.getMonth() + 1) + '-' +
          padLeftZero(date.getDate())
        return '有效期至: ' + timeStr
      }
    },
    amountText(item) {
      let obj = item.Detail
      if (item.Type === 4 && this.$user.UserId === item.FromId) {
        if (obj.BehalfScale) {
          return obj.Behalf / 10 + '折'
        } else {
          return obj.Behalf / 100 + '元'
        }
      } else {
        if (obj.AmountScale) {
          return obj.Amount / 10 + '折'
        } else {
          return obj.Amount / 100 + '元'
        }
      }
    },
    // 初始化获得购物车数据
    initCartsData() {
      return new Promise(r => {
        let self = this
        self.$request.do('GET', 'cart/purchase').then(res => {
          let data = res.take('Data')
          self.postage = res.take('Postage')
          if (!data) {
            window.location.href = '/cart.html'
            return
          }
          let entries = []
          let _array = []
          data.forEach(item => {
            let o = {}
            o['Entries'] = item.Item.Entries // 单品渲染数据
            o['Pictures'] = item.Item.Pictures // 图片数据
            o['CategoryId'] = item.Item.CategoryId // 品类id
            o['Count'] = item.Count // 商品数量
            o['Discount'] = item.Item.Discount // 商品折扣
            o['Money'] = item.Item.Money / 100 // 商品价格
            o['Price'] = item.Item.Price / 100 // 原价
            o['Id'] = item.Id // 购物车Id
            o['IsCustom'] = item.Item.Work ? false : true //是否为定制产品
            o['IsShop'] = !o['IsCustom'] //是否为商店产品
            o['ProductId'] = item.Item.Packets //产品Id
            if (item.Item.Work) {
              o['WorkId'] = item.Item.Work.Id         //作品Id
              o['ArtistId'] = item.Item.Work.UserId   //艺术家Id
              o['WorkTitle'] = item.Item.Work.Title   //作品title
            }
            _array.push(o)
            entries = entries.concat(item.Item.Entries)
          })
          getEntries(entries).then(res => {
            r([_array, res])
          })
        })
      })
    },
    // 提交订单时 地址这一块要传递的参数
    getAddId(id) {
      this.currentAdrId = id
    },
    // 删除商品
    dele(item, index) {
      request.remove('cart', [item['Id']]).then(res => {
        this.carts.splice(index, 1)
        layer.toast('删除成功')
      }, res => {
        res.hide()
        layer.toast('删除失败')
      })
    },
    addressList() {
      this.adList = true
    },
    onScroll() {
      let bar = document.getElementById("bottom_bar")
      let self = this
      let didScroll = false
      self.barH = $('#bottom_bar').offset().top // 距离顶部的距离
      if (self.barH >= self.windowH) { // 初始化判断是否需要悬浮
        this.isFix = true
      }
      // 监听浏览器滚动事件
      window.addEventListener('scroll', function(){
        let _h = $(window).scrollTop()
        // 节流
        setTimeout(function() {
          didScroll = true
        },250)
        if (didScroll) {
          if (_h >= self.barH - (self.windowH/2) && $(bar).hasClass('fix')) {
            self.isFix = false
          } else if (_h < self.barH - (self.windowH/2) && !$(bar).hasClass('fix')) {
            self.isFix = true
          }
        }
      }, false)
    },
    waCoin() {
      this.sendWa = !this.sendWa
      this.windowH = document.body.scrollHeight
    },
    couponUse() {
      this.useCoupon = !this.useCoupon
      this.windowH = document.body.scrollHeight
    },
    sendCoupon() {
      let Code = [this.couponCode]
      let body = {Code: Code}
      let emulateObj = {'emulateJSON': true}
      if (this.couponCode.length === 0) {
        this.$notify({
          text: '请输入兑换码'
        })
        return
      }
      request.do('POST', 'http://192.168.1.6/coupon/take', body, emulateObj).then((res) => {
        let data = res.body.Data
        for (let key in data) {
          this.$notify(codeObj[data[key]])
          if (data[key] === 'Success') {
            this.getCouponList()
          }
        }
      })
    },
    useConpon(item, scope) {
      let scopeStr = ''
      switch (scope) {
        case 0 :
          scopeStr = 'Price'
          break
        case 1 :
          scopeStr = 'IsCustom'
          break
        case 2 :
          scopeStr = 'IsShop'
          break
      }
      let filterArrOne = this.carts
      if (item.Detail.LimitIds && item.Detail.LimitIds.Category && item.Detail.LimitIds.Category.lenght > 0) {
        item.Detail.LimitIds.Category.forEach((item) => {
          filterArrOne = this.carts.filter((cart) => {
            return cart.CategoryId === item
          })
        })
      }
      let filterArrTwo = this.carts
      if (item.Detail.LimitIds && item.Detail.LimitIds.Product && item.Detail.LimitIds.Product.lenght > 0) {
        item.Detail.LimitIds.Product.forEach((item) => {
          filterArrTwo = this.carts.filter((cart) => {
            return cart.ProductId === item
          })
        })
      }
      let filterArrThree = this.carts
      if (item.Detail.LimitIds && item.Detail.LimitIds.Work && item.Detail.LimitIds.Work.lenght > 0) {
        item.Detail.LimitIds.Work.forEach((item) => {
          filterArrThree = this.carts.filter((cart) => {
            return cart.WorkId === item
          })
        })
      }
      let filterArrFour = this.carts
      if (item.Detail.LimitIds && item.Detail.LimitIds.Artist && item.Detail.LimitIds.Artist.lenght > 0) {
        item.Detail.LimitIds.Artist.forEach((item) => {
          filterArrFour = this.carts.filter((cart) => {
            return cart.WorkId === item
          })
        })
      }
      let filterArrFive = []
      filterArrOne.forEach((item) => {
        filterArrTow.forEach((itm) => {
          if (item.Id === itm.Id && item[scopeStr]) {
            filterArrFive.push(item)
          }
        })
      })
      let filterArrSix = []
      filterArrFive.forEach((item) => {
        filterArrThree.forEach((itm) => {
          if (item.Id === itm.Id && item[scopeStr]) {
            filterArrSix.push(item)
          }
        })
      })
      let filterArrEnd = []
      filterArrSix.forEach((item) => {
        filterArrFour.forEach((itm) => {
          if (item.Id === itm.Id && item[scopeStr]) {
            filterArrEnd.push(item)
          }
        })
      })
      let money = 0
      filterArrEnd.forEach(item => {
        money += (item.Count * item.Money)
      })
      this.couponMoney = Math.ceil(money * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)) * 100)
    },
    couponLiCur(item, index) {
      if (!item.Detail.LowMoney || item.Detail.LowMoney / 100 < this.totalMoney) {
        if (item.Type === 4 && this.$user.UserId === item.FromId) {
          if (item.Detail.BehalfScale) {
            this.couponMoney = Math.ceil(this.totalMoney * parseFloat((1 - (item.Detail.Behalf / 100)).toFixed(2)) * 100)
          } else {
            this.couponMoney = item.Detail.Amount
          }
        } else if (!item.Detail.AmountScale) {
          this.couponMoney = item.Detail.Amount
        } else {
          if (item.Type === 1) {
            if (!item.Detail.LimitIds) {
              if (item.Detail.LimitScope === 1) {
                this.couponMoney = Math.ceil(this.customTotalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)) * 100)
              } else if (item.Detail.LimitScope === 2 ) {
                this.couponMoney = Math.ceil(this.shopTotalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)) * 100)
              } else {
                this.couponMoney = Math.ceil(this.totalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)) * 100)
              }
            } else {
              if (item.Detail.LimitScope === 1) {
                this.useConpon(item, 1)
              } else if(item.Detail.LimitScope === 2) {
                this.useConpon(item, 2)
              } else if(item.Detail.LimitScope === 0) {
                this.useConpon(item, 0)
              }
            }
          } else {
              this.couponMoney = Math.ceil(this.totalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)) * 100)
          }
        }
        if (this.couponId !== item['Id']) {
          this.couponId = item['Id']
        } else {
          this.couponId = ''
          this.couponMoney = 0
        }
      } else {
        layer.toast('该优惠券最低消费为￥' + (item.Detail.LowMoney) / 100)
      }
    },
    useBalance() {
      let inputBalance = this.inputBalance
      let totalBalance = this.totalBalance
      if (!totalBalance) return
      if (inputBalance > totalBalance) {
        inputBalance = totalBalance
      }
      this.balanceMoney = inputBalance
    },
    updateInvoiceType(type) {
      this.invoiceType = type
      if (type === 0) {
        this.invoiceId = 0
      }
    },
    currentAd(v) {
      this.currentAdd = v
    },
    updateInvoiceId(id) {
      this.invoiceId = id
    },
    // 提交订单
    submitOrder() {
      let o = {
        CartIds: []
      }
      if (!this.currentAdrId) {
        layer.toast('请选择默认地址')
        return
      } else {
        o['AddressId'] = this.currentAdrId
      }
      if (this.InvoiceId) {
        o['InvoiceId'] = this.InvoiceId
      }
      if (this.InvoiceTitle) {
        o['InvoiceTitle'] = this.InvoiceTitle
      }
      if (this.orderTips!=='') {
        o['BuyerRemark'] = this.orderTips
      }
      if (this.couponId) {
        o['CouponId'] = this.couponId
      }
      this.carts.forEach(item => {
        o.CartIds.push(parseInt(item.Id))
      })
      console.log(JSON.stringify(Object.assign({
        PayType: 1,
        PayMoney: this.payMoney * 100
      }, o)))
      this.$request.do('POST', 'trade/add', Object.assign({
        PayType: 1,
        PayMoney: this.payMoney * 100
      }, o)).then(res => {
        window.location.href = `pay.html?TradeId=${res.take('Data')}`
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  computed: {
    nextDisable() {
      if (this.couponObj.Data) {
        return this.couponObj.Data.length < 10
      }
      return true
    },
    customTotalMoney() {
      let money = 0
      this.carts.forEach(item => {
        if (item.IsCustom) {
          money += (item.Count * item.Money)
        }
      })
      return money
    },
    shopTotalMoney() {
      let money = 0
      this.carts.forEach(item => {
        if (!item.IsCustom) {
          money += (item.Count * item.Money)
        }
      })
      return money
    },
    totalMoney() {
      let money = 0
      this.carts.forEach(item => {
        money += (item.Count * item.Money)
      })
      return money + this.postage
    },
    payMoney() {
      let payMoney = this.totalMoney - this.balanceMoney / 100 - this.couponMoney / 100
      payMoney = payMoney < 0 ? 0 : payMoney
      return payMoney
    }
  }
}
</script>
