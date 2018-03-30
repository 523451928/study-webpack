<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <form class="form form-base user-form" id="infoForm">
        <div class="panel panel-default">
          <div class="panel-heading">账号管理</div>
          <div class="panel-body profile-panel-body">
            <div class="form-group">
              <label for="nickname">昵称：</label>
              <div class="form-cont">
                <input type="text" v-if="!has.Nickname" v-model="Nickname" class="form-control" id="nickname" placeholder="昵称">
                <p v-else v-text="has.Nickname"></p>
              </div>
            </div>
            <div class="form-group">
              <label for="mobile">手机：</label>
              <div class="form-cont">
                <input type="text" v-if="!has.Mobile" v-model="Mobile" class="form-control validate[custom[mobile]]" id="mobile" placeholder="手机">
                <p v-else v-text="has.Mobile"></p>
              </div>
            </div>
            <template v-if="!has.Mobile && loading">
              <div class="form-group" v-if="show">
                <label>图片验证码：</label>
                <div class="form-cont">
                  <input :maxlength="captchaLength" @blur="validate" :disabled="validated" v-model='mobileVeriCode' type="text" class="form-control validate[required,custom[integer]]" id="captchaCode" placeholder="请输入验证码">
                </div>
                <div class="form-cont">
                  <img :src='src' @click='refresh' alt="验证码"/>
                </div>
              </div>
              <div class="form-group">
                <label>手机验证码：</label>
                <div class="form-cont">
                  <input type="text" v-model='MobileVerifyCode' id="phonecode" class="form-control validate[custom[integer]]" placeholder="请输入短信验证码">
                  <a class="btn forget sent-code forget-phone" @click='sendMobile' v-if="!begin" href="javascript:;">发送验证码</a>
                  <a href="javascript:;" :class="{disable:begin}" class="btn forget sent-code forget-phone" v-if="begin">{{count}}S</a>
                </div>
              </div>
            </template>

            <!--<div class="form-group">
              <label for="email">邮箱：</label>
              <div class="form-cont">
                <input type="text" v-if="!has.Email" v-model="Email" class="form-control validate[custom[email]]" id="email" placeholder="邮箱">
                <p v-else v-text="has.Email"></p>
              </div>
            </div>
            <div class="form-group" v-if="show">
              <label for="emailcode">图片验证码：</label>
              <div class="form-cont">
                <input :maxlength="captchaLength" @blur="validate" :disabled="validated" v-model='user.CaptchaCode' type="text" name="captchaCode" class="form-control input-lg validate[required,custom[integer]]" id="captchaCode" placeholder="请输入验证码">
              </div>
              <div class="form-cont">
                <img :src='src' @click='refresh' alt="验证码"/>
              </div>
            </div>
            <div class="form-group" v-if="!has.Email">
              <label for="emailcode">邮箱验证码：</label>
              <div class="form-cont">
                <input type="text" v-model='EmailVerifyCode' id="emailcode" name="emailcode" autocomplete="off" class="form-control validate[custom[integer]]" placeholder="请输入邮箱验证码">
                <a class="btn forget sent-code forget-phone" @click='sendEmail' href="javascript:;">发送验证码</a>
              </div>
            </div>-->
            <div class="form-group">
              <a href="setting.html#/password">设置密码</a>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" id="submit-btn">保存</button>
      </form>
    </div>
  </div>
