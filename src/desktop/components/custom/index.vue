<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="custom-con-wrap">
    <div v-if="custom.waiting">
      <loading></loading>
    </div>
    <div v-else class="container">
      <div class="row m-t-h">
        <div class="col-md-8">
          <component :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="editStatus" :entry="custom.current.entry" :displays="custom.displays" :pictures="custom.current.pictures" :xi="custom.xi" :di="custom.di" :isproduct="false"></component>
          <div class="tools-btn-area text-xs-center">
            <ul class="detai-btns-area">
              <li>
                <a href="javascript:void(0)" class="set-image-link" title="右旋" @click="op('set-image', 'rotate', 'right')">
                  <i class="wa wa-rotate-right"></i> 旋转
                </a>
              </li>
              <li>
              <li>
                <a href="javascript:void(0)" class="set-image-link" title="填充" @click="op('set-image', 'set', 'fill')">
                  铺满画面
                </a>
              </li>
              <li>
                <a href="javascript:void(0)" class="set-image-link" title="垂直居中" @click="op('set-image', 'set', 'vMid')">
                  <i class="wa wa-vertical-center"></i>垂直居中
                  </a>
              </li>
              <li>
                <a href="javascript:void(0)" class="set-image-link" title="水平居中" @click="op('set-image', 'set', 'hCenter')">
                  <i class="wa wa-horizontal-center"></i>水平居中
                  </a>
              </li>
              <!-- <li v-if="!custom.isFullAways">
              - 品类设置非强制填满的类型时，展示完整展示的设置按钮 -
              <a href="javascript:void(0)" class="set-image-link" title="适应"
                      @click="op('set-image', 'set', 'fit')">
                  完整展示
              </a>
            </li> -->
            </ul>
          </div>
          <scrollbar :pic="tranPic" :init-scale="initScale" :cat-id="catId"></scrollbar>
        </div>
        <div class="col-md-4">
          <div class="right-area">
            <div class="detail-area">
              <ul class="list-unstyled info">
                <li class="hd clearfix">
                  <span class="title">售价</span>
                  <span class="pull-right price">
                    <img :src="setDiscount" class="item discount-icon" alt="">
                    <span class="item ori-price">￥{{recentDiscontMoney}}</span>
                    <span class="item discount-price">
                      <strong>￥</strong>
                      <strong id="completedMoney">{{Math.floor((custom.current.entry.Price/100)*(discount/100))}}</strong>
                    </span>
                  </span>
                </li>
                <li>
                  <span class="title">完成尺寸</span>
                  <span class="pull-right size" id="completedSize">43.8x43.8cm</span>
                </li>
                <li class="clearfix cart-wrapper" v-if="!isEdit">
                  <div class="num-wrap">
                    <span class="input-item">
                      <input type="text" v-model="CustomCount" @change="verify">
                    </span>
                    <a href="javascript:void(0)" @click="setCount('minus')" class="default-link num-ope-item minus">
                      -
                    </a>
                    <a href="javascript:void(0)" @click="setCount('plus')" class="default-link num-ope-item plus">
                      +
                    </a>
                  </div>
                  <a @click="addToCart()" class="btn btn-lg btn-block btn-success add-cart-btn">
                    <i class="wa wa-shopping-cart-fill"></i>
                    <span>加入购物车</span>
                  </a>
                  <div class="userOperation">
                    <div class="sale" @click="onSale">售卖</div>
                    <div class="share-wrap" @mouseover="onShareMove(true)" @mouseleave="onShareMove(false)">
                      <span>分享</span>
                      <ul class="share-wrap" v-show="isShareShow">
                        <li class="item weibo">
                          <i @click="onShare('weibo')"></i>
                        </li>
                        <li class="weixin item">
                          <i @click="onShare('weixin')"></i>
                          <div class="wxcode" v-if="wxCodeShow">
                            <img v-if="wxCode===''" src="/src/desktop/assets/images/loading/loading-128.gif" class="loading" />
                            <img v-else :src="wxCode" class="wxCode-img" />
                          </div>
                        </li>
                        <li class="douban item">
                          <i @click="onShare('douban')"></i>
                        </li>
                        <li class="qq item">
                          <i @click="onShare('qq')"></i>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <!-- 编辑区域 -->
                <li class="clearfix" v-else>
                  <a class="btn btn-lg btn-block btn-success edit-btn" @click="onEdit('save')">
                    <span>保存修改</span>
                  </a>
                  <a class="btn btn-lg btn-block btn-success giveup-btn" @click="onEdit('giveup')">
                    <span>放弃修改</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="bom-area">
              <component v-for="bom in boms" :is="tpl(bom.name)" :fix="bom.fix" :key="bom.cat" :prokey="bom.prokey" :cat-id="catId" :materials="custom.materials(bom.name)" :material="custom.material(bom.name)" :current="getCurrent" :pic="tranPic">
              </component>
            </div>
          </div>
        </div>
      </div>
      <div v-show="showMaterialDetail" class="modal material-detail fade" :class="{'in': showMaterialDetail}">
        <div class="modal-backdrop fade in" @click="closeDetailModal()"></div>
        <div class="modal-dialog">
          <div class="text-center">
            <div v-if="materialDetail.Id">
              <list-item :id="materialDetail.Id" :name="materialDetail.Name" :icon="materialDetail.Icon" :size="480"></list-item>
              <span class="material-detail-name">{{materialDetail.Name}}</span>
            </div>
            <h2 v-else>
              暂无详情
            </h2>
          </div>
        </div>
      </div>
      <custom-pro-detail :cat-id="catId"></custom-pro-detail>
    </div>
