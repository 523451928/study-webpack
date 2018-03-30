<template>
  <div class="walllife-banner wa-swipper-wrap">
   <!-- <swiper :dragDisable="false" :imgArr="bannerList" :duration="5000" clientType="mobile"></swiper> -->
  </div>
</template>
<script>
  /* eslint-disable */
//  import Swiper from './Swiper.vue'
  import WaSwiper from 'scripts/tools/wa-swiper'
  import Swiper from './banner.vue'
  export default {
    data() {
      return {
        bannerData: [{
          title: '与爱宠合作  给生活不同',
          link: '换个方式来炫爱宠吧',
          img: require('assets/images/activity/pet-guide/bnr-1.jpg'),
          url: '/activity/pet.html'
        }, {
          title: '与孩子合作  把自己惊呆',
          link: '把孩子的画带入生活',
          img: require('assets/images/activity/child-guide/bnr-1.jpg'),
          url: '/activity/children.html'
        }],
        bannerList: [{
          img: require('assets/images/wallLife/Mobile-banner.jpg'),
          url: 'coupon/receive/receive.html?couponCode=ABCDEFGH'
        }, {
          img: require('assets/images/wallLife/Hot.jpg'),
          url: 'javascript:void(0)'
        }, {
          img: require('assets/images/wallLife/Mobile-frames.jpg'),
          url: 'javascript:void(0)'
        }, {
          img: require('assets/images/wallLife/Mobile-pillow.jpg'),
          url: 'javascript:void(0)'
        }, {
          img: require('assets/images/wallLife/Mobile-scarves.jpg'),
          url: 'javascript:void(0)'
        }],
        dataId: 0
      }
    },
    components: {
      Swiper
    },
    mounted() {
      let swiper = new WaSwiper({
          el: document.querySelector('.walllife-banner'),
          imgArr: this.bannerList,
          isAutoPlay: true,
          isLoop: true
      })
    },
    methods: {

    }
  }
</script>
<style lang='sass'>
  .walllife-banner {
    width: 100%;
    /*height: 100%;*/
    height: auto;
    background-color: #fff;
    position: relative;
    .carousel_img {
      width: 100%;
      min-height: 100%;
      position: relative;
      left: 0;
      top: 0;
      overflow: hidden;
      /*轮播图指示器*/
      .carousel_index {
        position: absolute;
        bottom: 70px;
        width: 100%;
        height: 20px;
        z-index: 4;
        > div {
          background-color: transparent;
          border: 1px solid #26a7c7;
          border-radius: 50%;
          height: 12px;
          width: 12px;
          display: inline-block;
          text-align: center;
          &:nth-child(1) {
            margin-right: 5px;
          }
          &:nth-child(2) {
            margin-left: 5px;
          }
          &.active {
            background-color: #999;
            border: none;
          }
        }
      }
      /*轮播图item*/
      .carousel-item {
        width: 100%;
        height: calc(100% - 50px);
        background-position: center;
        background-size: cover;
        position: absolute;
        top: 0;
        &:nth-child(1) {
          color: #fff;
          z-index: 3;
        }
        &:nth-child(2) {
          color: #565a5c;
          z-index: 2;
        }
        .row-text {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 300px;
          width: 100%;
          transform: translate(-50%,-50%);
          > h1 {
            font-size: 30px;
            margin: 0 0 20px;
            color: inherit;
          }
          > span {
            font-size: 16px;
              display: block;
              line-height: 1.5;
              color: inherit;
          }
          > .btn-detail {
            display: inline-block;
            text-align: center;
            margin-top: 20px;
            padding: 8px 10px;
            font-size: 14px;
            letter-spacing: 1px;
            background: none;
            border: 1px solid #26a7c7;
            color: #26a7c7;
            width: 30%;
            &:hover {
              text-decoration: none;
            }
          }
        }
      }
    }
  }
</style>
