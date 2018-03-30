<template>
  <div class="m-swiper-list">
    <div class="swiper-container" ref="swiper">
      <ul class="swiper-wrapper" style="padding-right: 100px;">
        <li class="list-item swiper-slide" v-for="(item, index) in list">
          <work-display 
            :entryId="item.EntryId" 
            :productId="item.ProductId" 
            :categoryId="item.CategoryId"
            :pictures="item.Pictures"
            :workId = "item.WorkId"
            ></work-display>
        </li>
      </ul>
    </div>
    <div class="wa wa-left"></div>
    <div class="wa wa-right"></div>
  </div>
</template>

<script>
/* eslint-disable */
let Swiper = require('../../scripts/utils/swiper.min.js')
import WorkDisplay from './work-display'
export default {
  components: {
    WorkDisplay
  },
  props: {
    list: {
      type: Array
    }
  },
  created() {
    this.initSwiper()
  },
  methods: {
    initSwiper() {
      this.$nextTick(() => {
        let swiperEl = this.$refs.swiper
        let swiper = new Swiper(swiperEl, {
          navigation: {
            nextEl: '.wa-left',
            prevEl: '.wa-right',
          },
          speed: 300,
          slidesPerView: 'auto',
        })
      })
    }
  },
}
</script>


<style lang="sass" scoped>
@import '~../../styles/swiper.min.css';
@import '~../../styles/scss/public/variable.scss';
.m-swiper-list {
  position: relative;
  .swiper-container {
    .swiper-wrapper {
      li {
        width: 230px;
        margin-right: 20px;
      }
    }
  }
  >.wa {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 48px;
    color: $c-fc-3;
    &.wa-left {
      left: -58px;
    }
    &.wa-right {
      right: -58px;
    }
    &.swiper-button-disabled {
      color: $c-bg-2;
    }
  }
}
</style>
