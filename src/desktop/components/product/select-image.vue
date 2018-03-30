<!-- Copyright Wallwa.com. All rights reserved. -->
<template>
  <transition name="scale">
    <div class="modal fade" :class="{in:showAlbum}" v-show="showAlbum" id="chs-img-dialog" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-backdrop fade in" @click="hideAlbum"></div>
      <div class="modal-dialog chs-img-box">
        <div class="modal-content">
          <div class="modal-body clearfix">
            <div class="chs-img clearfix">
              <div class="chs-img-area">
                <div class="chs-album-list  clearfix">
                  <ul class="list-unstyled cont-list album-list clearfix" :class = "{scroll:albums.length>6}">
                    <li v-for=" album in albums" :class="{active: album.select}" @click="selectAlbum(album.Id)">
                      {{album.Name === '' ? '默认相册' : album.Name}}
                  </li>
                  </ul>
                </div>
                <div class="chs-img-list  clearfix">
                  <ul v-if = "images.length>0" class="list-unstyled cont-list proImg-chs-list clearfix">
                    <li v-for="img in images" :class="{active : selectId === img.Id}" @click="selectImg(img)" @dblclick.prevent="selectSaveImg(img)" :data-id="img.Id">
                      <a class="face-img-list ">
                        <img :src="img.src" :style="getStyle(img)">
                        <div class="mask">
                          <i class="wa wa-check-tri"></i>
                        </div>
                      </a>
                    </li>
                  </ul>
                  <p v-else class="blank-msg">
                    作品集为空
                  </p>
                </div>
                <div class="clearfix">
                  <nav class="pull-left" aria-label="...">
                    <ul class="pagination">
                      <li class="page-item" v-for="thisP in recentPage" @click="selectCurPage(thisP)" :class="{active: curPage === thisP}"><span class="page-link">{{thisP}}</li>
                      <li class="page-item" @click="loadNextPage"><span class="page-link">... <span class="sr-only">(next)</span></span></li>
                    </ul>
                  </nav>
                  <a href="javascript:void(0)" @click="saveSel" class="btn btn-primary pull-right ww-album-set-btn" id="chs-img-btn">开始创作</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ProImgListParam } from 'scripts/utils/const.js'
import { sizeShape, parseImageSize } from 'scripts/utils/custom/utils.js'
import { initImages } from './app/utils.js'
import { InterfaceMap as Interf } from 'scripts/interfaceConst.js'

export default {
  data() {
    return {
      albums: {}, // 所有的相册
      curPage: 1,
      recentPage: 1, // 图片当前加载过多少页（处理后台不返回总页数的问题）
      images: [],
      selectId: 0 // 选中图片的Id
    }
  },
  props: {
    showAlbum: {
      type: Boolean,
      required: true
    }
  },
  created() {
//    this.initAlbum()
  },
  methods: {
    icon(i) {
      return request.thumb('image', i.Id, 480, i.File)
    },
    getStyle(imgObj) {
      let style = {}
      if (!imgObj) return style
      let diffVal
      let isRotate = imgObj.Info.Rotate / 90 % 2 === 1
      let imgSize = parseImageSize(imgObj)
      let shape = sizeShape(imgSize)
      switch (shape) {
        case 'v':
          diffVal = ((imgSize[0] - imgSize[1]) / imgSize[0] * 50) + '%'
          style[isRotate ? 'height' : 'width'] = '100%'
          style[isRotate ? 'margin-left' : 'margin-top'] = diffVal
          break
        case 'h':
          diffVal = ((imgSize[1] - imgSize[0]) / imgSize[1] * 50) + '%'
          style[isRotate ? 'width' : 'height'] = '100%'
          style[isRotate ? 'margin-top' : 'margin-left'] = diffVal
          break
        default:
          style['width'] = '100%'
      }
      style['transform'] = [
        `rotate(${imgObj.Info.Rotate}deg)`,
        `scaleX(${imgObj.Info.ScaleX})`,
        `scaleY(${imgObj.Info.ScaleY})`
      ].join(' ')
      return style
    },
    loadNextPage() {
      var self = this
      let cur = self.curPage + 1
      let reqPromise = this.initImage(cur)
      reqPromise.then(res => {
        let data = res.take('Data')
        if (data.length > 0) {
          self.images = initImages(data)
          self.curPage = cur
          self.recentPage++
        } else {
          layer.shortToast('没有更多图片了哦')
        }
      }, err => {
        layer.shortToast(err.take('Error'), 1.5)
      })
    },
    initAlbum() {
      let self = this
      if (this.images.length > 0) {
        return
      }
      request({url: 'image/album/list'}).then(res => {
        let data = res.take('Data')
        _.each(data, (a, i) => {
          // 初始选中默认相册
          a.select = a.Name === ''
        })
        this.albums = data
        let reqPromise = this.initImage()
        reqPromise.then(res => {
          let data = res.take('Data')
          self.images = initImages(data)
        }, err => {
          layer.shortToast(err.take('Error'), 1.5)
        })
      })
    },
    initImage(page) {
      let self = this
      let activeAlbum = _.find(this.albums, (a) => {
        return a.select
      })
      let id = activeAlbum.Id
      let p = !_.isUndefined(page) ? page : self.curPage
      let params = {
        'Page': p,
        'Count': ProImgListParam.Count,
        'Mode': 1,
        'AlbumId': id
      }
      return request({url: 'image/list', params})
    },
    selectImg(img) {
      this.selectId = img.Id
    },
    selectSaveImg(img) {
      this.selectId = img.Id
      let params = {
        ImageId: img.Id,
        ImageFile: img.File
      }
      request({url: Interf.checkImgUsed, params}).then(res => {
        let data = res.data
        if (data === 0) {
          // 图片没有被创建成产品的情况
          this.$emit('selectImg', img)
          this.hideAlbum()
        } else {
          layer.open({
            content: '啊噢~您选择的图片已经被制作成产品了\n是否重新编辑?',
            btn: ['查看已有产品（N）', '重新编辑（Y）'],
            yes: function() {
              // 跳转到编辑页，data.Id为返回的产品Id
              location.hash = `#/edit/${data.Id}`
            },
            no: function() {
              // 跳转到个人中心的产品列表页面
              location.pathname = '/user/work.html'
            }
          })
        }
      }, err => {
        err.hide()
        this.hideAlbum()
        layer.toast(`请求失败：${err.errorMessage}`)
        this.$emit('selectImg', img)
      })
    },
    saveSel() {
      let selId = this.selectId
      let selImg = _.find(this.images, i => {
        return i.Id === selId
      })
      this.$emit('selectImg', selImg)
      this.hideAlbum()
    },
    hideAlbum() {
      this.showAlbum = false
      this.$emit('hideAlbum')
    },
    selectAlbum(id) {
      let self = this
      _.each(this.albums, al => {
        if (al.Id === id) {
          al.select = true
        } else {
          al.select = false
        }
      })

      let reqPromise = this.initImage()
      reqPromise.then(res => {
        let data = res.take('Data')
        self.images = initImages(data)
      }, err => {
        layer.shortToast(err.take('Error'), 1.5)
      })
    }
  }
}
</script>
