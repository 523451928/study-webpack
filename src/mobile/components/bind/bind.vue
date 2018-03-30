<template>
  <div class="table-stage">
    <div class="cell-wrap load-container loading">
      <div class="load-wrap">
        <div class="ww-loading"></div>
      </div>
      <div class="front-wrap cont-container" :class="{'active':container,'hide':!hide}">
        <div class="form-wrap">
          <div class="text-center mb30">
            <a href="/">
              <img src="~images/logo/logo-wallwa-normal-login.png" alt="墙蛙 - 唤醒你的墙"/>
            </a>
          </div>
          <p class="tips">完善你的账号信息</p>
          <form class="tab-pane rl-form" id="reg-form" role="form" :class='{active:active==1}'>
            <div class="form-key-wrap">
              <div class="form-group">
                <label class="sr-only" for="phone">手机号</label>
                <input type="text" name="phone" style="display: none;"/>
                <span class="phone-select" @click='numtoggle'><span class="pnum" v-text='phoneDistrict'></span><span class="wa wa-angle-down waphone pull-right"></span></span>
                <input name="phone" v-model='user.account' autocomplete="off" class="form-control input-lg validate[required,custom[mobile2]] pl110" id="phone-num" placeholder="请输入手机号">
              </div>
              <div class="form-group captcha-group" v-show='show'>
                <label class="sr-only">图片验证码</label>
                <div class="captcha-input form-cont">
                  <input type="text" name="new" style="display: none;"/>
                  <input :maxlength="captchaLength" :disabled="validated" @blur="validate" v-model='user.CaptchaCode' type="text" name="new" class="form-control input-lg validate[required,custom[integer]]" id="captchaCode" placeholder="请输入验证码">
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

            <button type="submit" class="btn btn-primary btn-lg btn-block mb20">绑定</button>
            <div class="mail-bottom clearfix">
              <a class="fl aaa">已有Wallwa账号？</a>
              <a class="fr" href="javascript:;"  @click='tabli(2)'>绑定已有账号</a>
            </div>
            <ul class="phone-select-ul" v-show='numlist'>
              <li @click='phoneDistri(item[item.length-1])' v-for="item in countries">
                <span>{{item[0]}}</span>
                <span class="pull-right">{{item[item.length-1]}}</span>
              </li>
            </ul>
          </form>
          <form class="tab-pane rl-form form-base" id="login-form" :class='{active:active==2}' >
            <div class="form-key-wrap">
              <div class="form-group">
                <label class="sr-only" for="email">邮箱</label>
                <input type="text" name="email" style="display: none;"/>
                <span class="phone-select" @click='numtoggle'><span class="pnum" v-text='phoneDistrict'></span><span class="wa wa-angle-down waphone pull-right"></span></span>
                <input name="email" v-model='user.account' class="form-control input-lg validate[required,custom[phonemail]] pl110" id="email" placeholder="请输入手机号/邮箱">
              </div>
              <div class="form-group captcha-group" v-show='show'>
                <label class="sr-only">图片验证码</label>
                <input type="hidden" name="captchaCode" style="display: none;"/>
                <div class="captcha-input form-cont">
                  <input :maxlength="captchaLength" @blur="validate" :disabled="validated" v-model='user.CaptchaCode' type="text" name="captchaCode" class="form-control input-lg validate[required,custom[integer]]" id="captchaCode2" placeholder="请输入验证码">
                </div>
                <div class="captcha-img">
                  <img :src='src' @click='refresh' alt="验证码"/>
                </div>
              </div>
              <div class="form-group special">
                <label class="sr-only" for="password">密码</label>
                <input v-model='user.Password' type="password" name="password" class="form-control input-lg validate[required,minSize[6],maxSize[16]]" id="password2" placeholder="请输入密码">
                <a href="/forget.html" class="forget aaa">忘记密码?</a>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block submitBtn mb25">登录</button>
            <a href="javascript:void(0)" class="aaa" @click='tabli(1)'>返回</a>
            <ul class="phone-select-ul" v-show='numlist'>
              <li @click='phoneDistri2(item[item.length-1])' v-for="item in countries">
                <span>{{item[0]}}</span>
                <span class="pull-right">{{item[item.length-1]}}</span>
              </li>
              <span class="divider"></span>
              <li @click='phoneDistri2("邮箱")'>
                <span>邮箱</span>
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
import { getParameter } from 'js/getParameter.js'
import {captcha, common} from './captcha.js'
export default {
  mixins: [captcha, common],
  data() {
    return {
      user: {},
      user2: {},
      src: '',
      show: false,
      veriObj: {},
      code: 0,
      container: false,
      countIndex: 5,
      hide: true,
      active: 1,
      state: 0
    }
  },
  created() {
    this.state = getParameter('State')
  },
  mounted() {
    let self = this
    let form = $('#reg-form')
    let form2 = $('#login-form')
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
    form2.validationEngine('attach', {
      scroll: false,
      binded: false,
      maxErrorsPerField: 1,
      promptPosition: 'centerRight',
      Top: 7,
      custom_error_messages: {
        '#email': {
          'required': {
            'message': '手机号或邮箱不能为空'
          },
          'custom[phonemail]': {
            'message': '手机号或邮箱地址格式有误'
          }
        },
        '#captchaCode2': {
          'required': {
            'message': '验证码不能为空'
          },
          'custom[integer]': {
            'message': '只能为数字'
          }
        },
        '#password2': {
          'required': {
            'message': '密码不能为空'
          },
          'minSize': {
            'message': '密码最少为6位'
          },
          'maxSize': {
            'message': '密码最多为16位'
          }
        }
      },
      onValidationComplete: function(form, valid) {
        if (valid) {
          self.login()
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
    tabli(num) {
      this.active = num
      if (num === 1) {
        this.check(2)
      } else if (num === 2) {
        this.check(1)
      }
      this.user = {}
      this.capchaObj = {}
    },
    cb() {
      let self = this
      let params = { 'State': self.state }
      request.submit('social/bind/bind', params).then(res => {
        window.location.href = '/'
      }, res => {
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
          let state = self.state
          if (!state) {
            layer.toast('链接无效请重试')
          } else {
            self.cb()
          }
        }, res => {
        this.validated = false
        this.refresh()
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    },
    login() {
      const self = this
      this.getAccount()
      const u = _.merge(this.capchaObj, this.user)
      request.submit('user/login', u).then(res => {
        let state = self.state
        if (!state) {
          layer.toast('链接无效请重试')
        } else {
          self.cb()
        }
      }, res => {
        self.validated = false
        self.refresh()
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    }
  }
}
</script>
