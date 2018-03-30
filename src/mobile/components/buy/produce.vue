<template>
  <div>
    <!--<Loading v-show="showLoading"></Loading>-->
    <ul class="list-unstyled cart-table order-cart-table">
      <li class="tr-row tr-row-all" v-for="(item,index) in carts">
        <div class="td-item goods-img">
          <viewer v-if="item.Entries" :entries="item.Entries" :pictures="item.Pictures" :length="120" ref="display" :isClick="false"></viewer>
        </div>
        <div class="td-item goods-info" v-for="e in item.EntriesDetail">
          <p>
            <a href="javascript:void (0);" class="order-pro-title underline-link">{{e.Name}}</a>
          </p>
          <span v-for="p in item.BomDetail">
            {{p.Key}}&nbsp;:{{p.Value}};
          </span>
          <div class="clearfix">
            <span class="goods-info-num fr">x{{item.Count}}</span>
            <span class="goods-money-num fl">￥{{item.Money/100}}</span>
            <span class="goods-price-num fl">￥{{item.Price/100}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import { getEntries } from 'components/custom/display/entry'
  import { initOrderItem } from 'components/cart/utils.js'
  import Loading from 'components/public/loading.vue'
  import Viewer from 'components/custom/display/viewer.vue'
  let mixinCom = _.assign({Loading, Viewer})
  export default {
    mixins: [{components: mixinCom}],
    data() {
      return {
        carts: [],
        noItem: false,
        showLoading: true,
        editStatus: false
      }
    },
    props: {
      initCarts: {type: Array, defualt: []}
    },
    watch: {
      'initCarts': function(n, o) {
        this.carts = n
        if (this.carts.length > 0) {
          this.showProList()
        }
      }
    },
    methods: {
      showProList() {
        let self = this
        let carts = self.carts
        let entriesIds = []
        if (carts.length === 0) {
          this.noItem = true
        } else {
          carts.forEach(v => {
            if (v.Item.Entries) {
              entriesIds = _.concat(entriesIds, v.Item.Entries)
            }
          })
          getEntries(entriesIds).then(entriesDetail => {
            self.carts = initOrderItem(carts, entriesDetail)
            self.$emit('cartData', self.carts)
            self.entriesDetail = entriesDetail
            self.showLoading = false
          })
        }
      }
    }
  }
</script>
