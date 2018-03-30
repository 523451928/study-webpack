<template>
  <div class="warp">
    <!--收货地址列表-->
    <div class="addList" v-show="newAddress">
      <div class="profile-head">
        <a @click="back" class="back profile-back">
          <i class="wa wa-left"></i>
        </a>收货地址管理
      </div>
      <div class="user-fixed-head-wrap addr-list-area container">
        <div class="row user-profile-form">
          <div class="col-xs-12">
            <div class="detail-item address-item" id="address-item">
              <transition-group tag="ul" name="flip-list" class="list-unstyled addr-list-wrap mr15">
                <li class="addr" :key="item.Detail" v-for="(item, index) in addListObj"   @touchstart="itemStart($event,index)" @touchmove="itemMove($event,index)" @touchend="itemEnd($event,index)" ref="domlis">
                  <div class="detail">
                    <p class="clearfix mb0">
                      <span class="pull-left">
                        <span v-if="item.Default" class="default-addr">默认</span>
                        <span v-else>收货人：</span>
                        {{item.Receiver}}</span>
                      <span class="pull-right">{{item.Cellphone}}</span>
                    </p>
                    <p class="mb0 add-detail">
                      <span>收货地址:</span>
                      <span v-for="(ads,index) in getAddress(item.PlaceId)">
                        {{ads[0]}}
                      </span>
                      <span>{{item.Detail}}</span>
                    </p>
                    <span class="wa wa-pencil addr-right" @click="editAdd(item, index)"></span>
                  </div>
                  <div class="del-addr" @click.prevent.stop="delAddr(item, index, true)">
                    <span>删除</span>
                  </div>
                </li>
              </transition-group>
            </div>
            <div class="save-addr">
              <a href="javascript:void(0)" class="btn btn-success fixed-bottom-btn" @click="newAdd()">新增收货地址</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--新增收货地址-->
    <div class="editor-warp" v-show="!newAddress">
      <div class="profile-head">
        <a class="back address-back" @click="newAddress=true">
          <i class="wa wa-left"></i>
        </a>
        <span class="new-dom">{{editorModel ? '编辑收货地址' : '新增收货地址'}}</span>
        <span class="del-addr" v-if="editorModel" @click="delAddr">删除</span>
      </div>
        <div class="user-fixed-head-wrap container">
          <div class="row user-profile-form">
            <div class="col-xs-12">
              <div class="form form-horizontal form-base" id="address-form">
                <div class="panel panel-default">
                  <div class="panel-body profile-panel-body">
                    <div class="form-group">
                      <div class="form-cont">
                        <input type="text" readonly="readonly" class="form-control validate[required]" v-model="addEnd" id="new-address" placeholder="请选择收货地区" @click="selectArea">
                        <!-- <input type="text" readonly="readonly" class="form-control validate[required]" v-model="addEnd" id="new-address" placeholder="请选择收货地区" @click="addListShow"> -->
                        <span class="wa wa-angle-down"></span>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-cont">
                        <input type="text" class="form-control validate[required]" maxlength="120" v-model="detailAddress" id="ship-address" placeholder="请输入详细收货地址">
                        <span class="wa"></span>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-cont">
                        <input type="text" class="form-control validate[required]" maxlength="40" v-model="addressName" id="ship-name" placeholder="请输入收货人姓名">
                        <span class="wa"></span>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-cont">
                        <input type="text" class="form-control validate[groupRequired[phone],custom[mobile]]" maxlength="20" v-model="addressTel" id="ship-mb" placeholder="请输入联系电话">
                        <span class="wa"></span>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="form-cont">
                        <input type="text" class="form-control last" maxlength="20" id="ship-zip" v-model="postCode" placeholder="邮编(可不填)">
                        <span class="wa"></span>
                      </div>
                    </div>

                  </div>
                </div>
                <button class="btn btn-success fixed-bottom-btn" @click.stop="saveAddr(false)">
                  保存收货地址
                </button>
                <button class="btn btn-success fixed-bottom-btn" v-show="editorModel" @click.stop="saveAddr(true)">
                  确认修改地址
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="default-wrapper">
          <wa-checkbox v-model="isDefault">设为默认地址</wa-checkbox>
        </div>
    </div>
    <!--地区列表-->
    <div class="addr-mask" v-show="addressList">
      <div class="addr-head" v-if="addressArr.length>0">
        <span @click="changeAddr(index)" v-for="(item, index) in addressArr" :class="{'active':index==addressArr.length-1}">{{item.name}}</span>
      </div>
      <!--<transition-group name="list-complete" tag="ul" class="form-control">-->
        <!--<li class="list-complete-item" :key="item.Name" v-for="item in address" @click="province(item['Id'], item['Name'] )">{{ item['Name'] }}</li>-->
      <!--</transition-group>-->
      <ul class="form-control">
        <li v-for="item in address" @click="province(item['Id'], item['Name'] )">{{ item['Name'] }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import { provinces, findPlaceById, Admap } from 'json/districts.js'
  import weui from 'scripts/tools/weui.js'
  import {area} from 'json/area'
  import { getSlideDirection, prefixStyle } from 'scripts/tools/slideDirection'
  const transform = prefixStyle('transform')
  import WaCheckbox from "../public/WaCheckbox"
  let admap = new Admap(provinces)
  export default {
    components: {
      WaCheckbox
    },
    data() {
      return {
        addListObj: {},
        address: provinces,
        newAddress: true,
        addressList: false,
        addressArr: [],
        addressArrNum: [],
        placeId: '',
        editorAddNum: [],
        addEnd: '',
        detailAddress: '',
        addressName: '',
        addressTel: '',
        postCode: '',
        editorModel: false,
        id: 0,
        editIndex: '',
        liItem: '',
        itemTouch: {},
        isDefault: false
      }
    },
    mounted() {
      this.getAddressList()
    },
    methods: {
       selectArea() {
          let self = this
          weui.picker(area, {
              depth: 3,
              defaultValue: this.defaultValue,
              onChange: function onChange(result) {
                  // console.log(result);
              },
              onConfirm: (result) => {
                  self.placeId = result[2] ? result[2].value : result[1].value
                  let endArr = []
                  result.forEach((item) => {
                    endArr.push(item.label)
                  })
                  self.addEnd = endArr.join(' ')
              },
              id: this.addEnd
          })
      },
      back() {
        window.history.go(-1)
      },
      itemStart(e, index) {
        let domlis = document.querySelectorAll('.addr')
        domlis[index].style.transition = 'none'
        if (this.lastIndex === index) {
          domlis[index].style.transition = 'all .3s'
        }
        domlis.forEach((item, idx) => {
          if (idx !== index) {
            item.style[transform] = 'translate(0px,0px)'
          }
        })
        if (e.target.innerText != '删除') {
          this.itemTouch.disX = 0
        }
        this.itemTouch.isStart = true
        this.itemTouch.startX = e.touches[0].clientX
        this.itemTouch.startY = e.touches[0].clientY
      },
      itemMove(e, index) {
        if (this.itemTouch.isStart) {
          let domlis = document.querySelectorAll('.addr')
          let moveX = e.touches[0].clientX
          let moveY = e.touches[0].clientY
          let direction = getSlideDirection(this.itemTouch.startX, this.itemTouch.startY, moveX, moveY)
          if (direction === 1 || direction === 2) {
            return false
          }
          this.itemTouch.disX = moveX - this.itemTouch.startX
          if (this.itemTouch.disX > 20) {
            return
          }
          if (this.itemTouch.disX < -80) {
            this.itemTouch.disX = -80
          }
          // domlis[index].style[transform] = `translate(${this.itemTouch.disX}px,0px)`
        }
      },
      itemEnd(e, index) {
        let domlis = document.querySelectorAll('.addr')
        domlis[index].style.transition = 'all .3s'
        if (this.itemTouch.disX < -30) {
          domlis[index].style[transform] = 'translate(-80px,0px)'
          this.lastIndex = index
        } else {
          domlis[index].style[transform] = 'translate(0px,0px)'
          this.lastIndex = -1
        }
      },
      hideAdd() {
        this.$emit('hideAdd')
      },
      getAddressList() {
        request.list('address').then(res => {
          this.addListObj = res.take('Data')
          if (this.addListObj.length === 0) {
            this.addAddress = true
          }
        })
      },
      getAddress(i) {
        return admap.getAddress(i)
      },
      newAdd() {
        this.newAddress = false
        this.editorModel = false
        this.isDefault = false
        this.detailAddress = ''
        this.addressName = ''
        this.addressTel = ''
        this.postCode = ''
        this.addEnd = ''
        this.placeId = ''
        this.id = 0
      },
      trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      saveAddr(flag) {
        this.detailAddress = this.trim(this.detailAddress)
        this.addressName = this.trim(this.addressName)
        if (!this.placeId) {
          this.$toast.center('请选择收货地区')
          return
        }
        if (this.detailAddress.length === 0) {
          this.$toast.center('请填写详细地址')
          return
        }
        if (this.addressName.length === 0) {
          this.$toast.center('请填写收货人')
          return
        }
        if (!this.isMobile) {
          this.$toast.center('请填写正确的手机号')
          return
        }
        if (this.isDefault && this.id) {
          request.set('address', this.id, {Default: true}).then((res) => {
          })
        }
        let params = {Default: this.isDefault, Receiver: this.addressName, PlaceId: this.placeId, Cellphone: this.addressTel, Detail: this.detailAddress, Postcode: this.postCode }
        if (flag) {
          params.Id = this.id
        }
        request.save('address', params).then(res => {
          this.getAddressList()
          this.newAddress = true
        }, res => {
          res.hide()
          layer.toast('添加失败')
        })
      },
      addListShow() {
        this.addressList = true
        this.address = provinces
      },
      province(id, name) {
        this.address = findPlaceById(id)['Children']
        this.addressArr.push({id, name})
        this.placeId = id
        if (!this.address || this.address.length === 0) {
          this.addressList = false
          let endArr = []
          this.addressArr.forEach((item) => {
            endArr.push(item.name)
          })
          this.addEnd = endArr.join(' ')
          this.addressArr = []
        }
      },
      changeAddr(index) {
        switch (index) {
          case 0:
            this.addressArr = []
            this.address = provinces
            break
          case 1:
            this.addressArr.splice(1, 1)
            this.address = findPlaceById(this.addressArr[0].id)['Children']
            break
        }
      },
      editAdd(item, index) {
        let addArr = []
        this.getAddress(item.PlaceId).forEach((arr) => {
          this.editorAddNum.push(arr[1])
          addArr.push(arr[0])
        })
        this.newAddress = false
        this.editorModel = true
        this.isDefault = item.Default
        this.detailAddress = item.Detail
        this.addressName = item.Receiver
        this.addressTel = item.Cellphone
        this.postCode = item.Postcode
        this.addEnd = addArr.join(' ')
        this.placeId = item.PlaceId
        this.id = item.Id
        this.editIndex = index
        this.liItem = item
      },
      delAddr(item, index, flag) {
        let self = this
        let id = item.Id ? item.Id : this.id
        let idx = index || this.editIndex
        if (flag) {
          this.$actionSheet({
            title: '确认删除此地址吗?',
            comfirm: {
              text: '删除',
              callback() {
                request.remove('address', id, {}).then(res => {
                  self.addListObj.splice(idx, 1)
                  // self.$refs.domlis.forEach((item, idx) => {
                  //   item.style[transform] = 'translate(0px,0px)'
                  // })
                  self.newAddress = true
                  self.$toast.center('删除成功')
                }, res => {
                  res.hide()
                  self.$toast.center('删除失败')
                })
                this.cancelFn()
              }
            },
            cancel: {
              text: '取消'
            }
          })
        } else {
          this.$dialog({
            title: '删除地址',
            content: '确定要删除该地址吗?',
            btnArr: [
              {
                text: '取消',
                className: 'view-btn',
                callback: function() {
                  this.close()
                }
              },
              {
                text: '确定',
                className: 'use-btn',
                callback: function() {
                  this.close()
                  request.remove('address', id, {}).then(res => {
                    self.addListObj.splice(idx, 1)
                    self.$refs.domlis.forEach((item, idx) => {
                      item.style[transform] = 'translate(0px,0px)'
                    })
                    self.newAddress = true
                    self.$toast.center('删除成功')
                  }, res => {
                    res.hide()
                    self.$toast.center('删除失败')
                  })
                }
              }
            ]
          })
        }
      }
    },
    computed: {
      defaultValue() {
        let placeId = this.placeId
        if (placeId) {
          return [
            Math.floor(placeId / 1000) * 1000,
            Math.floor(placeId / 10) * 10,
            placeId
          ]
        } else {
          return [0, 0, 0]
        }
      },
      isMobile() {
        if (!(/^1[3|4|5|7|8][0-9]{9}$/.test(this.addressTel))) {
          return false
        }
        return true
      }
    }
  }
</script>
<style>
  .list-complete-item {
    transition: all .5s;
  }
  .list-complete-enter, .list-complete-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  .list-complete-leave-active {
    position: absolute;
    transition: all .1s;
    transform: translateX(-100%);
    width: 100%;
  }
  .flip-list-move {
    transition: transform .5s;
  }
  .flip-list-leave-active{
    transform: translateX(-120%) !important;
    transition: transform .3s !important;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
  }
</style>
