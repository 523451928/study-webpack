<template>
  <div class="ww-wrap user-wrap">
    <div class="user-album-nav">
      <div class="container">
        <div id="photo-default-bar" v-show="list">
          <div class="pull-left back-to-album">
            <a class="primary-link back-to-album-link" href="/album.html">&lt;返回作品集列表</a>
          </div>
          <ul class="nav navbar-nav album-nav-list">
            <li class="album-title" @click="switchList(item['Id'])" :class="item['Id']==activeId?'active':''" v-for="item in objList">
              <a :href="item['more']? 'album.html' : 'album.html#/photo?albumId='+item['Id']" v-text="item['Name']?item['Name']:'默认相册'"></a>
            </li>
          </ul>
          <a href="javascript:void(0)" @click="list = !list" class="btn btn-default batch-btn" :class="{disabled:disable}" id="batch-btn">批量管理</a>
        </div>
        <div id="batch-control-bar" v-show="!list" class="batch-control-bar clearfix">
          <div class="batch-select">
            <div class="checkbox">
              <label>
                <input type="checkbox" id="batch-select-all" @click="allToggle"> 全选
              </label>
            </div>
          </div>
          <div class="show-select-num" v-show="len">
            已选择{{len}}张图片
          </div>
          <a href="javascript:void(0)" @click="batchMove" class="batch-group-btn" id="batch-move">移动作品集</a>
          <a href="javascript:void(0)" @click="batchEdit" class="batch-group-btn" id="batch-edit">编辑图片</a>
          <a href="javascript:void(0)" @click="batchDelete" class="batch-group-btn" id="batch-del">删除</a>
          <a href="javascript:void(0)" @click="list = !list" class="btn btn-primary batch-complete" id="batch-complete">完成</a>
        </div>
      </div>
    </div>
    <div class="container upload-img-link">
      <a href="javascript:void(0)" class="pull-right uploader" id="ww-upload-img-btn">
        <span class="wa wa-plus"></span>
        上传作品
        <input class="uploader-input" type="file" accept="image/gif, image/jpeg, image/png" name="uploader"
               multiple="multiple" @change="upload($event)">
      </a>
    </div>

    <div class="cont-wrap photo-wrap mb65" id="photo-list-box">
      <div v-show="isEmpty" id="photo-gallery1" class="photo-gallery container">
        <div class="no-pro-msg text-center">
          <h2 class="text-center">暂无产品</h2>
        </div>
      </div>
      <div v-show="isFull && list" id="photo-gallery2" class="photo-gallery flex-images container">
        <div class="pto-list dn item" :data-w="calculate(item['File'],'w')" :data-h="calculate(item['File'],'h')" @click="preview(index)" v-for="(item,index) in obj">
          <img :src="'http://192.168.1.6:8000/thumbnail/image/'+item['Id']+'/480/'+item['File']">
          <div class="photo-hover-box">
            <div class="ww-photo-hover-actions">
              <ul class="actions-list">
                <span class="actions-arrow-icon"></span>
                <li>
                  <a class="ww-photo-action del-photo" @click.stop="deleteImg(item,index)" href="javascipt:void(0)">删除作品</a>
                </li>
                <li>
                  <a class="ww-photo-action ww-photo-hover-setface" @click.stop="setImg(item,index)">设为封面</a>
              </li>
              </ul>
            </div>
            <div class="ww-photo-hover-detail">
              <div class="ww-photo-hover-data">
                <div class="ww-photo-hover-title" v-text="item['Title']?item['Title']:item['Name']?item['Name']:'默认相册'"></div>
                <div class="ww-photo-hover-time" v-text="item['CreateTime'].substring(0,10)"></div>
              </div>
              <a class="ww-photo-hover-cusbutton">去定制</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 缩略图开始-->
      <div id="photo-icon" v-show="!list" class="photo-gallery container">
        <ul class="list-unstyled cont-list batch-list clearfix">
          <li :class="x(i)?'active':''" @click="iconToggle(i)" v-for="(i,index) in obj">
            <span class="select-status-icon"></span>
            <a class="batch-img-list" :style="{backgroundImage: 'url(http://192.168.1.6:8000/thumbnail/image/'+ i['Id'] +'/240/'+ i['File']+')'}">&nbsp;</a>
          </li>
        </ul>
      </div>
      <!-- 缩略图结束-->
      <div class="weui-loadmore" v-show="loading && !noMore">
        <div class="weui-loading"></div>
        <div class="weui-loadmore__tips">正在加载</div>
      </div>
      <p class="nomore text-center" v-show="noMore && has">没有更多了。。。</p>
    </div>

    <!--编辑图像模态框-->
    <div class="modal fade" :class="{hide: !editImg, in:editImg}" id="edit-img-dialog" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-backdrop fade in" @click="editimg"></div>
      <div class="modal-dialog ww-photo-edit-box">
        <a class="close-icon" @click="editimg" data-dismiss="modal" aria-label="Close" href="javascript:void(0)" ></a>
        <div class="modal-content">
          <div class="modal-body clearfix">
            <div class="ww-photo-edit-area clearfix">
              <div class="ww-photo-edit-slider" id="ww-photo-edit-slider">
                <div id="slider" class="flexslider">
                  <div class="flex-viewport">
                    <ul class="slides slider-list" :style="{width: obj.length*200 +'%',transform: 'translate3d('+(-serial*666)+'px, 0px, 0px)'}">
                      <li v-for="(item,index) in obj">
                        <div class="pto-list">
                          <div class="real-img-box">
                            <img draggable="false" :alt="item['Title']?item['Title']:item['Name']?item['Name']:'默认相册'" :style="{transform:'rotate('+(index==serial?1:0)*(serialDegree*90)+'deg)'}" :src="'http://192.168.1.6:8000/thumbnail/image/'+item['Id']+'/480/'+item['File']"/>
                            <span class="ww-photo-slider-delete del-photo" @click="deleteImg(item,index,1)"></span>
                            <span class="ww-photo-slider-rotate" @click="rotateImg"></span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <ul class="flex-direction-nav">
                    <li class="flex-nav-prev">
                      <a class="flex-prev" :class="[serial==0?'flex-disabled':'']" @click="toPrev" href="javascript:;"></a>
                    </li>
                    <li class="flex-nav-next">
                      <a class="flex-next" :class="[serial==(maxLen-1)?'flex-disabled':'']" @click="toNext" href="javascript:;"></a>
                    </li>
                  </ul>
                </div>

                <div id="carousel" class="flexslider">
                  <div class="flex-viewport">
                    <ul class="slides carousel-list" :style="{width: '400%',transform: 'translate3d('+(serial*65>correct?-serial*65+correct:0) +'px, 0px, 0px)'}">
                      <li v-for="(item,index) in obj" @click="toNum(index)">
                        <div class="pto-list">
                          <img draggable="false" :src="'http://192.168.1.6:8000/thumbnail/image/'+item['Id']+'/120/'+item['File']" :alt="item['Title']?item['Title']:item['Name']?item['Name']:'默认相册'" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
              <div class="ww-photo-detail">
                <div class="ww-photo-edit-title">
                  正在编辑第{{serial+1}}张图片
                </div>
                <ul class="ww-photo-edit-list">
                  <li>
                    <label>添加至</label>
                    <select class="form-control photo-album ww-photo-edit-area" v-model="serialAlbum">
                      <option :value="item['Id']" v-for="item in objListAll">{{item['Name']?item['Name']:'默认相册'}}</option>
                    </select>
                  </li>
                  <li>
                    <label>图片名称</label>
                    <div class="input-group ww-photo-group">
                      <input type="text" v-model="serialTitle" class="form-control photo-title ww-photo-edit-area" placeholder="请填写图片名称" aria-describedby="basic-addon1"/>
                    </div>
                  </li>
                  <li>
                    <label>标签</label>
                    <div class="tips-box clearfix">
                      <div class="tips-list" v-for="(item,index) in editTags">
                        <span class="tip-value" v-text="item"></span>
                        <span class="tip-del" @click="delTips(index)">x</span>
                      </div>
                    </div>
                    <div class="input-group ww-photo-group">
                      <input type="text" v-model="editTag" @blur="addTips" @keyup.enter="addTips" class="form-control tips-add ww-photo-edit-area" placeholder="添加标签" aria-describedby="basic-addon1">
                    </div>
                  </li>
                  <li>
                    <label>图片描述</label>
                    <div class="input-group ww-photo-group">
                      <textarea type="text" v-model="serialDesc" rows="4" class="form-control photo-dsp ww-photo-edit-area"  placeholder="添加图片描述"></textarea>
                    </div>
                  </li>
                  <li>
                    <a class="btn btn-primary" id="edit-save-btn" @click="serialDone" href="javascript:void(0)">保存</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--批量移动模态框-->
    <div class="modal fade" :class="{hide: !editMove, in:editMove}" id="batch-move-dialog" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-backdrop fade in" @click="editMove=false"></div>
      <div class="modal-dialog ww-add-album-box">
        <div class="modal-content">
          <div class="modal-body clearfix">
            <div class="ww-add-album clearfix">
              <h2 class="ww-add-album-title">移动到其他作品集 <a class="close-icon" data-dismiss="modal" aria-label="Close" @click="editMove=false" href="javascript:void(0)" ></a></h2>
              <ul class="ww-add-album-eidt">
                <li class="clearfix">
                  <label>添加至</label>
                  <select class="form-control photo-album ww-photo-edit-area" v-model="ToAlbumId">
                    <option :value="item['Id']" v-for="item in objListAll">{{item['Name']?item['Name']:'默认相册'}}</option>
                  </select>
                </li>
              </ul>
              <a href="javascript:void(0)" @click="batchMoveDone" class="btn btn-primary batch-move-btn" id="batch-move-btn">保存</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--批量编辑模态框-->
    <div class="modal fade" :class="{hide: !edit, in:edit}" id="batch-edit-dialog" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-backdrop fade in" @click="edit=false"></div>
      <div class="modal-dialog ww-add-album-box">
        <div class="modal-content">
          <div class="modal-body clearfix">
            <div class="ww-add-album clearfix">
              <h2 class="ww-add-album-title">批量编辑 <a class="close-icon" @click="edit=false" data-dismiss="modal" aria-label="Close" href="javascript:void(0)" ></a></h2>
              <ul class="ww-add-album-eidt">
                <li>
                  <label>标题</label>
                  <div class="input-group ww-photo-group">
                    <input type="text" class="form-control tips-add ww-photo-edit-area" v-model="editTitle" placeholder="添加标题" aria-describedby="basic-addon1">
                  </div>
                </li>
                <li>
                  <label>标签</label>
                  <div class="tips-box clearfix">
                    <div class="tips-list" v-for="(item,index) in editTags">
                      <span class="tip-value" v-text="item"></span>
                      <span class="tip-del" @click="delTips(index)">x</span>
                    </div>
                  </div>
                  <div class="input-group ww-photo-group">
                    <input type="text" @blur="addTips" @keyup.enter="addTips" class="form-control tips-add ww-photo-edit-area" v-model="editTag" placeholder="添加标签" aria-describedby="basic-addon1">
                  </div>
                </li>
                <li>
                  <label>图片描述</label>
                  <div class="input-group ww-photo-group ">
                    <textarea type="text"  rows="4" class="form-control photo-dsp ww-photo-edit-area" v-model="editDesc" placeholder="添加图片描述"></textarea>
                  </div>
                </li>
              </ul>
              <a href="javascript:void(0)" @click="batchEditDone" class="btn btn-primary batch-edit-btn" id="batch-edit-btn">保存</a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style lang="sass">
  .nomore{
    margin: 0;
    padding: 20px 0;
  }
  #slider{
    margin-bottom: 10px;
  }
