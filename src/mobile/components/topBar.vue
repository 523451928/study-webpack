<template>
  <div id="topbar" class="topbar">
    <div class="wa-topbar">
      <div class="inline-left left" @click="back">
        <a href="javascript:void (0)"><i class="wa wa-left"></i></a>
      </div>
      <h2 class="inline center" @click="showProductList">
        {{productName}}定制
        <!--<span class="icon-wrapper" :class="{'icon-rotate': isShow}">-->
          <!--<i class="wa wa-caret-down"></i>-->
        <!--</span>-->
      </h2>
      <div @click="addCart" class="inline-right right">
        <a href="javascript:void(0)" class="cart-url">
          <img src="~images/icon/add-cart.png" alt="">
        </a>
      </div>
    </div>
    <transition name="slide">
      <div v-show="isShow" class="select-cate" @touchmove.stop>
        <div class="row mb45">
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/8">
              <img class="cate-icon" src="~images/custom/cate-icon/frame.jpg">
              <span class="cate-title">有框画</span>
              <span class="r-line "></span>
            </a>
          </div>

          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/2">
              <img class="cate-icon" src="~images/custom/cate-icon/rimless.jpg">
              <span class="cate-title">布艺画</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/11">
              <img class="cate-icon" src="~images/custom/cate-icon/bolster.jpg">
              <span class="cate-title">抱枕</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/10">
              <img class="cate-icon" src="~images/custom/cate-icon/case.jpg">
              <span class="cate-title">手机壳</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/18">
              <img class="cate-icon" src="~images/custom/cate-icon/pad.jpg">
              <span class="cate-title">iPad壳</span>
              <span class="r-line sm-hide"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/19">
              <img class="cate-icon" src="~images/custom/cate-icon/notebook.jpg">
              <span class="cate-title">笔记本</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/21">
              <img class="cate-icon" src="~images/custom/cate-icon/puzzle.jpg">
              <span class="cate-title">拼图</span>
              <span class="r-line sm-hide"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/20">
              <img class="cate-icon" src="~images/custom/cate-icon/clock.jpg">
              <span class="cate-title">挂钟</span>
              <span class="r-line"></span>
            </a>
          </div>

          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/16">
              <img class="cate-icon" src="~images/custom/cate-icon/shirtChild.jpg">
              <span class="cate-title">儿童T恤</span>
              <span class="r-line sm-hide"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/15">
              <img class="cate-icon" src="~images/custom/cate-icon/shirtWoman.jpg">
              <span class="cate-title">女士T恤</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/14">
              <img class="cate-icon" src="~images/custom/cate-icon/shirtMan.jpg">
              <span class="cate-title">男士T恤</span>
              <span class="r-line sm-hide"></span>
            </a>
          </div>
          <div class="col-xs-4">

            <a class="cate-link" href="/custom.html#/category/17">
              <img class="cate-icon" src="~images/custom/cate-icon/bag.jpg">
              <span class="cate-title">帆布包</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/12">
              <img class="cate-icon" src="~images/custom/cate-icon/cup.jpg">
              <span class="cate-title">旅行杯</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a class="cate-link" href="/custom.html#/category/4">
              <img class="cate-icon" src="~images/custom/cate-icon/scroll.jpg">
              <span class="cate-title">卷轴画</span>
              <span class="r-line"></span>
            </a>
          </div>
          <div class="col-xs-4">
            <a href="javascript:void(0)" class="cate-link" style="height:154px;"></a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style lang="sass">
  .slide-enter-active, .slide-leave-active {
    transition: all .5s;
  }
  .slide-enter, .slide-leave-active {
    opacity: 0;
    top: -100% !important;
  }
  $topbar-height: 50px;
  #topbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $topbar-height;
    border-bottom: 1px solid #dce0e0;
    background-color: #fff;
    text-align: center;
    z-index: 101;
    color: #82888a;
    .center{
      color: #565a5c;
    }
    .wa-topbar{
      position: relative;
      z-index: 100;
      background: #fff;
      .wa-left{
        color: #82888a;
      }
      .icon-wrapper{
        display: inline-block;
        transition: all .3s;
        transform-origin: center center;
      }
      .icon-rotate{
        transform: rotate(180deg);
      }
    }
    > div {
      line-height: $topbar-height;
      height: 100%;
      font-size: 17px;
      cursor: pointer;
    }
    .left {
      padding: 0 20px 0 15px;
    }
    .select-cate {
      position: fixed;
      overflow: auto;
      top: 50px;
      left: 0px;
      background: #fff;
    }
    .right {
      padding: 0 10px 0 20px;
      right: 8px;
      top: -4px;
      .wa {
        font-size: 1.5em;
      }
      img {
        width: 28px;
        height: 28px;
      }
    }
    .center {
      margin: 0 auto;
      text-align: center;
      line-height: $topbar-height;
      height: 100%;
      font-size: 17px;
      cursor: pointer;
      .wa {
        font-size: .8em;
        margin-left: 4px;
      }
    }
    .mb45 {
      margin-bottom: 45px;
      .cate-link {
        display: inline-block;
        position: relative;
        color: #565a5c;
        text-align: center;
        background-color: #fff;
        margin: 0 -15px;
        .cate-icon {
          display: block;
          width: 100%;
          margin: 0 auto;
        }
        .cate-title {
          font-size: 12px;
          margin-top: 10px;
          display: inline-block;
        }
        .r-line {
          position: absolute;
          width: 3px;
          height: 100%;
          top: 0;
          right: 0;
          display: block;
          background: #edefef;
        }
      }
    }
  }
