<template>
  <!--<transition name="slide-fade">-->
  <!--<div class="order-detail-box">-->
  <!--<Loading v-show="showLoading"></Loading>-->
  <!--</div>-->
  <!--</transition>-->
  <div class="order-detail-box user-cont-wrap cont-wrap container" style="margin-top: 50px;position: relative; ">
    <Loading v-show="showLoading"></Loading>
    <ol class="breadcrumb mt30 detail-bg">
      <li><a href="/">首页</a></li>
      <li><a href="/order.html">我的订单</a></li>
      <li class="active">订单详情</li>
    </ol>
    <div id="order-detail">
      <div class="title-wrap">
        <span>收货信息</span>
      </div>
      <div class="base-info-wrapper" v-if="orderDetail.Address">
        <div>
          <span class="per-40"><i class="info-tit">下单时间：</i>{{orderDetail | formatDate}}</span>
          <span><i class="info-tit">订单编号：</i>{{orderDetail.Id}}</span>
        </div>
        <div>
          <span class="per-40"><i class="info-tit">收&nbsp;货&nbsp; 人：</i>{{orderDetail.Address.Receiver}}</span>
          <span><i class="info-tit">联系方式：</i></span>{{orderDetail.Address.Cellphone | formatPhone}}
        </div>
        <div>
          <span><i class="info-tit">收货地址：</i><i v-for="(ads,index) in getAddress(orderDetail.Address.PlaceId)">
                          {{ads[0]}}
                        </i> {{orderDetail.Address.Detail}}</span>
        </div>
      </div>
      <div class="title-wrap">
        <span>物流进展</span>
      </div>
      <div class="order-progress len4">
        <span class="line"></span>
        <div class="step step1 curr">
          <div class="tit">
            <span class="ball"></span> 提交订单
          </div>
          <div class="time" v-if="orderDetail.OrderFlows">{{orderDetail | formatDate}}</div>
        </div>
        <div class="step step2" :class="tradeLogTwo?'curr':''">
          <div class="tit">
            <span class="ball"></span> 商品出库
          </div>
          <div class="time" v-if="tradeLogTwo">
            <span>{{tradeLogTwo | formatDate}}</span>
          </div>
          <div class="time" v-else>
            <span>----_----_--</span>
          </div>
        </div>
        <div class="step step3" :class="tradeLogThree?'curr':''">
          <div class="tit">
            <span class="ball"></span> 等待收货
          </div>
          <div class="time" v-if="tradeLogThree">
            <span>{{tradeLogThree | formatDate}}</span>
          </div>
          <div class="time" v-else>
            <span>----_----_--</span>
          </div>
        </div>
        <div class="step step4" :class="tradeLogFour?'curr':''">
          <div class="tit">
            <span class="ball"></span> 确认收货
          </div>
          <div class="time" v-if="tradeLogFour">
            <span>{{tradeLogFour | formatDate}}</span>
          </div>
          <div class="time" v-else>
            <span>----_----_--</span>
          </div>
        </div>
      </div>
      <div class="logistics-wrapper" v-if="expressArr.length === 0">
        <div class="panel-heading" style="border-bottom: none;">
          暂无物流信息
        </div>
      </div>
      <div v-else class="logistics-wrapper" v-for="(item, index) in expressArr">
        <div class="panel-heading" @click="collaspePanel(item)">
          {{logisticsName(item.Company)}}<i>:</i> {{item.Number}}
          <a @click.stop class="link pull-right" :href='logisticsHref(item.Company)' target="_blank">去快递网站查询</a>
        </div>
        <transition name="collaspe">
          <div v-show="!item.expand" v-if="item.Data" class="logistics-container">
            <p v-for="(item,index) in item.Data.lastResult.data">
            <span class="log-time">
              {{item.time}}
            </span>
              <span class="log-text">
              {{item.context}}
            </span>
            </p>
          </div>
        </transition>
      </div>
      <div class="title-wrap">
        <span>商品详情</span>
      </div>
      <div class="panel-default order-pane">
        <div class="order-list">
          <panel-head></panel-head>
          <order-list @buyAgain="buyAgain" :order="orderDetail" :isDetail="true" @showBigImg="showBigImg"></order-list>
        </div>
      </div>
      <div class="order-money clearfix">
        <div class="pull-right">
          <div class="item">
            <span>商品总额：</span>
            <span>{{totalMoney}} 元</span>
          </div>
          <div class="item">
            <span>运&nbsp;&nbsp;费：</span>
            <span>0 元</span>
          </div>
          <div class="item">
            <span>优惠金额：</span>
            <span>{{(totalMoney - orderDetail.PayMoney / 100).toFixed(2)}} 元</span>
          </div>
          <div class="item">
            <span>应付总额：</span>
            <span class="price">{{orderDetail.PayMoney / 100}} 元</span>
          </div>
        </div>
      </div>
      <transition name="fade">
        <big-image :entries="Entries" :pictures="Pictures" :isClick="false" v-if="imgShow"
                   @popHide="popHide"></big-image>
      </transition>
    </div>
</template>
<script>
  /* eslint-disable */
  import { provinces, findPlaceById, Admap } from 'json/districts.js'
  let admap = new Admap(provinces)
  import Loading from 'components/public/loading.vue'
  import BigImage from 'components/public/imagebigshow.vue'
  import PanelHead from '../public/order/PanelHead.vue'
  import OrderList from '../public/order/OrderList.vue'
  import { formatDate, formatPhone } from '../../scripts/filters/filters'
  export default {
    components: {
      Loading,
      BigImage,
      PanelHead,
      OrderList
    },
    beforeRouteEnter(to, from, next) {
      const orderId = to.params.id
      const f = that => that.getOrderDetail(orderId)
      document.querySelector('body').style.background = '#f5f5f5'
      next(f)
    },
    mounted() {
    },
    data() {
      return {
        orderId: 0,
        orderDetail: {},
        errorText: '',
        errorStatus: false,
        showLoading: true,
        imgShow: false,
        showDetail: true,
        Entries: [],
        Pictures: [],
        expressArr: [],
        expressHrefArr: [],
        href: ''
      }
    },
    methods: {
      buyAgain(order) {
        request.do('POST', `http://192.168.1.6:8000/trade/purchase/${order.Id}`).then((res) => {
          if (res.body.Data) {
            console.log(res.body.Data)
            if (res.body.Data.Yes > 0) {
              window.location.href = 'cart.html'
            } else {
              layer.toast(res.body.Data.No)
            }
          } else {
            layer.toast('购买失败')
          }
        })
      },
      collaspePanel(item) {
        if (!item.expand) {
          this.$set(item, 'expand', true)
        } else {
          item.expand = !item.expand
        }
      },
      getAddress(i) {
        return admap.getAddress(i)
      },
      showBigImg(item) {
        this.imgShow = true
        this.Entries = item.Entries
        this.Pictures = item.Pictures
      },
      popHide() {
        this.imgShow = false
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
      logisticsHref(name) {
        let href = ''
        switch (name) {
          case 'shunfeng':
            href = 'http://www.sf-express.com'
            break
          case 'shentong':
            href = 'http://www.sto.cn/'
            break
          case 'zhongtong':
            href = 'http://www.zto.com/'
            break
          default :
            href =''
        }
        return href
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
    filters: {
      formatPhone,
      formatDate
    },
    computed: {
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
    }
  }
</script>
