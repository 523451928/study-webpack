<template>
  <div class="cart-box">
    <!--商品列表开始-->
    <div class="ww-wrap shop-wrap order-detail" >
      <!--收货地址模块begin-->
      <!--<transition name="slide">-->
        <div class="warp" v-show="seeAddess">
        <!--收货地址列表-->
        <div class="addList" v-show="newAddress">
          <div class="profile-head">
            <a class="back profile-back" @click="seeAddess = false">
              <i class="wa wa-left"></i>
            </a>选择收货地址
          </div>
          <div class="user-fixed-head-wrap addr-list-area container">
            <div class="row ">
              <div class="col-xs-12">
                <div class="detail-item address-item" id="address-item">
                  <transition-group name="flip-list" tag="ul" class="list-unstyled addr-list-wrap mr15">
                    <li v-drag drag-distance="80" :key="item.Detail" drag-trigger-distance="120" class="addr" v-for="(item, index) in addListObj" :class="{default: item.Default}" >
                      <div class="detail">
                        <label class="ww-icon icheck cb " :class="{checked:item.checked}" @click.stop="choseAddress(item)">
                        </label>
                        <p class="clearfix mb0">
                          <span class="pull-left">
                            <span :class="{'default-receive': item.Default}">{{item.Default ? '默认':'收货人:'}}</span>{{item.Receiver}}</span>
                          <span class="pull-right">{{item.Cellphone}}</span>
                        </p>
                        <p class="mb0 detail-addr">
                          <span>收货地址:</span>
                          <span v-for="(ads,index) in getAddress(item.PlaceId)">
                            {{ads[0]}}
                          </span>
                          <span>{{item.Detail}}</span>
                        </p>
                        <span @click.stop="editerAddress(item, index)" class="wa wa-pencil addr-right"></span>
                      </div>
                      <div @click.stop="delAddrItem($event, item, index)" class="del-item">删除</div>
                    </li>
                  </transition-group>
                </div>
                <div class="save-addr">
                  <a href="javascript:void(0)" class="btn-success fixed-bottom-btn" @click="newAdd()">
                    新增收货地址
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--新增收货地址-->
        <div class="editor-warp" v-show="!newAddress">
          <div class="profile-head">
            <a class="back address-back" @click="newAddress=true">
              <i class="wa wa-left"></i>
            </a>
            <span class="new-dom">{{editorModel ? '编辑收货地址' : '新增收货地址'}}</span>
            <span class="del-addr" v-if="editorModel" @click="delAddr">删除</span>
          </div>
            <div class="user-fixed-head-wrap">
              <div class="row user-profile-form">
                <div class="col-xs-12">
                  <form class="form form-horizontal form-base" id="address-form">
                    <div class="panel panel-default">
                      <div class="panel-body profile-panel-body">
                        <div class="form-group">
                          <div class="form-cont">
                            <input type="text" readonly="readonly" class="form-control validate[required]" v-model="addEnd" id="new-address" placeholder="请选择收货地区" @click="selectArea">
                           <!-- <input type="text" readonly="readonly" class="form-control validate[required]" v-model="addEnd" id="new-address" placeholder="收货地区" @click="addListShow()"> -->
                            <span class="wa wa-angle-down"></span>
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="form-cont">
                            <input type="text" class="form-control validate[required]" maxlength="120" v-model="detailAddress" id="ship-address" placeholder="详细收货地址">
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="form-cont">
                            <input type="text" class="form-control validate[required]" maxlength="40" v-model="addressName" id="ship-name" placeholder="收货人姓名">
                          </div>
                        </div>
                        <div class="form-group">
                          <div class="form-cont">
                            <input type="text" class="form-control validate[groupRequired[phone],custom[mobile]]" maxlength="20" v-model="addressTel" id="ship-mb" placeholder="联系电话">
                          </div>
                        </div>
                        <div class="form-group ">
                          <div class="form-cont last">
                            <input type="text" class="form-control " maxlength="20" id="ship-zip" v-model="postCode" placeholder="邮编(可不填)">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="btn-success fixed-bottom-btn" @click="saveNewAdd">保存</div>
                  </form>
                </div>
              </div>
              <div class="default-wrapper">
                <wa-checkbox v-model="isDefault">设为默认地址</wa-checkbox>
              </div>
            </div>
          </div>
      </div>
      <!--</transition>-->
        <!--地区列表-->
        <div class="addr-mask" v-show="addressList">
          <ul class="form-control">
            <li v-for="item in address" @click="province(item['Id'], item['Name'])">{{ item['Name'] }}</li>
          </ul>
        </div>
      </div>
      <!--收货地址模块end-->
      <div class="shop-cont-wrap cont-wrap" v-show="!seeAddess">
        <div class="profile-head">
          <a class="back profile-back" @click="back" href="javascript: void (0);">
            <i class="wa wa-left"></i>
          </a>填写订单
        </div>
        <!--订单地址开始-->
        <a href="javascript:void(0)" class="no-addr" v-show="addAddress" @click="changeAddr(true)">
          + 点击添加收货地址
          <span class="wa-right fr"></span>
        </a>
        <div class="detail-item address-item container" v-show="!addAddress">
          <div class="addr-cont">
            <ul class="list-unstyled addr-list-wrap">
              <li class="addr" @click="changeAddr" v-if="defaultAddress">
                <div class="detail single-detail">
                  <p class="clearfix mb0">
                    <span class="pull-left">收货人: {{defaultAddress.Receiver}}</span>
                    <span class="pull-right">{{defaultAddress.Cellphone}}</span>
                  </p>
                  <p class="mb0 detail-addr">
                    <span>收货地址: </span>
                    <span v-for="(ads,index) in getAddress(addressId)">
                      {{ads[0]}}
                        </span>
                    <span>{{defaultAddress.Detail}}</span>
                  </p>
                  <span class="wa wa-right addr-right"></span>
                  <!--<span class="wa wa-check-circle-o addr-select"></span>-->
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--订单地址结束-->
        <div class="shop-cont cart-cont load-container">
          <div class="load-wrap">
            <div class="ww-loading"></div>
          </div>
          <div class="cart-list-wrap">
            <produce ref="produce" :initCarts ="carts" @cartData="cartData"></produce>
            <!--备注开始-->
            <div class="detail-item remark-item">
              <div class="plr15">
                <input type="text" class="form-control mb10" name="remarks" v-model="orderTips" placeholder="选填，订单留言备注，限45个字"/>
              </div>
            </div>
            <!--备注结束-->
            <!--信息综合开始-->
            <div class="order-summary">
              <!--优惠券开始-->
              <div class="order-coupon mb10">
                <div class="item-cont coupon-tab-con-box">
                  <div class="cbox mt15">
                    <div class="clear">
                      <div id="coupon-code" class="coupon-tab-con tab-pane fade in ">
                        <div class="gift-form form-inline">
                          <span class="clearfix">
                            <input type="text" id="couponKey" class="form-control fl" placeholder="请输入优惠码" v-model="couponCode"/>
                            <a class="btn-success fr " id="submit-coupon" @click="sendCoupon">使用</a>
                          </span>
                        </div>
                        <div class="coupon-ticket-con" id="coupon-ticket">
                          <p class="no-tickets" v-show="notCoupon">暂无优惠券 (╥﹏╥)</p>
                          <ul class="list-unstyled ticket-list" v-show="!notCoupon">
                            <li v-for="(item,index) in couponObj.Data"  @click="couponLiCur(item,index)" :class="item['Id']===couponId?'active': ''">
                                <span class="item icon-item">
                                  <label class="check"></label>
                                </span>
                              <span class="ticket-money item" v-text="amountText(item)"></span>
                              <span class="ticket-type item">{{item.Type==1?item.Detail.Name:
                                item.Type==2?'注册优惠':
                                  item.Type==3?'个人优惠':item.Detail.Name}}</span>
                              <p>
                                使用范围：
                                <span class="ticket-type item" v-if="item.Type==1">{{item.Detail.LimitScope==0?'全站':
                                  item.Detail.LimitScope==1?'定制':item.Detail.LimitScope==2?'商店':''}}</span>
                                <span class="ticket-type item" v-if="item.Type!=1">全场通用</span>
                                <span class="item" v-text="dateText(item)"></span>
                              </p>
                            </li>
                          </ul>
                        </div>
                        <!--<div class="total">-->
                          <!--可用优惠-->
                          <!--<strong id="coupon-price-small" class="color-d1">{{couponMoney / 100}}</strong>元-->
                        <!--</div>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--优惠券结束-->
              <!--使用蛙币开始-->
              <div class="user-balance">
                <div class="balance-panel">
                  可用蛙币<span class="valid-money color-d1">{{balanceMoney/100}}</span>元
                  <wa-switch class="pull-right" @input="changeWabin" v-model="waActive"></wa-switch>
                </div>
              </div>
              <!--使用蛙币结束-->
              <div class="money-info">
                <p>总商品金额：￥{{totalMoney / 100}}</p>
                <p>运费：￥0</p>
                <p>优惠：￥{{waActive ? couponMoney + balanceMoney / 100 : couponMoney / 100}}</p>
                <p>应付总额：￥{{payMoney / 100}}</p>
              </div>
            </div>
            <!--信息综合结束-->
            <div class="cart-summary clearfix fix">
              <span class="summary-money mr10">
                <span class="summary-num">应付:</span>
                <strong class="fix-strong">￥{{payMoney / 100}}</strong>
              </span>
              <a target="_blank" @click="submitOrder()" class="submit-order btn-success btn-fix-order pull-right">去付款</a>
            </div>
          </div>
        </div>
      </div>
      <pay ref="pay" :tradeId="tradeId"></pay>
    </div>
    <!--商品列表结束-->
