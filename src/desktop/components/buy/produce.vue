<template>
  <div>
    <!--<Loading v-show="showLoading"></Loading>-->
    <ul class="list-unstyled cart-table cart-table-list order-confirm">

      <li class="th-row">
        <span class="td-item goods-img">商品清单</span>
        <span class="td-item goods-info">产品信息</span>
        <span class="td-item goods-price">单价</span>
        <span class="td-item goods-num">数量</span>
        <span class="td-item goods-privilege">优惠/件</span>
        <span class="td-item goods-total-price">总价</span>
        <span class="td-item goods-ope">库存状态</span>
      </li>
      <li class="tr-row tr-row-all" v-for="(item,index) in initCarts">
        <div class="td-item goods-img">
          <viewer :entries="item.Entries" :pictures="item.Pictures" :length="150" ref="display" :isClick="false"></viewer>
        </div>
        <div class="td-item goods-info">
          <p>
            <div v-if="item['Work']">
              <a href="javascript:void(0)" target="_blank" class="order-pro-title underline-link" @click="worlUrl('work',item)">{{item['Work']['Title']}}</a>
            </div>
            <a href="javascript:void(0)" target="_blank" class="order-pro-title underline-link" v-else @click="worlUrl('custom',item)">{{item.Name}}</a>
          </p>
          <div  v-for="e in item.Properties">
            <span>{{e.Key}}&nbsp;</span>:&nbsp;<span>{{e.Value}}</span>
          </div>
        </div>
        <div class="td-item googds-price">￥{{item.Price}}</div>
        <div class="td-item goods-num">
          <div class="num-warp">
              <span class="input-item">
                {{item.Count}}
              </span>
          </div>
        </div>
        <div class="td-item goods-privilege">￥{{item.Money}}</div>
        <div class="td-item goods-total-price">￥{{(item.Money)*item.Count}}</div>
        <div class="td-item goods-ope">
          有货(48小时发货)
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  /* eslint-disable */
  import { InterfaceMap as Interf } from 'scripts/interfaceConst.js'
  // import { getEntries } from 'scripts/utils/entry'
  import { getEntries } from 'components/custom/display/entry'
  import Viewer from 'components/custom/display/viewer.vue'
  import { initItem } from 'components/cart/utils.js'
  import Loading from 'components/public/loading.vue'
  import { mixin as displayComponents } from 'components/public/display/app/components'
  export default {
    components: {
      Loading,
      ...displayComponents,
      Viewer
    },
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
    created() {
    },
    watch: {
      'initCarts': function(n, o) {
        let self = this
        self.carts = n
        if (self.carts.length > 0) {
          self.showProList()
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
            self.carts = initItem(carts, entriesDetail)
            self.entriesDetail = entriesDetail
            self.showLoading = false
          })
        }
      },
      worlUrl(action, item) {
        switch (action) {
          case 'work':
            let h = `${Interf.baseUrl}/work/${item['Work']['Id']}?CategoryId=${item['CategoryId']}`
            window.location.href = h
            break
          case 'custom':
            let hr = `${Interf.baseUrl}/custom.html#/category/${item['CategoryId']}`
            window.location.href = hr
            break
        }
      }
    }
  }
</script>
