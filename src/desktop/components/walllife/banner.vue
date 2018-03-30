<template>
  <div class="walllife-bg">
    <carousel :imgArr="bannerData"></carousel>
  </div>
</template>
<script>
  /* eslint-disable*/
  import carousel from './Wcarousel.vue'
  export default {
    data() {
      return {
        bannerData: [{
          img: require('assets/images/banner-bg/coupon.jpg'),
          url: 'javascript:void(0)',
          callback: () => {
            this.$bus.$emit('showCoupon')
          }
        }, {
          img: require('assets/images/banner-bg/PC-frames.jpg'),
          url: 'javascript:void(0)'
        }, {
          img: require('assets/images/banner-bg/PC-scarves.jpg'),
          url: 'javascript:void(0)'
        }, {
          img: require('assets/images/banner-bg/PC-pillow.jpg'),
          url: 'javascript:void(0)'
        }, {
          img: require('assets/images/banner-bg/hot-product.jpg'),
          url: 'javascript:void(0)'
        }],
        activeIndex: 0,
        interval: null
      }
    },
    components: {
      carousel
    },
    mounted() {
//      this.autoPlay()
    },
    methods: {
      autoPlay() {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
          if (this.activeIndex >= 0 && this.activeIndex < this.bannerData.length - 1) {
            this.activeIndex = parseInt(this.activeIndex) + 1
          } else if (this.activeIndex === this.bannerData.length - 1) {
            this.activeIndex = 0
          }
        }, 5000)
      },
      prev() {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.activeIndex --
        this.activeIndex < 0 ? this.activeIndex = this.bannerData.length - 1 : ''
      },
      next() {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.activeIndex ++
        this.activeIndex > this.bannerData.length - 1 ? this.activeIndex = 0 : ''
      }
    }
  }
</script>
<style lang='sass'>
  @import '~styles/scss/wallwa/banner.scss'
</style>
