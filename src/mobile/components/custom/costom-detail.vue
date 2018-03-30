<template>
  <transition name="custom-slide">
    <div class="detail-mask" @touchmove.stop.prevent @click="detailShow = false" v-show="detailShow">
      <div @click.stop class="detail-wrapper">
        <div class="detail-title scale-1px">
          产品详细信息
          <span @click="detailShow = false" class="wa wa-angle-down fr"></span>
        </div>
        <div class="detail-content">
          <div class="price-detail scale-1px">
            售价:
            <span class="price fr">
              <span class="discount-text">{{detailObj.discountText}}</span>
              <span class="ori-price">￥{{Math.floor(detailObj.discountMoney)}}</span>
              <span class="discount-price">
                 ￥{{detailObj.realPrice}}
              </span>
            </span>
          </div>
          <ul>
            <li v-for="(item, index) in detailObj.propertyArr">
              <!--<span v-if="item.Key==='颜色'">{{item.Code ? '卡纸' : ''}}{{index+1}}层</span>-->
              {{item.Key}} <span class="fr">{{item.Value}}</span>
            </li>
          </ul>
        </div>
        <div class="join-cart" @click="addTocart">
          <span class="wa wa-shopping-cart-fill"></span>
          加入购物车
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable */
  export default {
    props: {
      detailObj: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail() {
        this.detailShow = true
      },
      addTocart() {
        this.$emit('addTocart')
      }
    }
  }
</script>

<style lang="sass" scope>
  .custom-slide-enter-active, .custom-slide-leave-active {
    transition: all .3s;
  }
  .custom-slide-enter , .custom-slide-leave-active{
    opacity: 0;
  }
  .custom-slide-enter .detail-wrapper, .custom-slide-leave-active .detail-wrapper{
    transform: translateY(100%);
  }
  .scale-1px{
    position: relative;
    border:none;
  }
  .scale-1px:after{
    content: '';
    position: absolute;
    bottom: 0;
    left:0;
    background: #dce0e0;
    width: 100%;
    height: 1px;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .fr{
    float: right;
  }
  .detail-mask{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    .detail-wrapper{
      position: absolute;
      width: 100%;
      height: auto;
      min-height: 200px;
      bottom: 0;
      background: #fff;
      transition: all .3s;
      .detail-content{
        padding:0 10px;
        min-height: 100px;
        .price-detail{
          line-height: 50px;
          font-size: 16px;
          .price{
            height: 50px;
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
        ul{
          padding-left: 0px;
          li{
            list-style: none;
            line-height: 30px;
          }
        }
      }
      .detail-title{
        line-height: 40px;
        padding: 0 10px;
        .wa{
          margin: 9px 3px 0 0;
          font-size: 18px;
        }
      }
    }
    .join-cart{
      line-height: 50px;
      text-align: center;
      font-size: 17px;
      background: #76a549;
      color: #fff;
    }
  }
</style>
