<template>
  <div class="item-wrapper">
    <!--<Loading v-show="showLoading"></Loading>-->
    <div class="item-detailBox"  v-for="(item,index) in items">
      <div class="item-row img-item">
        <div class="td-item goods-img">
          <viewer @click.native="showImg(item)" :entries="item.Entries" :pictures="item.Pictures" :length="150" ref="display" :isClick="false"></viewer>
        </div>
      </div>
      <div class="item-row goods-info">
        <p v-if="item['Work']">
          {{item['Work']['Title']}}
        </p>
        <p v-else>
          {{item.EntriesDetail[0].Name}}
        </p>
        <span v-for="p in item.BomDetail">
          {{p.Key}}:{{p.Value}}; &nbsp;
        </span>
        <div class="order-money-info">
          <span class="money">￥{{item.Money/100}}</span>
          <span class="ori-m mr5">￥{{item.Price/100}}</span>
          <span class="c pull-right">x{{item.Count}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getEntries } from 'scripts/utils/entry'
  import { initItem } from 'components/cart/utils.js'
  import Loading from 'components/public/loading.vue'
  import Viewer from 'components/custom/display/viewer.vue'
  let mixinCom = _.assign({Loading, Viewer})
  export default {
    mixins: [{components: mixinCom}],
    props: {
      initOrders: {type: Array, defualt: []}
    },
    data() {
      return {
        orders: this.initOrders,
        items: [],
        noItem: false,
        showLoading: true,
        editStatus: false
      }
    },
    watch: {
      'initOrders'(n, o) {
        this.orders = n
        if (this.orders.length > 0) {
          this.showProList()
        }
      }
    },
    created() {
      this.showProList()
    },
    methods: {
      showImg(item) {
        this.$emit('showImg', item)
      },
      showProList() {
        let orders = this.orders
        let entriesIds = []
        if (orders.length === 0) {
          this.noItem = true
        } else {
          orders.forEach(v => {
            if (v.Item.Entries) {
              entriesIds = _.concat(entriesIds, v.Item.Entries)
            }
          })
          getEntries(entriesIds).then(entriesDetail => {
            this.items = initItem(orders, entriesDetail, 'Item')
            this.showLoading = false
          })
        }
      }
    }
  }
</script>
