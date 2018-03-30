<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div class="table-stage">
    <div class="cell-wrap load-container loading">
      <div class="front-wrap cont-container" :class="{'active':container,'hide':!hide}">
        <div class="form-wrap">
          <div class="text-center mb30">
            <a href="/">
              <img src="~images/logo/logo-wallwa-normal-login.png" alt="墙蛙 - 唤醒你的墙"/>
            </a>
          </div>
          <form class="rl-form" id="reg-form" role="form">
            <div class="form-key-wrap">
              <div class="form-group">
                <label class="sr-only" for="phone">手机号</label>
                <input type="text" name="phone" style="display: none;"/>
                <span class="phone-select" @click='numtoggle'><span class="pnum" v-text='phoneDistrict'></span><span class="wa wa-angle-down waphone pull-right"></span></span>
                <input name="phone" v-model='user.account' autocomplete="off" class="form-control input-lg validate[required,custom[mobile2]] pl110" id="phone-num" placeholder="请输入手机号">
              </div>
              <div class="form-group captcha-group" v-show='show'>
                <input type="text" style="display: none;"/>
                <label class="sr-only">图片验证码</label>
                <div class="captcha-input form-cont">
                  <input :maxlength="captchaLength" :disabled="validated" @blur="validate" v-model='user.CaptchaCode' type="text" name="captchaCode" class="form-control input-lg validate[required,custom[integer]]" id="captchaCode" placeholder="请输入验证码">
                </div>
                <div class="captcha-img">
                  <img :src='src' @click='refresh' alt="验证码"/>
                </div>
              </div>
              <div class="form-group special">
                <input type="text" name="phonec" style="display: none;"/>
                <label class="sr-only" for="phonecode">验证码</label>
                <input type="text" v-model='capchaObj.VerifyCode' name="phonec" class="form-control input-lg validate[required,custom[integer]]" id="code" placeholder="请输入短信验证码">
                <a class="btn forget sent-code forget-phone" v-if="!begin" @click='send' href="javascript:;">发送验证码</a>
                <a href="javascript:;" :class="{disable:begin}" class="btn forget sent-code forget-phone" v-if="begin">{{count}}S</a>
              </div>
              <div class="form-group special">
                <input type="text" style="display: none;"/>
                <label class="sr-only" for="password">密码</label>
                <input type="password" v-model='user.Password' name="password" class="form-control input-lg validate[required,minSize[6],maxSize[16]]" id="password" placeholder="请输入6-16位数字或字母">
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block mb20">注册</button>
            <div class="mail-bottom clearfix">
              <a class="fl aaa" href="/login">返回登录</a>
              <a class="fr" href="/useAgreement" target="_blank">《用户使用协议》</a>
            </div>
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
      <div class="callback-wrap" :class="{'hide':hide}">
        <div class="info">
          <h2>注册成功</h2>

          <p><strong class="countdown">{{countIndex}}</strong> 秒后自动跳转至首页！</p>

          <p><a href="/" class="uline-link">立即跳转</a></p>
        </div>
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
      user: {},
      src: '',
      show: false,
      container: false,
      countIndex: 5,
      hide: true
    }
  },
  mounted() {
    let self = this
    let form = $('#reg-form')
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
        '#captchaCode': {
          'required': {
            'message': '验证码不能为空'
          },
          'custom[integer]': {
            'message': '只能为数字'
          }
        },
        '#code': {
          'required': {
            'message': '短信验证码不能为空'
          },
          'custom[integer]': {
            'message': '只能为数字'
          }
        }
      },
      onValidationComplete: function(form, valid) {
        if (valid) {
          self.register()
        }
      }
    })
    this.check(2)
    this.getCountries()
    this.container = true
  },
  methods: {
    send() {
      const self = this
      let account = this.user.account
      const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$/
      if (!account) {
        layer.toast('账号不能为空')
        return
      } else if (!reg.test(account)) {
        layer.toast('请输入正确的手机号')
        return
      }
      let u = {
        Type: 2
      }
      this.getAccount()
      u = _.merge(this.user, u)
      request.submit('verify/send', u).then(
        res => {
          let data = res.take('Data')
          self.begin = true
          self.countdown()
          self.capchaObj.VerifyIdX = data['IdX']
          layer.toast('验证码已发送，请查收')
        }, res => {
        self.validated = false
        self.refresh()
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    },
    register() {
      const self = this
      this.getAccount()
      const u = _.merge(this.capchaObj, this.user)
      request.submit('user/register', u).then(
        res => {
          self.hide = false
          let timer = setInterval(function() {
            (self.countIndex) --
            if (self.countIndex === 0) {
              clearInterval(timer)
              window.location.href = '/'
            }
          }, 1000)
        }, res => {
        this.validated = false
        this.refresh()
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    }
  }
}
</script>
