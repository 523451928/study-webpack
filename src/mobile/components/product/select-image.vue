<!-- Copyright Wallwa.com. All rights reserved. -->
<template>
  <div class="modal fade" :class="{in:showAlbum}" v-show="showAlbum" id="chs-img-dialog" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-backdrop fade in" @click="hideAlbum"></div>
    <div class="modal-dialog chs-img-box">
      <div class="modal-content">
        <div class="modal-body clearfix">
          <div class="chs-img clearfix">
            <!--<button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
            <!--<span class="ww-icon ww-close"></span>-->
            <!--</button>-->
            <!--<h2 class="chs-img-title"> <a data-dismiss="modal" aria-label="Close" href="javascript:void(0)" ></a></h2>-->
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
                  <li v-for="img in images" :class="{active : selectId === img.Id}" @click="selectImg(img)" @dblclick="selectSaveImg(img)" data-id="img.Id">
                    <a class="face-img-list ">
                      <img v-lazy="img.src" :class ="{tran: img.shape === 'tran', vert: img.shape === 'vert'}" >
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
</template>

<script>
import { ProImgListParam } from 'scripts/utils/const'
import { initImages } from './app/utils'

export default {
  data() {
    return {
      //  所有的相册
      albums: {},
      curPage: 1,
      // 图片当前加载过多少页（处理后台不返回总页数的问题）
      recentPage: 1,
      images: [],
      // 选中图片的Id
      selectId: 0
    }
  },
  props: {
    showAlbum: {
      type: Boolean,
      required: true
    }
  },
  mounted() {

  },
  created() {
    this.initAlbum()
  },
  methods: {
    icon(i) {
      return request.thumb('image', i.Id, 480, i.File)
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
          layer.toast('没有更多图片了哦')
        }
      }, res => {
        layer.toast(res.take('Error'))
      })
    },
    initAlbum() {
      let self = this
      request({url: 'image/album/list'}).then(res => {
        let data = res.take('Data')
        _.each(data, (a, i) => {
          // 初始选中默认相册
          let select = a.Name === ''
          a.select = select
        })
        this.albums = data
        let reqPromise = this.initImage()
        reqPromise.then(res => {
          let data = res.take('Data')
          self.images = initImages(data)
        }, res => {
          layer.toast(res.take('Error'))
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
      this.$emit('selectImg', img)
      this.hideAlbum()
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
      }, res => {
        layer.toast(res.take('Error'))
      })
    }
  },
  computed: {

  }
}
</script>
