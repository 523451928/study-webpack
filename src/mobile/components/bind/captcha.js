// Copyright 2016 CHEN Xianren. All rights reserved.
import { Errors } from './const'
export const common = {
  data() {
    return {
      numlist: false,
      phoneDistrict: '+86',
      phoneDistrict2: '+86',
      countries: [],
      capchaObj: {},
      validated: false,
      captchaLength: 4,
      begin: false,
      count: 60
    }
  },
  methods: {
    getCountries() {
      request({url: 'countries'}).then(res => {
        this.countries = res.body
      }, res => {
        res.hide()
        layer.toast(Errors(res.take('Error')))
      })
    },
    numtoggle() {
      this.numlist = !this.numlist
    },
    phoneDistri(text) {
      this.phoneDistrict = text
      this.numlist = !this.numlist
    },
    phoneDistri2(text) {
      this.phoneDistrict2 = text
      this.numlist = !this.numlist
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
    }
  }
}
export const captcha = {
  methods: {
    check(type) {
      let url = 'captcha/get'
      let params = { Type: type }
      request({ url, params }).then(res => {
        let data = res.take('Data')
        if (data != null) {
          this.show = true
          this.captchaLength = data.Length
          this.user.CaptchaIdX = data.IdX
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
      let params = { IdX: this.capchaObj.CaptchaIdX }
      request({ url, params }).then(res => {
        let data = res.take('Data')
        if (data != null) {
          self.src = data.DataUrl
          self.user.CaptchaIdX = data.IdX
        }
      })
    },
    validate() {
      if (this.validated) return
      let url = 'captcha/validate'
      let params = { IdX: this.user.CaptchaIdX, Code: this.user.CaptchaCode }
      request({ url, params }).then(res => {
        if (res.take('Pass')) {
          this.validated = true
          return
        }
        if (res.take('Data')) {
          let data = res.take('Data')
          this.src = data.DataUrl
          this.user.CaptchaIdX = data.IdX
        }
      })
    },
    getAccount() {
      if (this.phoneDistrict !== '+86' && this.phoneDistrict !== '邮箱') {
        this.user.Account = this.phoneDistrict + '-' + this.user.account
      } else {
        this.user.Account = this.user.account
      }
    }
  }
}
