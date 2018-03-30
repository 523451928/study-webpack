<template>
  <transition name="slide-fade">
    <div class="order-box">
      <Loading v-show="!showLoading"></Loading>
      <div class="order-nav">
        <div class="user-cont-wrap container">
          <a class="item" :class="{'active': orderStatus==0}" href="#/0">全部订单</a>
          <a class="item" :class="{'active': orderStatus==1}" href="#/1">待支付订单</a>
          <!--<a class="item" :class="{'active': orderStatus==1}" href="#/1">未支付订单</a>-->
          <!--<a class="item" :class="{'active': orderStatus==5}" href="#/5">已关闭订单</a>-->
          <!--<a class="item" href="#refund">退换货订单</a>-->
          <!--<a class="item" :class="{'active': orderStatus==='income'}" href="#/income">收入订单</a>-->
        </div>
      </div>
      <div class="no-order" v-if="orderList==null || orderList.length==0">暂无订单</div>
      <div class="user-cont-wrap container" v-if="orderList && orderList.length>0">
        <panel-head></panel-head>
        <div id="my-order"  class="order-panel-wrap load-container">
          <div class="error-wrap" :class="{'active': errorStatus}">
            <div class="order-msg">{{errorText}}</div>
          </div>
          <div :class="{'active':orderList.length>0}" class="order-list">
            <div v-for="order in orderList" class="order-pane panel-default">
              <div class="panel-heading">
                <span class="create-time">
                    {{order | formatDate}}
                </span>
                <span class="order-num">
                  订单编号：
                  <a :href="'/order-detail.html#/'+order.Id" class="code-link " target="_blank">{{order.Id}}</a>
                </span>
              </div>
              <order-list @buyAgain="buyAgain" :order="order" @closeOrder="closeOrder" @showBigImg="showBigImg"></order-list>
            </div>
          </div>
        </div>
        <income v-if="orderStatus=='income'"></income>
      </div>
      <nav class="page-wrapper">
        <pagination  :nextDisable="nextDisable" :pager="orderData.Pager" @updatePage="updatePageIndex"></pagination>
      </nav>
      <transition name="fade">
        <big-image  :entries="Entries" :pictures="Pictures" :isClick="false" v-if="imgShow" @popHide="popHide"></big-image>
      </transition>
    </div>
  </transition>
</template>
<script>
  /* eslint-disable */
  import BigImage from 'components/public/imagebigshow.vue'
  import Loading from 'components/public/loading.vue'
  import Pagination from 'components/public/Pager.vue'
  import income from './income.vue'
  import PanelHead from '../public/order/PanelHead.vue'
  import OrderList from '../public/order/OrderList.vue'
  import { formatDate } from '../../scripts/filters/filters'

  export default {
    components: {Loading, Pagination, income, BigImage, PanelHead, OrderList},
    beforeRouteEnter(to, from, next) {
      const status = to.params.status
      let f
      if (status === 'income') {
        f = that => {
          that.orderStatus = 'income'
          that.showLoading = false
        }
      } else {
        f = that => that.getOrderList(status, 1)
      }
      next(f)
    },
    data() {
      return {
        orderType: 0,
        pageIndex: 1,
        orderStatus: 0,
        errorText: '',
        errorStatus: false,
        showLoading: true,
        orderData: {},
        orderList: [],
        Entries: [],
        Pictures: [],
        imgShow: false,
        pageCount: 10
      }
    },
    watch: {
      '$route'(to, from) {
        const status = to.params.status
        if (status === 'income') {
          this.orderStatus = 'income'
          this.showLoading = false
          return
        }
        this.showLoading = false
        this.getOrderList(status, 1)
      }
    },
    methods: {
      buyAgain(order) {
        request.do('POST', `trade/purchase/${order.Id}`).then((res) => {
          if (res.body.Data) {
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
      closeOrder(order) {
        request.do('POST', `trade/close/${order.Id}`).then((res) => {
          if(res.body.Data) {
            order.Status = 5
          } else {
            layer.toast('关闭失败')
          }
        })
      },
      popHide() {
        this.imgShow = false
      },
      showBigImg(item) {
        this.imgShow = true
        this.Entries = item.Entries
        this.Pictures = item.Pictures
      },
      getOrderList(status, page) {
        let params = {
          Page: page,
          Count: 10
        }
        if(parseInt(status) !== 0) {
          params.Status = parseInt(status)
        }
        this.orderStatus = status
        request({ url: 'trade/list', params }).then((res) => {
          this.orderData = res.body
          this.orderList = this.orderData.Data
          this.showLoading = true
        })
      },
      updatePageIndex(p) {
        this.pageIndex = p
        this.getOrderList(this.orderStatus, p)
      }
    },
    filters: {
      formatDate
    },
    computed: {
      nextDisable() {
        if (this.orderList) {
          return this.orderList.length < 10
        } else {
          return true
        }
      }
    }
  }
</script>
<style lang="sass">
  .viewer{
    .display-wrapper{
      margin: 0 auto;
    }
  }
</style>
