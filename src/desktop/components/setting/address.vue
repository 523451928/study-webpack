<template>
  <div class="main-cont tab-content col-md-10" id="address-setting">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">收货地址</div>
        <div class="panel-body">
          <transition-group tag="ul" id="address-list" name="flip-list" class="list-unstyled user-addr-list">
            <li v-for="(item,index) in addressArr" class="li-btn clearfix" :key="item.Detail">
              <div class="fl">
                <span class="addr-receiver">{{item.Receiver}}</span>
                <div class="addr-content">
                  <span v-for="(item,index) in item.placeArr">{{item[0]}}</span>
                  {{item.Detail}}
                  <span>{{item.Telephone}}</span>
                  <span>{{item.Postcode}}</span>
                </div>
                <span>{{item.Cellphone | formatPhone}}</span>
                <div class="fr default-addr" v-show="item.Default">默认地址</div>
              </div>
              <div class="fr dn li-active">
                <a href="javascript:void(0)" v-show="!item['Default']" v-on:click="defaultAddr(item)">设为默认地址</a>
                <a href="javascript:void(0)" v-on:click="editAddr(item,index)">编辑</a>
                <a href="javascript:void(0)" v-on:click="deleAddr(item,index)">删除</a>
              </div>
            </li>
          </transition-group>
          <a href="javascript:void(0)" id="add-btn" v-on:click="newAddr()">+新增收货地址</a>
        </div>
      </div>
    </div>
    <transition name="scale">
      <div class="modal" id="address-from-wrap" v-show="seen">
      <div class="modal-backdrop fade in"></div>
      <div class="modal-dialog">
        <div class="modal-content" v-drag>
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="closeFormBox"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{viewAdd ? '新增收货地址' : '更改收货地址'}}</h4>
          </div>
          <div class="modal-body">
            <div class="form form-horizontal form-base"  id="address-from">
              <input type="hidden" name="id" id="addrId"/>
              <div class="form-group receive-group">
                <label for="ship-name"> 收货人：</label>
                <div class="form-cont">
                  <input :class="{'input-error': !name && isSubmit}" v-model="name" placeholder="收货人姓名" class="form-control validate[required]" type="text" maxlength="40" id="ship-name" name="Name" >
                </div>
              </div>
              <div class="form-group place-group">
                <label>收货地址：</label>
                <div class="form-cont form-select">
                  <select class="form-control" v-on:change="changeProvince($event.target.value, true)" id="province">
                    <option :value="addr.Id" v-for="addr of provinces"
                            :selected="addr === province">{{addr.Name}}</option>
                  </select>
                  <select class="form-control" v-on:change="changeCity($event.target.value, true)" id="city">
                    <option :value="addr.Id" v-for="addr of cities"
                            :selected="addr === city">{{addr.Name}}</option>
                  </select>
                  <select class="form-control" v-show="districts.length > 0" v-on:change="changeDistrict($event.target.value)" id="district">
                    <option :value="addr.Id" v-for="addr of districts"
                      :selected="addr === district">{{addr.Name}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="ship-address"> 详细地址：</label>
                <div class="form-cont">
                  <input :class="{'input-error': !detail && isSubmit}" v-model="detail" class="form-control detail-control validate[required]" type="text" placeholder="详细地址、街道、门牌号等" maxlength="120" id="ship-address" name="Detail">
                </div>
              </div>
              <div class="form-group">
                <label for="ship-zip">邮政编码：</label>
                <div class="form-cont">
                  <input v-model="postCode" class="form-control" type="text" id="ship-zip" name="Postcode" placeholder="选填" maxlength="6">
                </div>
              </div>
              <div class="form-group">
                <label for="ship-mb">手机号：</label>
                <div class="form-cont">
                  <input :class="{'input-error': !isMobile && isSubmit}" v-model="mobile" class="form-control validate[groupRequired[phone],custom[mobile]]" type="text" placeholder="请输入手机号" id="ship-mb" maxlength="20" name="mobile">
                </div>
              </div>
              <div class="form-group">
                <label for="ship-phone">座机号：</label>
                <div class="form-cont">
                  <input v-model="phone" class="form-control" type="text" placeholder="也可以填写座机号 " id="ship-phone" maxlength="20" name="phone">
                </div>
              </div>
              <div class="form-group">
                <label>&nbsp;</label>
                <div class="form-cont">
                  <button type="button" @click="submit" v-show="viewAdd"  id="addAddrBtn" class="btn btn-primary btn-submit">保存</button>
                  <button type="button" @click="editor" v-show="viewEdit"  id="editAddrBtn" class="btn btn-primary btn-submit">确认修改</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>
<script>
  /* eslint-disable */
import { provinces, findPlaceById, Admap } from 'json/districts.js'
import { formatPhone } from 'scripts/filters/filters'
let admap = new Admap(provinces)
export default {
  data() {
    return {
      provinces,
      cities: [],
      districts: [],
      province: undefined,
      city: undefined,
      district: undefined,
      addressArr: [],
      seen: false,
      viewEdit: false,
      viewAdd: true,
      str: '',
      obj: [],
      editorArr: [],
      detail: '',
      name: '',
      postCode: '',
      mobile: '',
      phone: '',
      id: 0,
      editIndex: 0,
      addrtown: true,
      isSubmit: false
    }
  },
  methods: {
    getPlaceName(id) {
      let p = findPlaceById(id)
      return p ? p.Name : ''
    },
    closeFormBox() {
      if (this.seen === true) {
        this.seen = false
        this.viewEdit = false
        this.viewAdd = true
      }
    },
    clear() {
      this.province = this.provinces[0]
      this.cities = this.province.Children
      this.city = this.cities[0]
      this.districts = this.city.Children || []
      this.district = this.districts[0]
      this.name = ''
      this.mobile = ''
      this.phone = ''
      this.detail = ''
      this.postCode = ''
    },
    submit() {
      this.viewEidt = false
      this.viewAdd = true
      this.saveOrAdd(0)
    },
    editor() {
      this.saveOrAdd(this.addressId)
    },
    saveOrAdd(id) {
      this.isSubmit = true
      let p = {
        Id: id
      }
      let placeId = this.district ? this.district.Id : this.city.Id
      if (this.name) {
        p['Receiver'] = this.name
      } else {
        this.$notify({
          text: '请填写收件人'
        })
        return
      }
      if (this.detail) {
        p['Detail'] = this.detail
      } else {
        this.$notify({
          text: '请填写详细地址'
        })
        return
      }

      p['PlaceId'] = parseInt(placeId)
      if (this.postcode) {
        p['Postcode'] = this.postcode
      }
      if (this.mobile) {
        if (!this.isMobile) {
          this.$notify({
            text: '请填写正确的手机号码'
          })
          return
        } else {
          p['Cellphone'] = this.mobile
        }
      } else {
        this.$notify({
          text: '请填写手机号码'
        })
        return
      }
      if (this.phone) {
        p['Telephone'] = this.phone
      }
      this.$request.save('address', p).then((res) => {
        this.seen = false
        this.isSubmit = false
        this.getAddressList()
      })
    },
    deleAddr(item, index) {
      this.$request.remove('address', item.Id).then(res => {
        this.addressArr.splice(index, 1)
        this.$notify({
          type: 'wa-success',
          text: '你已成功删除地址'
        })
      })
    },
    newAddr() {
      this.seen = true
      this.clear()
      this.viewEdit = false
      this.viewAdd = true
    },
    editAddr(item, index) {
      this.seen = true
      this.addressId = item.Id
      let ad = admap.getAddress(item.PlaceId)
      const provinceId = parseInt(ad[0][1])
      const cityId = parseInt((ad[1][1]))
      if (ad.length === 3) {
        const districtId = parseInt(ad[2][1])
        this.district = findPlaceById(districtId)
      }
      this.province = findPlaceById(provinceId)
      this.city = findPlaceById(cityId)
      this.cities = this.province.Children
      this.changeCity(this.cities[0].Id)
      this.viewEdit = true
      this.viewAdd = false
      this.name = item.Receiver
      this.mobile = item.Cellphone
      this.detail = item.Detail
      this.postCode = item.Postcode
      this.id = item.Id
      this.editIndex = index
    },
    defaultAddr(item) {
      // 设置默认id
      this.$request.set('address', item.Id, {
        Default: true
      }).then(res => {
        this.addressArr.forEach((itm) => {
          itm.Default = false
        })
        item.Default = true
        this.$notify({
          type: 'wa-success',
          text: '你已成功设置默认地址'
        })
      })
//      this.$request.submit(`address/set/${item.Id}`, {
//        Default: true
//      }).then(res => {
//        this.addressArr.forEach((itm) => {
//          itm.Default = false
//        })
//        item.Default = true
//      })
    },
    changeProvince(id, flag) {
      this.province = findPlaceById(parseInt(id))
      this.cities = this.province.Children
      if (flag) {
        this.changeCity(this.cities[0].Id, flag)
      }
    },
    changeCity(id, flag) {
      if (flag) {
        this.city = findPlaceById(parseInt(id))
        this.districts[0] ? this.changeDistrict(this.districts[0].Id) : (this.district = undefined)
      }
      this.districts = this.city.Children || []
    },
    changeDistrict(id) {
      this.district = findPlaceById(parseInt(id))
    },
    getAddressList() {
      this.$request.list('address').then(res => {
        let address = res.take('Data')
        address.forEach((item) => {
          item.placeArr = admap.getAddress(item.PlaceId)
        })
        this.addressArr = address
      })
    }
  },
  computed: {
    isMobile() {
      if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.mobile))) {
        return false
      }
      return true
    }
  },
  mounted() {
    this.getAddressList()
  },
  filters: {
    formatPhone
  }
}
</script>
<style>
  .flip-list-move {
    transition: transform .5s;
  }
  .flip-list-leave-active{
    transform: translateX(-100%);
    transition: transform .5s;
  }
<<<<<<< HEAD
  .panel-body{
    overflow: hidden;
  }
  .tab-content{
    min-height: 500px;
  }
=======
  .panle-body{
    overflow: hidden;
  }
>>>>>>> 58ebdcd8a01383ce5eb5fd965c9d24d1bfbef729
</style>