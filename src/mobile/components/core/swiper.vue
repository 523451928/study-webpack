<template>
  <swiper class="m-swiper">
    <swiper-slide></swiper-slide>
  </swiper>
</template>

<script>
/*eslint-disable*/
import 'styles/public/swiper.min.css'
import { swiper, swiperSlide } from 'scripts/core/vue-awesome-swiper.js'

export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    options: {
      type: Object,
      default: {
        type: 'swiper' // 判断是轮播还是滚动
      }
    }
  }
  
}
</script>

<style lang="sass" scoped>
</style>


