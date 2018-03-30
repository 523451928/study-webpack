<template>
  <div>
    <!--发票开始-->
    <div class="detail-item invoice-item">
      <div class="tit">
        <h3>发票信息</h3>
      </div>
      <div class="invoice-cont clearfix" id="part-inv">
        <span class="fl" v-show="!invoiceDetail">不开发票</span>
        <a href="javascript:void(0)" @click="contact">联系客服开发票</a>
        <!--<div class="fl" v-show="invoiceDetail">-->
          <!--<span>普通发票(纸质)</span>-->
          <!--<span>{{invoiceIncreTitle}}</span>-->
          <!--<span>明细</span>-->
        <!--</div>-->
         <!--<a href="javascript:void(0)" class="invoice-edit fl" @click="invoiceFormShow">修改</a>-->
      </div>
    </div>
    <!--发票结束-->
    <!--发票表单开始-->
    <transition name="scale">
      <form class="modal fade invoice-modal in" id="invoice-form" v-show="invoiceForm" action="tc/invoice/add">
        <div class="modal-backdrop fade in"></div>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close">
                <span @click="closeInvoice">×</span>
              </button>
              <h4 class="modal-title">发票信息</h4>
            </div>
            <div class="modal-body">
              <ul class="list-unstyled inv-type-wrap">
                <li class="active">
                  <a href="javascript:void(0)">
                    普通发票
                    <i class="ww-icon small-ok activeOk"></i>
                  </a>
                </li>
              </ul>
              <div class="inv-cont tab-content" >
                <div id="normal-inv" class="tab-pane fade in">
                  <div class="form form-base">
                    <div class="form-group" >
                      <label>发票主体:</label>
                      <div class="form-cont">
                        <a href="javascript:void(0)" class="btn btn-default inv-body" v-for="(item,index) in invoiceType" :class="{active: active===index}" @click="tab(item,index)">
                          <span>{{item.name}}</span>
                          <i class="ww-icon small-ok" :class="{activeOk: active===index}"></i>
                        </a>
                      </div>
                    </div>
                    <div class="form-group" v-show="isDeatilInv">
                      <label>发票抬头:</label>
                      <div class="form-cont">
                        <div class="inv-tit-list" id="ulWarp">
                          <div class="tit-item clearfix " v-for="(item,index) in invioceObj" :class="item['Id']==curInvoiceIndex?'selected':''" @click="liCur(item, index)" >
                            <div class="fl info inv-tit" :class="index==invoiceIndex?'stat-update':''">
                              <span class="words">{{item.Title}}</span>
                              <div class="inv-tit-update input-control fr">
                                <input type="text" :value="item.Title" v-model="Invoicetitle"/>
                                <a href="javascript:void(0)" class="invoiceSave" @click="invoiceSave(item,index)">保存</a>
                                <a href="javascript:void(0)" class="invoiceCancel" @click="invoiceCancel(index)">取消</a>
                              </div>
                            </div>
                            <div class="fr">
                              <a href="javascript:void(0)" class="invEditor" v-on:click="invoiceE(item,index)">编辑</a>
                              <a href="javascript:void(0)" class="invCancel" v-on:click="invoiceDeleInv(item,index)">删除</a>
                            </div>
                          </div>
                          <div class="tit-item clearfix selected" v-show="incrInvoice">
                            <input type="text" v-model="invoiceTitle" class="fl" placeholder="新增抬头发票"/>
                            <a href="javascript:void(0)" class="fr" @click="submitInvoice">保存</a>
                          </div>
                        </div>
                        <a href="javascript:void(0)" class="add-link" @click="addInvoice">新增单位发票</a>
                      </div>
                    </div>
                    <div class="form-group">
                      <label>&nbsp;</label>
                      <div class="form-cont">
                        <button type="button" class="btn btn-primary save-btn" @click="saveInvoice">保存发票信息</button>
                        <button type="button" class="btn btn-default cancel-btn" @click="closeInvoice">取消</button>
                        <a href="/faq.html#bill" target="_blank" class="">发票信息相关问题>></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </transition>
    <!--发票表单结束-->
  </div>
</template>
<script>
  /* eslint-disable */
  import {mixin} from '../contactMixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        invoiceForm: false,
        incrInvoice: false,
        invoiceDetail: false,
        isDeatilInv: false,
        invioceObj: [],
        Invoicetitle: '',
        invoiceTitle: '',
        invoiceIncreTitle: '',
        curInvoiceIndex: -1,
        invoiceIndex: -1,
        invoiceEditIndex: 0,
        id: 0,
        active: 1,
        invoiceType: [
          {name: '明细', type: 1, isActive: false},
          {name: '不开发票', type: 0, isActive: true}
        ]
      }
    },
    methods: {
      invoiceFormShow() {
        let self = this
        if (this.invoiceForm === false) {
          this.invoiceForm = true
        } else {
          this.invoiceForm = false
        }
        request({url: 'tc/invoice/'}).then(res => {
          self.invioceObj = res.take('Data')
        })
      },
      closeInvoice() {
        if (this.invoiceForm === true) {
          this.invoiceForm = false
        }
      },
      submitInvoice() {
        let self = this
        let params = { Title: this.invoiceTitle }
        request.submit('tc/invoice/add', params).then(
          res => {
            let params1 = {Title: this.invoiceTitle, Id: res.take('Data')['Id']}
            self.invioceObj.push(params1)
            this.incrInvoice = false
          }, res => {
          res.hide()
        })
      },
      invoiceE(item, index) {
        this.invoiceIndex = index
        this.Invoicetitle = item.Title
        this.invoiceEditIndex = index
      },
      invoiceSave(item, index) {
        let params = { Title: this.Invoicetitle, Id: item.Id }
        request.submit('tc/invoice/edit/' + item.Id, params).then(
          res => {
            this.invioceObj.splice(this.invoiceEditIndex, 1, params)
            this.invoiceIndex = -2
            layer.toast('修改成功')
          }, res => {
          layer.toast('修改失败')
        })
      },
      saveInvoice() {
        if (this.active === 0) {
          this.invoiceDetail = true
          this.invoiceForm = false
          if (this.curInvoiceIndex !== -1) {
            this.$emit('updateInvoiceId', this.curInvoiceIndex)
          } else {
            layer.toast('请选择发票抬头')
            this.invoiceDetail = false
            return
          }
        } else if (this.active === 1) {
          this.invoiceDetail = false
          this.invoiceForm = false
        }
      },
      invoiceDeleInv(item, index) {
        request.submit('tc/invoice/remove/' + item.Id, {}).then(
          res => {
            this.invioceObj.splice(index, 1)
          }, res => {
          res.hide()
          layer.toast('删除失败')
        })
      },
      addInvoice() {
        this.invoiceTitle = ''
        let warp = document.getElementById('ulWarp')
        if (this.incrInvoice === false) {
          this.incrInvoice = true
          setTimeout(function() {
            warp.scrollTop = warp.scrollHeight + 40
          }, 30)
        } else {
          this.incrInvoice = false
        }
      },
      liCur(item, index) {
        this.curInvoiceIndex = item['Id']
        this.invoiceIncreTitle = item.Title
      },
      tab(item, index) {
        let invoiceType = item.type
        item.isActive = true
        this.active = index
        if (item.type === 1) {
          this.isDeatilInv = true
        } else {
          this.isDeatilInv = false
        }
        this.$emit('updateInvoiceType', invoiceType)
      },
      invoiceCancel(index) {
        this.invoiceIndex = -2
      }
    }
  }
</script>