</style>
<script>
  import { Errors } from './const'
  import { initBar, resetBar } from 'js/bar.js'
  import { getParameter } from 'js/getParameter.js'

  export default {
    data() {
      return {
        activeId: 0,
        len: 0,
        isEmpty: false,
        isFull: false,
        list: true,
        percent: 0,
        id: 0,
        objList: [],
        objListAll: [],
        obj: [],
        iconSelect: [],
        page: 1,
        disable: false,
        has: false,
        loading: true,
        noMore: false,
        editMove: false,
        edit: false,
        editImg: false,
        ToAlbumId: 0,
        serialAlbum: 0,
        serialTitle: '',
        serialDesc: '',
        serialDegree: 0,
        editTitle: '',
        editTag: '',
        editTags: [],
        editDesc: '',
        serial: 0,
        maxLen: 0,
        correct: 296
      }
    },
    mounted() {
      let self = this
      this.pullList()
      this.pull()
      window.onscroll = _.throttle(function() {
        if (self.noMore) return
        if (!self.loading && $(window).scrollTop() === $(document).height() - $(window).height()) {
          self.page++
          self.pull()
        }
      }, 1000)
    },
    methods: {
      iconToggle(i) {
        if (_.includes(this.iconSelect, i['Id'])) {
          this.iconSelect = _.pull(this.iconSelect, i['Id'])
        } else {
          this.iconSelect.push(i['Id'])
        }
        this.len = this.iconSelect.length
        if (this.len !== this.obj.length) {
          document.getElementById('batch-select-all').checked = false
        } else {
          document.getElementById('batch-select-all').checked = true
        }
      },
      allToggle() {
        let self = this
        const flag = document.getElementById('batch-select-all').checked
        self.iconSelect = []
        if (flag) {
          _.each(this.obj, function(v) {
            self.iconSelect.push(v['Id'])
          })
          this.len = self.iconSelect.length
        } else {
          this.len = 0
        }
      },
      x(i) {
        if (_.includes(this.iconSelect, i['Id'])) {
          return true
        }
        return false
      },
      switchList(str) {
        if (this.activeId === str) return
        this.initSelect()
        this.activeId = str
        this.obj = []
        this.has = false
        this.refreshList(str)
      },
      pullList() {
        let self = this
        request({url: 'image/album/list'}).then(res => {
          let data = res.take('Data')
          if (data) {
            self.objListAll = data
            _.each(data, function(v) {
              if (!v['Name']) {
                self.ToAlbumId = v['Id']
              }
            })
            if (data.length > 6) {
              let p = {
                Name: '...',
                more: true
              }
              self.objList = _.take(data, 6)
              self.objList.push(p)
            } else {
              self.objList = data
            }
          }
        })
      },
      pull() {
        let self = this
        this.loading = true
        self.id = getParameter('albumId')
        self.activeId = self.id
        let params = {
          'Page': self.page,
          'Count': 12,
          'Mode': 1,
          'AlbumId': self.id
        }
        request({url: 'image/list', params}).then(res => {
          let data = res.take('Data')
          if (data.length) {
            self.has = true
            self.isFull = true
            for (let i = 0; i < data.length; i++) {
              self.obj.push(data[i])
            }
            setTimeout(function() {
              $('#photo-gallery2').flexImages({rowHeight: 260})
              self.loading = false
            }, 1000)
          } else if (self.obj.length) {
            self.noMore = true
          } else {
            self.isEmpty = true
            self.noMore = true
            self.disable = true
          }
        }, res => {
          self.isEmpty = true
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      upload($event) {
        let self = this
        self.id = getParameter('albumId')
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
          fd.append('Image', v)
          fd.append('AlbumId', self.id)
          request.submit('image/upload', fd, {
            progress(e) {
              self.percent = Math.floor(e.loaded / e.total * 100)
            }
          }).then(
            res => {
              if (i === b.length - 1) {
                self.refreshList()
              }
              let data = res['data']
              if (data['Duplicate']) {
                layer.toast('文件重复')
              }
            }, res => {
              res.hide()
              layer.toast(Errors(res.take('Error')))
            })
        })
      },
      deleteImg(item, index, album) {
        let self = this
        layer.open({
          content: '确认要删除这幅作品吗？',
          btn: ['确认', '取消'],
          yes: function() {
            request.remove('image', item['Id']).then(res => {
              if (res.take('Data')) {
                layer.toast('作品删除成功')
                self.obj.splice(index, 1)
                self.isNoneAfterDelete(album)
              }
            }, res => {
              res.hide()
              layer.toast(Errors(res.take('Error')))
            })
          }
        })
      },
      setImg(item) {
        let albumId = item['AlbumId']
        let id = item['Id']
        console.log(item)
        let params = {
          CoverId: id
        }
        request.submit('image/album/set/' + albumId, params).then(res => {
          if (res.take('Data')) {
            layer.toast('设置成功')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      refreshList(flag) {
        let self = this
        self.page = 1
        self.noMore = false
        this.loading = true
        if (flag) {
          self.id = flag
        } else {
          self.id = getParameter('albumId')
        }
        let params = {
          'Page': 1,
          'Count': 12,
          'Mode': 1,
          'AlbumId': self.id
        }
        request({url: 'image/list', params}).then(res => {
          let data = res.take('Data')
          self.obj = []
          if (data.length) {
            self.has = true
            self.isFull = true
            self.isEmpty = false
            self.disable = false
            for (let i = 0; i < data.length; i++) {
              self.obj.push(data[i])
            }
            setTimeout(function() {
              $('#photo-gallery2').flexImages({rowHeight: 260})
              self.loading = false
            }, 1000)
          } else {
            self.has = false
            self.noMore = true
            self.isEmpty = true
            self.disable = true
          }
        }, res => {
          self.isEmpty = true
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      batchDelete() {
        let self = this
        if (!this.len) {
          layer.toast('请先选择作品')
          return
        }
        layer.open({
          content: `确认要删除这${self.len}幅作品吗？`,
          btn: ['确认', '取消'],
          yes: function() {
            self.id = getParameter('albumId')
            let params = {
              AlbumId: self.id
            }
            request.remove('image/batch', self.iconSelect, { params }).then(res => {
              if (res.take('Data')) {
                layer.toast('作品删除成功')
                let arr = []
                _.each(self.obj, function(v, i) {
                  if (_.includes(self.iconSelect, v['Id'])) {
                    arr.push(i)
                  }
                })
                for (let j = 0; j < arr.length; j++) {
                  if (j !== 0) { arr[j] = arr[j] - j }
                  self.obj.splice(arr[j], 1)
                }
                self.isNoneAfterDelete()
              }
            }, res => {
              res.hide()
              layer.toast(Errors(res.take('Error')))
            })
          }
        })
      },
      batchMove() {
        if (!this.len) {
          layer.toast('请先选择作品')
          return
        }
        this.editMove = true
      },
      batchMoveDone() {
        let params = {
          FromAlbumId: +getParameter('albumId'),
          ToAlbumId: this.ToAlbumId
        }
        if (params.FromAlbumId === params.ToAlbumId) {
          layer.toast('相同的相册')
          return
        }
        request.move('image/batch', this.iconSelect, params).then(res => {
          if (res.take('Data')) {
            this.initSelect()
            this.editMove = false
            layer.toast('作品移动成功')
            this.refreshList(params['FromAlbumId'])
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      batchEdit() {
        if (!this.len) {
          layer.toast('请先选择作品')
          return
        }
        this.edit = true
      },
      batchEditDone() {
        let params = {
          AlbumId: +getParameter('albumId'),
          Title: this.editTitle,
          Description: this.editDesc,
          Tag: this.editTags.join('\n')
        }
        params = _.pickBy(params, function(v) {
          return !!v
        })
        request.set('image/batch', this.iconSelect, params).then(res => {
          if (res.take('Data')) {
            this.edit = false
            layer.toast('编辑成功')
            this.initSelect()
            this.refreshList()
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      addTips() {
        if (this.editTag) {
          this.editTags.push(this.editTag)
          this.editTag = ''
        }
      },
      delTips(index) {
        this.editTags.splice(index, 1)
      },
      preview(index) {
        this.maxLen = this.obj.length
        this.serial = index
        this.initSerial(index)
        this.serialDegree = 0
        this.editImg = true
        initBar()
        $('body').addClass('modal-open')
      },
      editimg() {
        resetBar()
        this.editImg = false
      },
      serialDone() {
        let id = this.obj[this.serial]['Id']
        let params = {
          AlbumId: this.serialAlbum,
          Title: this.serialTitle,
          Description: this.serialDesc,
          Tag: this.editTags.join('\n')
        }
        params = _.pickBy(params, function(v) {
          return !!v
        })
        request.set('image', id, params).then(res => {
          if (res.take('Data')) {
            this.refreshList()
            layer.toast('编辑成功')
            this.editImg = false
            $('body').removeClass('modal-open')
          }
        }, res => {
          res.hide()
          layer.toast(Errors(res.take('Error')))
        })
      },
      toPrev() {
        this.serialDegree = 0
        this.serial--
        this.initSerial(this.serial)
      },
      toNext() {
        this.serialDegree = 0
        this.serial++
        this.initSerial(this.serial)
      },
      toNum(index) {
        this.serialDegree = 0
        this.serial = index
        this.initSerial(this.serial)
      },
      rotateImg() {
        this.serialDegree++
      },
      calculate(str, x) {
        let arr = str.split('-')[1].split('.')[0].split('x')
        if (x === 'w') {
          return arr[0]
        } else if (x === 'h') {
          return arr[1]
        }
      },
      isNoneAfterDelete(flag) {
        if (flag) {
          this.serial > 0 && this.serial--
          this.maxLen = this.obj.length
        }
        this.initSelect()
        if (this.obj.length) {
          setTimeout(function() {
            $('#photo-gallery2').flexImages({rowHeight: 260})
          }, 1000)
        } else {
          this.has = false
          this.isEmpty = true
          this.disable = true
          this.noMore = false
          this.editImg = false
        }
      },
      initSelect() {
        this.len = 0
        this.iconSelect = []
        document.getElementById('batch-select-all').checked = false
      },
      initSerial(index) {
        this.serialTitle = this.obj[index]['Title']
        this.serialDesc = this.obj[index]['Description']
        this.editTags = _.compact(this.obj[index]['Tag'].split('\n'))
      }
    }
  }
</script>