</style>
<script>
  import addUrl from 'scripts/directives/add-url.js'
  const categories = [{
    id: 8,
    name: '装饰画',
    children: [
      {id: 8, name: '有框画', type: 'frame'},
      {id: 2, name: '布艺画', type: 'rimless'},
      {id: 4, name: '卷轴画', type: 'scroll'}
    ]
  }, {
    id: 11,
    name: '家具产品',
    children: [
      {id: 11, name: '抱枕', type: 'bolster'},
      {id: 21, name: '拼图', type: 'clock'}
    ]
  }, {
    id: 14,
    name: 'T恤',
    children: [
      {id: 14, name: '男士T恤', type: 'shirtMan'},
      {id: 15, name: '女士T恤', type: 'shirtWoman'},
      {id: 16, name: '儿童T恤', type: 'shirtChild'}
    ]
  }, {
    id: 10,
    name: '手机壳 · iPad壳',
    children: [
      {id: 10, name: '手机壳', type: 'case'},
      {id: 18, name: 'iPad壳', type: 'pad'}
    ]
  }, {
    id: 17,
    name: '帆布包',
    children: [
    ]
  }, {
    id: 19,
    name: '文创产品',
    children: [
      {id: 19, name: '笔记本', type: 'notebook'},
      {id: 12, name: '旅行杯', type: 'cup'},
      {id: 20, name: '挂钟', type: 'puzzle'}
    ]
  }]
  export default {
    directives: {addUrl},
    data() {
      return {
        categories,
        isShow: false,
        activeCatId: 0,
        productName: '',
        activeCatGroup: {id: 0}
      }
    },
    watch: {
      '$route'(to, from) {
        const id = to.params.id
        this.activeCatId = Number(id)
        this.isShow = false
        this.upDateTitleName()
      }
    },
    methods: {
      back() {
        window.history.back()
      },
      addCart() {
        this.$bus.$emit('addCart')
      },
      showProductList() {
        this.isShow = !this.isShow
      },
      upDateTitleName() {
        let activeCatId = this.activeCatId
        _.find(categories, cg => {
          if (cg.id === activeCatId) {
            if (cg.hasOwnProperty('children') && cg.children.length) {
              _.each(cg.children, child => {
                if (child.id === activeCatId) {
                  this.productName = child.name
                }
              })
            } else {
              this.productName = cg.name
            }
          } else {
            if (cg.hasOwnProperty('children') && cg.children.length) {
              _.each(cg.children, child => {
                if (child.id === activeCatId) {
                  this.productName = child.name
                }
              })
            }
          }
        })
      }
    },
    mounted() {
      this.activeCatId = Number(this.$route.params.id)
      this.upDateTitleName()
    }
  }
</script>
