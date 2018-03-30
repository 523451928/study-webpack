<template>
  <div class="warp">
    <loading v-if="!orderDetail.Status"></loading>
    <div class="user-head scale-1px">
      <a class="pull-left back"  @click="back">
        <i class="wa wa-left"></i>
      </a>
      <h2 class="title">订单详情</h2>
    </div>
    <div class="order-base-info">
      <div class="base-info-list active">
        <div class="info-cont clearfix">
          <span class="pull-left">订单号：{{orderDetail.Id}}</span>
          <span class="pull-right" :style="stateStyle">
            {{orderDetail.Status===1 ? '待付款'
               :orderDetail.Status===2 ? '待发货'
                :orderDetail.Status===3 ? '已发货'
                  :orderDetail.Status===4 ? '交易成功'
                    :orderDetail.Status===5 ? '交易关闭' : ''}}
          </span>
        </div>
        <span>购买时间：{{orderDetail | formatDate}}</span>
      </div>
    </div>
    <div class="receiver-info" v-if="orderDetail.Address">
      <div class="clearfix">
        <span class="receiver-name pull-left">收货人: {{orderDetail.Address.Receiver}}</span>
        <span class="receiver-cellphone pull-right">{{orderDetail.Address.Cellphone}}</span>
      </div>
      <p>
         <i>收货地址:</i> <i v-for="(ads,index) in getAddress(orderDetail.Address.PlaceId)">
                          {{ads[0]}}
          </i> {{orderDetail.Address.Detail}}
        </p>
    </div>
    <div class="order-progress len4" v-if="orderDetail.Status!==1 && orderDetail.Status!==5">
      <span class="line"></span>
      <div class="step step1 curr">
        <div class="tit">
          <span class="ball"></span>
          </div>
        <span>提交订单</span>
      </div>
      <div class="step step2" :class="tradeLogTwo?'curr':''">
        <div class="tit">
          <span class="ball"></span>
          </div>
        <span>商品出库</span>
      </div>
      <div class="step step3" :class="tradeLogThree?'curr':''">
        <div class="tit">
          <span class="ball"></span>
          </div>
        <span>等待收货</span>
      </div>
      <div class="step step4" :class="tradeLogFour?'curr':''">
        <div class="tit">
          <span class="ball"></span>
        </div>
        <span>确认收货</span>
      </div>
      <div class="pending-tips">
        <p v-if="orderDetail.Status===2" >
          您的商品正在制作中，请耐心等待~
        </p>
        <div class="panel-heading color-tl" v-if="expressArr.length !== 0">
          <span v-for="item in expressArr">
            <span>
                <span>{{logisticsName(item.Company)}}</span>:
                <span>{{item.Number}}</span>
            </span>
            <a href="javascript:void(0)" class="log-detail-link pull-right open" @click="logDetail(item)">
              物流详情 <i class="wa wa-caret-right"></i>
            </a>
          </span>
        </div>
      </div>
      <transition name="slide">
        <div class="log-detail" v-show="logShow">
          <div class="user-head">
            <a class="pull-left back" @click="logShow = false">
              <i class="wa wa-left" ></i>返回
            </a>
            <h2 class="title">物流信息</h2>
          </div>
          <div class="log-content">
            <p>物流公司: {{logisticsName(logDetailObj.Company)}}</p>
            <p>货运单号: {{logDetailObj.Number}}</p>
          </div>
          <ul class="log-timeline" v-if="logDetailObj.Data">
            <li v-for="item in logDetailObj.Data.lastResult.data">
              <span class="time">{{item.time}}</span>
              <span class="context">{{item.context}}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="order-list">
      <div class="panel panel-default ord-detail-pane">
        <Produce @showImg="showImg" v-if="orderDetail.Orders" :initOrders='orderDetail.Orders'></Produce>
      </div>
    </div>
    <div class="order-money clearfix">
      <div class="item clearfix">
        <span class="pull-left">商品总价：</span>
        <span class="pull-right">{{totalMoney}} 元</span>
      </div>
      <div class="item clearfix">
        <span class="pull-left">优惠金额：</span>
        <span class="pull-right">{{(totalMoney - orderDetail.PayMoney / 100).toFixed(2)}} 元</span>
      </div>
      <div class="item clearfix">
        <span class="pull-left">运费：</span>
        <span class="pull-right">0 元</span>
      </div>
      <div class="item clearfix">
        <span class="pull-left">实付金额: </span>
        <span class="price pull-right">{{orderDetail.PayMoney/100}} 元</span>
      </div>
    </div>
    <div class="order-operate clearfix">
      <span v-if="orderDetail.Status===1" class="go-pay pull-right" @click="payFn">去付款</span>
      <span v-if="orderDetail.Status===3 || orderDetail.Status===4" class="buy-again pull-right">再次购买</span>
      <a v-if="orderDetail.Status===5" class="go-shop pull-right" href="/work">去商店逛逛</a>
      <span class="contact-service pull-right" @click="contactService">咨询客服</span>
    </div>
    <pay ref="pay" :tradeId="orderDetail.Id"></pay>
    <img-preview v-if="imgShow" :displayData="displayData" @hideImg="imgShow=false"></img-preview>
  </div>
