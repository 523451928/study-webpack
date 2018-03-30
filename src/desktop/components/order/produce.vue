<template>
  <div>
    <!--<Loading v-show="showLoading"></Loading>-->
    <div class="item-detailBox"  v-for="(item,index) in initOrders">
      <div class="item-row img-item">
        <div class="td-item goods-img" @click="showBigImg(item.Item)">
          <viewer :entries="item.Item.Entries" :pictures="item.Item.Pictures" :length="150" ref="display" :isClick="true" ></viewer>
        </div>
      </div>
      <div class="item-row goods-info">
        <p>
          <span class="product-name">回复都是来看回复都是来看回复都是来看回复都是来看</span>
          <span class="mr10 fr">x{{item.Count}}</span>
          <span class="mr40 fr">￥{{item.PayMoney/100}}</span>
        </p>
        <p v-if="goodsInfoArr[index]">
          {{goodsInfoArr[index]['Name']}}
        </p>
      </div>
      <div class="item-row order-money-info">
        <!--<span class="ori-m mr5">￥{{item.Money/100}}</span>-->
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import { getEntries } from 'components/custom/display/entry'
  import Loading from 'components/public/loading.vue'
  import Viewer from 'components/custom/display/viewer.vue'
  export default {
    props: {
      initOrders: {type: Array, defualt: []}
    },
    components: {
      Loading,
      Viewer
    },
    data() {
      return {
        orders: this.initOrders,
        goodsInfoArr: [],
        noItem: false,
        showLoading: true,
        editStatus: false
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
        this.initOrders.forEach((item) => {
          entryIds = entryIds.concat(item.Item.Entries)
        })
        getEntries(entryIds).then((res) => {
          console.log(res)
          this.goodsInfoArr = res
        })
      },
      showBigImg(item) {
        this.$emit('showBigImg', item)
      }
    }
  }
</script>
