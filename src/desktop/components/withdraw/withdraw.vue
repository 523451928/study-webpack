<template>
  <div>
    <div class="detail-wrap row">
      <div class="coupon-cont main-cont tab-content">
        <div class="panel panel-default coupon-panel">
          <div class="panel-heading"><a href="/income.html" class="with-link">我的收入&nbsp;</a>/&nbsp;提现</div>
          <div class="panel-body">
            <div class="panel-hd clearfix mb20">
              <a href="/withdrawlist.html" class="pull-right"><span class="circle"></span>提现记录</a>
            </div>
            <div class="panel-bd row form-base">
              <div class="col-md-6">
                <div class="lh30 mb10">可提现额度<strong class="color-d1 available">{{incomeAll.Available/100||0}}</strong>元
                  <span class="withdraw-list">,<strong class="color-d1 u-now">{{incomeAll.UnFinishWithdraw/100 || 0}}</strong>元正在提现中。</span>
                </div>
                <div class="form-cont">
                  <span>提现金额：</span>
                  <input type="text" class="form-control" id="withdraw-input" v-model="withdrawinput" value="" placeholder="最小提现金额50元" style="display: inline-block;">
                  <a class="btn btn-primary btn-lg income-btn" @click="withdraw" href="javascript:;" :class="{disabled:able}">提现</a>
                </div>
              </div>
              <div class="col-md-6 plline">
                <div class="inwrap">
                  <p class="accBind">选择提现账户：</p>
                  <button :class="{on:index==checkNum}" @click="check(item['Id'], index)" class="btn btn-default btn-block" v-for="(item, index) in bankList">
                    <span class="wa wa-credit-card pull-left"></span>
                    <span>{{item['Number']}}</span>
                    <span class="wa wa-circle pull-right"></span>
                  </button>
                  <button @click.stop="isActive=true" class="btn btn-default btn-block addAccount"><span class="wa wa-plus-o"></span>绑定新账户</button>
                </div>
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
    <div class="modal" :style="{display: isActive?'block':'none'}">
      <div class="modal-backdrop" @click.stop="isActive=false" :class="{in:isActive}"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" @click.stop="isActive=false" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">提现账户</h4>
          </div>
          <div class="modal-body">
            <div class="form form-horizontal form-base" id="withdraw-from">
              <div class="form-group">
                <label for="ship-name">账户类型：</label>
                <div class="form-cont account">
                  <button class="btn btn-default active"><span class="wa wa-check-tri"></span>银行账户</button>
                </div>
              </div>
              <div class="btn-div">
                <form class="bank active" id="bankform">
                  <div class="form-group">
                    <label for="account-name">开户名：</label>
                    <div class="form-cont">
                      <input class="form-control width346 validate[required]" v-model="name" type="text" maxlength="40" id="account-name">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>开户行：</label>
                    <div class="form-cont form-inline">
                      <select class="form-control" id="banks" v-model="bank">
                        <option value="中国工商银行">中国工商银行</option>
                        <option value="中国农业银行">中国农业银行</option>
                        <option value="中国建设银行">中国建设银行</option>
                        <option value="中国银行">中国银行</option>
                        <option value="招商银行">招商银行</option>
                        <option value="中国邮政储蓄银行">中国邮政储蓄银行</option>
                        <option value="中国民生银行">中国民生银行</option>
                        <option value="中国光大银行">中国光大银行</option>
                        <option value="中信银行">中信银行</option>
                        <option value="交通银行">交通银行</option>
                        <option value="兴业银行">兴业银行</option>
                        <option value="上海浦东发展银行">上海浦东发展银行</option>
                        <option value="中国人民银行">中国人民银行</option>
                        <option value="华夏银行">华夏银行</option>
                        <option value="深圳发展银行">深圳发展银行</option>
                        <option value="广东发展银行">广东发展银行</option>
                        <option value="国家开发银行">国家开发银行</option>
                        <option value="中国进出口银行">中国进出口银行</option>
                        <option value="中国农业发展银行">中国农业发展银行</option>
                      </select>
                      <input class="form-control validate[required,custom[chinese]]" type="text" v-model="branch" maxlength="40" id="bank-name" placeholder="支行名称" >
                    </div>
                    <div>
                      <label></label>
                      <div class="form-cont">
                        <span>注：支行名称请务必填写准确，否则收入无法提现</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="bank-mb">账号：</label>
                    <div class="form-cont">
                      <input class="form-control width346 validate[required,custom[number],minSize[16]]" type="text" v-model="number" id="bank-mb" maxlength="40">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>&nbsp;</label>
                    <div class="form-cont">
                      <button id="addBankBtn" class="btn btn-primary">保存账户</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .modal{
    display: none;
  }
