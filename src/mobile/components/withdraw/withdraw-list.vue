<template>
  <div class="detail-wrap row">
    <div class="coupon-cont main-cont tab-content">
      <div class="panel panel-default coupon-panel">
        <div class="panel-heading"><a href="/income.html" class="with-link">我的收入&nbsp;</a>/&nbsp;提现记录</div>
        <div class="panel-body">
          <div class="panel-bd form-base calendar btnone">
            <span>提现列表</span>
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
                <th>提现日期</th>
                <th>提现账户</th>
                <th>金额</th>
                <th>状态</th>
              </tr>
              </thead>
              <tbody>
                <tr v-show="list.length&&!loading" v-for="item in list">
                  <td>{{item.Time}}</td>
                  <td>{{item.str}}</td>
                  <td><span :class="item.style">{{item.Money/100}}</span></td>
                  <td>{{item.status}}</td>
                </tr>
                <tr v-show="!list.length&&!loading">
                  <td colspan="4" class="text-center">暂无记录</td>
                </tr>
              </tbody>
            </table>
            <div class="weui-loadmore" v-show="loading">
              <div class="weui-loading"></div>
              <div class="weui-loadmore__tips">正在加载</div>
            </div>
          </div>

          <div class="row mt60">
            <div class="col-md-12">
              <p class="ptline">提现说明：</p>
              <ul class="pdn">
                <li>1、墙蛙网提现无需手续费。</li>
                <li>2、每月限定提现1次，每次最小提现金额为50元。</li>
                <li>3、提现金额无上限限制（超过800元，需按照国家规定予以缴纳20%个人所得税）。</li>
                <li>4、当月20日之前申请的提现，会由墙蛙专员在当月月底进行审核确认，20日之后申请的提现顺延至下月处理。</li>
                <li>5、通过审核后即提现至您绑定的账户，具体到账时间以各银行为准。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        beginDate: '2016-03-08',
        endDate: '',
        loading: false,
        list: []
      }
    },
    created() {
      this.getToday()
    },
    mounted() {
      $('#birth').cxCalendar()
      $('#birthto').cxCalendar()
      this.getList()
    },
    methods: {
      getList() {
        let self = this
        this.loading = true
        this.beginDate = document.getElementById('birth').value
        this.endDate = document.getElementById('birthto').value
        let params = {
          Begin: this.beginDate,
          End: this.endDate
        }
        const arr = ['', '待审核', '待打款', '审核未通过', '提现成功']
        const cls = ['', '', '', 'income-success', 'income-fail']
        request({url: 'tc/withdraw/list', params}).then(res => {
          if (!_.isEmpty(res.take('Data'))) {
            _.each(res.take('Data'), function(v) {
              v['Time'] = self.time(v['CreateTime'])
              v['status'] = arr[v['Status']]
              v['str'] = v['Bank'] + '&nbsp;&nbsp;&nbsp;' + v['Number']
              v['style'] = cls[v['Status']]
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
