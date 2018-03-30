<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div class="table-stage">
    <div class="cell-wrap">
      <div class="front-wrap">
        <div class="form-wrap">
          <div class="text-center mb20">
            <a href="javascript:;">
              <img class="img-responsive" src="~images/logo/logo-wallwa-normal-login.png" alt="墙蛙 - 唤醒你的墙"/>
            </a>
          </div>
          <p class="tips mb10">完善你的账号信息</p>
          <form class="rl-form" id="bindForm">
            <div class="form-key-wrap">
              <div class="form-group" v-if="!has.Mobile">
                <label class="sr-only" for="phone">手机号</label>
                <input type="text" name="phone" style="display: none;"/>
                <span class="phone-select" @click='numtoggle'><span class="pnum" v-text='phoneDistrict'></span><span class="wa wa-angle-down waphone pull-right"></span></span>
                <input name="phone" v-model='user.Mobile' autocomplete="off" class="form-control input-lg validate[required,custom[mobile2]] pl110" id="phone-num" placeholder="请输入手机号">
              </div>
              <div class="form-group captcha-group" v-show='show'>
                <label class="sr-only" for="">图片验证码</label>
                <div class="captcha-input form-cont">
                  <input :maxlength="captchaLength" :disabled="validated" @blur="validate" v-model='user.CaptchaCode' type="text" name="captchaCode" class="form-control input-lg validate[required,custom[integer]]" id="captchaCode" placeholder="请输入验证码">
                </div>
                <div class="captcha-img">
                  <img :src='src' @click='refresh' alt="验证码"/>
                </div>
              </div>
              <div class="form-group special" v-if="!has.Mobile">
                <label class="sr-only" for="phonecode">手机验证码</label>
                <input type="text" name="pcode" style="display: none;"/>
                <input type="text" v-model='user.MobileVerifyCode' id="phonecode" name="pcode" autocomplete="off" class="form-control validate[required,custom[integer]] input-lg" placeholder="请输入短信验证码">
                <a class="btn forget sent-code forget-phone" v-if="!beigin" @click='sendMobile' href="javascript:;">发送验证码</a>
                <a href="javascript:;" :class="{disable:begin}" class="btn forget sent-code forget-phone" v-if="begin">{{count}}S</a>
              </div>
              <div class="form-group special " v-if="!has.HasPassword">
                <input type="text" name="password" style="display: none;"/>
                <label class="sr-only" for="password">密码</label>
                <input type="password" v-model='user.Password' name="password" class="form-control input-lg validate[required,minSize[6],maxSize[16]]" id="password" placeholder="请设置密码（6-16位数字或字母）">
              </div>
              <div class="form-group special " v-if="!has.Nickname">
                <input type="text" style="display: none;"/>
                <label class="sr-only" for="nickname">昵称</label>
                <input type="text" v-model='user.Nickname' name="nickname" class="form-control validate[required] input-lg" id="nickname" placeholder="请设置昵称">
              </div>
              <!-- 暂时去掉邮箱完善-->
              <!--<div class="form-group special " v-if="false">
                <input type="text" style="display: none;"/>
                <label class="sr-only" for="email">邮箱</label>
                <input type="text" v-model='user.Email' name="email" class="form-control validate[required,custom[email]] input-lg" id="email" placeholder="请设置邮箱">
              </div>
              <div class="form-group special" v-if="false">
                <input type="text" name="ecode"  style="display: none;"/>
                <label class="sr-only" for="ecode">邮箱验证码</label>
                <input type="text" v-model='user.EmailVerifyCode' id="emailcode" name="ecode" autocomplete="off" class="form-control validate[required,custom[integer]] input-lg" placeholder="请输入验证码">
                <a class="btn forget sent-code forget-phone" @click='sendEmail' href="javascript:;">发送验证码</a>
              </div>-->
              <!-- 暂时去掉邮箱完善-->
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block mb20">提交</button>
            <ul class="phone-select-ul" v-show='numlist'>
              <li @click='phoneDistri(item[item.length-1])' v-for="item in countries">
                <span>{{item[0]}}</span>
                <span class="pull-right">{{item[item.length-1]}}</span>
              </li>
            </ul>
          </form>
        </div>
        <div class="phone-select-mask" @click='numtoggle' v-show='numlist'></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Errors } from './const'
import {captcha, common} from './captcha.js'
export default {
  mixins: [captcha, common],
  data() {
    return {
      has: {},
      user: {},
      MobileVerify: {},
      EmailVerify: {},
      show: false,
      src: ''
    }
  },
  mounted() {
    let self = this
    let form = $('#bindForm')
    form.validationEngine('attach', {
      scroll: false,
      binded: false,
      maxErrorsPerField: 1,
      promptPosition: 'centerRight',
      Top: 7,
      custom_error_messages: {
        '#phone-num': {
          'required': {
            'message': '手机号不能为空'
          },
          'custom[mobile2]': {
            'message': '请输入正确的手机号'
          }
        },
        '#password': {
          'required': {
            'message': '密码不能为空'
          },
          'minSize': {
            'message': '密码最少为6位'
          },
          'maxSize': {
            'message': '密码最多为16位'
          }
        },
        '#nickname': {
          'required': {
            'message': '昵称不能为空'
          }
        },
        '#email': {
          'required': {
            'message': '邮箱不能为空'
          },
          'custom[email]': {
            'message': '请输入正确的邮箱'
          }
        },
        '#phonecode': {
          'required': {
            'message': '验证码不能为空'
          },
          'custom[integer]': {
            'message': '只能为数字'
          }
        },
        '#emailcode': {
          'required': {
            'message': '验证码不能为空'
          },
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
    request({ url: 'user/improve' }).then(res => {
      this.has = res.take('Data')
      if (!this.has['Mobile']) {
        self.check(2)
      }
    }, res => {
      res.hide()
      if (res.take('Error') === 'NotLogin') {
        layer.toast(Errors(res.take('Error')))
        setTimeout(function() {
          window.location.href = 'login.html?next=' + encodeURIComponent('improve.html')
        }, 1000)
      }
    })
    this.getCountries()
  },
  methods: {
    sendMobile() {
      const self = this
      let account = this.user.Mobile
      const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$/
      if (!account) {
        layer.toast('账号不能为空')
        return
      } else if (!reg.test(account)) {
        layer.toast('请输入正确的手机号')
        return
      }
      if (this.phoneDistrict !== '+86' && this.phoneDistrict !== '邮箱') {
        account = this.phoneDistrict + '-' + account
      }
      let u = {
        Type: 4,
        Account: account
      }
      u = _.merge(this.user, u)
      request.submit('verify/send', u).then(
        res => {
          let data = res.take('Data')
          self.user.MobileVerifyIdX = data['IdX']
        }, res => {
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    },
    sendEmail() {
      const self = this
      const account = this.user.Email
      const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$|^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i
      if (!account) {
        layer.toast('账号不能为空')
        return
      } else if (!reg.test(account)) {
        layer.toast('请输入正确的邮箱')
        return
      }
      let u = {
        Type: 4,
        Account: account
      }
      request.submit('verify/send', u).then(
        res => {
          let data = res.take('Data')
          self.user.EmailVerifyIdX = data['IdX']
        }, res => {
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    },
    submit() {
      request.submit('user/improve', this.user).then(
        res => {
          layer.toast('提交成功')
          setTimeout(function() { window.location.href = '/' }, 1000)
        }, res => {
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    }
  }
}
</script>
