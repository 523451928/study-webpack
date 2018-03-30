<template>
  <div class="main-cont tab-content col-md-10" id="address-setting">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">收货地址</div>
        <div class="panel-body">
          <ul id="address-list" class="list-unstyled user-addr-list">
            <li v-for="(item,index) in obj" class="li-btn clearfix" >
              <div class="fl">
                <span>{{item.Name}}</span>
                <span v-text="x(item.Place[0])"></span>
                <span v-text="y(item.Place[1])"></span>
                <span v-text="z(item.Place[2])"></span>
                <span>{{item.Detail}}</span>
                <span>{{item.Postcode}}</span>
                <span>{{item.Mobile}}</span>
                <span>{{item.Tel}}</span>
                <div class="fr default-addr" v-show="item.Default">默认地址</div>
              </div>
              <div class="fr dn li-active">
                <a href="javascript:void(0)" v-on:click="e(item,index)">编辑</a>
                <a href="javascript:void(0)" v-on:click="deleAddr(item,index)">删除</a>
                <a href="javascript:void(0)" v-show="!item['Default']" v-on:click="defaultAddr(item)">设为默认地址</a>
              </div>
            </li>
          </ul>
          <a href="javascript:void(0)" id="add-btn" v-on:click="formBox">+新增收货地址</a>
        </div>
      </div>
    </div>
    <div class="modal" id="address-from-wrap" v-show="seen">
      <div class="modal-backdrop fade in"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="closeFormBox"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">收货地址</h4>
          </div>
          <div class="modal-body">
            <form class="form form-horizontal form-base" method="post" action="tc/address/add" id="address-from">
              <input type="hidden" name="id" id="addrId"/>
              <div class="form-group">
                <label for="ship-name"><strong>*</strong> 收货人：</label>
                <div class="form-cont">
                  <input v-model="name" class="form-control validate[required]" type="text" maxlength="40" id="ship-name" name="Name" >
                </div>
              </div>
              <div class="form-group place-group">
                <label><strong>*</strong>收货地址：</label>
                <div class="form-cont">
                  <select class="form-control" v-model='homeProvince' id="province" data-type="province">
                      <option :value="item['Id']" v-for="item in address">
                        {{ item['Name'] }}
                      </option>
                  </select>
                  <select class="form-control" v-model='homeCity' id="city" data-type="city">
                    <option :value="item['Id']" v-for="item in son">{{item['Name']}}</option>
                  </select>
                  <select class="form-control" v-model='Hometown' id="district" data-type="district">
                    <option :value="item['Id']" v-for="item in grandson">{{item['Name']}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="ship-address"><strong>*</strong> 详细地址：</label>
                <div class="form-cont">
                  <input v-model="detail" class="form-control validate[required]" type="text" maxlength="120" id="ship-address" name="Detail">
                </div>
              </div>
              <div class="form-group">
                <label for="ship-zip"><strong>*</strong>邮政编码：</label>
                <div class="form-cont">
                  <input v-model="postCode" class="form-control" type="text" id="ship-zip" name="Postcode">
                </div>
              </div>
              <div class="form-group">
                <label for="ship-mb"><strong>*</strong>联系方式：</label>
                <div class="form-cont">
                  <input v-model="mobile" class="form-control validate[groupRequired[phone],custom[mobile]]" type="text" placeholder="请输入手机号" id="ship-mb" maxlength="20" name="mobile">
                </div>
              </div>
              <div class="form-group">
                <label for="ship-phone">&nbsp;</label>
                <div class="form-cont">
                  <input v-model="phone" class="form-control" type="text" placeholder="请输入座机号 (0571-88888888-01)" id="ship-phone" maxlength="20" name="phone">
                </div>
              </div>
              <div class="form-group">
                <label>&nbsp;</label>
                <div class="form-cont">
                  <button type="button" @click="submit" v-show="viewAdd"  id="addAddrBtn" class="btn btn-primary">确认收货地址</button>
                  <button type="button" @click="editor" v-show="viewEdit"  id="editAddrBtn" class="btn btn-primary">确认修改</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {reorganizeAddr} from 'json/districts.js'
  const Addr = reorganizeAddr
  const city = reorganizeAddr[110000]['Children']
  const town = reorganizeAddr[110000]['Children'][110100]['Children']
  export default {
    data() {
      return {
        seen: false,
        viewEdit: false,
        viewAdd: true,
        address: Addr,
        str: '',
        obj: [],
        editorArr: [],
        detail: '',
        name: '',
        postCode: '',
        mobile: '',
        phone: '',
        son: city,
        grandson: town,
        homeProvince: 110000,
        homeCity: 110100,
        Hometown: 110101,
        id: 0,
        editIndex: 0
      }
    },
    methods: {
      formBox() {
        this.clear()
        if (this.seen === false) {
          this.seen = true
        } else {
          this.seen = false
        }
      },
      closeFormBox() {
        if (this.seen === true) {
          this.seen = false
          this.viewEdit = false
          this.viewAdd = true
        }
      },
      clear() {
        this.name = ''
        this.homeProvince = 110000
        this.homeCity = 110100
        this.Hometown = 110101
        this.mobile = ''
        this.phone = ''
        this.detail = ''
        this.postCode = ''
      },
      submit() {
        this.viewEidt = false
        this.viewAdd = true
        let placeId = [this.homeProvince, this.homeCity, this.Hometown]
        let params = { Name: this.name, PlaceId: placeId, Mobile: this.mobile, Tel: this.phone, Detail: this.detail, Postcode: this.postCode }
        request.submit('tc/address/add', params).then(
          res => {
            let params1 = { Name: this.name, Id: res.take('Data')['Id'], Place: placeId, Mobile: this.mobile, Tel: this.phone, Detail: this.detail, Postcode: this.postCode }
            this.obj.push(params1)
            this.seen = false
          }, res => {
          res.hide()
          layer.toast('添加失败')
        })
      },
      deleAddr(item, index) {
        request.submit('tc/address/remove/' + item.Id, {}).then(
          res => {
            this.obj.splice(index, 1)
          }, res => {
          res.hide()
          layer.toast('删除失败')
        })
      },
      e(item, index) {
        this.seen = true
        this.viewEdit = true
        this.viewAdd = false
        this.name = item.Name
        this.homeProvince = item.Place[0]
        this.homeCity = item.Place[1]
        this.Hometown = item.Place[2]
        this.detail = item.Detail
        this.postCode = item.Postcode
        this.id = item.Id
        this.editIndex = index
        request({url: 'tc/address/get/' + item.Id}).then(res => {
          self.editorArr = res.take('Data')
          this.mobile = self.editorArr['Mobile']
          this.phone = self.editorArr['Tel']
        })
      },
      editor() {
        let placeId = [this.homeProvince, this.homeCity, this.Hometown]
        let params = { Name: this.name, Place: placeId, Id: this.id, PlaceId: placeId, Mobile: this.mobile, Tel: this.phone, Detail: this.detail, Postcode: this.postCode }
        request.submit('tc/address/edit/' + this.id, params).then(
          res => {
            this.seen = false
            this.obj.splice(this.editIndex, 1, params)
            layer.toast('修改成功')
          }, res => {
          layer.toast('编辑失败')
        })
      },
      defaultAddr(item) {
        request.submit('tc/address/set/' + item.Id, {}).then(
          res => {
            for (var i = 0; i < this.obj.length; i++) {
              this.obj[i].Default = false
            }
            item.Default = true
            layer.toast('设置成功')
          })
      },
      x: function(c) {
        let y = ''
        _.each(Addr, function(x) {
          if (x.Id === c) {
            y = x.Name
          }
        })
        return y
      },
      y: function(c) {
        let y = ''
        _.each(Addr, function(x) {
          let a = x.Children
          _.each(a, function(v) {
            if (v.Id === c) {
              y = v.Name
            }
          })
        })
        return y
      },
      z: function(c) {
        let y = ''
        _.each(Addr, function(x) {
          let a = x.Children
          _.each(a, function(v) {
            let b = v.Children
            _.each(b, function(i) {
              if (i.Id === c) {
                y = i.Name
              }
            })
          })
        })
        return y
      }
    },
    mounted() {
      let self = this
      let form = $('#address-from')
      request({url: 'tc/address/'}).then(res => {
        self.obj = res.take('Data')
      })
      form.validationEngine('attach', {
        scroll: false,
        binded: true,
        maxErrorsPerField: 1,
        promptPosition: 'centerRight',
        custom_error_messages: {
          '#ship-name': {
            'required': {
              'message': '收货人不能为空'
            }
          },
          '#ship-address': {
            'required': {
              'message': '收件地址不能为空'
            }
          },
          '#ship-phone': {
            'groupRequired': {
              'message': '手机或者座机电话必填其中一个'
            }
          },
          '#ship-mb': {
            'groupRequired': {
              'message': '手机或者座机电话必填其中一个'
            }
          }
        },
        onValidationComplete: function(form, valid) {
          if (valid) {
            self.seen = false
          }
        }
      })
    },
    watch: {
      'homeProvince': function(n, o) {
        this.grandson = null
        if (n !== o) this.son = this.address[n]['Children']
      },
      'homeCity': function(n, o) {
        if (n !== o) this.grandson = this.son[n]['Children']
        if (_.isEmpty(this.grandson)) {
          this.Hometown = this.homeCity
        }
      }
    }
  }
</script>