</template>
<script>
  /* eslint-disable */
import {
	categoryImgSize,
	DecorativeCategories as dc,
	MaterialTypes as mt,
	Angles,
	StackLines,
	Fulls,
	tabs,
	product,
	Directions,
	catNameIdMap,
	SuggestSize as ss
} from "scripts/utils/custom/consts.js" // 一些常量
  import { newCustom } from './core/custom'
  import { mixin as components } from './components.js'
  import { getDisplayer } from './display/display-util'
  // import { freshEntry, buildEntry } from 'components/custom/core/entry.js'
  import {
    getByProperty,
    parseImageSize,
    swapSize,
    isDecorate
  } from 'scripts/utils/custom/utils.js'
  import {
    changePicture,
    resetPicture
  } from './picture/picture.js'
  import {
  categoryUtil
  } from 'scripts/utils/category'
  export default {
    mixins: [components],
    beforeRouteEnter(to, from, next) {
      // 进入页面时项目初始化
      let params = to.params
      // 获得vue-router的参数id
      const id = parseInt(params.id)
      if (id === dc.Frame || id === dc.Matless) return
      let f = (that) => {
        // beforeRouteEnter 拦截器的next回调函数接收的第一个参数就是Vue实例,此处that指向Vue
        // let entryId, imageId, itemId
        that.catId = id
        let itemId, entryId, imageId
        if (Object.getOwnPropertyNames(to.query).length === 0) {
          that.custom.initialize(id)
        } else {
          if (to.query.ItemId) {
            // 如果出现商品id
            itemId = parseInt(to.query.ItemId)
            initUrlParams.call(that, 'item', itemId, id).then(res => {
              return new Promise((resolve, reject) => {
                // 判断是否是照片墙
                if (!DetectionPhotoWall(res.Entries)) {
                  let p = res.Pictures
                  that.$request.get('entry', res.Entries).then(response => {
                    let entry = response.take('Data')[0]
                    resolve({
                      e: entry,
                      p: p
                    })
                  })
                } else {
                  console.log('处理是照片墙的逻辑') // todo
                }
              })
            }).then(response => {
              that.custom.initUrlParams('item', response)
            }).catch(url => {
              window.location.href = url
            })
          } else if (to.query.EntryId) {
            // 处理单品id
            entryId = to.query.EntryId
            initUrlParams.call(that, 'entry', entryId, id).then(res => {
              // todo 此处是否判断是否是照片墙
              if (!DetectionPhotoWall(res)) {
                // 处理不是照片墙的逻辑
                that.custom.initUrlParams('entry', res[0])
              }
            }).catch(url => {
              window.location.href = url
            })
          } else if (to.query.ImageId) {
            // 此处处理ImageId的业务逻辑
            imageId = to.query.ImageId
            initUrlParams.call(that, 'image', imageId, id).then(res => {
              // 返回的是一个图片数据, 处理成我们所需要的数据格式, 还需要一个categoryId
              let r = {
                Image: res,
                CategoryId: id
              }
              that.custom.initUrlParams('image', r)
            })
          }
        }
      }
      next(/[1-9][0-9]*/.test(id) && f)
    },
    data() {
      return {
        custom: newCustom(),
        customCanvas: 'Custom',
        editStatus: true,
        edit: false,
        n: 1,
        catId: undefined,
        show: false,
        message: '',
        initScale: 100,
        setTimer: null,
        CustomCount: 1,
        showMaterialDetail: false,
        materialDetail: {},
        catList: undefined, // categories
        DPI: 100,
        imgData: {},
        isEdit: false, // 是否处于编辑状态
        discount: 100,
        isShareShow: false, // 分享栏目是否显示
        wxCode: '', // 微博二维码url
        wxCodeShow: false, // 微信二维码是否显示
        _categoryList: undefined // 品类
      }
    },
    watch: {
      'custom.message'(s) {
        if (s) layer.toast(s)
      },
      CustomCount(newVal, oldVal) {
        if (isNaN(newVal)) {
          this.CustomCount = oldVal
        }
      },
      '$route'(to, from) {
        const id = to.params.id
        this.catId = parseInt(id)
        this.initScale = 100
        this.custom.initialize(parseInt(id), undefined, undefined, undefined, () => {
          this.getDiscount(id, window.$categories)
        })
        if (window.$categories.size) {
          this.DPI = window.$categories.get(this.catId)
        } else {
          this.getCatList(function() {
            this.DPI = window.$categories.get(this.catId)
          })
        }
      }
    },
    created() {
      this._d = _.mergeFuncs(
        this.$onBus('select-material', (v, extra) => {
          // 选中物料的方法
          this.custom.selectMaterial(v, extra, (t)=>{
            if (v.Type === 'image') {
              if (this.custom.current.pictures.length === 0) {
                layer.toast('图片不合适')
              } else {
                layer.toast('图片填充成功')
              }
            }
          })
        }),
        this.$onBus('show-material-detail', v => {
          this.showBomDetail(v)
        }),
        this.$onBus('change-indicator', (xi, di) => {
          let c = this.custom
          if (this.$lodash.isUndefined(xi)) xi = c.xi
          if (this.$lodash.isUndefined(di)) di = c.di
          c.changeIndicator(xi, di)
        }),
        this.$onBus('change-hole', hole => {
          let c = this.custom
          if (c.waiting) return
          c.hole = hole
        }),
        this.$onBus('set-image', (action, parm) => {
          this.op('set-image', action, parm)
        }),
        this.$onBus('reset-image', (type) => {
          // 图片归位：越界之后归位（overstep）；恢复初始适配的状态：(reset)
          this.op('reset-image', type)
        }),
        this.$onBus('toggle-edit', () => {
          this.custom.toggleEdit()
        })
      )
      this.getCatList()
    },
    beforeDestroy() {
      if (this._d) {
        this._d()
        this._d = null
      }
    },
    methods: {
      verify(val) {
      },
      getCatList(cb) {
        if (this.catList) {
          if (typeof cb === 'function') {
            cb()
          }
        } else {
          this.$request.list('category').then(res => {
            let id = this.$route.params.id
            let data = res.take("Data")
            this.catList = categoryUtil.allMap(res.data.Data)
            window.$categories = this.catList
            if (typeof cb === 'function') {
              cb()
            }
            this.getDiscount(id, window.$categories)
          })
        }
      },
      onShareMove(type) {
        // 分享页面鼠标事件
        let self = this
        switch (type) {
          case true:
            this.isShareShow = type
            break
          case false:
            self.isShareShow = type
            self.wxCodeShow = type
            break
        }
      },
      showMessage(s) {
        let that = this
        let f = () => {
          that.message = s
          that.show = true
        }
        if (that.show) {
          that.show = false
          that.$nextTick(f)
        } else {
          f()
        }
      },
      op(mode, a, b) {
        let c = this.custom
        if (c.waiting) return
        const warnMsg = msg => layer.toast(`请先选择${msg}哦o_o`)
        let i = c.pictureIndex
        switch (i) {
          case -2:
            warnMsg('照片')
            return
          case -1:
            warnMsg('孔')
            return
        }
        let p = getByProperty(c.current.pictures, i, 'Index')
        if (!p) {
          // 因为在触发mouseleave事件时，会检查overstep，
          // 所以在没选择图片时，触发mouseleave事件不提示warnMsg('图片')
          a !== 'overstep' && warnMsg('图片')
          return
        }
        if (a === 'rotate' && isDecorate(c.current.entry.CategoryId)) {
          let s = parseImageSize(p.Image)
          let material = c.changeSize(s, true)
          if (material) {
            p.Output.Size = swapSize(p.Output.Size)
            c.selectMaterial(material)
          }
        }
        switch (mode) {
          case 'set-image':
            changePicture(p, a, b, this.n)
            break
          case 'reset-image':
            resetPicture(p, a)
            break
        }
      },
      addToCart() {
        let self = this
        let c = self.custom
        if (c.waiting) return
        let item = c.serialize()
        layer.toast('定制还未完整哦T_T')
        if (!item) {
          layer.toast('定制还未完整哦T_T')
          return
        }
        // Action:1添加购物车，2分享
        this.$request.save('item', item, {
          params: {
            Count: self.CustomCount,
            Action: 1
          }
        }).then(res => {
          this.$user.getUserInfo()
          flyadd()
          layer.toast('产品定制成功,已加入购物车')
        })
        function flyadd(){
          let $addCartCount = $('.add-cart-count')
          let $addCartBtn = $('.add-cart-btn')
          let offsetcart = $addCartCount[0].getBoundingClientRect()
          let offsetbtn = $addCartBtn[0].getBoundingClientRect()
          let correct = $addCartBtn.width() / 2 - 30
          let div = $('<span class="add-cart-fly">1</span>')
          div.fly({
            start: {top: offsetbtn.top, left: offsetbtn.left+correct},
            end: {top: offsetcart.top+12, left: offsetcart.left,width:15,height:15},
            speed:2,
            onEnd: function(){
              this.destroy()
            }
          })
        }
      },
      tpl(name) {
        let tplName = this.custom.initBomTplName(name)
        return tplName
      },
      getDiscount(id, list) {
        let self = this
        // 获取折扣
        if (list instanceof Map) {
          list.forEach((item, index) => {
            if (parseInt(item.Id) === parseInt(id)) {
              self.discount = item.Discount
            }
          })
        }
      },
      showBomDetail(m) {
        this.showMaterialDetail = true
        if (m.hasOwnProperty('Property')) {
          this.materialDetail = {
            'Id': m.Property.OptionId,
            'Icon': m.Property.Icon,
            'Name': m.Property.Value
          }
        } else {
          this.materialDetail = m
        }
      },
      closeDetailModal() {
        this.showMaterialDetail = false
      },
      setCount(type) {
        // 修改商品数量
        let self = this
        if (type === 'minus' && self.CustomCount > 1) {
          self.CustomCount--
        } else if (type === 'minus' && self.CustomCount === 1) {
          layer.toast('至少一件')
        }
        if (type === 'plus') {
          self.CustomCount++
        }
      },
      onEdit(type) {
        let self = this
        // 保存或放弃商品
        if (type === 'save') {
          // 此处调用custom保存方法
        } else if (type === 'giveup') {
          self.isEdit = false
        }
      },
      // 分享商品
      onShare(type) {
        let self = this
        let c = this.custom
        let item = c.serialize()
        let id
        // let self = this
        if (!item) {
          layer.toast('定制还未完整哦T_T,不能分享该产品')
        } else {
          // let url = `share/item/${type}`
          this.$request.save('item', item, {
            params: {
              Action: 2
            }
          }).then(res => {
            id = res.body.Id
            // let pathName = window.location.pathname
            // let pos = href.indexOf(pathName)
            // let url = href.substring(0, pos)
            let url = window.location.protocol + '//' + window.location.host
            // 请求获得分享二维码
            self.$request.submit('share/qr', {
              Link: `${url}/preshare?ItemId=${id}`
            }).then(res => {
              this.wxCodeShow = true
              this.wxCode = `data:image/png;base64,${res.take('Data')}`
            })
          })
        }
      },
      // 出售商品
      onSale() {
        let c = this.custom
        let item = c.serialize()
        if (!item) {
          layer.toast('商品还没定制完成,不能分享该商品')
          return
        } else {

        }
      }
    },
    computed: {
      recentDiscontMoney() {
        let curEntry = this.custom.current.entry
        let realPrice = curEntry.Price / 100
        let discount = 1
        return parseInt(realPrice)
      },
      boms() {
        return this.custom.getboms()
      },
      getCurrent() {
        return this.custom.current
      },
      // todo 折扣信息改由程序设计
      setDiscount() {
        let disMap = new Map([
          [90, '/src/desktop/assets/images/icon/discount9.png'],
          [80, '/src/desktop/assets/images/icon/discount8.png'],
          [70, '/src/desktop/assets/images/icon/discount7.png'],
          [60, '/src/desktop/assets/images/icon/discount6.png'],
          [50, '/src/desktop/assets/images/icon/discount5.png'],
          [40, '/src/desktop/assets/images/icon/discount4.png'],
          [30, '/src/desktop/assets/images/icon/discount3.png'],
          [20, '/src/desktop/assets/images/icon/discount2.png'],
          [10, '/src/desktop/assets/images/icon/discount1.png']
        ])
        return disMap.get(this.discount)
      },
      displayer() {
        let c = this.custom
        if (c.waiting) return
        return getDisplayer(c.current.entry, c.di)
      },
      scroller() {
        let c = this.custom
        if (c.waiting) return
        let t = c.type
        let f = t => t + '-scroller'
        if (t === mt.Size) return f('size')
        if (t === 'key') return f('property')
        if (this.$lodash.isNumber(t)) return f('material')
        if (this.$lodash.isString(t)) return f(t)
      },
      tranPic() {
        // 处理图片bar
        let c = this.custom
        if (c.waiting) return
        const warning = s => layer.toast(`请先选择${s}哦o_o`)
        let i = c.pictureIndex
        switch (i) {
          case -2:
            warning('照片')
            return
          case -1:
            warning('孔')
            return
        }
        let p = getByProperty(c.current.pictures, i, 'Index')
        return p
      }
    }
  }
  // 获得url上的数据
  function initUrlParams(type, id, categoryId) {
    // type 请求的类型
    // id 请求的id
    // options 参数
    return new Promise((resolve, reject) => {
      switch (type) {
        case 'item':
          this.$request.do('GET', `item/get/${id}`).then(res => {
            if (res.take('Data').CategoryId === categoryId) {
              resolve(res.take('Data'))
            } else {
              reject(`/custom/${res.take('Data').CategoryId}?ItemId=${id}`)
            }
          })
          break
        case 'entry':
          this.$request.get('entry', [id]).then(res => {
            // 还是要做是否是照片墙的判断
            let _categoryId = res.take('Data')[0].CategoryId
            if (categoryId === _categoryId) {
              resolve(res.take('Data'))
            } else {
              reject(`/custom/${_categoryId}?EntryId=${id}`)
            }
          })
          break
        case 'image':
          this.$request.do('GET', `image/info/${id}`).then(res => {
            resolve(res.take('Data'))
          })
          break
      }
    })
  }
  // 检测是否是照片墙
  function DetectionPhotoWall(e) {
    // 是照片墙返回 true 不是照片墙返回false
    if (e.length > 1) {
      return true
    } else {
      return false
    }
  }
</script>

<style lang='sass'>
  .custom-wrap{
    margin-top: 130px;
  }
  .editor{
    margin: 0 auto;
    td{
      padding: 5px;
      text-align: center;
      input{
        display: inline-block;
        width: 50px;
    }
  }
  }
  .add-cart-fly{
    font-size: 12px;
    line-height: 18px;
    position: absolute;
    top: 16px;
    right: 11px;
    width: 18px;
    height: 18px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    z-index: 1031;
    background-color: #76a549;
  }
</style>
