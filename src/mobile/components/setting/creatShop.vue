<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
      <div class="panel-heading">我要开店</div>
      <div class="panel-body master-panel-body" v-show="Status0">
        <div class="master-tips">
          <p class="mb30">为了保障图片的正版权益，开店需先经过身份认证，提交您的个人身份信息。<br/>
            您也可以选择暂不认证，直接开店。体验期间，您可以正常使用墙蛙网的开店功能。为确保您的资金安全，在您进行
            收益提现时，仍需提交个人身份信息。
          </p>
          <a href="javascript:void(0)" class="btn btn-default btn-group-lg" @click="shop">开店认证</a>
          <a href="javascript:void(0)" class="btn btn-default btn-group-lg" @click="notShop">暂不认证,直接开店</a>
        </div>
      </div>
      <div class="panel-body master-panel-body" v-show="Status4">
        <div class="item form-item master-cont-wrap">
          <div class="title">开店需先经过身份认证,请您提交个人信息</div>
          <form id="master-form" class="form form-base user-form">
            <div class="form-group">
              <label for="master-name">真实姓名： </label>
              <div class="form-cont">
                <input type="text" v-model="realName" class="form-control validate[required]" id="master-name" placeholder="真实姓名"/>
              </div>
            </div>
            <div class="form-group mobile-form-group validated">
              <label for="master-mobile">手机号码：</label>
              <div class="form-cont">
                <div class="item">
                  <span class="validated-mb">{{VerifyObj['MobileNumber']}}</span>(已验证)
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="identity-card">身份证号：</label>
              <div class="form-cont">
                <input type="text" v-model="IdNumber" class="form-control validate[required, custom[chinaIdLoose]] w300" id="identity-card" placeholder="身份证号"/>
              </div>
              <span class="identity-span ml10">国家/地区:</span>
              <div class="form-cont">
                <select class="form-control w110" id="identity-district">
                  <option v-for="item in Country " v-model="Country">{{item[0]}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>身份证正面照：</label>
              <div class="form-cont">
                <button type="button" id="front-upload" class="btn btn-default vt upload">点击上传</button>
                <input type="file" class="file" accept="image/jpeg,image/png" multiple="multiple" @change="upload($event,'face')"/>
                <input type="hidden" id="front-rand" class="validate[required]" v-model="IdAvatar"/>
                <div class="img-wrap2 mt10" v-show="seen1">
                  <div class="mask" v-show="percent" v-text="percent +'%'"></div>
                  <img :src='imgSrc1' alt="身份证正面" width="100"/>
                </div>
              </div>
              <div class="show-example">
                <a href="javascript:void(0)">查看范例
                  <img src="http://wallwa.com/images/user/master/head.jpg" alt="身份证正面"/>
                </a>
              </div>
            </div>
            <div class="form-group">
              <label>身份证反面照：</label>
              <div class="form-cont">
                <button type="button" id="reverse-upload" class="btn btn-default vt upload">点击上传</button>
                <input type="file" class="file" accept="image/jpeg,image/png" multiple="multiple" @change="upload($event,'back')"/>
                <input type="hidden" id="reverse-rand" class="validate[required]" v-model="IdEmblem"/>
                <div class="img-wrap2 mt10" v-show="seen2">
                  <div class="mask">100%</div>
                  <img :src='imgSrc2' alt="身份证反面照" width="100"/>
                </div>
              </div>
              <div class="show-example">
                <a href="javascript:void(0)">查看范例
                  <img src="http://wallwa.com/images/user/master/back.jpg" alt="身份证正面"/>
                </a>
              </div>
            </div>
            <div class="form-group">
              <label>手持身份证照片：</label>
              <div class="form-cont">
                <button type="button" id="hand-upload" class="btn btn-default vt upload">点击上传</button>
                <input type="file" class="file" accept="image/jpeg,image/png" multiple="multiple" @change="upload($event,'hand')"/>
                <input type="hidden" id="hand-rand" class="validate[required]" v-model="IdInHand"/>
                <div class="img-wrap2 mt10" v-show="seen3">
                  <div class="mask">100%</div>
                  <img :src='imgSrc3' alt="手持身份证照" width="100"/>
                </div>
              </div>
              <div class="show-example">
                <a href="javascript:void(0)">查看范例
                  <img src="http://wallwa.com/images/user/master/with-hand.jpg" alt="身份证正面"/>
                </a>
              </div>
            </div>
            <div class="title">
              请认真阅读以下协议,确认无误后点击同意选项并提交信息
            </div>
            <div class="form-group">
              <div class="copyright-detail">
                <p readonly>
                  1、所有作品的版权都依然属于您，我们是在您的签约授权下，生成商品用以销售。<br/>
                  2、作品图片上传后将保存在后台，在墙蛙网展示的产品仅会使用原图的缩略图。<br/>
                  3、除您之外的任何人都无法取得原图，以保障原图不被窃取，原图的保存在服务器仅仅是用于 最高质量的订单生产。<br/>
                  4、不可上传任何含有反动政治、黄色、严重暴力、污秽及损害他人利益的内容，一旦发现，墙蛙有权下架该商品且永久封杀账号，无法分成改内容所得利润。此外因此产生的所有经济、法律责任，由您本人承担。<br/>
                  5、必须保证上传作品的原创性，正视版权归属。一旦发生盗图、版权疑问，墙蛙有权下架该商品且永久封杀账号，无法分成改内容所得利润。此外因此产生的所有经济、法律责任，由您本人承担。<br/>
                </p>
              </div>
              <label for="rule-allow-checkbox" class="checkbox-inline text-left copyright-label" id="rule-allow-area">
                  <input type="checkbox" id="rule-allow-checkbox" name="weixin" class="validate[required]]"/>我已同意并阅读
                  <a href=""> 《杭州墙蛙科技有限公司版权承诺协议》</a>
              </label>
            </div>
            <button type="submit" class="btn btn-primary btn-lg">保存</button>
          </form>
      </div>
    </div>
      <div class="panel-body master-panel-body" v-show="Status1">
        <div class="item detail-item">
          <div class="title">待审核</div>
          <div class="cont-wrap">
            <h2 class="shop-success-tips text-center">您的申请已提交，24小时内会有答复，请耐心等待！</h2>
          </div>
        </div>
      </div>
      <div class="panel-body master-panel-body" v-show="Status3">
          <div class="item detail-item">
            <div class="title">审核不通过</div>
            <div class="cont-wrap">
              <h2 class="shop-success-tips text-center">非常抱歉，你的审核不通过！</h2>
            </div>
          </div>
        </div>
      <div class="panel-body master-panel-body" v-show="Status2">
          <div class="item form-item master-cont-wrap">
            <div class="title">您已具备开店权限,以下是您的个人信息</div>
            <form class="form form-base user-form">
              <div class="form-group">
                <label for="master-name">真实姓名： </label>
                <div class="form-cont">
                  <input type="text" v-model="realName" class="form-control" disabled="disabled"/>
                </div>
              </div>
              <div class="form-group mobile-form-group validated">
                <label for="master-mobile">手机号码：</label>
                <div class="form-cont">
                  <div class="item">
                    <span class="validated-mb">{{VerifyObj['MobileNumber']}}</span>(已验证)
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="identity-card">身份证号：</label>
                <div class="form-cont">
                  <input type="text" v-model="IdNumber" class="form-control w300" disabled="disabled"/>
                </div>
                <!--<span class="identity-span ml10">国家/地区:</span>-->
                <!--<div class="form-cont">-->
                  <!--<input type="text" class="form-control w110" disabled="disabled" v-model="Country"/>-->
                <!--</div>-->
              </div>
              <div class="form-group">
                <label>身份证正面照：</label>
                <div class="form-cont">
                  <div class="img-wrap2 mt10">
                    <img :src='imgSrc1' alt="身份证正面" width="100"/>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>身份证反面照：</label>
                <div class="form-cont">
                  <div class="img-wrap2 mt10">
                    <!--<div class="mask">100%</div>-->
                    <img :src='imgSrc2' alt="身份证反面照" width="100"/>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>手持身份证照片：</label>
                <div class="form-cont">
                  <div class="img-wrap2 mt10">
                    <!--<div class="mask">100%</div>-->
                    <img :src='imgSrc3' alt="手持身份证照" width="100"/>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        seen1: false,
        seen2: false,
        seen3: false,
        imgSrc1: '',
        imgSrc2: '',
        imgSrc3: '',
        VerifyObj: {},
        percent: 0,
        id: 0,
        realName: '',
        IdNumber: '',
        Country: '',
        IdAvatar: '',
        IdEmblem: '',
        IdInHand: '',
        Status0: false,
        Status1: false,
        Status4: false,
        Status2: false,
        Status3: false
      }
    },
    methods: {
      shop() {
        request({url: 'identify/get'}).then(res => {
          this.Status0 = false
          this.Status4 = true
        })
      },
      notShop() {
        request({url: 'identify/delay'}).then(res => {
          window.location.href = 'product.html'
        }, res => {
          res.hide()
          layer.toast('开店失败')
        })
      },
      upload($event, action) {
        let self = this
        let a = $event.target.files[0]
        if (!a) {
          layer.toast('没有选择文件哦')
          return
        }
        if (!/^image\//i.test(a.type)) {
          layer.toast(`文件 ${a.name} 不是图片哦`)
          return
        }
        const fd = new window.FormData()
        fd.append('File', a)
        request.submit('upload/identify', fd, {
          progress(e) {
            self.percent = Math.floor(e.loaded / e.total * 100)
          }
        }).then(res => {
          const data = res.take('Data')
          switch (action) {
            case 'face':
              self.seen1 = true
              self.IdAvatar = data
              self.imgSrc1 = request.thumb('identify', self.id, 480, self.IdAvatar)
              break
            case 'back':
              self.seen2 = true
              self.IdEmblem = data
              self.imgSrc2 = request.thumb('identify', self.id, 480, self.IdEmblem)
              break
            case 'hand':
              self.seen3 = true
              self.IdInHand = data
              self.imgSrc3 = request.thumb('identify', self.id, 480, self.IdInHand)
              break
          }
        })
      },
      save() {
        let params = { RealName: this.realName, IdNumber: this.IdNumber, IdAvatar: this.IdAvatar, IdEmblem: this.IdEmblem, IdInHand: this.IdInHand }
        request.submit('identify/save', params).then(res => {
          this.Status4 = false
          this.Status1 = true
        }, res => {
          res.hide()
          layer.toast('保存失败')
        })
      },
      success(data) {
        let self = this
        self.realName = data.RealName
        self.IdNumber = data.IdNumber
        self.id = data.UserId
        self.IdAvatar = data.IdAvatar
        self.IdEmblem = data.IdEmblem
        self.IdInHand = data.IdInHand
        self.imgSrc1 = request.thumb('identify', self.id, 480, self.IdAvatar)
        self.imgSrc2 = request.thumb('identify', self.id, 480, self.IdEmblem)
        self.imgSrc3 = request.thumb('identify', self.id, 480, self.IdInHand)
      },
      city() {
        let self = this
        request({ url: 'countries' }).then(res => {
          self.Country = res.data
        })
      },
      prove() {
        request({ url: 'identify/get' }).then(res => {
          this.VerifyObj = res.data
          this.id = this.VerifyObj['UserId']
          if (this.VerifyObj.Status === 0) {
            this.Status0 = true
          } else if (this.VerifyObj.Status === 4) {
            this.Status4 = true
          } else if (this.VerifyObj.Status === 1) {
            this.Status1 = true
          } else if (this.VerifyObj.Status === 2) {
            this.Status2 = true
            this.success(this.VerifyObj)
          } else if (this.VerifyObj.Status === 3) {
            this.Status3 = true
          }
        })
      }
    },
    mounted() {
      let self = this
      self.prove()
      self.city()
      let form = $('#master-form')
      form.validationEngine('attach', {
        scroll: false,
        binded: true,
        maxErrorsPerField: 1,
        promptPosition: 'centerRight',
        custom_error_messages: {
          '#master-name': {
            'required': {
              'message': '姓名不能为空'
            }
          },
          '#rule-allow-checkbox': {
            'required': {
              'message': '请仔细阅读规则'
            }
          },
          '#identity-card': {
            'required': {
              'message': '身份证号不能为空'
            }
          },
          '#front-rand': {
            'required': {
              'message': '身份证正面不能为空'
            }
          },
          '#reverse-rand': {
            'required': {
              'message': '身份证反面不能为空'
            }
          },
          '#hand-rand': {
            'required': {
              'message': '手持身份证照片不能为空'
            }
          }
        },
        onValidationComplete: function(form, valid) {
          if (valid) {
            self.save()
          }
        }
      })
    }
  }
</script>
