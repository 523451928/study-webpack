<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="form form-base user-form" id="passwordForm">
        <div class="panel panel-default">
          <div class="panel-heading">修改密码</div>
          <div class="panel-body password-panel-body">
            <div class="form-group">
              <label for="oldpwd">旧密码：</label>
              <div class="form-cont">
                <input type="password" :class="{'input-error': Oldpassword.length < 6 && isSubmit}" v-model="Oldpassword" class="form-control validate[required,minSize[6]]" id="oldpwd" placeholder="旧密码">
              </div>
            </div>
            <div class="form-group">
              <label for="newpwd">新密码：</label>
              <div class="form-cont">
                <input type="password" :class="{'input-error': Newpassword.length < 6 && isSubmit}" v-model="Newpassword" class="form-control validate[required,minSize[6]]" id="newpwd" placeholder="新密码">
              </div>
            </div>
            <div class="form-group">
              <label for="cfmpwd">确认新密码：</label>
              <div class="form-cont">
                <input type="password" :class="{'input-error': Confirmpassword !== Newpassword && isSubmit || Newpassword.length < 6 && isSubmit}" v-model="Confirmpassword" class="form-control validate[equals[newpwd]]" id="cfmpwd" placeholder="确认密码">
              </div>
            </div>
          </div>
        </div>
        <button type="submit" @click="submit" class="btn btn-primary btn-lg btn-submit" id="submit-btn">保存</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { Errors } from './const'
  export default {
    data() {
      return {
        Oldpassword: '',
        Newpassword: '',
        Confirmpassword: '',
        isSubmit: false
      }
    },
    mounted() {
//      let self = this
//      const form = $('#passwordForm')
//      form.validationEngine('attach', {
//        scroll: false,
//        maxErrorsPerField: 1,
//        binded: false,
//        promptPosition: 'centerRight',
//        custom_error_messages: {
//          '#oldpwd': {
//            'required': {
//              'message': '旧密码不能为空'
//            },
//            'minSize': {
//              'message': '密码最少为6位'
//            }
//          },
//          '#newpwd': {
//            'required': {
//              'message': '新密码不能为空'
//            },
//            'minSize': {
//              'message': '新密码最少为6位'
//            }
//          }
//        },
//        onValidationComplete: function(form, valid) {
//          if (valid) {
//            self.submit()
//          }
//        }
//      })
    },
    methods: {
      submit() {
        this.isSubmit = true
        let obj = {
          'OldPassword': this.Oldpassword,
          'NewPassword': this.Newpassword
        }
        if (!this.Oldpassword) {
          this.$notify({
            text: '旧密码不能为空'
          })
          return
        } else if (this.Oldpassword.length < 6) {
          this.$notify({
            text: '旧密码长度不能小于6位'
          })
          return
        }
        if (!this.Newpassword) {
          this.$notify({
            text: '新密码不能为空'
          })
          return
        } else if (this.Newpassword.length < 6) {
          this.$notify({
            text: '新密码长度不能小于6位'
          })
          return
        }
        if (this.Confirmpassword !== this.Newpassword) {
          this.$notify({
            text: '确认密码不一致'
          })
          return
        }
        request.submit('user/change/password', obj).then(
          res => {
            if (res.take('Data')) {
              this.$notify({
                text: '密码重置成功',
                type: 'wa-success'
              })
            }
            this.isSubmit = false
          }, res => {
          res.hide()
          this.$notify({
            text: Errors(res.take('Error')),
            type: 'wa-error'
          })
//          layer.toast(Errors(res.take('Error')))
        })
      }
    }
  }
</script>
