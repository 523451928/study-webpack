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
          <div class="add-address" v-show="objAdd.length===0">
            <a @click="newAddr">+新增收货地址</a>
          </div>
          <div class="addr-cont" v-show="objAdd.length>0">
            <div class="addr-wrap">
              <ul id="address-list" class="list-unstyled addr-list-wrap" :class="isunfold&&'max-height'">
                <li class="addr default" :class="item.Default && 'current'" v-for="(item, index) in aheadAddress" @click="selAddr(item, index)" :style="{transform:'translateY('+ liNum +'px)'}">
                  <div class="detail-item" :class="{'active': index == activeIndex}">
                    <div class="span-wrap">
                      <span>{{item.Receiver}}</span>
                      <span v-for="ad in getAddress(item.PlaceId)">{{ad[0]}}</span>
                      <span class="detail-span">{{item.Detail}}</span>
                      <span class="mobile">{{changePhone(item.Cellphone)}}</span>
                      <span class="phone">{{item.Telephone}}</span>
                    </div>
                    <div class="pull-right">
                      <span class="default-addr" v-show="item.Default">默认地址</span>
                        <span class="active-icon">
                          <i class="ww-icon small-ok active-ok wa-check-circle-o"></i>
                        </span>
                    </div>
                  </div>
                  <div class="btn-wrap">
                    <a href="javascript:void(0)" class="update" @click="editAddr(item)">编辑</a>
                    <a href="javascript:void(0)" class="remove" @click="delAddr(item)">删除</a>
                    <a href="javascript:void(0)" v-show="!item['Default']" @click="defaultAddr(item)">设为默认地址</a>
                  </div>
                </li>
              </ul>
            </div>
            <button class="more btn btn-default" v-show="moreAdd" @click="onMoreAdd">查看更多</button>
            <button class="more btn btn-default" v-show="isunfold" @click="onClose">收起</button>
            <a href="javascript:void(0)" @click="newAddr">+新增收货地址</a>
          </div>
        </div>
      </div>
    </div>
    <!--//填写并核对订单信息结束-->
    <!--新增模态框开始-->
    <transition name="fade">
      <div class="modal" id="address-from-wrap" v-show="formSeen">
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
                  <label for="ship-name"> 收货人：</label>
                  <div class="form-cont">
                    <input v-model="name" class="form-control validate[required]" type="text" maxlength="40" id="ship-name"  name="userName">
                  </div>
                  <transition name="fade">
                    <p class="remind" v-show="remind.name!==''">{{remind.name}}</p>
                  </transition>
                </div>
                <div class="form-group place-group">
                  <label>收货地址：</label>
                  <div class="form-cont">
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
                    <input v-model="detailAddr" class="form-control validate[required]" type="text" maxlength="120" id="ship-address" name="Detail">
                  </div>
                  <transition name="fade">
                    <p class="remind" v-show="remind.detail!==''">{{remind.detail}}</p>
                  </transition>
                </div>
                <div class="form-group">
                  <label for="ship-zip">邮政编码：</label>
                  <div class="form-cont">
                    <input v-model="postCode" class="form-control" type="text" id="ship-zip" name="Postcode" placeholder="选填" style="width: 160px">
                  </div>
                </div>
                <div class="form-group">
                  <label for="ship-mb">联系方式：</label>
                  <div class="form-cont">
                    <input v-model="mobile" class="form-control validate[groupRequired[phone],custom[mobile]]" type="text" placeholder="请输入手机号" id="ship-mb" maxlength="20" name="mobile">
                  </div>
                  <transition name="fade">
                    <p class="remind mobile" v-show="remind.mobile!==''">{{remind.mobile}}</p>
                  </transition>
                </div>
                <div class="form-group">
                  <label for="ship-phone">座机号:</label>
                  <div class="form-cont">
                    <input v-model="phone" class="form-control" type="text" placeholder="请输入座机号" id="ship-phone" maxlength="20" name="phone">
                  </div>
                  <transition name="fade">
                    <p class="remind" v-show="remind.phone!==''">{{remind.phone}}</p>
                  </transition>
                </div>
                <div class="form-group">
                  <label>&nbsp;</label>
                  <div class="form-cont">
                    <button type="button" id="addAddrBtn" v-show="viewAdd" class="u-primary-btn" @click="submit">保存</button>
                    <button type="button" id="editAddrBtn" v-show="viewEdit" class="u-primary-btn" @click="editor">确认修改</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="modal-backdrop fade in" v-show="formSeen"></div>
    <!--新增模态框结束-->
  </div>
