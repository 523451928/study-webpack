<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="custom-con-wrap">
    <div v-if="custom.waiting"> <loading></loading> </div>
    <div v-else class="display-wrap">
      <!--中间图片部分-->
      <div class="center-block">
        <component :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="editStatus" :entry="custom.current.entry"
                   :displays="custom.displays" :pictures="custom.current.pictures"
                   :xi="custom.xi" :di="custom.di" :type="displayType"></component>
      </div>
      <div class="center-block rotate-wrapper" v-show="editShow">
        <span class="rotate-btn" @click="op('rotate','right')">
          <i class="wa wa-rotate"></i>
        </span>
      </div>
      <!--价格部分-->
      <div class="price-wrap text-center" v-show="editShow">
        <span class="title">售价:</span>
        <span class="price">
          <!--<img src="~images/icon/discount.png" class="discount-icon" alt="">-->
          <span class="discount-text">{{discountText}}</span>
          <span class="ori-price">￥{{Math.floor(recentDiscontMoney)}}</span>
          <span class="discount-price">
             ￥{{custom.current.entry.Price/100}}
          </span>
        </span>
      </div>
    </div>
    <custom-detail @addTocart="jionCart" ref="customDetail" :detailObj="customDetail"></custom-detail>
    <!--底部状态栏-->
    <div class="bom-area">
      <bottom-custom-bar @canShowEdit="canShowEdit" :custom="custom" v-if="!custom.waiting" :boms="boms" :bomsHeader="bomsHeader"
                         :material="materialArr" :materials="materialsArr" ref="bottomCustom"></bottom-custom-bar>
    </div>
    <!--<custom-pro-detail :cat-id="categoryId"></custom-pro-detail>-->
    <div v-if="custom.waiting"><loading></loading></div>
  </div>
</template>