</template>
<script>
/* eslint-disable */
import { mi as list, produce } from './component'
import { mixin as displayComponents } from 'components/public/display/app/components'
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import { orderFreshTotal } from 'components/cart/utils.js'
import { provinces, findPlaceById, Admap } from 'json/districts.js'
import { isWxPlatform } from 'scripts/tools/isWxPlatform'
import weui from 'scripts/tools/weui.js'
import {area} from 'json/area'
let admap = new Admap(provinces)
import waSwitch from '../public/WaSwitch.vue'
import WaCheckbox from "../public/WaCheckbox"
import pay from '../public/pay.vue'
let mixinComponents = _.assign(list, produce, displayComponents, {waSwitch})
export default {
  components: {WaCheckbox, pay},
  mixins: [{components: mixinComponents}],
  data() {
    return {
      isDefault: false,
      editIndex: 0,
      showLoading: true,
      seen: true,
      notCoupon: false,
      couponActive: false,
      couponCode: '',
      couponMoney: 0,
      totalBalance: 0,
      freightMoney: 0,
      balanceMoney: 0,
      inputBalance: 0,
      carts: [],
      addressId: 0,
      AddressId: 0,
      editStatus: false,
      noItem: false,
      couponObj: {},
      freshTotalObj: {},
      invoiceType: 0,
      invoiceId: 0,
      orderTips: '',
      waActive: false,
      seeAddess: false,
      addListObj: [1],
      address: provinces,
      newAddress: true,
      addressList: false,
      addressArr: [],
      placeId: '',
      editorAddNum: [],
      addEnd: '',
      detailAddress: '',
      addressName: '',
      addressTel: '',
      postCode: '',
      editorModel: false,
      addAddress: false,
      couponId: undefined,
      pageId: 1,
      postage: 0,
      cartArr: [],
      Id: 0,
      tradeId: undefined
    }
  },
  created() {
    this.showLoading = false
    this.getAddressList(true)
    this.getCartList()
    this.getCouponList()
  },
  methods: {
    selectArea() {
        let self = this
        weui.picker(area, {
            depth: 3,
            defaultValue: this.defaultValue,
            onChange: function onChange(result) {
                // console.log(result);
            },
            onConfirm: (result) => {
                self.placeId = result[2].value
                let endArr = []
                result.forEach((item) => {
                  endArr.push(item.label)
                })
                self.addEnd = endArr.join(' ')
            },
            id: this.addEnd
        })
    },
    changeWabin(val) {
      console.log(val)
    },
    back() {
      window.history.go(-1)
    },
    dateText(item) {
      let date = new Date(item.Detail.End)
      let timeStr
      if (item.Detail.End === 0 || !item.Detail.End) {
        return '有效期: 长期有效'
      } else {
        timeStr = date.getFullYear() + '-' +
          padLeftZero(date.getMonth() + 1) + '-' +
          padLeftZero(date.getDate())
        return '有效期: ' + timeStr
      }
    },
    delAddrItem(e, item, index) {
      if (item.Id === this.AddressId) {
        this.addressId = 0
      }
      request.remove('address', item.Id, {}).then((res) => {
        this.$toast.center('删除成功')
        e.target.parentNode.style['transform'] = 'translate(0px, 0px)'
        this.addListObj.splice(index, 1)
      })
    },
    delAddr() {
      let self = this
      this.$dialog({
        title: '删除地址',
        content: '确定要删除该地址吗?',
        btnArr: [
          {
            text: '取消',
            className: 'view-btn',
            callback: function() {
              this.close()
            }
          },
          {
            text: '确定',
            className: 'use-btn',
            callback: function() {
              this.close()
              request.remove('address', self.Id, {}).then((res) => {
                self.$toast.center('删除成功')
                self.newAddress = true
                self.addListObj.splice(self.editIndex, 1)
              })
            }
          }
        ]
      })
    },
    editerAddress(item, index) {
      let addArr = []
      this.getAddress(item.PlaceId).forEach((arr) => {
        addArr.push(arr[0])
      })
      this.editIndex = index
      this.isDefault = item.Default
      this.addressArr = []
      this.Id = item.Id
      this.newAddress = false
      this.editorModel = true
      this.address = provinces
      this.placeId = item.PlaceId
      this.addressName = item.Receiver
      this.addressTel = item.Cellphone
      this.addEnd = addArr.join(' ')
      this.detailAddress = item.Detail
      this.postCode = item.Postcode
    },
    getCouponList() {
      let params = {
        Status: 0,
        Page: this.pageId,
        Count: 10
      }
      request({url: 'coupon/list', params}).then((res) => {
        this.couponObj = res.body
      })
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
    getAddress(i) {
      return admap.getAddress(i)
    },
    getCartList() {
      request.do('GET', 'cart/purchase').then(res => {
        this.carts  = res.take('Data')
        this.postage = res.take('Postage')
        if (!this.carts) {
          window.location.href = '/cart.html'
        }
      })
    },
    cartData(data) {
      this.cartArr = data
    },
    getAddressList(isFirst) {
      request.list('address').then(res => {
        this.addListObj = res.take('Data')
        if (this.addListObj.length === 0) {
          this.addAddress = true
        } else {
          if (isFirst) {
            let hasSetDefault = false
            this.addListObj.forEach((item, index) => {
              this.$set(item, 'checked', false)
              if (item.Default) {
                this.addressId = item['PlaceId']
                this.AddressId = item['Id']
                this.addListObj.splice(index, 1)
                this.addListObj.unshift(item)
                this.$set(item, 'checked', true)
                hasSetDefault = true
              }
            })
            if (!hasSetDefault) {
              this.addressId = this.addListObj[0]['PlaceId']
              this.AddressId = this.addListObj[0]['Id']
              this.$set(this.addListObj[0], 'checked', true)
            }
          } else {
            // this.seeAddess = false
            let hasSetDefault = false
            this.addListObj.forEach((item, index) => {
              this.$set(item, 'checked', false)
              if (item.Default) {
                this.addListObj.splice(index, 1)
                this.addListObj.unshift(item)
              }
              if (this.Id && item.Id === this.Id) {
                this.addressId = item['PlaceId']
                this.AddressId = item['Id']
                this.$set(item, 'checked', true)
                hasSetDefault = true
              }
            })
            if (!hasSetDefault) {
              if (!this.isDefault && this.addListObj.length > 1) {
                this.addressId = this.addListObj[1]['PlaceId']
                this.AddressId = this.addListObj[1]['Id']
                this.$set(this.addListObj[1], 'checked', true)
              } else {
                this.addressId = this.addListObj[0]['PlaceId']
                this.AddressId = this.addListObj[0]['Id']
                this.$set(this.addListObj[0], 'checked', true)
              }
            }
          }
        }
      })
    },
    show() {
      if (this.seen === true) {
        this.seen = false
      }
    },
    sendCoupon() {
      let Code = [this.couponCode]
      let body = {Code: Code}
      let emulateObj = {'emulateJSON': true}
      request.do('POST', 'coupon/take', body, emulateObj).then((res) => {
        let data = res.body.Data
        for (let key in data) {
          this.$toast.center(data[key])
          if (data[key] === 'Success') {
            this.getCouponList()
          }
        }
      })
    },
    newAdd() {
      this.addressArr = []
      this.newAddress = false
      this.editorModel = false
      this.isDefault = false
      this.Id = 0
      this.address = provinces
      this.placeId = ''
      this.addressName = ''
      this.addressTel = ''
      this.addEnd = ''
      this.detailAddress = ''
      this.postCode = ''
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    saveNewAdd() {
      this.detailAddress = this.trim(this.detailAddress)
      this.addressName = this.trim(this.addressName)
      if (!this.placeId) {
        this.$toast.center('请选择收货地区')
        return
      }
      if (this.detailAddress.length === 0) {
        this.$toast.center('请填写详细地址')
        return
      }
      if (this.addressName.length === 0) {
        this.$toast.center('请填写收货人')
        return
      }
      if (!this.isMobile) {
        this.$toast.center('请填写正确的手机号')
        return
      }
      if (this.isDefault && this.Id) {
        request.set('address', this.Id, {Default: true}).then((res) => {
        })
      }
      let params = {Default: this.isDefault, Receiver: this.addressName, PlaceId: this.placeId, Cellphone: this.addressTel, Detail: this.detailAddress, Postcode: this.postCode, Id: this.Id}
      request.save('address', params).then(res => {
        this.getAddressList(false)
        if (this.Id) {
          this.$toast.center('修改地址成功')
        } else {
          this.$toast.center('添加地址成功')
        }
        this.newAddress = true
      }, res => {
        res.hide()
        this.$toast.center('添加失败')
      })
    },
    addListShow() {
      this.address = provinces
      this.addressArr = []
      this.addressList = true
    },
    province(id, name) {
      this.address = findPlaceById(id)['Children']
      this.addressArr.push(name)
      this.placeId = id
      if (!this.address || this.address.length === 0) {
        this.addressList = false
        this.addEnd = this.addressArr.join(' ')
      }
    },
    changeAddr(flag) {
      if (flag ===true && this.addListObj.length === 0) {
        this.newAddress = false
        this.newAdd()
      }
      this.seeAddess = true
    },
    choseAddress(item) {
      document.querySelector('.bd').scrollTop = 0
      this.addAddress = false
      this.addressId = item['PlaceId']
      this.AddressId = item['Id']
      this.addListObj.forEach((itm) => {
        itm.checked = false
      })
      item.checked = true
      this.seeAddess = false
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
      let filterArr = []
      if (item.Detail.LimitIds && item.Detail.LimitIds.Category) {
        item.Detail.LimitIds.Category.forEach((item) => {
          filterArr = this.cartArr.filter((cart) => {
            return cart.CategoryId === item && cart[scopeStr]
          })
        })
      }
      if (filterArr.length > 0 && item.Detail.LimitIds && item.Detail.LimitIds.Product) {
        item.Detail.LimitIds.Product.forEach((item) => {
          filterArr = filterArr.filter((cart) => {
            return cart.ProductId === item && cart[scopeStr]
          })
        })
      }
      if (filterArr.length > 0 && item.Detail.LimitIds && item.Detail.LimitIds.Work) {
        item.Detail.LimitIds.Work.forEach((item) => {
          filterArr = filterArr.filter((cart) => {
            return cart.WorkId === item && cart[scopeStr]
          })
        })
      }
      if (filterArr.length > 0 && item.Detail.LimitIds && item.Detail.LimitIds.Artist) {
        item.Detail.LimitIds.Artist.forEach((item) => {
          filterArr = filterArr.filter((cart) => {
            return cart.WorkId === item && cart[scopeStr]
          })
        })
      }
      let money = 0
      filterArr.forEach(item => {
        money += (item.Count * item.Money)
      })
      this.couponMoney = Math.ceil(money * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)))
    },
    couponLiCur(item, index) {
      if (!item.Detail.LowMoney || item.Detail.LowMoney / 100 < this.totalMoney) {
        if (item.Type === 4 && this.$user.UserId === item.FromId) {
          if (item.Detail.BehalfScale) {
            this.couponMoney = Math.ceil(this.totalMoney * parseFloat((1 - (item.Detail.Behalf / 100)).toFixed(2)))
          } else {
            this.couponMoney = item.Detail.Amount
          }
        } else if (!item.Detail.AmountScale) {
          this.couponMoney = item.Detail.Amount
        } else {
          if (item.Type === 1) {
            if (!item.Detail.LimitIds) {
              if (item.Detail.LimitScope === 1) {
                this.couponMoney = Math.ceil(this.customTotalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)))
              } else if (item.Detail.LimitScope === 2 ) {
                this.couponMoney = Math.ceil(this.shopTotalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)))
              } else {
                this.couponMoney = Math.ceil(this.totalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)))
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
            this.couponMoney = Math.ceil(this.totalMoney * parseFloat((1 - (item.Detail.Amount / 100)).toFixed(2)))
          }
        }
        if (this.couponId !== item['Id']) {
          this.couponId = item['Id']
        } else {
          this.couponId = ''
          this.couponMoney = 0
        }
      } else {
        this.$toast.center('该优惠券最低消费为￥' + (item.Detail.LowMoney) / 100)
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
    submitOrder() {
      let params = {}
      let orders = []
      _.each(this.carts, c => {
        orders.push(c.Id)
      })
      if (this.waActive === true) {
        params.UseBalance = self.balanceMoney
      }
      if (this.addressId === 0) {
        this.$toast.center('请添加收货地址')
        return
      } else {
        params.AddressId = this.AddressId
      }

      params.PayMoney = this.payMoney
      params.BuyerRemark = this.trim(this.orderTips)
      params.CartIds = orders
      params.PayType = 1
      if (this.couponId) {
        params['CouponId'] = this.couponId
      }
      request.do('POST', 'trade/add', params).then(res => {
        this.tradeId = res.take('Data')
        if (isWxPlatform()) {
          let params = {
            TradeId: res.take('Data'),   // 交易Id
            Platform: 'weixin',   // 支付平台，weixin或alipay
            Wap: true,       // 是否移动端支付
            Jump:true      // 是否自动跳转
          }
          request({url: 'pay/for', params}).then((res) => {
            console.log(res)
          })
        } else {
          this.$refs.pay.show()
        }
//        window.location.href = `pay.html?TradeId=${res.take('Data')}`
      }, res => {
        console.log(res.take('Error'))
      })
    }
  },
  computed: {
    defaultValue() {
      let placeId = this.placeId
      if (placeId) {
        return [
          Math.floor(placeId / 1000) * 1000,
          Math.floor(placeId / 10) * 10,
          placeId
        ]
      } else {
        return [0, 0, 0]
      }
    },
    isMobile() {
      if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.addressTel))) {
        return false
      }
      return true
    },
    defaultAddress() {
      let addList = this.addListObj.filter((item) => {
        return item.checked === true
      })
      if (addList.length === 0 || this.addListObj.length === 0) {
        this.addAddress = true
      } else {
        this.addAddress = false
      }
      return addList[0]
    },
    customTotalMoney() {
      let money = 0
      this.cartArr.forEach(item => {
        if (item.IsCustom) {
          money += (item.Count * item.Money)
        }
      })
      return money
    },
    shopTotalMoney() {
      let money = 0
      this.cartArr.forEach(item => {
        if (!item.IsCustom) {
          money += (item.Count * item.Money)
        }
      })
      return money
    },
    totalMoney() {
      let money = 0
      this.cartArr.forEach(item => {
        money += (item.Count * item.Money)
      })
      return money + this.postage
    },
    payMoney() {
      let payMoney
      if (this.waActive) {
        payMoney = this.totalMoney - this.balanceMoney - this.couponMoney
      } else {
        payMoney = this.totalMoney - this.couponMoney
      }
      payMoney = payMoney < 0 ? 0 : payMoney
      return payMoney
    }
  }
}
</script>
<style>
  /*.slide-enter-active, .slide-leave-active {*/
    /*transition: all .3s;*/
  /*}*/
  /*.slide-enter, .slide-leave-to {*/
    /*transform: translateX(100%);*/
  /*}*/
  .check{
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url('~images/icon/icheck-cb.png') no-repeat;
    background-size: contain;
    margin-bottom: -4px;
  }
  .ticket-list li:last-child{
    border-bottom: none !important;
  }
  .active .check{
    background: url('~images/icheck.png');
    background-size: contain;
  }
  .ticket-list .ticket-agency{
    display: inline-block;
    padding: 1px;
    color: #da4453;
    border: 1px solid #da4453;
    border-radius: 2px;
    font-size: 12px;
  }
  .flip-list-move {
    transition: transform .5s;
  }
  .flip-list-leave-active{
    transform: translateX(-120%) !important;
    transition: transform .3s !important;
  }
</style>
