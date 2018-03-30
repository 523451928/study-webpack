<template>
  <div class="detail-wrap row">
    <div class="coupon-cont main-cont tab-content">
      <div class="panel panel-default coupon-panel">
        <div class="panel-heading">我的收入</div>
        <div class="panel-body min">
          <div class="panel-hd mb20 mt15">
            已核实收入<strong class="color-d1 u-balance">{{incomeAll.FinishIncome/100 || 0}}</strong>元，<span v-if="able" class="withdraw-now">可提现收入<strong class="color-d1 u-wait">{{incomeAll.Available/100 || 0}}</strong>元。
                                    <a class="btn btn-primary btn-lg income-btn" href="/withdraw.html" id="isWithdraw">立即提现</a>
                                </span>
            <span class="withdraw-list" v-if="!able"><strong class="color-d1 u-now">{{incomeAll.UnFinishWithdraw/100 || 0}}</strong>元正在提现中。<a class="btn btn-default btn-lg income-btn withdraw-list" href="/withdrawlist.html">提现列表</a></span>
            <a href="../faq.html" target="_blank" class="pull-right">常见问题</a>
          </div>
          <div class="panel-bd form-base calendar mt30">
            <span>收入变更详情</span>
            <div class="pull-right corr-form">
              <div class="form-cont">
                <input type="text" class="form-control" id="birth" v-model="beginDate">
              </div>
              <div class="form-cont">
                <input type="text" class="form-control" id="birthto" v-model="endDate">
              </div>
              <a class="btn btn-default search" @click="getList" href="javascript:;">搜索</a>
            </div>
          </div>
          <div class="table-responsive money">
            <table class="table table-hover table-bordered">
              <thead>
              <tr>
                <th>日期</th>
                <th>商品</th>
                <th>数量</th>
                <th>分成</th>
                <th>状态</th>
              </tr>
              </thead>
              <tbody>
              <tr v-show="list.length&&!loading" v-for="item in list">
                <td>{{item.Time}}</td>
                <td>{{item.Title}}</td>
                <td>{{item.Count}}</td>
                <td><span :class="item.str">{{item.Reward/100}}</span></td>
                <td>{{item.status}}</td>
              </tr>
              <tr v-show="!list.length&&!loading">
                <td colspan="5" class="text-center">暂无记录</td>
              </tr>
              </tbody>
            </table>
            <div class="weui-loadmore" v-show="loading">
              <div class="weui-loading"></div>
              <div class="weui-loadmore__tips">正在加载</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { InterfaceMap as interf } from 'scripts/interfaceConst'
  export default {
    data() {
      return {
        incomeAll: {},
        beginDate: '2016-03-08',
        endDate: '',
        list: [],
        loading: false,
        able: false
      }
    },
    created() {
      this.getToday()
    },
    mounted() {
      this.isAvailable()
      this.pull()
      $('#birth').cxCalendar()
      $('#birthto').cxCalendar()
    },
    methods: {
      isAvailable() {
        let self = this
        request({url: interf.getAvailable}).then(res => {
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
        request({url: interf.getBalance}).then(res => {
          this.incomeAll = res.take('Data')
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      getList() {
        let self = this
        this.loading = true
        this.beginDate = document.getElementById('birth').value
        this.endDate = document.getElementById('birthto').value
        let params = {
          Begin: this.beginDate,
          End: this.endDate
        }
        const arr = ['处理中', '完成交易', '交易失败']
        const cls = ['', 'income-success', 'income-fail']
        request({url: 'tc/withdraw/income/list', params}).then(res => {
          if (!_.isEmpty(res.take('Data'))) {
            _.each(res.take('Data'), function(v) {
              v['Time'] = self.time(v['CreateTime'])
              v['status'] = arr[v['Status']]
              v['str'] = cls[v['Status']]
            })
            this.list = res.take('Data')
          }
          this.loading = false
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
          this.loading = false
        })
      },
      getToday() {
        const date = new Date()
        let calenyear = date.getFullYear()
        let calenmonth = date.getMonth() + 1
        let calenday = date.getDate()
        calenmonth = calenmonth > 9 ? calenmonth : ('0' + calenmonth)
        calenday = calenday > 9 ? calenday : ('0' + calenday)
        this.endDate = calenyear + '-' + calenmonth + '-' + calenday
      },
      time(t) {
        const time = new Date(t)
        return time.getFullYear() + '-' + this.two(time.getMonth() + 1) + '-' + this.two(time.getDate()) + '&nbsp;&nbsp;&nbsp;' + this.two(time.getHours()) + ':' + this.two(time.getMinutes()) + ':' + this.two(time.getSeconds())
      },
      two(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
    }
  }
</script>
<style>
  .calendar{
    padding: 25px 0 30px;
    border-top: 1px solid #dce0e0;
  }
  .income-btn{
    padding: 6px 28px;
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
