<template>
  <transition name="slide-fade">
    <div class="order-box pt5">
      <!--<Loading v-show="showLoading"></Loading>-->
      <wall-head :hasReturnText="false" title="订单列表" ></wall-head>
      <div class="order-nav">
        <a class="item" :class="{'active': orderStatus==0}" href="#/0">全部</a>
        <a class="item" :class="{'active': orderStatus==1}" href="#/1">待付款</a>
        <a class="item" :class="{'active': orderStatus==2}" href="#/2">待收货</a>
        <a class="item" :class="{'active': orderStatus==5}" href="#/5">已关闭</a>
        <!--<a class="item" :class="{'active': orderStatus==='income'}" href="#/income">收入</a>-->
      </div>
      <div v-if="infinitScroll" class="user-cont-wrap" v-infinite="getOrderList" infinite-scroll-disabled="loading" infinite-scroll-distance="10" hasGoTop="true">
        <div id="my-order" v-if="test" class="order-panel-wrap load-container">
          <div class="error-wrap" :class="{'active': errorStatus}">
            <div class="order-msg">{{errorText}}</div>
          </div>
          <div :class="{'active':orderList.length>0}" class="order-list">
            <div v-for="order in orderList" class="order-pane panel panel-default">
              <div class="panel-heading">
                <div class="fl">
                  订单:
                  <a :href="'/order-detail.html#/'+order.Id" class="code-link color-tb">{{order.Code}}</a>
                </div>
                <a :href="'/order-detail.html#/'+order.Id">
                  状态:
                  <span class="color-tl fr" v-show="order.Status===1">等待支付</span>
                  <span class="color-tl fr" v-show="order.Status===2">待发货</span>
                  <span class="color-tl fr" v-show="order.Status===3">已发货</span>
                  <span class="color-tl fr" v-show="order.Status===4">交易成功</span>
                  <span class="color-tl fr" v-show="order.Status===5">交易关闭</span>
                  <span class="color-tl fr" v-show="order.Status===6">已退款</span>
                  <span class="wa-right"> </span>
                </a>
              </div>
              <table class="table table-bordered">
                <tbody class="text-center">
                <tr>
                  <td colspan="3" width="100%">
                    <!--<a :href="'/order-detail.html#/'+order.Id" class="color-565a5c">-->
                      <Produce @showBig="showBig" :initOrders='order.Orders'></Produce>
                    <!--</a>-->
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <income v-if="!test"></income>
      </div>
      <div v-else class="order-wrapper">
        <loadmore v-show="orderList.length>0" :isAutoLoadmore="true" :noMoreText="noMoreText" :top-method="loadTop" :bottom-method="getOrderList" :all-bottom-loaded="allLoaded"
                  ref="loadmore">
          <div :class="{'active':orderList.length>0}" class="order-list">
            <div v-for="order in orderList" class="order-pane panel panel-default">
              <div class="panel-heading scale-1px">
                <div class="fl">
                  订单:
                  <a :href="'/order-detail.html#/'+order.Id" class="code-link color-tb">{{order.Id}}</a>
                </div>
                <a :href="'/order-detail.html#/'+order.Id" class="code-link color-tb fr">
                  状态:
                  <span v-if="order.Status===1">待付款</span>
                  <span v-if="order.Status===2">待发货</span>
                  <span v-if="order.Status===3">已发货</span>
                  <span v-if="order.Status===4">交易完成</span>
                  <span v-if="order.Status===5">交易关闭</span>
                  <span v-if="order.Status===6">已退款</span>
                  <span class="wa-right"></span>
                </a>
              </div>
              <table class="table">
                <tbody class="text-center">
                  <tr>
                    <td colspan="3" width="100%">
                      <a :href="'/order-detail.html#/'+order.Id" >
                        <Produce @showBig.prevent="showBig" :initOrders='order.Orders' :orderId="order.Id"></Produce>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <div class="order-oprate clearfix">
                      <a href="javascript: void(0);" @click="payNow(order.Id)" v-if="order.Status==1" class="wa-btn wa-pay fr">
                        去付款
                      </a>
                      <span @click="buyAgain(order)" v-if="order.Status!=1" class="wa-btn wa-buy-again fr">
                        再次购买
                      </span>
                      <a class="wa-btn fr" :href="`/order-detail.html#/${order.Id}`" v-if="order.Status==3">
                        查看物流
                      </a>
                      <span class="wa-btn wa-cancel-order fr" v-if="order.Status==1" @click="closeOrder(order)">取消订单</span>
                      <a class="wa-btn wa-go-shop fr" v-if="order.Status==6 || order.Status==5" href="/work" target="_self">去商店逛逛</a>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </loadmore>
        <div v-if="noMoreText==='暂无订单'" class="no-more-order">
          <div class="no-more-info">
            <span class="wa wa-shopping-cart-fill"></span>
            <p>{{orderStatus==0 ? '你还没有在墙蛙买过东西哦~' :
               orderStatus==1?'暂无待付款订单~':'暂无待收货订单~'}}
            </p>
          </div>
          <a class="index-btn" href="/" target="_self">去首页逛逛</a>
        </div>
      </div>
      <pay ref="pay" :tradeId="tradeId"></pay>
      <img-preview v-if="imgShow" :displayData="displayData" @hideImg="imgShow=false"></img-preview>
    </div>
  </transition>
