<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <form class="form form-base user-form" id="infoForm">
        <div class="panel panel-default">
          <div class="panel-heading">个人信息</div>
          <div class="panel-body profile-panel-body">
            <div class="form-group">
              <label>头像：</label>
              <div class="form-cont">
                <a href="setting.html#/avatar" class="block layout-avatar">
                  <div class="hover-layout text-center">
                    <span class="wa wa-camera"></span><br/>
                    更换头像
                  </div>
                  <img :src="src" alt="" class="avatarImg img-rounded"/>
                </a>
              </div>
            </div>
            <div class="form-group">
              <label for="realname">真实姓名：</label>
              <div class="form-cont">
                <span class="msg color-d1"></span>
                <input type="text" v-model="RealName" class="form-control validate[required]" id="realname" placeholder="真实姓名">
              </div>
            </div>
            <div class="form-group sex-group">
              <label>性别：</label>
              <div class="form-cont">
                <label class="radio-inline text-left" for="female">
                  <input type="radio" name="sex" id="female" v-model='Gender' value="2">
                  女
                </label>
                <label class="radio-inline text-left" for="male" >
                  <input type="radio" name="sex" id="male" v-model='Gender' value="1">
                  男
                </label>
              </div>
            </div>
            <div class="form-group birth-group">
              <label for="birth">生日：</label>
              <div class="form-cont">
                <input type="text" v-model="Birthday" class="form-control validate[required]" id="birth">
              </div>
            </div>
            <div class="form-group place-group">
              <label>家乡：</label>
              <div class="form-cont">
                <select class="form-control" v-model='homeProvince' id="abode-p" data-type="province">
                  <option :value="item['Id']" v-for="item in address">{{item['Name']}}</option>
                </select>
                <select class="form-control" v-show='x' v-model='homeCity' id="abode-c" data-type="city">
                  <option :value="item['Id']" v-for="item in son">{{item['Name']}}</option>
                </select>
                <select class="form-control" v-show='y' v-model='Hometown' id="abode-d" data-type="district">
                  <option :value="item['Id']" v-for="item in grandson">{{item['Name']}}</option>
                </select>
              </div>
            </div>
            <div class="form-group place-group">
              <label>居住地：</label>
              <div class="form-cont">
                <select class="form-control" v-model="residenceProvince" data-type="province">
                  <option :value="item['Id']" v-for="item in address">{{item['Name']}}</option>
                </select>
                <select class="form-control" v-show='o' v-model="residenceCity" data-type="city">
                  <option :value="item['Id']" v-for="item in residenceSon">{{item['Name']}}</option>
                </select>
                <select class="form-control" v-show='p' v-model="Residence" data-type="district">
                  <option :value="item['Id']" v-for="item in residenceGrandson">{{item['Name']}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" id="submit-btn">保存</button>
      </form>
    </div>
  </div>
</template>
<style lang="sass">
.avatarImg{
  width: 100px;
}
</style>
<script>
import {reorganizeAddr, reverse} from 'json/districts.js'
const Addr = reorganizeAddr
export default {
  data() {
    return {
      src: '/static/images/user/default-profile.jpg',
      RealName: '',
      Gender: 2,
      Birthday: '1990-01-01',
      homeProvince: '',
      homeCity: '',
      Hometown: '',
      residenceProvince: '',
      residenceCity: '',
      Residence: '',
      address: Addr,
      son: [],
      grandson: [],
      residenceSon: [],
      residenceGrandson: [],
      x: false,
      y: false,
      o: false,
      p: false
    }
  },
  mounted() {
    let self = this
    let $form = $('#infoForm')
    $('#birth').cxCalendar()
    self.pull()
    $form.validationEngine('attach', {
      scroll: false,
      binded: false,
      maxErrorsPerField: 1,
      promptPosition: 'centerRight',
      custom_error_messages: {
        '#realname': {
          'required': {
            'message': '真实姓名不能为空'
          }
        },
        '#birth': {
          'required': {
            'message': '生日不能为空'
          }
        }
      },
      onValidationComplete: function(form, valid) {
        if (valid) {
          self.submit()
        }
      }
    })
  },
  methods: {
    pull() {
      let self = this
      request({url: 'profile/get'}).then(res => {
        let data = res.take('Data')
        let imgSrc = document.getElementById('selfAvatar').value
        self.src = imgSrc || '/static/images/user/default-profile.jpg'
        if (data['RealName']) { self.RealName = data['RealName'] }
        if (data['Gender']) { self.Gender = data['Gender'] }
        if (data['Birthday']) {
          let str = String(data['Birthday'])
          self.Birthday = `${str.slice(0, -4)}-${str.slice(-4, -2)}-${str.slice(-2)}`
        }
        if (data['Hometown']) {
          let obj = reverse(data['Hometown'])
          self.homeProvince = obj[0]['Id']
          self.homeCity = obj[1]['Id']
          self.Hometown = obj[2]['Id']
        }
        if (data['Residence']) {
          let obj = reverse(data['Residence'])
          self.residenceProvince = obj[0]['Id']
          self.residenceCity = obj[1]['Id']
          self.Residence = obj[2]['Id']
        }
      })
    },
    submit() {
      this.Birthday = document.getElementById('birth').value
      let params = {
        RealName: this.RealName,
        Gender: this.Gender,
        Birthday: Number(this.Birthday.split('-').join('')),
        Hometown: this.Hometown ? this.Hometown : this.homeCity,
        Residence: this.Residence ? this.Residence : this.residenceCity
      }
      request.submit('profile/save', params).then(
        res => {
          if (res.take('Data')) { layer.toast('资料更新成功') }
        }, res => {
        res.hide()
        layer.toast(res.data['Error'])
      }
      )
    }
  },
  watch: {
    'homeProvince': function(n, o) {
      if (n !== o) this.son = this.address[n]['Children']
      this.x = true
      this.y = false
    },
    'homeCity': function(n, o) {
      if (n !== o) this.grandson = this.son[n]['Children']
      if (_.isEmpty(this.grandson)) {
        this.Hometown = this.homeCity
      } else {
        this.y = true
      }
    },
    'residenceProvince': function(n, o) {
      if (n !== o) this.residenceSon = this.address[n]['Children']
      this.o = true
      this.p = false
    },
    'residenceCity': function(n, o) {
      if (n !== o) this.residenceGrandson = this.residenceSon[n]['Children']
      if (_.isEmpty(this.residenceGrandson)) {
        this.Residence = this.residenceCity
      } else {
        this.p = true
      }
    }
  }
}
</script>