</template>
<style>
  .sent-code{
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
<script>
  import { Errors } from './const'
  export default {
    data() {
      return {
        Nickname: '',
        Mobile: '',
        Email: '',
        has: {},
        HasPassword: true,
        MobileVerifyIdX: '',
        MobileVerifyCode: '',
        EmailVerifyIdX: '',
        EmailVerifyCode: '',
        mobileCode: 0,
        emailCode: 0,
        show: false,
        loading: false,
        validated: false,
        src: '',
        capchaObj: {},
        captchaLength: 4,
        begin: false,
        count: 60,
        mobileVeriCode: ''
      }
    },
    mounted() {
      let self = this
      const form = $('#infoForm')
      request({ url: 'user/improve' }).then(res => {
        self.has = res.take('Data')
        if (!self.has.Mobile) {
          self.check()
        }
        self.loading = true
        self.HasPassword = self.has.HasPassword
      })
      form.validationEngine('attach', {
        scroll: false,
        binded: false,
        maxErrorsPerField: 1,
        promptPosition: 'centerRight',
        custom_error_messages: {
          '#mobile': {
            'custom[mobile]': {
              'message': '请输入正确的手机号'
            }
          },
          '#phonecode': {
            'custom[integer]': {
              'message': '只能为数字'
            }
          },
          '#email': {
            'custom[email]': {
              'message': '请输入正确的邮箱'
            }
          },
          '#emailcode': {
            'custom[integer]': {
              'message': '只能为数字'
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
      sendMobile() {
        const self = this
        const account = this.Mobile
        const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$/
        if (!account) {
          layer.toast('账号不能为空')
          return
        } else if (!reg.test(account)) {
          layer.toast('请输入正确的手机号')
          return
        }
        let u = {
          Type: 5,
          Account: account,
          CaptchaIdX: this.MobileVerifyIdX,
          CaptchaCode: this.mobileVeriCode
        }
        request.submit('verify/send', u).then(
          res => {
            let data = res.take('Data')
            self.begin = true
            self.countdown()
            self.MobileVerifyIdX = data['IdX']
            layer.toast('验证码已发送，请查收')
          }, res => {
          self.validated = false
          self.refresh()
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      sendEmail() {
        const self = this
        const account = this.Email
        const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$|^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i
        if (!account) {
          layer.toast('账号不能为空')
          return
        } else if (!reg.test(account)) {
          layer.toast('请输入正确的邮箱')
          return
        }
        let u = {
          Type: 5,
          Account: account
        }
        request.submit('verify/send', u).then(
          res => {
            let data = res.take('Data')
            self.emailCode = data['Code']
            self.EmailVerifyIdX = data['IdX']
          }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      countdown() {
        let self = this
        let timer = setInterval(function() {
          if (self.count === 1) {
            clearInterval(timer)
            self.count = 60
            self.begin = false
          } else {
            self.count--
          }
        }, 1000)
      },
      check() {
        let url = 'captcha/get'
        let params = {
          Type: 2
        }
        request({ url, params }).then(res => {
          let data = res.take('Data')
          if (data != null) {
            this.show = true
            this.captchaLength = data.Length
            this.MobileVerifyIdX = data.IdX
            this.src = data.DataUrl
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
          if (res.take('Error') === 'AlreadyLogin') {
            setTimeout(function() {
              window.location.href = '/'
            }, 1000)
          }
        })
      },
      refresh() {
        const self = this
        if (this.validated) return
        let url = 'captcha/refresh'
        let params = { IdX: this.MobileVerifyIdX }
        request({ url, params }).then(res => {
          let data = res.take('Data')
          if (data != null) {
            self.src = data.DataUrl
            self.MobileVerifyIdX = data.IdX
          }
        })
      },
      validate() {
        if (this.validated) return
        let url = 'captcha/validate'
        let params = { IdX: this.MobileVerifyIdX, Code: this.mobileVeriCode }
        request({ url, params }).then(res => {
          if (res.take('Pass')) {
            this.validated = true
            return
          }
          if (res.take('Data')) {
            let data = res.take('Data')
            this.src = data.DataUrl
            this.MobileVerifyIdX = data.IdX
          }
        })
      },
      submit() {
        let obj = {
          'Mobile': this.Mobile,
          'MobileVerifyIdX': this.MobileVerifyIdX,
          'MobileVerifyCode': this.MobileVerifyCode,
          'Email': this.Email,
          'EmailVerifyIdX': this.EmailVerifyIdX,
          'EmailVerifyCode': this.EmailVerifyCode,
          'Nickname': this.Nickname
        }
        obj = _.pickBy(obj, function(v) {
          return !!v
        })
        if (_.isEmpty(obj)) { return }
        request.submit('user/improve', obj).then(
        res => {
          let num = res.take('Data')
          if (num) {
            layer.toast('资料更新成功')
            setTimeout(function() { window.location.href = 'setting.html' }, 1000)
          } else {
            layer.toast('请正确填写后重试')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      }
    }
  }
</script>