</template>
<script>
  /* eslint-disable */
import { InterfaceMap as Interf } from 'scripts/interfaceConst'
import { isWxPlatform } from 'scripts/tools/isWxPlatform'
import Loading from 'components/public/loading.vue'
import Pagination from 'components/public/pagination.vue'
import WallHead from 'components/public/Wahead.vue'
import ImgPreview from 'components/public/imgPreview'
import Produce from './produce.vue'
import income from './income.vue'
import loadmore from 'components/public/loadmore'
import pay from '../public/pay.vue'
export default {
  components: {Loading, Pagination, Produce, income, WallHead, ImgPreview, loadmore, pay},
  beforeRouteEnter(to, from, next) {
    const status = to.params.status
    let f
    if (status === 'income') {
      f = that => {
        that.test = false
        that.orderStatus = 'income'
        that.showLoading = false
      }
    } else {
      f = that => {
        that.orderStatus = status
        if (that.infinitScroll) {
          that.getOrderList()
        }
      }
    }
    next(f)
  },
  data() {
    return {
      orderType: 0,
      totalPage: 1,
      pageIndex: 1,
      orderStatus: 0,
      errorText: '',
      errorStatus: false,
      showLoading: true,
      orderData: {},
      orderList: [],
      itemsDetail: [],
      test: true,
      loading: true,
      noMore: false,
      displayData: {},
      imgShow: false,
      allLoaded: false,
      infinitScroll: false,
      noMoreText: '没有更多了!',
      tradeId: undefined
    }
  },
  watch: {
    '$route'(to, from) {
      const status = to.params.status
      this.orderStatus = status
      if (status === 'income') {
        this.test = false
        this.orderStatus = 'income'
        this.showLoading = false
        return
      }
      this.test = true
      this.orderList = []
      this.pageIndex = 1
      this.allLoaded = false
      this.$loading('加载中...')
      document.querySelector('.bd').scrollTop = 0
      this.getOrderList()
    }
  },
  methods: {
    payNow(id) {
      this.tradeId = id
      if (isWxPlatform()) {
        let params = {
          TradeId: id,   // 交易Id
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
    buyAgain(order) {
      request.do('POST', `trade/purchase/${order.Id}`).then((res) => {
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
    closeOrder(order) {
      request.do('POST', `trade/close/${order.Id}`).then((res) => {
        if(res.body.Data) {
          order.Status = 5
        } else {
          this.$toast.center('关闭失败')
        }
      })
    },
    loadTop(){
      setTimeout(() =>{
        this.$refs.loadmore.onTopLoaded()
      }, 1000)
    },
    showBig(data) {
      this.imgShow = true
      this.displayData = data
    },
    getOrderList() {
      let params = {
        Page: this.pageIndex,
        Count: 10
      }
      if (parseInt(this.orderStatus) !== 0 && this.infinitScroll) {
        params.Status = this.orderStatus
      } else {
        if (parseInt(window.location.hash.slice(-1)) !== 0) {
          if (window.location.hash.slice(-1) == 2) {
            params.Status = [2, 3]
          } else {
            params.Status = window.location.hash.slice(-1)
          }
        }
      }
      this.loading = true
      this.showLoading = true
      this.noMoreText = '没有更多了!'
      document.querySelector('.bd').style.overflowY = 'auto'
      return request({ url: 'trade/list', params }).then((res) => {
        this.orderData = res.body
        this.$loading.close()
        if (this.orderData.Data && this.orderData.Data.length > 0) {
          this.orderList = this.orderList.concat(this.orderData.Data)
          setTimeout(() => {
            this.loading = false
            this.pageIndex++
          }, 500)
        } else {
          if (this.pageIndex == 1) {
            this.noMoreText = '暂无订单'
            document.querySelector('.bd').style.overflowY = 'hidden'
          }
          this.noMore = false
          this.allLoaded = true
        }
        if (!this.infinitScroll) {
          this.$refs.loadmore.onBottomLoaded()
        }
        this.showLoading = false
      })
    },
    updateTotalPage(p) {
      this.getOrderList(this.orderStatus, p)
    },
    updatePageIndex(p) {
      this.pageIndex = p
      this.getOrderList(this.orderStatus, p)
    }
  },
  computed: {
  }
}
</script>
<style>
  .go-top{
    position: fixed;
    right: 0px;
    bottom: 40px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    background: rgba(0,0,0,.8);
  }
  .my-loadmore{
    background: #f5f5f5;
  }
</style>
