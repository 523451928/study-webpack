<template>
  <div class="ww-wrap user-album-wrap user-center-wrap t">
    <div class="upload-img-link clearfix">
      <a href="javascript:void(0)" class="pull-right" @click="addBtn" id="user-album-add">新建作品集</a>
    </div>
    <div class="user-info-item" id="my-album">
      <div class="item-cont">
        <p class="no-album" v-if="init">赶紧上传图片， 建立自己的第一个作品集吧  ＼（＾ ＾）／</p>
        <ul class="list-unstyled cont-list album-list" v-else>
          <li v-for="(item,index) in obj" :style="{background:styleObj[item['Id']],backgroundSize:'cover'}">
            <a class="album-link" :href="'album.html#/photo?albumId='+item['Id']">
            </a>
            <div class="album-hover-box">
              <div class="ww-album-hover-actions" v-if="item['Name']">
                <ul class="actions-list">
                  <span class="actions-arrow-icon"></span>
                  <li><a class="ww-photo-action del-album-btn" @click="deleteAlbum(item,index)" href="javascipt:void(0)">删除作品集</a></li>
                  <li><a class="ww-photo-action edit-album-btn" @click="editOpen(item)">编辑作品集</a></li>
                </ul>
              </div>
              <div class="ww-album-hover-detail">
                <span class="ww-album-title" v-text="item['Name']?item['Name']:'默认相册'"></span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="modal fade" :class="{hide: !editHide, in:editHide}" id="edit-album-dialog" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-backdrop fade in" @click="mask"></div>
      <div class="modal-dialog ww-add-album-box">
        <div class="modal-content">
          <div class="modal-body clearfix">
            <div class="ww-add-album clearfix">
              <h2 class="ww-add-album-title">编辑作品集
                <div class="x-icon" @click="mask" data-dismiss="modal" aria-label="Close">
                  <div class="d-part1"></div>
                  <div class="d-part2"></div>
                  <div class="d-part3"></div>
                  <div class="d-part4"></div>
                </div>
              </h2>
              <ul class="ww-add-album-eidt">
                <li class="clearfix">
                  <label>作品集名称 </label>
                  <div class="input-group ww-album-group">
                    <template v-if="editHideOne">
                      <input type="text" id="album-edit-title" v-model="albumTitle" class="form-control ww-album-edit-area album-title" placeholder="请填写图片名称"/>
                      <a href="javascript:void(0)" @click="newAlbum" class="btn btn-primary ww-album-edit-btn" id="ww-album-edit-btn">保存</a>
                    </template>
                    <template v-if="editHideTwo">
                      <input type="text" id="album-edit-title" v-model="editTitle" class="form-control ww-album-edit-area album-title" placeholder="请填写图片名称"/>
                      <a href="javascript:void(0)" @click="editAlbum" class="btn btn-primary ww-album-edit-btn" id="ww-album-edit-btn">保存</a>
                    </template>
                    <div class="blank-error" @click="tips=false" v-show="tips">*作品集名称不能为空</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Errors } from './const'
  import {initBar, resetBar} from 'js/bar.js'
  export default {
    data() {
      return {
        editHide: false,
        editHideOne: false,
        editHideTwo: false,
        albumTitle: '',
        editTitle: '',
        editId: 0,
        tips: false,
        init: false,
        obj: [],
        styleObj: {}
      }
    },
    mounted() {
      this.pull()
    },
    methods: {
      pull() {
        let self = this
        request({url: 'image/album/list'}).then(res => {
          let data = res.take('Data')
          if (data) {
            self.obj = data
            self.backImg()
          } else {
            self.init = true
          }
        })
      },
      backImg() {
        let self = this
        _.each(this.obj, function(v) {
          let cId = v['CoverId']
          let str = ''
          if (cId) {
            str = `url(http://192.168.1.6:8000/thumbnail/image/${v['CoverId']}/480/${v['CoverFile']}) no-repeat center`
          } else {
            str = `url('~images/custom/m2bg.jpg') no-repeat center`
          }
          self.styleObj[v['Id']] = str
        })
      },
      addBtn() {
        this.editHideOne = true
        this.common()
      },
      common() {
        this.editHide = true
        this.tips = false
        initBar()
      },
      mask() {
        this.editHide = false
        this.editHideOne = false
        this.editHideTwo = false
        resetBar()
      },
      newAlbum() {
        let self = this
        if (!this.albumTitle) {
          this.tips = true
          return
        }
        let params = {
          Name: this.albumTitle,
          Priority: 1
        }
        request.submit('image/album/add', params).then(res => {
          let data = res.take('Data')
          if (data) {
            self.pull()
            self.mask()
            layer.toast('相册创建成功')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      editOpen(item) {
        this.common()
        this.editHideTwo = true
        this.editTitle = item['Name']
        this.editId = item['Id']
      },
      editAlbum() {
        let self = this
        if (!this.editTitle) {
          this.tips = true
          return
        }
        let params = {
          Name: this.editTitle
        }
        request.submit('image/album/set/' + this.editId, params).then(res => {
          if (res.take('Data')) {
            self.pull()
            self.mask()
            layer.toast('相册设置成功')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      deleteAlbum(item, index) {
        let self = this
        layer.open({
          content: '确认删除这个相册吗',
          btn: ['确认', '取消'],
          yes: function() {
            request.remove('image/album', item['Id']).then(res => {
              if (res.take('Data')) {
                layer.toast('相册删除成功')
                self.obj.splice(index, 1)
              }
            }, res => {
              res.hide()
              layer.toast(Errors(res.take('Error')))
            })
          }
        })
      }
    }
  }
</script>
