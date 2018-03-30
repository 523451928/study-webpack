<!-- Copyright 2016 . All rights reserved. -->
<template>
  <div class="incomes-wrap">
    <div class="title clearfix">
      <div class="fir-col">可选型号</div>
      <div class="sec-col">收入</div>
      <div class="thir-col">比例
        <div class="qus-icon">
          <span class="wa wa-question-circle"></span>
          <div class="qus-tips-right">
            <span class="product-edit-arrow-out"></span>
            <span class="product-edit-arrow-inner"></span>
            产品售价=墙蛙底价+作者自定收入，您可以通过调整自定收入比例，进而改变产品售价。PS：一般来说，分成低的产品销量会比较高哦！
          </div>
        </div>
      </div>
    </div>
    <ul class="size-list">
      <li class="clearfix" v-for="income in childIncomes">
        <div class="income-status">
          <label>
            <input type="checkbox" v-model="income.status" @change="updateIncome(income)">
            {{getName(income)}}
          </label>
        </div>
        <div class="income-money">
          ￥ {{getPrice(income)}}
        </div>
        <div class="income-bonus">
          <input class="bonus-input form-control"  type="text" v-model.number="income.Bonus">
        </div>
      </li>
    </ul>
    <button @click="saveIncomes" type="button" class="btn btn-primary btn-block main-btn">
      保存修改
    </button>
  </div>
</template>

<script>
  import { proBomsCount as pbCount } from 'scripts/utils/custom/consts'
  export default {
    props: {
      incomes: {
        type: Array,
        required: true,
        default: []
      }
    },
    data() {
      return {
        childIncomes: this.incomes
      }
    },
    watch: {
      'incomes': function(n) {
        this.childIncomes = n
      }
    },
    methods: {
      getName(income) {
        let name
        if (income.hasOwnProperty('tpl')) {
          //  新品类
          name = income.tpl.Name
        } else if (income.hasOwnProperty('size')) {
          //  有框画
          name = income.size[0] / 10 + ' x ' + income.size[1] / 10 + 'cm'
        } else {
          //  布艺画 无卡画
          name = income.Packets[0] / 10 + ' x ' + income.Packets[1] / 10 + 'cm'
        }
        return name
      },
      getPrice(income) {
        let entry = income.Entries[0]
        let price = entry.Price
        let bonus = income.Bonus
        let inc
        inc = price * bonus / 10000
        return inc
      },
      updateIncome(income) {
        let incomes = this.childIncomes
        let len = _.filter(incomes, i => {
          return i.status
        }).length
        if (len > pbCount || len < 1) {
          income.status = !income.status
          layer.toast('最大设置' + pbCount + '个，最少设置1个')
        }
//        this.$emit('saveIncomes', this.incomes)
      },
      saveIncomes() {
        this.updatePrice()
        this.$emit('saveIncomes', this.childIncomes)
      },
      updatePrice() {
        let incomes = this.childIncomes
        let minIncMoney
        let maxIncMoney
        let minPrice
        let maxPrice
        let activeIncomes = _.filter(incomes, i => {
          return i.status
        })
        let priceObj = {}
        _.each(activeIncomes, (i, index) => {
          let thisE = i.Entries[0]
          let incMony = thisE.Price * i.Bonus / 100
          let price = thisE.Price + incMony
          if (index === 0) {
            minIncMoney = incMony
            maxIncMoney = incMony
            minPrice = price
            maxPrice = price
          } else {
            minIncMoney = incMony > minIncMoney ? minIncMoney : incMony
            maxIncMoney = incMony < maxIncMoney ? maxIncMoney : incMony
            minPrice = price > minPrice ? minPrice : price
            maxPrice = price < maxPrice ? maxPrice : price
          }
        })
        priceObj.minIncMoney = minIncMoney
        priceObj.maxIncMoney = maxIncMoney
        priceObj.minPrice = minPrice
        priceObj.maxPrice = maxPrice
        this.$emit('updatePrice', priceObj)
      }
    }
  }
</script>
