<template>
  <div class="main-cont tab-content col-md-10" id="invoice-setting">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">发票信息</div>
        <div class="panel-body">
          <div class="invoice-box">
            <ul id="invoice-type-wrap" class="invoice-type-wrap">
              <li class="active">
                <a href="javascript:void(0)" >
                  普通发票
                  <i class="ww-icon small-ok active-ok"></i>
                </a>
              </li>
              <li class="dn">
                <a href="javascript:void(0)">
                  增值税发票
                  <i class="ww-icon small-ok active-ok"></i>
                </a>
              </li>
            </ul>
            <div id="invoice-content" class="invoice-content">
              <div class="invoice-pane" id="normal-invoice">
                <ul class="list-unstyled">
                  <li class="clearfix" v-for="(item,index) in obj">
                    <div class="fl info lh34">普通发票(纸质)</div>
                    <div class="fl info inv-tit" :class="index==liIndex?'stat-update':''">
                      <span class="words">{{item.Title}}</span>
                      <div class="inv-tit-update input-control">
                        <input type="text" :value="item.Title" v-model="Intitle"/>
                        <a href="javascript:void(0)" class="save" v-on:click="editor(item,index)">保存</a>
                        <a href="javascript:void(0)" class="cancel" v-on:click="cancel(index)">取消</a>
                      </div>
                    </div>
                    <div class="fl info ope">
                      <a href="javascript:void(0)" v-on:click="e(item,index)">编辑</a>
                      <a href="javascript:void(0)" v-on:click="deleInv(item,index)">删除</a>
                    </div>
                  </li>
                  <a href="javascript:void(0)" v-on:click="showBox">+新增普通发票</a>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="add-normal-modal" v-show="seen">
      <div class="modal-backdrop fade in"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" v-on:click="closeBox">×</span></button>
            <h4 class="modal-title">新增普通发票</h4>
          </div>
          <div class="modal-body">
            <div class="inv-cont tab-content">
              <form class="normal-invoice-form form-base" id="normal-form" action="tc/invoice/add">
                <div class="form-group">
                  <label><span class="required-icon">*</span>发票抬头: </label>
                  <div class="form-cont">
                    <input type="text" v-model="title" class="form-control validate[required]"  value="" id="normal-vat-name" placeholder="新增普通发票抬头">
                  </div>
                </div>
                <div class="form-group clearfix p50">
                  <label>&nbsp;</label>
                  <div class="pull-left">
                    <button type="button" id="sav-normal-vat" class="btn btn-primary" v-on:click="submit">保存</button>
                  </div>
                </div>
              </form>
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
      seen: false,
      inputShow: false,
      words: true,
      title: '',
      obj: [],
      liIndex: -1,
      Intitle: '',
      editIndex: 0
    }
  },
  methods: {
    showBox() {
      if (this.seen === false) {
        this.seen = true
      } else {
        this.seen = false
      }
    },
    closeBox() {
      if (this.seen === true) {
        this.seen = false
      }
    },
    submit() {
      let params = { Title: this.title }
      request.submit('tc/invoice/add', params).then(
        res => {
          let params1 = {Title: this.title, Id: res.take('Data')['Id']}
          this.obj.push(params1)
          this.seen = false
          layer.toast('添加成功')
        }, res => {
        res.hide()
        layer.toast('添加成功')
      })
    },
    deleInv(item, index) {
      request.submit('tc/invoice/remove/' + item.Id, {}).then(
        res => {
          this.obj.splice(index, 1)
        }, res => {
        res.hide()
        layer.toast('删除失败')
      })
    },
    e(item, index) {
      this.liIndex = index
      this.Intitle = item.Title
      this.editIndex = index
    },
    editor(item, index) {
      let params = { Title: this.Intitle, Id: item.Id }
      request.submit('tc/invoice/edit/' + item.Id, params).then(
        res => {
          this.obj.splice(this.editIndex, 1, params)
          this.liIndex = -2
          layer.toast('修改成功')
        }, res => {
        layer.toast('修改失败')
      })
    },
    cancel(index) {
      this.liIndex = -2
    }
  },
  mounted() {
    let form = $('#normal-form')
    let self = this
    request({url: 'tc/invoice/'}).then(res => {
      self.obj = res.take('Data')
    })
    form.validationEngine('attach', {
      scroll: false,
      binded: true,
      maxErrorsPerField: 1,
      promptPosition: 'centerRight',
      custom_error_messages: {
        '#normal-vat-name': {
          'required': {
            'message': '发票抬头不能为空'
          }
        }
      },
      onValidationComplete: function(form, valid) {
        if (valid) {
          self.seen = false
        }
      }
    })
  }
}
</script>

