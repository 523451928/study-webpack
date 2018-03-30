<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->
<template>
  <div class="table-stage">
    <div class="cell-wrap load-container">
      <div class="cont-container active">
        <div class="form-wrap min413">
          <div class="text-center mb30">
            <a href="/">
              <img src="~images/logo/logo-wallwa-normal-login.png" alt="墙蛙 - 唤醒你的墙"/>
            </a>
          </div>
          <ul class="login-nav mb30 clearfix">
            <li :class='{active:active==1}' @click='tabli(1)'>密码登录</li>
            <li :class='{active:active==2}' @click='tabli(2)'>验证码登录</li>
            <li :class='{active:active==3}' @click='tabli(3)'>第三方登录</li>
          </ul>
          <div class="tab-content">
            <!-- 密码登录 -->
            <div class="tab-pane" :class='{active:active==1}'>
              <div class="rl-form form-base" >
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
                      <input :maxlength="captchaLength" @blur="validate" :disabled="validated" v-model='user.CaptchaCode' type="text" name="captchaCode" class="form-control input-lg validate[required,custom[integer]]" id="captchaCode" placeholder="请输入验证码">
                    </div>
                    <div class="captcha-img">
                      <img :src='src' @click='refresh' alt="验证码"/>
                    </div>
                  </div>
                  <div class="form-group special">
                    <label class="sr-only" for="password">密码</label>
                    <input v-model='user.Password' @keyup.enter="login" type="password" name="password" class="form-control input-lg validate[required,minSize[6],maxSize[16]]" id="password" placeholder="请输入密码">
                    <a href="/forget" class="forget aaa">忘记密码?</a>
                  </div>
                </div>

                <button type='submit' @click="login" class="btn btn-primary btn-lg btn-block submitBtn mb25" ref="loginForm">登录</button>
                <a href="/register" class="aaa">新用户注册</a>
                <ul class="phone-select-ul" v-show='numlist'>
                  <li @click='phoneDistri(item[item.length-1])' v-for="item in countries">
                    <span>{{item[0]}}</span>
                    <span class="pull-right">{{item[item.length-1]}}</span>
                  </li>
                  <span class="divider"></span>
                  <li @click='phoneDistri("邮箱")'>
                    <span>邮箱</span>
                  </li>
                </ul>
              </div>
            </div>
            <!--验证码登录-->
            <div class="tab-pane" :class='{active:active==2}'>
              <div class="rl-form" id="phone-form" role="form" autocomplete="off">
                <div class="form-key-wrap">
                  <div class="form-group">
                    <input type="text" name="phone" style="display: none"/>
                    <label class="sr-only" for="phone">手机号</label>
                    <span class="phone-select" @click='numtoggle'><span class="pnum delmail" v-text='phoneDistrict2'></span><span class="wa wa-angle-down waphone pull-right"></span></span>
                    <input name="phone" v-model='user2.account' autocomplete="off" class="form-control input-lg validate[required,custom[mobile2]] pl110" id="phone-num" placeholder="请输入你的手机号">
                  </div>
                  <div class="form-group captcha-group" v-show='show2'>
                    <label class="sr-only">图片验证码</label>
                    <div class="captcha-input form-cont">
                      <input :maxlength="captchaLength" :disabled="validated2" @blur="validate2" id="captchaCode2" v-model='user2.CaptchaCode' type="text" name="captchaCode" class="form-control input-lg validate[required,custom[integer]]" placeholder="请输入验证码">
                    </div>
                    <div class="captcha-img">
                      <img :src='src2' @click='refresh2' alt="验证码"/>
                    </div>
                  </div>
                  <div class="form-group special">
                    <label class="sr-only" for="phonecode">验证码</label>
                    <input type="text"  @keyup.enter="login2" v-model='veriObj2.VerifyCode' name="phonecode" autocomplete="off" class="form-control input-lg validate[required,custom[integer]]" id="code" placeholder="请输入短信验证码">
                    <a class="btn forget sent-code forget-phone" v-if="!begin" @click='send' href="javascript:;">发送验证码</a>
                    <a href="javascript:;" :class="{disable:begin}" class="btn forget sent-code forget-phone" v-if="begin">{{count}}S</a>
                  </div>
                </div>

                <button type="submit" @click="login2" class="btn btn-primary btn-lg btn-block submitBtn mb25">登录</button>
                <span class="aaa">支持已经绑定过手机号的账号</span>
                <ul class="phone-select-ul" v-show='numlist'>
                  <li @click='phoneDistri2(item[item.length-1])' v-for="item in countries">
                    <span>{{item[0]}}</span>
                    <span class="pull-right">{{item[item.length-1]}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 第三方登录 -->
            <div class="tab-pane" :class='{active:active==3}'>
              <div class="social-wrap">
                <a class=" btn btn-success btn-block mb20 hide-sm" :href="`${baseUrl}/social/bind/weixin?Link=${localUrl.Link}`" target="_blank">
                  <span class="wa wa-wechat"></span>微信登录
                </a>
                <a class=" btn btn-primary btn-block mb20" :href="`${baseUrl}/social/bind/qq?Link=${localUrl.Link}`" target="_blank">
                  <span class="wa wa-qq"></span>QQ登录
                </a>
                <a class=" btn btn-danger btn-block" :href="`${baseUrl}/social/bind/weibo?Link=${localUrl.Link}`" target="_blank">
                  <span class="wa wa-weibo"></span>微博登录
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="phone-select-mask" @click='numtoggle' v-show='numlist'></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Errors } from './const'
// import { jump } from './jump'
import {captcha, captcha2, common} from './captcha.js'
import { InterfaceMap as Interf } from 'scripts/interfaceConst.js'
export default {
  mixins: [captcha, captcha2, common],
  data() {
    return {
      user: {}, // 账号密码登录的用户信息
      src: '', // Img图片
      show: false,
      active: 1,
      user2: {}, // 验证码登录的用户信息
      src2: '',
      show2: false,
      veriObj2: {},
      validated2: false,
      localUrl: {},
      baseUrl: Interf.baseUrl
    }
  },
  mounted() {
    let self = this
    // 记录历史Url
    self.localUrl = {
      Link: document.referrer
    }
    this.check(1)
    // 获得港澳台电话前缀
    this.getCountries()
  },
  methods: {
    tabli(num) {
      this.active = num
      if (num === 2) {
        this.check2()
      }
    },
    // 发送短信验证码
    send() {
      const self = this
      const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$/
      let account = this.user2.account
      if (!account) {
        this.$notify({
          text: '账号不能为空'
        })
        return
      } else if (!reg.test(account)) {
        this.$notify({
          text: '请输入正确的手机号'
        })
        return
      }
      let u = {
        Type: 1
      }
      this.getFastAccount()
      u = _.merge(this.user2, u)
      request.submit('verify/send', u).then(res => {
        let data = res.take('Data')
        self.begin = true
        self.countdown()
        this.$notify({
          text: '验证码已发送，请查收',
          type: 'wa-success'
        })
        self.validated2 = true
        self.veriObj2.VerifyIdX = data['IdX']
      }, res => {
        self.refresh2()
        res.hide()
        this.$notify({
          text: Errors(res.take('Error')),
          type: 'wa-error'
        })
      })
    },
    login() {
      const self = this
      if (!this.user.account) {
        this.$notify({
          text: '请输入账号'
        })
        return
      } else if ((!this.user.CaptchaCode || this.user.CaptchaCode.length < 4) && this.show) {
        this.$notify({
          text: '请输入正确的验证码'
        })
        return
      } else if (!this.user.Password) {
        this.$notify({
          text: '请输入密码'
        })
        return
      }
      this.getAccount()
      const u = _.merge(this.capchaObj, this.user)
      request.submit('user/login', u).then(res => {
        this.$notify({
          text: '登录成功',
          type: 'wa-success'
        })
        window.sessionStorage.setItem('userId', res.take('Data'))
        window.location.href = self.localUrl.Link
      }, res => {
        self.validated = false
        self.refresh()
        res.hide()
        this.$notify({
          text: Errors(res.take('Error')),
          type: 'wa-error'
        })
//        window.sessionStorage.setItem('userId', res.take('Data'))
//        window.location.href = self.localUrl.Link
      })
    },
    login2() {
      const self = this
      const reg = /^\s*1[34578][0-9]{9}\s*$|^([6|9])\d{7}$|^[6]([6|8])\d{5}$|^[9]\d{8}$/
      if (!reg.test(this.user2.account)) {
        this.$notify({
          text: '请输入正确的手机号'
        })
        return
      } else if (!this.user2.CaptchaCode) {
        this.$notify({
          text: '请输入正确的验证码'
        })
        return
      } else if (!this.veriObj2.VerifyCode) {
        this.$notify({
          text: '请输入正确的短信验证码'
        })
        return
      }
      this.getFastAccount()
      const u = _.merge(this.veriObj2, this.user2)
      request.submit('user/login/fast', u).then(res => {
        this.$notify({
          text: '登录成功',
          type: 'wa-success'
        })
        window.location.href = self.localUrl.Link
      }, res => {
        self.validated2 = false
        self.refresh2()
        res.hide()
        this.$notify({
          text: Errors(res.take('Error')),
          type: 'wa-error'
        })
      })
    }
  }
}
</script>
