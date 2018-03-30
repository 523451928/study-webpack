<template>
  <div>
    <!--填写并核对订单信息开始-->
    <div class="shop-cont load-container">
      <div class="order-detail">
        <div class="shop-step-title">
          <h2>填写并核对订单信息</h2>
        </div>
        <div id="address-part" class="detail-item address-item">
          <div class="tit">
            <h3>收货信息</h3>
          </div>
          <div class="addr-cont">
            <div class="addr-wrap">
              <ul id="address-list" class="list-unstyled addr-list-wrap">
                <li class="addr default" :class="item['Id']===currentAdrId?'current':''" v-for="(item, index) in objAdd" @click="selAddr(item)" :style="{transform:'translateY('+ liNum +'px)'}">
                  <div class="detail">
                    <span>{{item.Name}}</span>
                    <span v-text="provice(item.Place[0])"></span>
                    <span v-text="city(item.Place[1])"></span>
                    <span v-text="county(item.Place[2])"></span>
                    <span>{{item.Detail}}</span>
                    <span>{{item.Mobile}}</span>
                    <span>{{item.Tel}}</span>
                    <div class="pull-right">
                      <span class="default-addr" v-show="item.Default">默认地址</span>
                        <span class="active-icon">
                          <i class="ww-icon small-ok active-ok"></i>
                        </span>
                    </div>
                  </div>
                  <div class="btn-wrap">
                    <a href="javascript:void(0)" class="update" @click="e(item,index)">编辑</a>
                    <a href="javascript:void(0)" class="remove" @click="delAddr(item,index)">删除</a>
                    <a href="javascript:void(0)" v-show="!item['Default']" @click="defaultAddr(item)">设为默认地址</a>
                  </div>
                </li>
              </ul>
            </div>
            <button class="more btn btn-default" v-show="moreAdd" @click="moreAdd">更多地址</button>
            <a href="javascript:void(0)" @click="formBox">+新增收货地址</a>
            <div class="slide-btn-wrap" v-show="preBtn">
              <a href="javascript:void(0)" class="slide ww-icon arrow-big prev-big" @click="prevLi" :class="liNum==0?'disable':''"></a>
              <a href="javascript:void(0)" class="slide ww-icon arrow-big next-big" @click="nextLi" :class="{disable:nextFlag}"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--//填写并核对订单信息结束-->
    <!--新增模态框开始-->
    <div class="modal" id="address-from-wrap" v-show="formSeen">
      <div class="modal-backdrop fade in"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeFormBox"><span aria-hidden="true">&times;</span></button>
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
                  <select class="form-control" v-model="homeProvince" id="province" data-type="province">
                    <option :value="item['Id']" v-for="item in address">{{ item['Name'] }}</option>
                  </select>
                  <select class="form-control" v-model="homeCity" id="city" data-type="city">
                    <option :value="item['Id']" v-for="item in son">{{ item['Name'] }}</option>
                  </select>
                  <select class="form-control" v-model="Hometown" id="district" data-type="district">
                    <option :value ="item['Id']" v-for="item in grandson">{{ item['Name'] }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="ship-address"><strong>*</strong> 详细地址：</label>
                <div class="form-cont">
                  <input v-model="detailAddr" class="form-control validate[required]" type="text" maxlength="120" id="ship-address" name="Detail">
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
                  <button type="button" id="addAddrBtn" v-show="viewAdd" class="btn btn-primary" @click="submit">确认收货地址</button>
                  <button type="button" id="editAddrBtn" v-show="viewEdit" class="btn btn-primary" @click="editor">确认修改</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--新增模态框结束-->
  </div>
</template>
<script>
//  import {reorganizeAddr} from 'json/districts.js'
//  const Addr = reorganizeAddr
//  const city = reorganizeAddr[110000]['Children']
//  const town = reorganizeAddr[110000]['Children'][110100]['Children']

  const Addr = ''
  const city = ''
  const town = ''
  export default {
    data() {
      return {
        liNum: 0,
        moreAdd: true,
        formSeen: false,
        viewEdit: false,
        viewAdd: true,
        nextFlag: false,
        preBtn: false,
        address: Addr,
        son: city,
        grandson: town,
        homeProvince: 110000,
        homeCity: 110100,
        Hometown: 110101,
        objAdd: [],
        editorArr: [],
        name: '',
        detailAddr: '',
        postCode: '',
        phone: '',
        mobile: '',
        currentAdrId: 0,
        editIndex: -1
      }
    },
    watch: {
      'currentAdrId': function(n, o) {
        let addrId = n
        this.$emit('getOrderAdressId', addrId)
      },
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
    },
    mounted() {
      let self = this
      let form = $('#address-from')
      request({url: 'tc/address/'}).then(res => {
        self.objAdd = res.take('Data')
        console.log(self.objAdd)
        self.currentAdrId = _.find(self.objAdd, function(v) {
          return v['Default'] === true
        })['Id']
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
            self.formSeen = false
          }
        }
      })
    },
    methods: {
      formBox() {
        this.clear()
        if (this.formSeen === false) {
          this.formSeen = true
          this.viewAdd = true
          this.viewEidt = false
        } else {
          this.formSeen = false
        }
      },
      e(item, index) {
        this.formSeen = true
        this.viewEdit = true
        this.viewAdd = false
        this.name = item.Name
        this.homeProvince = item.Place[0]
        this.homeCity = item.Place[1]
        this.Hometown = item.Place[2]
        this.detailAddr = item.Detail
        this.postCode = item.Postcode
//        this.phone = item.Tel
//        this.mobile = item.Mobile
        this.id = item.Id
        this.editIndex = item.index
        request({url: 'tc/address/get/' + item.Id}).then(res => {
          self.editorArr = res.take('Data')
          this.mobile = self.editorArr['Mobile']
          this.phone = self.editorArr['Tel']
        })
      },
      editor() {
        let placeId = [this.homeProvince, this.homeCity, this.Hometown]
        let params = { Name: this.name, Place: placeId, Id: this.id, PlaceId: placeId, Mobile: this.mobile, Tel: this.phone, Detail: this.detailAddr, Postcode: this.postCode }
        request.submit('tc/address/edit/' + this.id, params).then(
          res => {
            this.formSeen = false
            this.viewEdit = false
            this.viewAdd = true
            this.objAdd.splice(this.editIndex, 1, params)
            layer.toast('修改成功')
          }, res => {
          layer.toast('编辑失败')
        })
      },
      submit() {
        this.viewEidt = false
        this.viewAdd = true
        let placeId = [this.homeProvince, this.homeCity, this.Hometown]
        let p = { Name: this.name, Place: placeId, Id: this.id, PlaceId: placeId, Mobile: this.mobile, Tel: this.phone, Detail: this.detailAddr, Postcode: this.postCode }
        request.submit('tc/address/add', p).then(
          res => {
            let p1 = { Name: this.name, Id: res.take('Data')['Id'], Place: placeId, Mobile: this.mobile, Tel: this.phone, Detail: this.detailAddr, Postcode: this.postCode }
            this.objAdd.push(p1)
            this.formSeen = false
          }, res => {
          res.hide()
          layer.toast('添加失败')
        })
      },
      selAddr(item) {
        this.currentAdrId = item['Id']
      },
      moreAdd() {
        this.moreAdd = false
        this.preBtn = true
      },
      prevLi() {
        this.nextFlag = false
        this.liNum = this.liNum + 38
        if (this.liNum > 0) {
          this.liNum = 0
        }
      },
      nextLi() {
        let num = parseInt(this.liNum / 38)
        if (0 - num >= this.objAdd.length - 4) {
          this.nextFlag = true
          return
        } else {
          this.liNum = this.liNum - 38
        }
      },
      delAddr(item, index) {
        request.submit('tc/address/remove/' + item.Id, {}).then(
          res => {
            this.objAdd.splice(index, 1)
          }, res => {
          res.hide()
          layer.toast('删除失败')
        })
      },
      closeFormBox() {
        if (this.formSeen === true) {
          this.formSeen = false
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
        this.detailAddr = ''
        this.postCode = ''
      },
      defaultAddr(item) {
        request.submit('tc/address/set/' + item.Id, {}).then(
          res => {
            for (var i = 0; i < this.objAdd.length; i++) {
              this.objAdd[i].Default = false
            }
            item.Default = true
            layer.toast('设置成功')
          })
      },
      provice: function(c) {
        let y = ''
        _.each(Addr, function(x) {
          if (x.Id === c) {
            y = x.Name
          }
        })
        return y
      },
      city: function(c) {
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
      county: function(c) {
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
    }
  }
</script>

