<template>
  <div class="warp">
    <!--头部开始-->
    <div class="profile-head">
      <div href="javascript:void(0)" @click="back" class="pull-left back" v-if="hasBack">
        <i class="wa wa-left"></i>
      </div>
      <span class="cart" :style="cartStyle">购物车</span>
      <span class="editor fr" v-show="!noItem" @click="editor" >{{change ? '完成' : '编辑'}}</span>
    </div>
    <!--头部结束-->
    <!--商品列表开始-->
    <div class="shop-wrap pt45">
      <div class="shop-cont-wrap cont-wrap">
        <div class="shop-cont cart-cont load-container">
          <loading v-show="showLoading"></loading>
          <div class="cart-list-wrap" v-if="!noItem">
            <div class="free-shipping">全场中通包邮(不含港澳台）</div>
            <transition-group tag="ul" name="flip-list"  class="list-unstyled cart-table cart-table-list"  :class="{'pb45': hasBack}" >
              <!--<li class="tr-row tr-row-all" v-for="(item,index) in carts" @touchstart="itemStart($event,index)" @touchmove="itemMove($event,index)" @touchend="itemEnd($event,index)" ref="domlis">-->
              <li v-drag drag-distance="80"  class="tr-row invalid-product tr-row-all scale-1px" v-for="(item,index) in invalidNoImgCarts" :key="item.Id">
                <div class="td-item checkbox-item">
                  <span class="invalid-icon">失效</span>
                </div>
                <div class="td-item goods-img" >
                  <img src="~images/msg-sys-icon.png">
                </div>
                <div class="td-item goods-info" >
                  <div class='invaild-del-btn' @click="dele(item, index)">
                    <span>删除商品</span>
                  </div>
                </div>
                <div class="del-item" @click="dele(item, index)">
                  <span>删除</span>
                </div>
              </li>
              <li v-drag drag-distance="80"  class="tr-row invalid-product tr-row-all scale-1px" v-for="(item,index) in invalidCarts">
                <div class="td-item checkbox-item">
                  <span class="invalid-icon">失效</span>
                </div>
                <div class="td-item goods-img" >
                  <viewer @click.native="showBig(item)" :entries="item.Entries" :pictures="item.Pictures" :length="120" ref="display" :isClick="false"></viewer>
                </div>
                <div class="td-item goods-info" v-for="e in item.EntriesDetail">
                  <p>
                    <a v-if="item.Work" href="javascript:void(0)"  class="order-pro-title underline-link">{{item.Work.Title}}</a>
                    <a v-else href="javascript:void(0)"  class="order-pro-title underline-link">
                      {{e['CategoryId'] == 1 ? '有框画' :
                      e['CategoryId'] == 6 ? '有框画' :
                        e['CategoryId'] == 7 ? '有框画' : e['Name']}}
                     </a>
                  </p>
                  <span class="detail" v-for="p in item.BomDetail">
                    {{p.Key}}&nbsp;:&nbsp;{{p.Value}};
                  </span>
                  <div class="clearfix goods-infos">
                    <a v-if="item.Work" :href="`/artist/${item.Work.UserId}?CategoryId=${item.CategoryId}`" class="similar-product fr">相似商品</a>
                    <span class="goods-money-num fl" @click="dele(item, index, true)">删除商品</span>
                  </div>
                </div>
                <div class="del-item" @click="dele(item, index, true)">
                  <span>删除</span>
                </div>
              </li>
              <li v-drag="dele" drag-distance="80" drag-trigger-distance="120" :id="item.Id" :key="item.Id" :index="index" class="tr-row tr-row-all scale-1px" v-for="(item,index) in validCarts" ref="domlis" >
                <div class="td-item checkbox-item" @click="clickItem(item)">
                  <label class="ww-icon icheck cd" :class="item.Checked ? 'checked' : ''"></label>
                </div>
                <div class="td-item goods-img" >
                  <viewer @click.native="showBig(item)" :entries="item.Entries" :pictures="item.Pictures" :length="120" ref="display" :isClick="false"></viewer>
                </div>
                <div class="td-item goods-info" v-for="e in item.EntriesDetail">
                  <p>
                    <a v-if="item.Work" href="javascript:void(0)"  class="order-pro-title underline-link">{{item.Work.Title}}</a>
                    <a v-else href="javascript:void(0)"  class="order-pro-title underline-link">
                      {{e['CategoryId'] == 1 ? '有框画' :
                      e['CategoryId'] == 6 ? '有框画' :
                        e['CategoryId'] == 7 ? '有框画' : e['Name']}}
                     </a>
                    <!--<span class="pull-right discount-btn">{{item.Discount | formatDis}}</span>-->
                  </p>
                  <span class="detail" v-for="p in item.BomDetail">
                    {{p.Key}}&nbsp;:&nbsp;{{p.Value}};
                  </span>
                  <div class="clearfix goods-infos">
                    <span v-show="!change" class="goods-info-num fr">x{{item.Count}}</span>
                    <span class="goods-money-num fl">￥{{item.Money/100}}</span>
                    <!--<span class="goods-money-num fl">￥{{item.Money*item.Count/100}}</span>-->
                    <span class="goods-price-num fl">￥{{item.Price/100}}</span>
                  </div>
                </div>
                <div class="del-item" @click="dele(item, index, true)">
                  <span>删除</span>
                </div>
                <div class="cart-li-bottom" v-show="change">
                  <div class="td-item goods-num">
                    <div class="num-warp">
                      <a href="javascript:void(0)" class="num-ope-item minus" :class="{'disabled' : item.Count === 1}" @click="setItemCount(item,'minus')"></a>
                      <span class="input-item">
                        <input type="text" class="form-control item-input" v-model="item.Count" @input="setItemCount(item,'model')"/>
                      </span>
                      <a href="javascript:void(0)" class="num-ope-item plus" :class="{'plus-disabled': item.Count === 99}" @click="setItemCount(item,'plus')"></a>
                    </div>
                  </div>
                  <!--<div class="td-item goods-ope">-->
                    <!--<span class="ope remove" @click="dele(item, index)">删除</span>-->
                  <!--</div>-->
                </div>
              </li>
            </transition-group>
            <div class="cart-summary fix clearfix" :class="{'fix-bottom': hasBack}">
              <span class="td-item checkbox-item pull-left">
                <label class="ww-icon icheck cd" :class="{'checked':isAllCheck,'disable':disabledCheck}" for="all-check">
                  <input id="all-check" type="checkbox" v-model="isAllCheck" @click="checkedAll">
                   <span class="all_chosen">全选</span>
                </label>
              </span>
              <button v-if="!change" id="submit-cart-btn" class="btn btn-success btn-fix btn-lg pull-right" @click="account">
                结算({{totalCount}})
              </button>
              <button v-else class="btn btn-delete btn-fix btn-lg pull-right" @click="delMultipel">
                删除所选
              </button>
              <div class="summary-cont pull-right" v-show="!change">
                <span class="summary-num">应付:<strong class="total-money">￥{{totalMoney/100}}</strong>
                  <!--<span class="small-text">全场中通包 </span>-->
                </span>
              </div>
            </div>
          </div>
          <div class="no-cart text-center fire" v-else>
            <div class="cart-icon">
              <i class="wa wa-shopping-cart-fill"></i>
              <p>购物车里空荡荡的</p>
            </div>
            <div class="info">
              <p>
                <a class="btn-goshop mr10" href="/">去购物</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img-preview v-if="imgShow" :displayData="displayData" @hideImg="imgShow=false"></img-preview>
    <!--商品列表结束-->
  </div>
</template>
<script>
/* eslint-disable */
import { getEntries } from 'components/custom/display/entry'
import { CartCount } from 'scripts/utils/const.js'
import { getSlideDirection, prefixStyle } from 'scripts/tools/slideDirection'
import { getURLParameters } from 'scripts/tools/getURLParameters.js'
import { initItem } from './utils.js'
import Loading from 'components/public/loading.vue'
import Viewer from 'components/custom/display/viewer.vue'
import ImgPreview from 'components/public/imgPreview'
import Loadmore from 'scripts/tools/loadmore'
let mixinComponents = _.assign({Loading, ImgPreview, Viewer})
const transform = prefixStyle('transform')
const CnNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
export default {
  mixins: [{components: mixinComponents}],
  data() {
    return {
      showLoading: true,
      dialog: false,
      carts: [],
      entriesDetail: [],
      noItem: false,
      freshTotalObj: {},
      editStatus: false,
      change: false,
      displayData: {},
      imgShow: false,
      itemTouch: {},
      hasBack: false
    }
  },
  mounted() {
    this.pull()
    let hasNav = getURLParameters(window.location.href).hasNav
    if (!hasNav) {
      document.querySelector('.nav-wrapper').style.display = 'none'
      this.hasBack = true
    }
    function bubbleSort(arr) {
      for (var i = 1;i < arr.length;i++) {
        for (var j = 0;j < arr.length - i;j++) {
          if (arr[j] > arr[j+1]) {
            [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
          }
        }
      }
      return arr
    }
    bubbleSort([3,8,1,2,6,0])
    function getFib(n){
      if (n==0) {
        return 0
      }
      if (n==1) {
        return 1
      }
      if (n>1) {
        return getFib(n-1) + getFib(n-2)
      }
    }
    function fibo(len){
      var fiboArr = []
      for (var i = 0;i < len;i++) {
        fiboArr.push(getFib(i))
      }
      return fiboArr
    }
    fibo(5)
    function getFibArr(n){
      var fibArr = []
      var i = 0
      while(i < n) {
        if (i <= 1) {
          fibArr.push(i)
        } else {
          fibArr.push(fibArr[i-1]+fibArr[i-2])
        }
        i++
      }
      return fibArr
    }
    getFibArr(5)
    function debounce(fn, delay){
      let timer
      return function (...args){
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(function() {
          fn.apply(this, args)
        }, delay)
      }
    }
    function fn(){
      console.log(1)
    }
    let fun = debounce(function(val) {
      console.log(val)
    }, 500)
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello debounce')
    fun('hello ')
  },
  computed: {
    invalidNoImgCarts() {
      return this.carts.filter((item) => {
        return item.Status === 2
      })
    },
    invalidCarts() {
      return this.carts.filter((item) => {
        return item.Status === 1
      })
    },
    validCarts() {
      return this.carts.filter((item) => {
        return item.Status === 0
      })
    },
    cartStyle() {
      if (this.noItem) {
        return {
          margin: 0
        }
      }
    },
    isAllCheck() {
      let flag = true
      this.validCarts.forEach((item) => {
        if (!item.Checked) {
          flag = false
        }
      })
      return flag
    },
    disabledCheck() {
      console.log(this.validCarts.length)
      return this.validCarts.length === 0
    },
    totalCount() {
      let count = 0
      this.validCarts.forEach((item) => {
        if (item.Checked) {
          count += item.Count
        }
      })
      return count
    },
    totalMoney() {
      let money = 0
      this.validCarts.forEach((item) => {
        if (item.Checked) {
          money += item.Count * item.Money
        }
      })
      return money
    }
  },
  methods: {
    delMultipel() {
      if (this.totalCount === 0) {
        this.$toast.center('请选择需要删除的商品')
        return
      }
      let self = this
      this.$dialog({
        title: '删除商品',
        content: '确定要删除选中的商品?',
        btnArr: [
          {
            text: '取消',
            className: 'view-btn',
            callback: function() {

              this.close()
            }
          },
          {
            text: '确定',
            className: 'use-btn',
            callback: function() {
              this.close()
              self.comfirmDel()
            }
          }
        ]
      })
    },
    comfirmDel() {
      let idArr = []
      let cartArr = this.carts
      for (let i = 0; i < cartArr.length ; i++) {
        if (cartArr[i].Checked) {
          idArr.push(cartArr[i].Id)
          cartArr.splice(i, 1)
          i--
        }
      }
      request.remove('cart', idArr).then(res => {
        if (cartArr.length === 0) {
          this.noItem = true
        }
        this.$toast.center('删除成功')
      }, res => {
        res.hide()
        this.$toast.center('删除失败')
      })
    },
    itemStart(e, index) {
      this.$refs.domlis[index].style.transition = 'none'
      if (this.lastIndex === index) {
        this.$refs.domlis[index].style.transition = 'all .3s'
      }
      this.$refs.domlis.forEach((item, idx) => {
        if (idx !== index) {
          item.style[transform] = 'translate(0px,0px)'
        }
      })
      this.itemTouch.isStart = true
      this.itemTouch.startX = e.touches[0].clientX
      this.itemTouch.startY = e.touches[0].clientY
    },
    itemMove(e, index) {
      if (this.itemTouch.isStart) {
        let moveX = e.touches[0].clientX
        let moveY = e.touches[0].clientY
        let direction = getSlideDirection(this.itemTouch.startX, this.itemTouch.startY, moveX, moveY)
        if (direction === 1 || direction === 2) {
          return false
        }
        this.itemTouch.disX = moveX - this.itemTouch.startX
        if (this.itemTouch.disX > 20) {
          return
        }
        if (this.itemTouch.disX < -80) {
          this.itemTouch.disX = -80
        }
        this.$refs.domlis[index].style[transform] = `translate(${this.itemTouch.disX}px,0px)`
      }
    },
    itemEnd(e, index) {
      this.$refs.domlis[index].style.transition = 'all .3s'
      if (this.itemTouch.disX < -30) {
        this.$refs.domlis[index].style[transform] = 'translate(-80px,0px)'
        this.lastIndex = index
      } else {
        this.$refs.domlis[index].style[transform] = 'translate(0px,0px)'
        this.lastIndex = -1
      }
    },
    showBig(item) {
      this.displayData = item
      this.imgShow = true
    },
    back() {
      window.history.go(-1)
    },
    pull() {
      const url = 'cart/list'
      request({url}).then(res => {
        let entriesIds = []
        let carts = res.take('Data') || []
        if (carts.length === 0) {
          this.noItem = true
          this.showLoading = false
        } else {
          carts.forEach(v => {
            if (v.Item.Entries) {
              entriesIds = _.concat(entriesIds, v.Item.Entries)
            }
          })
          getEntries(entriesIds).then(entriesDetail => {
            this.carts = initItem(carts, entriesDetail)
            this.entriesDetail = entriesDetail
            this.showLoading = false
          })
        }
      })
    },
    dele(item, index, flag) {
      request.remove('cart', [item['Id']]).then(res => {
        this.carts = this.carts.filter((cart) => {
           return item['Id'] !== cart['Id'] 
        })
        if (this.carts.length === 0) {
          this.noItem = true
        }
        if (flag) {
          this.$refs.domlis.forEach((item, idx) => {
            // item.style[transform] = 'translate(0px,0px)'
          })
        }
        this.$toast.center('删除成功')
      }, res => {
        res.hide()
        this.$toast.center('删除失败')
      })
    },
    setItemCount(item, action) {
      if (item.Count ===  CartCount.Min && action === 'minus' || item.Count === CartCount.Max && action === 'plus') {
        return
      }
      let params
      switch (action) {
        case 'plus':
          item.Count++
          break
        case 'minus':
          item.Count--
          break
        case 'model':
          if (!_.isNumber(item.Count)) {
            let modelValue = parseInt(item.Count)
            item.Count = _.isNaN(modelValue) ? 1 : modelValue
          }
          break
      }
      item.Count = item.Count < CartCount.Min ? CartCount.Min : item.Count
      item.Count = item.Count > CartCount.Max ? CartCount.Max : item.Count
      params = { Count: item.Count }
      request.set('cart', item['Id'], params).then(res => {
        if (!item.Checked) {
          request.set('cart', item['Id'], { Checked: true }).then(res => {
            item.Checked = true
          })
        }
      })
    },
    checkedAll() {
      let flag = true
      if (this.isAllCheck) {
        flag = false
      } else {
        flag = true
      }
      let b = {'Checked': flag}
      this.$loading('更新中...')
      request.submit('cart/batch/set', b).then(res => {
        _.each(this.carts, (c) => {
          c.Checked = flag
        })
        this.$loading.close()
      })
    },
    clickItem(item) {
//      this.showLoading = true
      let params = { Checked: !item.Checked }
      this.$loading("更新中...")
      request.set('cart', item['Id'], params).then(res => {
        item.Checked = !item.Checked
        this.$loading.close()
        this.showLoading = false
      })
    },
    editor() {
      if (this.carts.length === 0) {
        this.change = false
      } else {
        this.change = !this.change
      }
      if (this.$refs.domlis) {
        this.$refs.domlis.forEach((item, idx) => {
          item.style[transform] = 'translate(0px,0px)'
        })
      }
    },
    account() {
      if (this.totalCount === 0) {
        this.$toast.center('请选择商品')
        return
      } else {
        window.location.href = '/buy.html'
      }
    }
  },
  filters: {
    formatDis(val) {
      return `${CnNum[(val / 10) - 1]}折惠`
    }
  }
}
</script>
<style>
  .flip-list-move {
    transition: transform .5s;
  }
  .flip-list-leave-active{
    transform: translateX(-140%) !important;
    transition: transform .3s !important;
  }
</style>
