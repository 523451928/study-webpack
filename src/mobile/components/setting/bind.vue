<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">账号绑定</div>
        <div class="panel-body social">
          <ul class="list-unstyled social-ac-list">
            <li v-if="qq&&qq['Id']">
              <span class="item icon active"><i class="wa wa-qq"></i> 已绑定QQ账号： {{qq['Nickname']}}</span>
              <span class="item pull-right"><a href="javascript:;" class="ope" @click="unbind(qq['Id'])">解除绑定</a></span>
            </li>
            <li v-else>
              <span class="item icon"><i class="wa wa-qq"></i> QQ账号未绑定</span>
              <span class="item pull-right"><a href="javascript:;" @click="bind('qq')" class="ope" target="_blank">绑定</a></span>
            </li>

            <li v-if="weibo&&weibo['Id']">
              <span class="item stat"><i class="wa wa-weibo"></i>已绑定微博账号：{{weibo['Nickname']}}</span>
              <span class="item pull-right"><a href="javascript:;" class="ope" @click="unbind(weibo['Id'])">解除绑定</a></span>
            </li>

            <li v-else>
              <span class="item icon"><i class="wa wa-weibo"></i> 微博账号未绑定</span>
              <span class="item pull-right"><a href="javascript:;" @click="bind('weibo')" class="ope" target="_blank">绑定</a></span>
            </li>

            <li v-if="weixin && weixin['Id']">
              <span class="item stat"><i class="wa wa-wechat"></i> 已绑定微信账号：{{weixin['Nickname']}}</span>
              <span class="item pull-right"><a href="javascript:;" class="ope" @click="unbind(weixin['Id'])">解除绑定</a></span>
            </li>
            <li v-else>
              <span class="item icon"><i class="wa wa-wechat"></i> 微信账号未绑定</span>
              <span class="item pull-right"><a href="javascript:;" @click="bind('weixin')" class="ope" target="_blank">绑定</a></span>
            </li>
          </ul>

          <p class="social-title">是否在个人简介中显示社交账号:</p>
          <label class="checkbox-inline text-left" id="weiboCheck" for="weibo">
            <template v-if="weibo&&weibo['Id']">
              <input type="checkbox" name="weibo" @click.stop="isShow(weibo['Id'], !weibocheck)" v-model="weibocheck" id="weibo">
              <i class="wa wa-weibo active"></i>
            </template>
            <template v-else>
              <i class="wa wa-weibo"></i><span @click="bind('weibo')" class="text-lowercase">请先绑定微博账号</span>
            </template>
          </label>

          <p class="social-title">是否在个人简介中显示微信账号:</p>
          <template v-if="weixin && weixin['Id']">
            <label class="checkbox-inline text-left" id="weixinCheck" for="weixin">
              <input type="checkbox" name="weixin" v-model="weixincheck" @click.stop="isShow(weixin['Id'], !weixincheck)" id="weixin">
              <i class="wa wa-wechat active"></i> (上传二维码后才能生效)
            </label>
            <div class="social-upload clearfix">
              <div class="social-ewm social-ewm-special pull-left" :class="weixinpic?'init-domain':''">
                <div class="mask"></div>
                <div class="update-erweima">
                  <a class="social-upload-btn pull-left">
                    <input type="file" accept="image/gif, image/jpeg, image/png" class="weui_uploader_input" name="uploader"
                           multiple="multiple" @change="upload($event)">
                    <span class="wa" :class="weixinpic?'wa-cloud-update':'wa-cloud-upload'"></span>
                  </a>
                </div>
                <img class="def-image" :src="weixinpic" />
              </div>
            </div>
          </template>
          <template v-else>
            <label class="checkbox-inline text-left" for="weixin">
              <i class="wa wa-wechat"></i> <span @click="bind('weixin')" class="text-lowercase">请先绑定微信账号</span>
            </label>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Errors } from './const'
  export default {
    data() {
      return {
        qq: {},
        weibo: {},
        weixin: {},
        weixinpic: '',
        weibocheck: false,
        weixincheck: false
      }
    },
    mounted() {
      this.pull()
    },
    methods: {
      bind(str) {
        let params = {
          Link: 'setting.html',
          Next: 'setting.html'
        }
        request({url: 'social/bind/' + str, params}).then(res => {
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      upload($event) {
        let self = this
        let a = $event.target.files
        let b = []
        for (let i = 0; i < a.length; i++) {
          let f = a[i]
          if (!/^image\//i.test(f.type)) {
            layer.toast(`文件 ${f.name} 不是图片哦`)
          } else {
            b.push(f)
          }
        }
        if (b.length === 0) return
        _.each(b, function(v, i) {
          const fd = new window.FormData()
          fd.append('File', v)
          request.submit('upload/wxhp', fd, {
            progress(e) {
              layer.toast('上传中...')
            }
          }).then(res => {
            const file = res.take('Data')
            const id = document.getElementById('login-status').value
            self.weixinpic = 'http://192.168.1.6:8000/thumbnail/wxhp/' + id + '/480/' + file
            layer.toast('上传成功')
          }, res => {
            res.hide()
            layer.toast(Errors(res.take('Error')))
          })
        })
      },
      pull() {
        let self = this
        request({url: 'social/list'}).then(res => {
          let data = res.take('Data')
         /* let data = [
            {
              Id:1,
              Platform:'weibo',
              OpenId:'133',
              Nickname:'大胖weibo'
            },
            {
              Id:2,
              Platform:'weixin',
              OpenId:'133',
              Nickname:'大胖weixin'
            },
            {
              Id:3,
              Platform:'qq',
              OpenId:'133',
              Nickname:'大胖qq'
            }
          ] */
          self.weibo = self.sort(data, 'weibo')
          self.qq = self.sort(data, 'qq')
          self.weixin = self.sort(data, 'weixin')
          self.weixinmp = self.sort(data, 'weixinmp')
          self.weibocheck = self.weibo && self.weibo['Show']
          self.weixincheck = self.weibo && self.weixin['Show']
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      unbind(plateform) {
        let params = {}
        request.submit('social/unbind/' + plateform, params).then(res => {
          let data = res.take('Data')
          if (!data) {
            layer.toast('解绑失败，请重试')
          } else {
            layer.toast('解绑成功')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      sort(data, id) {
        let t = _.find(data, function(v) {
          return v['Platform'] === id
        })
        return t
      },
      isShow(plateform, flag) {
        let params = {
          Show: flag
        }
        request.submit('social/hp/' + plateform, params).then(res => {
          let data = res.take('Data')
          if (data) {
            layer.toast('操作成功')
          } else {
            layer.toast('操作失败')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      }
    }
  }
</script>
<style>
  .weui_uploader_input{
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer !important;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