</template>
<script>
  /* eslint-disable*/
import { getEntries } from 'scripts/utils/entry'
import { isWxPlatform } from 'scripts/tools/isWxPlatform'
import { initItem } from 'components/cart/utils.js'
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import { formatDate, formatPhone } from '../../scripts/filters/filters'
import Loading from 'components/public/loading.vue'
import WallHead from 'components/public/Wahead.vue'
import ImgPreview from 'components/public/imgPreview'
import Produce from './produce.vue'
import pay from '../public/pay.vue'
import loading from '../public/loading.vue'
import { mixin as displayComponents } from 'components/public/display/app/components'
let mixinCom = _.assign({Loading, WallHead, Produce, ImgPreview, pay, loading}, displayComponents)
import { provinces, findPlaceById, Admap } from 'json/districts.js'
let admap = new Admap(provinces)
export default {
  mixins: [{components: mixinCom}],
  beforeRouteEnter(to, from, next) {
    const status = to.params.id
    const f = that => that.getOrderDetail(status)
    next(f)
  },
  watch: {
    '$route'(to, from) {
      this.getOrderDetail(to.params.id)
    }
  },
  data() {
    return {
      orderId: 0,
      orderDetail: {},
      errorText: '',
      errorStatus: false,
      showLoading: true,
      itemsDetail: [],
      items: [],
//      showDetail: true,
      editStatus: false,
      Logistics: [],
      logDetailObj: {},
      displayData: {},
      imgShow: false,
      logShow: false,
      expressArr: []
    }
  },
  methods: {
    payFn() {
      if (isWxPlatform()) {
        let params = {
          TradeId: this.orderDetail.Id,   // 交易Id
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
    },
    buyAgain() {
      request.do('POST', `trade/purchase/${this.orderDetail.Id}`).then((res) => {
        if (res.body.Data) {
          if (res.body.Data.Yes > 0) {
            window.location.href = 'cart.html'
          } else {
            this.$toast.center(res.body.Data.No)
          }
        } else {
          this.$toast.center('购买失败')
        }
      })
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
    },
    back() {
      window.history.back()
    },
    showImg(data) {
      this.imgShow = true
      this.displayData = data
    },
    logisticsName(name) {
      let company = ''
      switch (name) {
        case 'shunfeng':
          company = '顺丰'
          break
        case 'shentong':
          company = '申通'
          break
        case 'zhongtong':
          company = '中通'
          break
        default :
          company ='暂无物流信息'
      }
      return company
    },
    logDetail(item) {
      this.logDetailObj = item
      this.logShow = true
    },
    getOrderDetail(id) {
      request.get('trade', id).then((res) => {
        this.showLoading = false
        this.orderDetail = res.body
        if (this.orderDetail.Expresses) {
          this.expressArr = this.orderDetail.Expresses
          this.expressArr.forEach((item) => {
            item.Data = JSON.parse (item.Data)
          })
        }
      })
    },
    getAddress(i) {
      return admap.getAddress(i)
    },
    getItemBomsDetail(item) {
      let detailStr = ''
      let bomDetail = item.BomDetail
      _.each(bomDetail, bd => {
        detailStr = detailStr + bd.Value + '' + bd.Key + ' / '
      })
      return detailStr
    },
    getLogStatus(id) {
      if (this.orderDetail.OrderFlows) {
        let inserted = 0
        this.orderDetail.OrderFlows.forEach((item) => {
          if(item.NewStatus == id) {
            inserted = item.Inserted
          }
        })
        return inserted
      }
    }
  },
  computed: {
    stateStyle() {
      let color = '#76A549'
      if (this.orderDetail.Status === 1 || this.orderDetail.Status === 5) {
          color = '#F05950'
      }
      return {
        color
      }
    },
    totalMoney() {
      let money = 0
      if (this.orderDetail.Orders) {
        this.orderDetail.Orders.forEach((item) => {
          money += (item.Count * item.Money)
        })
      }
      return money / 100
    },
    tradeLogTwo() {
      return this.getLogStatus(3)
    },
    tradeLogThree() {
      return this.getLogStatus(3)
    },
    tradeLogFour() {
      return this.getLogStatus(4)
    }
  },
  filters: {
    formatDate,
    formatPhone
  }
}
</script>
