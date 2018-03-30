<template>
  <div class="cart-box">
    <!--购物车banner开始-->
    <div class="m-shop-hd-wrap">
      <ul class="step-wrap">
        <li class="step step-cart curr"><span>购物车</span></li>
        <li class="hr"></li>
        <li class="step step-order"><span>填写订单</span></li>
        <li class="hr"></li>
        <li class="step step-pay"><span>等待支付</span></li>
        <li class="hr"></li>
        <li class="step step-ok"><span>支付成功</span></li>
      </ul>
    </div>
    <!--购物车banner结束-->
    <!--商品列表开始-->
    <div class="ww-wrap shop-wrap" >
      <div class="shop-cont-wrap cont-wrap">
        <!--  <ol class="breadcrumb">
           <li><a href="/home" target="_blank"> 首页 </a></li>
           <li class="active">购物车</li>
         </ol> -->
        <ul class="u-crumbs">
          <li class="crumbs-item">
            <a href="/" target="_blank">首页</a>
          </li>
          <li class="crumbs-item">购物车</li>
        </ul>
        <div class="shop-cont cart-cont load-container">
          <!-- Loading -->
          <loading v-show="showLoading"></loading>
          <!-- 存在商品 -->
          <div class="cart-list-wrap" v-if="!noItem">
            <ul class="list-unstyled cart-table cart-table-list">
              <li class="th-row">
                <span class="td-item checkbox-item">
                    <label class="ww-icon icheck cd" :class="{checked:isAllCheck}">
                      <input type="checkbox" v-model="isAllCheck" @click="checkedAll">
                    </label>
                    <span class="all_chosen">全选</span>
                </span>
                <span class="td-item goods-img"></span>
                <span class="td-item goods-info">产品信息</span>
                <span class="td-item goods-money">单价</span>
                <span class="td-item goods-num">数量</span>
                <span class="td-item goods-privilege">优惠/件</span>
                <span class="td-item">总价</span>
                <span class="td-item goods-ope">操作</span>
              </li>
              <!-- 遍历结果 -->
              <li class="tr-row tr-row-all" v-for="(item,index) in validCarts">
                <div class="td-item checkbox-item">
                  <label class="ww-icon icheck cd" :class="item.Checked ? 'checked' : ''" @click="clickItem(item)"></label>
                </div>
                <!-- 图片显示 -->
                <div class="td-item goods-img" @click="showBigImg(item.CarId)">
                  <viewer :entries="item.Entries" :pictures="item.Pictures" :length="150" ref="display" :isClick="false"></viewer>
                </div>
                <!-- 信息显示 -->
                <div class="td-item goods-info">
                  <!-- 此处做判断 判断跳转链接 -->
                  <h5>
                    <a v-if="!item.Work" href="">定制-{{mapProductName(item)}}</a>
                    <a v-else href="">{{item.Work.Title}}</a>
                  </h5>
                  <p>装裱形式: {{item.goodsInfo.Name}}</p>
                  <p v-for="info in item.goodsInfo.Properties">
                    {{info.Key}}: {{info.Value}}
                  </p>
                </div>
                <div class="td-item goods-money">
                  ￥{{Math.ceil((item.Money) / item.Discount)}}
                </div>
                <div class="td-item goods-num">
                  <div class="u-input-number">
                    <span role="button" class="input-number-decrease" :class="Number(item.Count)<=1&&'min'" @click="changeGoods(0, item.CarId)">
                      <i class="wa-minus"></i>
                    </span>
                    <span role="button" class="input-number-add" :class="Number(item.Count)>=99&&'max'" @click="changeGoods(1, item.CarId)">
                      <i class="wa-plus"></i>
                    </span>
                    <input type="text" autocomplete="off" maxlength="2" v-model="item.Count" @input="handleChange(item.CarId)" @blur="onBlur(item.CarId)">
                  </div>
                </div>
                <div class="td-item goods-privilege">
                  ￥{{Math.ceil((item.Money) / item.Discount) - item.Money}}
                </div>
                <div class="td-item goods-total-price">
                  ￥{{Math.floor(item.Money) * item.Count}}
                </div>
                <div class="td-item goods-ope">
                  <span class="remove-icon wa-times-circle-o" v-on:click="delItem(item.CarId, item.Entries, item.Pictures)"></span>
                  <p class="similarity">
                    <a :href="!item.Work?customUrl(item):workUrl(item)" target="_blank">相似商品</a>
                  </p>
                </div>
              </li>
              <li class="tr-row tr-row-all disable" v-for="(item,index) in invalidCarts">
                <div class="status td-item checkbox-item">
                  失效
                </div>
                <!-- 图片显示 -->
                <div class="td-item goods-img">
                  <viewer :entries="item.Entries" :pictures="item.Pictures" :length="150" ref="display" :isClick="false"></viewer>
                </div>
                <!-- 信息显示 -->
                <div class="td-item goods-info">
                  <!-- 此处做判断 判断跳转链接 -->
                  <h5>
                    <a v-if="!item.Work" href="">定制-{{mapProductName(item)}}</a>
                    <a v-else href="">{{item.Work.Title}}</a>
                  </h5>
                  <p>装裱形式: {{item.goodsInfo.Name}}</p>
                  <p v-for="info in item.goodsInfo.Properties">
                    {{info.Key}}: {{info.Value}}
                  </p>
                </div>
                <div class="td-item goods-money">
                  ￥{{Math.ceil((item.Money) / item.Discount)}}
                </div>
                <div class="td-item goods-num">
                  <div class="u-input-number">
                    <span role="button" class="input-number-decrease" :class="Number(item.Count)<=1&&'min'">
                      <i class="wa-minus"></i>
                    </span>
                    <span role="button" class="input-number-add" :class="Number(item.Count)>=99&&'max'">
                      <i class="wa-plus"></i>
                    </span>
                    <input type="text" autocomplete="off" maxlength="2" v-model="item.Count" disabled>
                  </div>
                </div>
                <div class="td-item goods-privilege">
                  ￥{{Math.ceil((item.Money) / item.Discount) - item.Money}}
                </div>
                <div class="td-item goods-total-price">
                  ￥{{Math.floor(item.Money) * item.Count}}
                </div>
                <div class="td-item goods-ope">
                  <span class="remove-icon wa-times-circle-o" v-on:click="delItem(item.CarId, item.Entries, item.Pictures)"></span>
                  <p class="similarity">
                    <a href="javascript:(0)" target="_blank">相似商品</a>
                  </p>
                </div>
              </li>
              <li class="tr-row tr-row-all disable" v-for="(item,index) in invalidNoImgCarts">
                <div class="td-item checkbox-item">
                  <label class="ww-icon icheck cd disable"></label>
                </div>
                <div class="status td-item checkbox-item">
                  失效
                </div>
                <div class="td-item goods-ope">
                  <span class="remove-icon wa-times-circle-o" v-on:click="onCallback(item.CarId)"></span>
                </div>
              </li>
            </ul>
            <div class="cart-summary u-buttom-bar">
              <div class="summary-cont">
                <div class="check-num">
                  已选商品&nbsp;
                  <strong>{{totalCount}}</strong>
                  &nbsp;件
                </div>
                <div class="total-price">
                  合计: <strong>￥ {{totalMoney}}</strong>
                </div>
              </div>
              <button id="submit-cart-btn" class="btn btn-success btn-lg" @click="account">结算</button>
            </div>
          </div>
          <!-- 没有商品 -->
          <div class="no-cart text-center" v-else>
            <span class="mr10">
                <i class="wa wa-shopping-cart-fill"></i>
            </span>
            <div class="info">
              <p>您的购物车中暂时没有商品，您可以：</p>
              <p class="text-left">
                <a class="btn btn-primary mr10" href="/" target="_blank">随便逛逛</a>
                <a class="btn btn-primary" href="/custom/1" target="_blank">去定制</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img-dialog v-if="dialogShow" :title="'是否删除这个商品'" :entries="Entries" :pictures="Pictures" :isDisplay="true" :isClick="false" @callback="onCallback" :id ='carId'>
    </img-dialog>
    <!--商品列表结束-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <image-big-show :entries="Entries" :pictures="Pictures" :isClick="false" v-if="imgShow" @popHide="popHide"></image-big-show>
    </transition>
  </div>
