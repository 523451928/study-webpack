<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div>
  <loading v-if="custom.waiting"></loading>
  <div v-else class="container-fluid">
    <div class="row m-t-h">
      <component :keep-alive="false" :is="displayer" :entry="custom.current.entry"
        :displays="custom.displays" :pictures="custom.current.pictures"
        :xi="custom.xi" :di="custom.di"></component>
    </div>
    <div class="row m-y-h">
      <div class="col-xs-12 text-xs-center">
        <button class="btn btn-secondary btn-sm" @click="custom.toggleEdit()">
          <i class="material-icons">{{custom.displayEdit ? 'visibility' : 'crop'}}</i>
        </button>
        <button class="btn btn-secondary btn-sm" @click="addToCart()">
          <i class="material-icons">add_shopping_cart</i>
        </button>
        <fullscreen></fullscreen>
        <indicator :po="custom.current.index >= 0"
          :xn="custom.xn" :xi="custom.xi"
          :dn="custom.dn" :di="custom.di"></indicator>
      </div>
    </div>
    <div v-show="custom.displayEdit">
      <table class="editor">
        <tr>
          <td>
            <button class="btn btn-secondary btn-sm" title="左移"
              @click="op('move', 'left')">
              <i class="material-icons">keyboard_arrow_left</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="右移"
              @click="op('move', 'right')">
              <i class="material-icons">keyboard_arrow_right</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="上移"
              @click="op('move', 'up')">
              <i class="material-icons">keyboard_arrow_up</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="下移"
              @click="op('move', 'down')">
              <i class="material-icons">keyboard_arrow_down</i>
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="btn btn-secondary btn-sm" title="左旋"
              @click="op('rotate', 'left')">
              <i class="material-icons">rotate_left</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="右旋"
              @click="op('rotate', 'right')">
              <i class="material-icons">rotate_right</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="水平翻转"
              @click="op('scale', 'x')">
              <i class="material-icons">swap_horiz</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="垂直翻转"
              @click="op('scale', 'y')">
              <i class="material-icons">swap_vert</i>
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="btn btn-secondary btn-sm" title="放大"
              @click="op('scale', 'in')">
              <i class="material-icons">zoom_in</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="缩小"
              @click="op('scale', 'out')">
              <i class="material-icons">zoom_out</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="填充"
              @click="op('set', 'fill')">
              <i class="material-icons">border_inner</i>
            </button>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" title="适应"
              @click="op('set', 'fit')">
              <i class="material-icons">border_outer</i>
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      <div class="row">
        <tab :category-id="custom.current.categoryId" :keys="custom.keys"></tab>
      </div>
      <div class="row">
        <div class="col-xs-12" v-el:scroller>
          <component keep-alive :is="scroller" :fix="custom.fix" :key="custom.key"
            :materials="custom.materials" :material="custom.material"></component>
        </div>
      </div>
    </div>
    <toast message="数据加载中" :loading="true" :show="custom.doing"></toast>
  </div>
  <toast :show.sync="show" :message="message" :time="2"
    :icon="false" :mask="false" :cancel="true"></toast>
</div>
</template>

<script>
import { openDialog } from 'components/prompt'
import { MaterialTypes as mt, isDecorate } from './consts'
import { newCustom } from './custom'
import { mixin as components } from './components'
import { getDisplayer } from './display-util'
import { getByProperty, parseSize, swapSize } from './util'
import { changePicture } from './picture'

const floor = Math.floor

function showMoney(x) {
  if (x >= 0) {
    let f = x % 10
    x = floor(x / 10)
    let j = x % 10
    x = floor(x / 10)
    return `${x}.${j}${f}元`
  }
  return '无'
}

function showDiscount(x) {
  if (x === 100) return '无'
  return (x % 10 === 0 ? x / 10 : x) + '折'
}

export default {
  mixins: [components],
  route: {
    canActivate(transition) {
      return /[1-9][0-9]*/.test(transition.to.params.id)
    },
    data(transition) {
      this.custom.initialize(parseInt(transition.to.params.id))
      transition.next()
    }
  },
  data() {
    return {custom: newCustom(), edit: false, show: false, message: ''}
  },
  watch: {
    'custom.message'(s) {
      if (s) this.showMessage(s)
    }
  },
  ready() {
    this._d = this.$lodash.calls(
      this.$EE.addEvent('select-tab', (t, k) => {
        let c = this.custom
        if (c.type) this.scrollToBottom(true)
        c.selectType(t, k)
      }, this),
      this.$EE.addEvent('select-material', v => {
        this.custom.selectMaterial(v)
      }, this),
      this.$EE.addEvent('change-indicator', (xi, di) => {
        let c = this.custom
        if (this.$lodash.isUndefined(xi)) xi = c.xi
        if (this.$lodash.isUndefined(di)) di = c.di
        c.changeIndicator(xi, di)
      }, this),
      this.$EE.addEvent('change-hole', hole => {
        let c = this.custom
        if (c.waiting) return
        c.hole = hole
      }, this))
  },
  beforeDestroy() {
    if (this._d) {
      this._d()
      this._d = null
    }
  },
  methods: {
    scrollToBottom(next = false) {
      let s = this.$els.scroller
      let f = () => s.scrollIntoView(false)
      next ? this.$nextTick(f) : f()
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
    op(a, b) {
      let c = this.custom
      if (c.waiting) return
      const f = s => this.showMessage(`请先选择${s}哦o_o`)
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
      if (!p) {
        f('图片')
        return
      }
      if (a === 'rotate' && isDecorate(c.current.entry.CategoryId)) {
        let s = parseSize(p.Image.File)
        if (p.Rotate / 90 % 2 === 0) s = swapSize(s)
        let material = c.changeSize(s, true)
        if (material) {
          p.Output.Size = swapSize(p.Output.Size)
          c.selectMaterial(material)
        }
      }
      changePicture(p, a, b)
    },
    addToCart() {
      let c = this.custom
      if (c.waiting) return
      let item = c.serialize()
      if (!item) {
        this.showMessage('定制还未完整哦T_T')
        return
      }
      this.$request.save('item', item, {params: {Count: 1, Action: 1}}).then(res => {
        let data = res.data
        openDialog({
          title: `成功添加定制${data.Id}到购物车${data.CartId}`,
          noBtn: '^_^',
          html: true,
          slot: [
            `价格：${showMoney(data.Money)}`,
            `折扣：${showDiscount(data.Discount)}`,
            `数量：${data.Count}`
          ].join('<br>')
        })
      })
    }
  },
  computed: {
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
    }
  }
}
</script>

<style lang='stylus'>
.editor
  margin 0 auto
  td
    padding 5px
    text-align center
    input
      display inline-block
      width 50px
</style>
