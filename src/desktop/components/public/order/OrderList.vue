<template>
  <div>
    <table class="table table-bordered">
      <tbody class="text-center">
      <tr>
        <td colspan="3" width="50%" >
          <produce @showBigImg="showBigImg" v-if="order.Orders" :initOrders='order.Orders'></produce>
        </td>
        <td rowspan="1" class="money-td color-tb pdt-70" width="16%">
          <p class="fw">￥ {{order.PayMoney / 100}}</p>
          <span class="cp-item">(含运费: ￥0元)</span>
        </td>
        <td rowspan="1" width="16%" class="pdt-70">
          <div class="text-center color-tb" v-if="order.Status===1">
            等待支付
          </div>
          <div class="text-center color-tb" v-if="order.Status===2">
            待发货
          </div>
          <div class="text-center color-tb" v-if="order.Status===3">
            已发货
          </div>
          <div class="text-center color-tb" v-if="order.Status===4">
            交易成功
          </div>
          <div class="text-center color-tb" v-if="order.Status===5">
            交易关闭
          </div>
          <div class="text-center color-tb" v-if="order.Status===6">
            已退款
          </div>
          <a v-if="!isDetail" :href="'/order-detail.html#/'+order.Id" class="detail-link" target="_blank">查看订单详情</a>
        </td>
        <td rowspan="1" class="order-ope text-center pdt-60" width="16%">
          <!--<a href="/public/list" class="btn btn-default"> <i class="wa wa-shopping-cart-fill"></i> 继续购物</a>-->
          <a :href="'/pay.html?TradeId='+order.Id" v-if="order.Status==1" :class="{'btn-primary':order.Status==1}" class="btn btn-default">
            去付款
          </a>
          <a @click="buyAgain(order)" v-if="order.Status!=1" :class="{'btn-primary':order.Status==1}" class="btn btn-default">
            再次购买
          </a>
          <p class="btn-link" v-if="order.Status==1" @click="closeOrder(order)">关闭订单</p>
          <a class="btn-link" v-if="order.Status==6 || order.Status==5" href="http://192.168.1.6:8000/work" target="_blank">去商店逛逛</a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Produce from './Produce.vue'
  export default{
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      },
      isDetail: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      closeOrder(order) {
        this.$emit('closeOrder', order)
      },
      showBigImg(item) {
        this.$emit('showBigImg', item)
      },
      buyAgain(order) {
        this.$emit('buyAgain', order)
      }
    },
    components: {
      Produce
    },
    mounted() {
    }
  }
</script>

