<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <form class="form form-base user-form" id="passwordForm">
        <div class="panel panel-default">
          <div class="panel-heading">修改密码</div>
          <div class="panel-body profile-panel-body">
            <div class="form-group">
              <label for="oldpwd">昵称：</label>
              <div class="form-cont">
                <input type="password" v-model="Oldpassword" class="form-control validate[required,minSize[6]]" id="oldpwd" placeholder="旧密码">
              </div>
            </div>
            <div class="form-group">
              <label for="newpwd">新密码：</label>
              <div class="form-cont">
                <input type="password" v-model="Newpassword" class="form-control validate[required,minSize[6]]" id="newpwd" placeholder="新密码">
              </div>
            </div>
            <div class="form-group">
              <label for="cfmpwd">新密码：</label>
              <div class="form-cont">
                <input type="password" class="form-control validate[equals[newpwd]]" id="cfmpwd" placeholder="确认密码">
              </div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" id="submit-btn">提交</button>
      </form>
    </div>
  </div>
</template>
<script>
  import { Errors } from './const'
  export default {
    data() {
      return {
        Oldpassword: '',
        Newpassword: ''
      }
    },
    mounted() {
      let self = this
      const form = $('#passwordForm')
      form.validationEngine('attach', {
        scroll: false,
        maxErrorsPerField: 1,
        binded: false,
        promptPosition: 'centerRight',
        custom_error_messages: {
          '#oldpwd': {
            'required': {
              'message': '旧密码不能为空'
            },
            'minSize': {
              'message': '密码最少为6位'
            }
          },
          '#newpwd': {
            'required': {
              'message': '新密码不能为空'
            },
            'minSize': {
              'message': '新密码最少为6位'
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
      submit() {
        let obj = {
          'OldPassword': this.Oldpassword,
          'NewPassword': this.Newpassword
        }
        request.submit('user/change/password', obj).then(
          res => {
            if (res.take('Data')) { layer.toast('密码重置成功') }
            setTimeout(function() { window.location.href = 'setting.html' }, 1000)
          }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      }
    }
  }
</script>
