<template>
  <div class="detail-wrap container">
    <div class="coupon-cont main-cont tab-content">
      <div class="panel panel-default coupon-panel">
        <div class="panel-body min">
          <div class="panel-hd mb20 mt15">
            已核实收入<strong class="color-d1 u-balance">{{incomeAll.FinishIncome/100 || 0}}</strong>元，<span v-if="able" class="withdraw-now">可提现收入<strong class="color-d1 u-wait">{{incomeAll.Available/100 || 0}}</strong>元。
                                </span>
          </div>
          <div class="none-withdraw text-center">
            <span>: ) 手机端暂不支持提现，请到电脑端完成操作</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  export default {
    data() {
      return {
        incomeAll: {},
        able: false
      }
    },
    mounted() {
      this.isAvailable()
      this.pull()
    },
    methods: {
      isAvailable() {
        let self = this
        request({url: Interf.getAvailable}).then(res => {
          const data = res.take('Data')
          if (data['Ok']) {
            self.able = true
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pull() {
        request({url: Interf.getBalance}).then(res => {
          this.incomeAll = res.take('Data')
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
<style>
  .none-withdraw {
    height: 30px;
    line-height: 26px;
    font-size: 12px;
    color: #82888a;
    border: 1px solid #c4c4c4;
    border-radius: 4px;
  }
  .coupon-panel .table thead {
    background-color: #EDEFED;
  }
  .coupon-panel .table td,
  .coupon-panel .table th {
    text-align: center;
  }
  .coupon-panel .table thead th {
    border: 0 none;
    color: #565a5c;
    font-weight: 500;
  }
  strong.color-d1 {
    font-size: 20px;
  }
</style>
