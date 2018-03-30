<template>
  <div>
    <!--<Loading v-show="showLoading"></Loading>-->
    <div class="item-detailBox"  v-for="(item,index) in items">
      <div class="item-row img-item">
        <div class="td-item goods-img">
          <viewer :entries="item.Entries" :pictures="item.Pictures" :length="150" ref="display" :isClick="false"></viewer>
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
          {{p.Key}}: {{p.Value}};
        </span>
        <div class="order-money-info">
          <!--<span>￥{{item.PayMoney/100/item.Count}}</span>-->
          <span class="money">￥{{item.Money/100}}</span>
          <span class="ori-m mr5">￥{{item.Price/100}}</span>
          <span class="c fr">x{{item.Count}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import { getEntries } from 'components/custom/display/entry'
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
      'initOrders': function(n, o) {
        let self = this
        self.orders = n
        if (self.orders.length > 0) {
          self.showProList()
        }
      }
    },
    created() {
      this.showProList()
    },
    methods: {
      showBig(item) {
        this.$emit('showBig', item)
      },
      showProList() {
        let self = this
        let orders = self.orders
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
            self.items = initItem(orders, entriesDetail, 'Item')
            self.showLoading = false
          })
        }
      }
    }
  }
</script>