</style>
<script>
  import { Errors } from './const'
  export default {
    data() {
      return {
        incomeAll: {},
        beginDate: '2016-03-08',
        endDate: '',
        list: [],
        bankList: [],
        accountId: '',
        withdrawinput: '',
        checkNum: 0,
        isActive: false,
        able: false,
        name: '',
        bank: '中国工商银行',
        branch: '',
        number: ''
      }
    },
    mounted() {
      let self = this
      let $bankform = $('#bankform')
      this.isAvailable()
      this.pull()
      this.getBankList()
      $bankform.validationEngine('attach', {
        scroll: false,
        showOneMessage: true,
        binded: false,
        maxErrorsPerField: 1,
        promptPosition: 'centerRight',
        custom_error_messages: {
          '#account-name': {
            'required': {
              'message': '开户名不能为空'
            }
          },
          '#bank-name': {
            'required': {
              'message': '支行名称不能为空'
            }
          },
          '#bank-mb': {
            'required': {
              'message': '账号不能为空'
            }
          }
        },
        onValidationComplete: function(form, valid) {
          if (valid) {
            self.addAccount()
          }
        }
      })
    },
    methods: {
      addAccount() {
        let self = this
        let params = {
          Type: 2,
          Name: this.name,
          Bank: this.bank,
          Branch: this.branch,
          Number: this.number
        }
        request.submit('tc/bank/account/add', params).then(res => {
          self.isActive = false
          self.getBankList()
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
          self.isActive = false
        })
      },
      check(item, index) {
        this.accountId = item
        this.checkNum = index
      },
      withdraw() {
        var reg = /\d+/
        var val = this.withdrawinput
        if (val === '') {
          layer.toast('金额不能为空')
          return
        } else if (!reg.test(val)) {
          layer.toast('请输入数字')
          this.withdrawinput = ''
          return
        } else if (this.incomeAll['Available'] < 5000) {
          layer.toast('可提现金额小于50元')
          return
        } else if (val < 50) {
          layer.toast('提现金额不能小于50元')
          return
        } else if (val > (this.incomeAll['Available'] / 100)) {
          layer.toast('输入金额大于可提现金额')
          this.withdrawinput = ''
          return
        } else {
          this.add(val)
        }
      },
      add(val) {
        let self = this
        if (this.accountId === '') {
          layer.toast('请先绑定账户')
          return
        }
        let params = {
          Money: val,
          AccountId: this.accountId
        }
        request.submit('tc/withdraw/add', params).then(res => {
          let data = res.take('Data')
          self.incomeAll.Available = data['RemainMoney']
          self.incomeAll.UnFinishWithdraw = self.incomeAll.UnFinishWithdraw + data['Money']
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      pull() {
        request({url: 'tc/withdraw/income'}).then(res => {
          this.incomeAll = res.take('Data')
          if (this.incomeAll.Available < 5000) {
            this.able = true
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      isAvailable() {
        let self = this
        request({url: 'tc/withdraw/available'}).then(res => {
          const data = res.take('Data')
          if (!data['Ok']) {
            self.able = true
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      getBankList() {
        let self = this
        request({url: 'tc/bank/account/list'}).then(res => {
          if (!_.isEmpty(res.take('Data'))) {
            let data = res.take('Data')
            self.accountId = data[0]['Id']
            self.bankList = data
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
