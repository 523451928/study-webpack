<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap" @click="hidePick">
      <div class="form form-base user-form" id="infoForm">
        <div class="panel panel-default">
          <div class="panel-heading">个人信息</div>
          <div class="panel-body profile-panel-body">
            <div class="form-group">
              <label>登录账户：</label>
              <div class="form-cont">
                <span class="msg color-d1"></span>
                <input type="text" v-model="Email" class="form-control validate[required]" id="realname" disabled="disabled" placeholder="登录账户">
              </div>
            </div>
            <div class="form-group mobile-group">
              <label for="realname">昵称：</label>
              <div class="form-cont">
                <span class="msg color-d1"></span>
                <input type="text" :class="{'input-error': !Nickname && isSubmit}" v-model="Nickname" class="form-control validate[required]" id="realname"  placeholder="昵称">
              </div>
            </div>
            <div class="form-group sex-group">
              <label>性别：</label>
              <div class="form-cont">
                <label class="radio-inline text-left" for="male" >
                  <input type="radio" name="sex" id="male" v-model='Gender' value="1">
                  <span :class="{'checked': Gender==1}"></span>
                  男
                </label>
                <label class="radio-inline text-left" for="female">
                  <input type="radio" name="sex" id="female" v-model='Gender' value="2">
                  <span :class="{'checked': Gender==2}"></span>
                  女
                </label>
              </div>
            </div>
            <div class="form-group birth-group">
              <label for="birth">生日：</label>
              <div class="form-cont">
                <input :class="{'input-error': Birthday.length !== 10 && isSubmit}" @click.stop="selectDate" type="text" v-model="Birthday" class="form-control validate[required]" id="birth">
                <span class="wa wa-calendar" @click.stop="selectDate"></span>
              </div>
            </div>
            <!--<div class="form-group mobile-group" v-if="Mobile">-->
              <!--<label >手机号：</label>-->
              <!--<div class="form-cont">-->
                <!--<span class="msg color-d1"></span>-->
                <!--<input type="text" v-model="Mobile" class="form-control validate[required]" id="realname" disabled="disabled" placeholder="手机号">-->
              <!--</div>-->
            <!--</div>-->
            <div class="form-group">
               <label class="top">简介：</label>
               <div class="form-cont">
                 <textarea  placeholder="用简短的话介绍下自己吧！这样就可以找到更多小伙伴啦...最多可以填写80个字哦..." v-model="Introduction"></textarea>
                 <p>剩余可填写<span>{{textCount}}</span>个字</p>
               </div>
            </div>
          </div>
        </div>
        <button @click="submit" class="btn btn-primary btn-lg btn-submit" id="submit-btn">保存</button>
      </div>
      <transition name="fade-in">
        <pick-date :isChangeYear="true" minDate="1930-01-01" v-show="pickShow" :pickStyle="pickStyle" :pickDate="Birthday" @output="writePut"  @cancelPick="hidePick"></pick-date>
      </transition>
    </div>
  </div>
</template>
<style lang="sass">
  .form-group {
    .top{
      vertical-align: top;
    }
  }
  .btn-submit{
    width: 140px;
    height: 35px;
    line-height: 12px;
    background: #26a7c7;
    border-radius: 2px;
    font-size: 16px;
    margin-top: 0;
  }
  .tab-content{
    padding-bottom: 35px;
  }
  .profile-panel-body{
    padding: 22px 0 30px 20px;
  }
</style>
<script>
  /* eslint-disable */
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  import { debounce } from 'scripts/tools/debounce'
  import { padLeftZero } from 'scripts/tools/padLeftZero'
  import PickDate from '../public/Pickdate.vue'
  export default {
    components: {
      PickDate
    },
    data() {
      return {
        pickStyle: {
          left: '123px',
          top: '249px'
        },
        pickShow: false,
        src: '',
        RealName: '',
        Gender: '',
        Birthday: '1990-01-01',
        Nickname: '',
        Mobile: '',
        Email: '',
        Introduction: '',
        isSubmit: false
      }
    },
    mounted() {
//      $('#birth').cxCalendar()
      document.querySelector('textarea').style.height = '140px'
      this.pull()
      this.$watch('Birthday', debounce((newVal) => {
        if (newVal.length === 4) {
          this.Birthday += '-'
        } else if (newVal.length === 7) {
          this.Birthday += '-'
        }
      }, 500))
    },
    watch: {
      Introduction(newVal) {
        if (newVal.length >= 80) {
          this.Introduction = this.Introduction.slice(0, 80)
        }
      }
    },
    computed: {
      textCount() {
        return 80 - this.Introduction.length
      }
    },
    methods: {
      selectDate(e) {
        this.pickShow = !this.pickShow
//        this.pickStyle = {
//          left: this.getLeftAndTop(e.target).left + 'px',
//          top: this.getLeftAndTop(e.target).top - e.layerY + e.target.clientHeight + 'px',
//        }
      },
      getLeftAndTop(elm) {
        let left = elm.offsetLeft
        let top = elm.offsetTop
        let parentElm = elm.offsetParent
        while (parentElm !== null ) {
          left += parseInt(parentElm.offsetLeft)
          top += parseInt(parentElm.offsetTop)
          if (parentElm.className == 'form-wrap') {
            break
          }
          parentElm = parentElm.offsetParent
        }
        return {
          left,
          top
        }
      },
      hidePick() {
        this.pickShow = false
      },
      writePut(val) {
        this.Birthday = val
        this.pickShow = false
      },
      pull() {
        request({url: 'profile/get'}).then(res => {
          let data = res.take('Data')
          if (data['RealName']) { this.RealName = data['RealName'] }
          if (data['Gender']) { this.Gender = data['Gender'] }
          if (data['Birthday']) {
            let str = String(data['Birthday'])
            this.Birthday = `${str.slice(0, -4)}-${str.slice(-4, -2)}-${str.slice(-2)}`
          }
          if (data['Introduction']) {
            this.Introduction = data['Introduction']
          }
        })
        request({url: 'user/improve'}).then((res) => {
          let data = res.take('Data')
          this.Nickname = data.Nickname
          this.Mobile = data.Mobile
          this.Email = data.Email
        })
      },
      submit() {
        this.isSubmit = true
        let params = {
          RealName: this.RealName || 'wallwa',
          Gender: this.Gender,
          Introduction: this.Introduction
        }
        let birthArr = this.Birthday.split('-')
        if (birthArr.length > 0) {
          let arr = []
          birthArr.forEach((item) => {
            if (item != 0) {
              arr.push(padLeftZero(item))
            }
          })
          params.Birthday = arr.join('')
        }
        if (params.Birthday.length !== 8) {
          this.$notify({
            type: 'wa-warning',
            text: '请输入正确格式的生日'
          })
          return
        }

        if (!this.Nickname) {
          this.$notify({
            type: 'wa-warning',
            text: '昵称不能为空'
          })
          return
        }
        request.submit('profile/save', params).then((res) => {
          let arr = []
          this.Birthday.split('-').forEach((item) => {
            if (item != 0) {
              arr.push(padLeftZero(item))
            }
          })
          this.Birthday = arr.join('-')
          this.$bus.$emit('refreshProfile')
        }).catch((err) => {
          console.log(err)
        })
        request.submit('user/improve', {Nickname: this.Nickname}).then((res) => {
          this.$user.Nickname = this.Nickname
          this.isSubmit = false
          this.$notify({
            type: 'wa-success',
            text: '保存成功'
          })
        })
      }
    }
  }
</script>