</template>
<script>
/* eslint-disable */
  import { provinces, findPlaceById, Admap } from 'json/districts.js'
  let admap = new Admap(provinces)
  export default {
    data() {
      return {
        liNum: 0,
        moreAdd: false, // 判断是多条
        formSeen: false, // 表单编辑
        viewEdit: false, // 编辑地址按钮
        viewAdd: true, // 新建地址按钮
        nextFlag: false,
        provinces,
        isunfold: false, // 是否展开
        cities: [],
        districts: [],
        province: undefined, // 当前显示省份信息
        city: undefined, // 当前显示城市信息
        district: undefined, // 当前显示区信息
        objAdd: [], // 用户地址
        otherAdd: [], // 其他地址
        name: '', // 姓名
        detailAddr: '', // 详细地址
        postCode: '', // 邮编
        phone: '', // 固话
        mobile: '', // 手机号码
        currentAdrId: 0, // 地址默认选中id
        addressId: -1, // 当前正在编辑的地址id
        currentAd: '', // 默认地址
        activeIndex: 0,
        remind: {
          name: '',
          detail: '',
          mobile: '',
          phone: ''
        }
      }
    },
    watch: {
      'currentAdrId': function(n, o) {
        let addrId = n
        this.$emit('getOrderAdressId', addrId)
      }
    },
    mounted() {
      let self = this
      self.getUserAddress()
      self.getAddress()
      // let form = $('#address-from')
      // form.validationEngine('attach', {
      //   scroll: false,
      //   binded: true,
      //   maxErrorsPerField: 1,
      //   promptPosition: 'centerRight',
      //   custom_error_messages: {
      //     '#ship-name': {
      //       'required': {
      //         'message': '收货人不能为空'
      //       }
      //     },
      //     '#ship-address': {
      //       'required': {
      //         'message': '收件地址不能为空'
      //       }
      //     },
      //     '#ship-phone': {
      //       'groupRequired': {
      //         'message': '手机或者座机电话必填其中一个'
      //       }
      //     },
      //     '#ship-mb': {
      //       'groupRequired': {
      //         'message': '手机或者座机电话必填其中一个'
      //       }
      //     }
      //   },
      //   onValidationComplete: function(form, valid) {
      //     if (valid) {
      //       self.formSeen = false
      //     }
      //   }
      // })
    },
    methods: {
      // 获得用户地址
      getUserAddress() {
        return new Promise(resolve => {
          this.$request.list('address').then(res => {
            let address = res.take('Data')
            this.$emit("addressList", address)
            for (let i = 0; i<address.length; i++) {
              if (address[i].Default) {
//                this.activeIndex = i
                let o = address[i]
                address.splice(i, 1)
                address.unshift(o)
                this.currentAdrId = address[0].Id
                this.returnCurrentAd(address[0])
                break;
              }
            }
            if (address.length > 5) {
              this.moreAdd = true
            }
            this.objAdd = address
          })
        })
      },
      // 打开弹窗
      newAddr() {
        this.formSeen = true
        this.clear()
        this.viewEdit = false
        this.viewAdd = true
      },
      closeFormBox() {
        if (this.formSeen === true) {
          this.clearRemind()
          this.formSeen = false
          this.viewEdit = false
          this.viewAdd = true
          for (let k in this.remind) {
            this.remind[k] = ''
          }
        }
      },
      // 从地址类中获得地址数据
      getAddress(i) {
        // 获得地址
        return admap.getAddress(i)
      },
      // 返回默认地址
      returnCurrentAd(item) {
          this.currentAd = ''
          if (item!=='') {
            for (let i of this.getAddress(item.PlaceId)) {
              this.currentAd += `  ${i[0]}  `
            }
            this.currentAd += item.Detail
            this.currentAd += item.Receiver
            this.currentAd += `  ${this.changePhone(item.Cellphone)}  `
            this.currentAd += item.Telephone
            this.$emit('currentAd', this.currentAd)
          } else {
            this.$emit('currentAd', item)
          }
      },
      // 编辑
      editAddr(item) {
        this.formSeen = true
        this.viewEdit = true
        this.viewAdd = false
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
        this.province = findPlaceById(provinceId)
        this.cities = this.province.Children
        this.changeCity(this.cities[0].Id)
        this.name = item.Receiver
        this.detailAddr = item.Detail
        this.postCode = item.Postcode
        this.phone = item.Telephone
        this.mobile = item.Cellphone
        // let placeId = this.district ? this.district.Id : this.city.Id
      },
      // 确认编辑
      editor() {
        let self = this
        let placeId = this.district ? this.district.Id : this.city.Id
        // 表单验证
        let a = this.testFormInfo()
        if (a.length > 0) {

        } else {
          let p = {
            Id: this.addressId
          }
          p['Receiver'] = this.name
          p['Detail'] = this.detailAddr
          p['PlaceId'] = parseInt(placeId)
          if (this.postcode) {
            p['Postcode'] = this.postcode
          }
          if (this.mobile) {
            p['Cellphone'] = this.mobile
          }
          if (this.phone) {
            p['Telephone'] = this.phone
          }
          this.$request.save('address', p).then(r => {
            const data = r.take('Data')
            self.objAdd.forEach((item, index) => {
              if (item.Id === data.Id) {
                if (data['Default']) {
                  this.returnCurrentAd(data)
                }
                item['Cellphone'] = data['Cellphone']
                item['Default'] = data['Default']
                item['Detail'] = data['Detail']
                item['PlaceId'] = data['PlaceId']
                item['Id'] = data['Id']
                item['Postcode'] = data['Postcode']
                item['Receiver'] = data['Receiver']
                item['Telephone'] = data['Telephone']
                this.clearRemind()
                this.formSeen = false
                layer.toast('编辑成功')
                this.currentAdrId = item['Id']
                this.returnCurrentAd(item)
                this.$emit('getOrderAdressId', data.Id)
              }
            })
          }).catch(() => {
            layer.toast('编辑失败')
          })
        }
      },
      // 保存
      submit() {
        this.viewEdit = false
        this.viewAdd = true
        let placeId = this.district ? this.district.Id : this.city.Id
        // 表单验证
        let a = this.testFormInfo()
        if (a.length > 0) {

        } else {
          let p = {}
          p['Receiver'] = this.name
          p['Detail'] = this.detailAddr
          p['PlaceId'] = parseInt(placeId)
          if (this.postcode) {
            p['Postcode'] = this.postcode
          }
          if (this.mobile) {
            p['Cellphone'] = this.mobile
          }
          if (this.phone) {
            p['Telephone'] = this.phone
          }
          this.$request.save('address', p).then(r => {
            layer.toast('保存成功')
            const data = r.take('Data')
            this.$emit('getOrderAdressId', data.Id)
            if (data['Default']) {
              this.returnCurrentAd(data)
            }
            this.objAdd.push(data)
            if (this.objAdd.length > 5) {
              this.moreAdd = true
              this.isunfold = false
            }
            this.clearRemind()
            this.formSeen = false
          })
        }
      },
      clearRemind() {
        for (let i in this.remind) {
          i = ''
        }
      },
      testFormInfo(o) {
        // 验证用户信息
        let r = []
        if (this.name === '') {
          r.push('请填写完成姓名')
          this.remind.name = '姓名不能为空'
        }  else {
          this.remind.name = ''
        }
        if (this.detailAddr === '') {
          r.push('请填写完整地址')
          this.remind.detail = '详细地址不能为空'
        } else {
          this.remind.detail = ''
        }
        //!/\d{4}-\d{8}-\d{2}/
        if (this.phone === '' && this.mobile === '') {
          r.push('请填写手机号或者固定电话')
          this.remind.mobile = '请填写手机号或者固定电话'
        } else if (this.mobile !== '' && !/1[3578]\d{9}/g.test(this.mobile)) {
          r.push('请填写正确的手机号码')
          this.remind.mobile = '请填写正确的手机号码'
        } else if (this.phone !== '' && !/\d{4}-\d{8}/g.test(this.phone)) {
          r.push('请填写正确的固定电话')
          this.remind.phone ='请填写格式正确的固定电话 0571-88888888'
        } else {
          this.remind.phone = ''
          this.remind.mobile = ''
        }
        return r
      },
      selAddr(item, index) {
        this.activeIndex = index
        this.currentAdrId = item['Id']
        this.returnCurrentAd(item)
      },
      onMoreAdd() {
        this.moreAdd = false
        this.isunfold = true
      },
      onClose() {
        this.moreAdd = true
        this.isunfold = false
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
      // 删除地址
      delAddr(item) {
        const id = item.Id
        let a = confirm('确认删除地址吗?')
        if (a) {
          this.$request.remove('address', id).then(r => {
            let id = r.take('Data')
            this.objAdd.forEach((item, index) => {
              if (item.Id === id) {
                this.objAdd.splice(index, 1)
                if (item.Default) {
                  this.$emit('getOrderAdressId', undefined)
                  this.returnCurrentAd('')
                }
                if (this.objAdd.length <= 5) {
                  this.moreAdd = false
                  this.isunfold = false
                }
              }
            })
          })
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
        this.postCode = ''
        this.detailAddr = ''
      },
      // 设置默认地址
      defaultAddr(item) {
        let id_2 = item.Id
        // 设置默认id
        this.$request.submit(`address/set/${id_2}`, {
          Default: true
        }).then(res => {
          let id = res.take('Data').Id
          for (let i of this.objAdd) {
            if (i.Default) {
              i.Default = !i.Default
            }
            if (i.Id === id_2) {
              i.Default = true
              this.returnCurrentAd(i)
            }
          }
          this.currentAdrId = id
        })
      },
      changeProvince(id, flag) {
        this.province = findPlaceById(parseInt(id))
        this.cities = this.province.Children
        if (flag) {
          this.changeCity(this.cities[0].Id)
        }
      },
      changeCity(id, flag) {
        if (flag) {
          // 城市
          this.city = findPlaceById(parseInt(id))
          this.districts[0] ? this.changeDistrict(this.districts[0].Id) : (this.district = undefined)
        }
        // 地区
        this.districts = this.city.Children || []
      },
      changeDistrict(id) {
        this.district = findPlaceById(parseInt(id))
      },
       // 手机号中间四位处理成***
      changePhone(p) {
        const reg = /1[3578]\d{9}$/g
        if (reg.test(p)) {
          let a = p.split('')
          a.forEach((item, index) => {
            if (index == 3 || index == 4 || index == 5 || index == 6) {
              a[index] = "*"
            }
          })
          return a.join('')
        }
      }
    },
    computed: {
      aheadAddress() {
        // 获取前两条数据
        if (!this.isunfold && this.objAdd.length > 5) {
          return this.objAdd.slice(0,5)
        } else if(this.isunfold && this.objAdd.length > 5) {
          return this.objAdd
        } else if (this.objAdd.length <=5 ) {
          return this.objAdd
        }
      }
    }
  }

</script>

