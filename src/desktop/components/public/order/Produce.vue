<template>
  <div>
    <div class="item-detailBox" :class="{'first':index == 0}"  v-for="(item,index) in initOrders">
      <div class="item-row img-item">
        <div class="td-item goods-img"  @click="showBigImg(item.Item)">
          <viewer :entries="item.Item.Entries" :pictures="item.Item.Pictures" :length="150" ref="display" :isClick="false" ></viewer>
        </div>
      </div>
      <div class="item-row goods-info">
        <p class="product-wrapper">
          <span class="product-name">{{item.Item.Work ? item.Item.Work.Title : '个性定制'}}</span>
          <span class="mr10 fr">x{{item.Count}}</span>
          <!--<span class="mr40 fr">￥{{item.PayMoney/100/item.Count}}</span>-->
          <span class="mr40 fr">￥{{item.Money/100}}</span>
        </p>
        <p v-if="goodsInfoArr[index]" class="product-info">
          {{goodsInfoArr[index]['CategoryId'] == 1 ? '有框画' :
            goodsInfoArr[index]['CategoryId'] == 6 ? '有框画' :
            goodsInfoArr[index]['CategoryId'] == 7 ? '有框画' : goodsInfoArr[index]['Name']}}
        </p>
      </div>
      <!--<div class="item-row order-money-info">-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import { getEntries } from 'components/custom/display/entry'
  import Viewer from 'components/custom/display/viewer.vue'
  export default {
    props: {
      initOrders: {type: Array, defualt: []}
    },
    components: {
      Viewer
    },
    data() {
      return {
        orders: this.initOrders,
        goodsInfoArr: []
      }
    },
    watch: {
      'initOrders': function(n, o) {
        let self = this
        self.orders = n
        if (self.orders.length > 0) {
//          self.showProList()
        }
      }
    },
    created() {
      this.showProList()
    },
    methods: {
      showProList() {
        let entryIds = []
        if(this.initOrders) {
          this.initOrders.forEach((item) => {
            entryIds = entryIds.concat(item.Item.Entries)
          })
          getEntries(entryIds).then((res) => {
            this.goodsInfoArr = res
          })
        }
      },
      showBigImg(item) {
        this.$emit('showBigImg', item)
      }
    }
  }
</script>
<style>
  .product-info{
    color: #565A5C;
  }
  .product-wrapper{
    color: #565A5C;
    margin-bottom: 5px;
  }
</style>
