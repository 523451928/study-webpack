<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">提现账户</div>
        <div class="panel-body">
          <ul id="withdraw-list" class="list-unstyled user-addr-list">
            <li class="addr" :class="{default:item['Id']==accountId}" v-for="(item, index) in bankList">
              <div class="detail">
                <span>{{item['Name']}}</span>
                <span>{{item['Bank']}}</span>
                <span>{{item['Branch']}}</span>
                <span>{{item['Number']}}</span>
                <div class="pull-right">
                  <span class="default-addr">默认账户</span>
                  <span class="active-icon"><i class="ww-icon small-ok active-ok"></i></span>
                </div>
              </div>
              <div class="btn-wrap">
                <a href="javascript:;" @click.stop="delAccount(item['Id'], index)" class="remove">删除</a>
                <a href="javascript:;" @click.stop="setAccount(item['Id'])" class="default">设为默认账户</a>
              </div>
            </li>
          </ul>
          <a href="javascript:;" @click.stop="isActive=true" id="add-withdraw">+新增提现账户</a>
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
<script>
  import { Errors } from './const'
  export default {
    data() {
      return {
        bankList: [],
        isActive: false,
        name: '',
        bank: '中国工商银行',
        branch: '',
        number: '',
        accountId: ''
      }
    },
    mounted() {
      let self = this
      let $bankform = $('#bankform')
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
      delAccount(id, index) {
        let self = this
        layer.open({
          content: '确认删除这个账号吗',
          btn: ['确认', '取消'],
          yes: function() {
            request({url: 'tc/bank/account/remove/' + id}).then(res => {
              self.bankList.splice(index, 1)
              layer.toast('删除成功')
            }, res => {
              res.hide()
              layer.toast(Errors(res.take('Error')))
            })
          }
        })
      },
      setAccount(id) {
        let params = {}
        request.submit('tc/bank/account/set/' + id, params).then(res => {
          this.accountId = id
          layer.toast('设置成功')
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
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