<script>
require('lodash')
import { newCustom } from './app/custom'
import { mixin as displayComponents } from 'components/public/display/app/components'
import bottomCustomBar from './bottom-custom-bar.vue'
import customProDetail from './custom-pro-detail.vue'
// import { mixin as components } from './app/components'
import { getDisplayer } from 'components/public/display/app/display-util'
import { getByProperty } from 'scripts/utils/custom/utils'
import { changePicture, isOverstep } from 'components/public/display/app/picture'
import customDetail from './costom-detail.vue'
/* eslint-disable */
let fixComponents = _.assign({bottomCustomBar: bottomCustomBar}, {customProDetail: customProDetail}, {customDetail: customDetail}, displayComponents)
export default {
  mixins: [{components: fixComponents}],
  beforeRouteEnter(to, from, next) {
    const id = to.params.id
    const f = that => {
      that.categoryId = id
      that.custom.initialize(parseInt(id))
    }
    next(/[1-9][0-9]*/.test(id) && f)
  },
  data() {
    return {
      custom: newCustom(),
      customCanvas: 'Custom',
      displayType: 'default',
      editStatus: true,
      editShow: false,
      edit: false,
      n: 2,
      show: false,
      message: '',
      initScale: 100,
      setTimer: null,
      categoryId: 8,
      discountText: '',
      customDetail: {}
    }
  },
  watch: {
    '$route'(to, from) {
      const id = to.params.id
      this.categoryId = id
      this.$refs.bottomCustom.isShowIdx = 0
      this.custom.initialize(parseInt(id))
      this.$bus.$emit('changeActive', -1)
      document.querySelector('.bcb-header').scrollLeft = 0
    }
  },
  created() {
    if (!window.localStorage.getItem('customTipShow')) {
      let isShowTip = true
      let tipInstance = null
      document.addEventListener('scroll', move)
      function move() {
        if (document.documentElement.scrollTop > 100) {
          isShowTip = false
          document.removeEventListener('scroll', move)
        }
        if (tipInstance) {
          tipInstance.close()
          tipInstance = null
        }
      }
      setTimeout(() => {
        if (document.documentElement.scrollTop === 0 && isShowTip) {
          tipInstance = this.$tip({
            message: '上滑查看详情页',
            style: {
              bottom: '66px',
              left: '50%',
              transform: 'translateX(-50%)'
            },
            triangleDirection: 'bottom',
            closeFn: () => {
              window.localStorage.setItem('customTipShow', true)
            }
          })
        }
      }, 120000)
    }
    let canEdit = true
    this._d = _.mergeFuncs(
      this.$onBus('select-tab', (t, k) => {
        let c = this.custom
        if (c.type) this.scrollToBottom(true)
        c.selectType(t, k)
      }, this),
      this.$onBus('changeActive', () => {
        if (canEdit) {
          canEdit = false
          this.editShow = false
        }
      }),
      this.$onBus('scale',(scale) => {

      }),
      this.$onBus('select-material', (v, flag) => {
        this.custom.selectMaterial(v, flag)
      }, this),
      this.$onBus('change-indicator', (xi, di) => {
        let c = this.custom
        if (_.isUndefined(xi)) xi = c.xi
        if (_.isUndefined(di)) di = c.di
        c.changeIndicator(xi, di)
      }, this),
      this.$onBus('change-hole', hole => {
        let c = this.custom
        if (c.waiting) return
        c.hole = hole
      }, this),
      this.$onBus('set-image', (action, parm) => {
        this.op(action, parm)
      }, this),
      this.$onBus('addCart', () => {
        this.addToCart()
      }),
      this.$onBus('changeDisplayType', type => {
        this.displayType = type
        this.custom.toggleEdit()
      }, this),
      this.$onBus('get-canvas-rate', rate => {
        this.setRate(rate)
      }, this))
    this.getCategoryList()
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
  },
  methods: {
    canShowEdit(idx) {
      if (idx === -1) {
        this.editShow = true
      } else {
        this.editShow = false
      }
    },
    getCategoryList() {
      request.list('category').then((res) => {
        window.$categories = res.data.Data
        this.categories = res.data.Data
      })
    },
    scrollToBottom(next = false) {
      let s = this.$els.scroller
      let f = () => s.scrollIntoView(false)
      next ? this.$nextTick(f) : f()
    },
    changeN($event) {
      let n = parseInt($event.target.value)
      if (n >= 1 && n <= 10) this.n = n
      layer.toast(this.n + '%')
    },
    op(a, b) {
      const f = s => this.$toast.center(`请先选择${s}哦o_o`)
      let p = this.tranPic
      let categoryId = parseInt(this.categoryId)
      if (!p) {
        f('图片')
        return
      }
      if (a === 'resetImg' && p.Output.Full === 2) {
        isOverstep(p)
        return
      }
      if (categoryId === 2 || categoryId === 8 || categoryId === 4 || categoryId === 24) {
        if (p.Image.Shape !== 'square' && a === 'rotate') {
          changePicture(p, a, 'half', this.n)
        } else {
          changePicture(p, a, b, this.n)
        }
      } else {
        changePicture(p, a, b, this.n)
      }
      if (p.Output.Full === 2) {
        if (this.setTimer) {
          clearTimeout(this.setTimer)
        }
        this.setTimer = setTimeout(() => {
          isOverstep(p)
        }, 800)
      }
    },
    setRate(rate) {
      let p = this.tranPic
      if (!p) {
        this.$toast.center("请先选择图片哦o_o")
        return
      }
      p.rate = rate
    },
    addToCart() {
      let c = this.custom
      this.customDetail = {
        discountText: this.discountText,
        realPrice: this.realPrice,
        discountMoney: this.recentDiscontMoney,
        propertyArr: c.entry.Properties
      }
      if (c.waiting) return
      let item = c.serialize()
      if (!item) {
        this.$toast.center('定制还未完整哦T_T')
        return
      }
      this.$refs.customDetail.showDetail()
    },
    tpl(name) {
      return this.custom.initBomTplName(name)
    },
    jionCart() {
      let item = this.custom.serialize()
      request.save('item', item, {params: {Count: 1, Action: 1}}).then(res => {
        this.$toast.center('产品定制成功')
        setTimeout(() => {
          window.location.href = '/cart.html'
        }, 500)
      })
    }
  },
  computed: {
    recentDiscontMoney() {
      let curEntry = this.custom.current.entry
      let realPrice = curEntry.Price / 100
      this.realPrice = realPrice
      let discount = 1  //  curEntry.Discount
      this.categories.forEach((item) => {
        if (item.Id === parseInt(this.categoryId)) {
          this.discountText = item.Discount / 10 + '折惠'
          discount = item.Discount
        }
      })
      return realPrice * discount / 100
    },
    tranPic() {
      let c = this.custom
      if (c.waiting) return
      const f = s => this.$toast.center(`请先选择${s}哦o_o`)
      let i = c.pictureIndex
      switch (i) {
        case -2:
          f('照片')
          return
        case -1:
          f('孔')
          return
      }
      let p = getByProperty(c.current.pictures, i, 'Index')
      return p
    },
    imageMaterials() {
      return this.custom.materials('image')
    },
    imageMaterial() {
      return this.custom.material('image')
    },
    boms() {
      return this.custom.getboms()
    },
//    获得底部状态栏标题  图片、尺寸、画框
    bomsHeader() {
      let headArr = []
      this.boms.forEach((item) => {
        if (item.prokey) {
          headArr.push({
            code: item.name,
            name: item.prokey
          })
        }
      })
      return this.custom.getbomsHeader().concat(headArr)
    },
    bomsDetail() {

    },
    materialsArr() {
      let tempBoms = this.custom.getboms()
      let tempMaterialsArr = _.map(tempBoms, (val) => this.custom.materials(val.name))
      return tempMaterialsArr
    },
    materialArr() {
      let tempBoms = this.custom.getboms()
      let tempMaterialArr = _.map(tempBoms, (val) => this.custom.material(val.name))
      return tempMaterialArr
    },
    displayer() {
      let c = this.custom
      if (c.waiting) return
      return getDisplayer(c.current.entry, c.di)
    }
  }
}
</script>
<style lang='sass'>
  .rotate-wrapper{
    margin-top: 10px;
    .rotate-btn{
      padding: 10px;
      .wa-rotate{
        font-size: 20px;
        color: #bdbdbd;
      }
    }
  }
  .custom-con-wrap {
    padding-top: 50px;
    height: 100%;
    position: relative;
    overflow: auto;
    .price-wrap {
      .title {
        font-size: 17px;
      }
      .price {
        .discount-icon {
          display: inline-block;
          color: #ed5565;
          font-size: 12px;
          border-radius: 3px;
          margin-right: 2px;
          padding: 2px 3px;
          position: relative;
          top: -3px;
        }
        .discount-text{
          color: #ed5565;
          border-radius: 2px;
          border: 1px solid #ed5565;
          padding: 1px 3px;
          font-size: 10px;
          position: relative;
          bottom: 2px;
        }
        .ori-price {
          font-size: 20px;
          color: #ed5565;
        }
        .discount-price {
          color: #82888a;
          font-size: 14px;
          text-decoration: line-through;
        }
      }
    }
  }
.custom-wrap{
  margin-top: 0;
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
.bom-area {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
}
</style>