</template>
<script>
  /* eslint-disable */
  // import { getEntries } from 'scripts/utils/entry'
  import { getEntries } from 'components/custom/display/entry'
  import { CartCount } from 'scripts/utils/const'
  import { InterfaceMap as interf } from 'scripts/interfaceConst.js'
  import { initItem, freshTotal } from './utils.js'
  import Loading from 'components/public/loading.vue'
  import { isBottom } from 'components/gotop.js'
  import Viewer from 'components/custom/display/viewer.vue'
  import ImageBigShow from 'components/public/imagebigshow.vue'
  import imgDialog from 'components/public/imgDialog.vue'
  import {
		DecorativeCategories as dc,
		MaterialTypes as mt,
	} from "scripts/utils/custom/consts.js" // 一些常量
  // import { mixin as displayComponents } from 'components/public/display/app/components'

  // let mixinComponents = _.assign({Loading}, displayComponents)
  const baseUrl = interf.baseUrl
  export default {
    components: {
      Viewer,
      Loading,
      ImageBigShow,
      imgDialog
    },
    data() {
      return {
        showLoading: true, // 是否loading
        carts: [], // 购物车数据
        entriesDetail: [],
        checkedAllStatus: true, // 全选按钮是否勾选
        noItem: false, // 是否存在商品
        freshTotalObj: {},
        //  区分调用的display组件是否用于编辑  *true  需要操作图片 *false 仅展示
        editStatus: false,
        goodsInfo: undefined, // 商品信息
        Entries: undefined, // 传递给子组件的数据
        Pictures: undefined, // 传递给子组件的图片数据
        imgShow: false, // 图片弹出层是否显示
        dialogShow: false, // 控制对话框是否弹出
        carId: -1 // 当前对话框弹出的购物车Id
      }
    },
    mounted() {
      this.getCartData().then(res => {
        if (res.length > 0) {
          this.showLoading = false
          this.noItem = false
          // 检验是否全选
          this.initDisplayData(res).then(res => {
            this.carts = res
          })
        } else {
          this.noItem = true
          this.showLoading = false
        }
      })
      isBottom()
    },
    methods: {
      // 获得购物车数据
      getCartData() {
        let self = this
        return new Promise((resolve, reject) => {
          self.$request.list('cart').then(res => {
            let carts = res.take('Data') ? res.take('Data') : []
            resolve(carts)
          })
        })
      },
      // 检验是否全选
      teskCartChecked(cart) {
        if (Array.isArray(cart)) {
          return cart.every((item, index) => {
            if (!item.Checked) {
              return false
            } else {
              return true
            }
          })
        } else {
          return false
        }
      },
      // 初始化数据
      initDisplayData(cart) {
        let self = this
        let arr = []
        let entryIds = []
        return new Promise(resolve => {
          cart.forEach((cartRow, i) => {
            let o = {}
            if (cartRow.Item.Entries) {
              o['Count'] = cart[i].Count // 数量
              o['Checked'] = cart[i].Checked // 是否选中
              o['Discount'] = cart[i].Discount / 100 //折扣
              o['CarId'] = cart[i].Id // 购物车id
              o['Entries'] = cart[i].Item.Entries // 单品渲染数据
              o['GoodsId'] = cart[i].Item.Id // 商品Id
              o['Money'] = cart[i].Item.Money / 100 // 商品价格
              o['Pictures'] = cart[i].Item.Pictures // 图片数据
              o['Status'] = cart[i].Item.Status // 商品状态
              o['CategoryId'] = cart[i].Item.CategoryId // 品类id
              if (cart[i].Item.Work) {
                o['Work'] = cart[i].Item.Work
              }
              arr.push(this._getEntries(o))
            } else {
              o['Status'] = cart[i].Item.Status
              o['CarId'] = cart[i].Id
              arr.push(this._getEntries(o))              
            }
          })
          Promise.all(arr).then(res => {
            resolve(res)
          })
        })
      },
      _getEntries(obj) {
        return new Promise((resolve, reject) => {
          let entryId = obj.Entries
          if (entryId) {
            getEntries(entryId).then(res => {
              obj['goodsInfo'] = res[0]
              resolve(obj)
            })
          } else {
            resolve(obj)
          }
        })
      },
      // 定制画跳转
      customUrl(item) {
        return `/custom/${item.CategoryId}`
      },
      // 作品跳转
      workUrl(item) {
        return `/artist/${item.Work.UserId}?CategoryId=${item.CategoryId}`
      },
      // 关闭大图显示的弹出层
      popHide(val) {
        this.imgShow = val
      },
      // 调整商品
      changeGoods(t, id) {
        let self = this
        self.carts.forEach(item => {
          if (item.CarId === id) {
            if (t) {
              if (Number(item.Count) >= 99) {
                this.$notify({
                  type: 'wa-warning',
                  text: '最多购买99件'
                })
              } else {
                self.$request.set('cart', id, {
                  Count: Number(item.Count) + 1
                }).then(() => {
                  item.Count = String(Number(item.Count) + 1)
                })
              }
            } else {
              if (Number(item.Count) === 1) {
                // this.$notify({
                //   type: 'wa-warning',
                //   text: '至少选择一件'
                // })
              } else {
                self.$request.set('cart', id, {
                  Count: Number(item.Count) - 1
                }).then(() => {
                  item.Count = String(Number(item.Count) - 1)
                })
              }
            }
          }
        })
      },
      // 控制输入框的数字显示
      handleChange(id) {
        let self = this
        for (let item of self.carts) {
          if (item.CarId === id) {
            if (Number.isNaN(Number(item.Count))) {
              item.Count = item.Count.replace(/\D+/g, '')
            }
            if (item.Count.length > 0){
              if (Number(item.Count) >= 99) {
                item.Count = '99'
              }
              if (Number(item.Count) === 0) {
                item.Count = '1'
              }
            }
            break
          }
        }
      },
      onBlur(id) {
        let self = this
        for (let item of self.carts) {
          if (item.CarId === id) {
            if (item.Count.length > 0) {
              this.$request.set('cart', id, {
                Count: parseInt(item.Count)
              })
            } else {
              this.$notify({
                type: 'wa-warning',
                text: '至少购买一件'
              })
              this.$request.set('cart', id, {
                Count: 1
              }).then(() => {
                item.Count = "1"
              })
            }
            break
          }
        }
      },
      // 删除
      delItem(id, e, p) {
        let self = this
        self.carts.forEach(item => {
          if (item.CarId === id) {
            self.Entries = item.Entries
            self.Pictures = item.Pictures
            self.carId = id
            self.dialogShow = true
          }
        })
      },
      setItemCount(item, action) {
        let params
        let self = this
        switch (action) {
          case 'plus':
            item.Count++
            this.freshTotalObj = freshTotal(self.carts)
            self.totalCount = this.freshTotalObj.totalCount
            self.totalMoney = this.freshTotalObj.totalMoney
            break
          case 'minus':
            item.Count--
            this.freshTotalObj = freshTotal(self.carts)
            self.totalCount = this.freshTotalObj.totalCount
            self.totalMoney = this.freshTotalObj.totalMoney
            break
          case 'model':
            if (!_.isNumber(item.Count)) {
              let modelValue = parseInt(item.Count)
              item.Count = _.isNaN(modelValue) ? 1 : modelValue
              this.freshTotalObj = freshTotal(self.carts)
              self.totalCount = this.freshTotalObj.totalCount
              self.totalMoney = this.freshTotalObj.totalMoney
            }
            break
        }

        item.Count = item.Count < CartCount.Min ? CartCount.Min : item.Count
        item.Count = item.Count > CartCount.Max ? CartCount.Max : item.Count
        params = { Count: item.Count }
        request.set('cart', item['Id'], params).then(res => {
          this.freshTotalObj = freshTotal(self.carts)
          self.totalCount = this.freshTotalObj.totalCount
          self.totalMoney = this.freshTotalObj.totalMoney
        })
      },
      // 全选 反选
      checkedAll() {
        let flag = true
        if (this.isAllCheck) {
          flag = false
        } else {
          flag = true
        }
        let b = {'Checked': flag}
        request.submit('cart/batch/set', b).then(res => {
          _.each(this.carts, (c) => {
            c.Checked = flag
          })
        })
      },
      // 选中购物车
      clickItem(item) {
        let params = { Checked: !item.Checked }
        request.set('cart', item['CarId'], params).then(res => {
          item.Checked = !item.Checked
          this.showLoading = false
        })
      },
      // 跳转到支付页面
      account() {
        let self = this
        if (self.totalCount === 0) {
          layer.toast('请选择商品')
          return
        } else {
          window.open('/buy.html')
        }
      },
      // 展开大图
      showBigImg(id) {
        let self = this
        self.carts.forEach(item => {
          if (item.CarId === id) {
            self.Entries = item.Entries
            self.Pictures = item.Pictures
            self.imgShow = true
          }
        })
      },
      // 当前选中的商品
      currentCount(id) {
        this.carts.forEach(item => {
          if (item.CarId === id) {
            return item.Count
          }
        })
      },
      // 删除商品的回调
      onCallback(v) {
        let self = this
        if (v) {
          self.$request.remove('cart', [v]).then(res => {
            self.carts.forEach((item, index, array) => {
              if (item.CarId === v) {
                array.splice(index, 1)
              }
              if (self.carts.length === 0) {
                self.noItem = true
              }
              layer.shortToast('删除成功')
              this.$user.getUserInfo()
            })
          }).catch(err => {
            err.hide()
            layer.toast('出现意外情况，删除失败，\n请刷新页面再次执行该动作')
          })
          this.dialogShow = false
        } else {
          this.dialogShow = v
        }
      },
      /**
       * 映射对应品类的名称
       */
      mapProductName(item) {
        const id = item.CategoryId
        switch(id) {
          case dc.Frame:
          case dc.Frames:
          case dc.Matless:
            return '有框画'
            break
          case dc.Rimless:
            return '布艺画'
            break
          case dc.Scroll:
            return '卷轴画'
            break
          case dc.Magnet:
            return '磁贴画'
            break
          case 13:
          case 14:
          case 15:
          case 16:
            return 'T恤'
            break
          case 17:
            return '帆布包'
            break
          case 18:
            return 'ipad保护壳'
            break
          case 19:
            return '笔记本'
            break
          case 20:
            return '挂钟'
            break
          case 21:
            return '拼图'
            break
          case 10:
            return 'iphone壳'
            break
          case 11:
            return '抱枕'
            break
          case 12:
            return '旅行杯'
            break
        }
      }
    },
    computed: {
      // 合计金额
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
      isAllCheck() {
        let flag = true
        this.validCarts.forEach((item) => {
          if (!item.Checked) {
            flag = false
          }
        })
        return flag
      },
      totalMoney() {
        let totalMoney = 0;
        this.validCarts.forEach((item, index)=> {
          if (item.Checked) {
            totalMoney += Math.floor(item.Money) * item.Count
          }
        })
        return totalMoney
      },
      // 合计总数
      totalCount() {
        let totalCount = 0
        this.validCarts.forEach(item => {
          if (item.Checked) {
            totalCount += Number(item.Count)
          }
        })
        return Number(totalCount)
      }
    }
  }
</script>
