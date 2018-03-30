<template>
  <div class="category-wrapper">
    <swiper :swiperData="swiperData" :isAuto="false"></swiper>
  </div>>
</template>

<script>
  /* eslint-disable */
  import swiper from './swiper.vue'
  export default {
    components: {
      swiper
    },
    data() {
      return {
        swiperData: [
          [
            {text:'有框画',href: '/shop.html', iconClass: 'wa-youkuanghua'},
            {text:'布艺画',href: '/shop.html', iconClass: 'wa-buyihua'},
            {text:'挂钟',href: '/shop.html', iconClass: 'wa-clock'},
            {text:'抱枕',href: '/shop.html', iconClass: 'wa-baozhen'},
            {text:'手机壳',href: '/shop.html', iconClass: 'wa-phone-case'},
            {text:'iPad壳',href: '/shop.html', iconClass: 'wa-iPad-case'},
            {text:'笔记本',href: '/shop.html', iconClass: 'wa-notebook'},
            {text:'拼图',href: '/shop.html', iconClass: 'wa-puzzle'}
          ],
          [
            {text:'儿童T恤',href: '/shop.html', iconClass: 'wa-T-Shirt'},
            {text:'男士T恤',href: '/shop.html', iconClass: 'wa-T-Shirt'},
            {text:'女士T恤',href: '/shop.html', iconClass: 'wa-T-Shirt'},
            {text:'旅行杯',href: '/shop.html', iconClass: 'wa-lvxingbei'},
            {text:'卷轴画',href: '/shop.html', iconClass: 'wa-juanzhouhua'},
            {text:'地垫',href: '/shop.html', iconClass: 'wa-ground-mat'},
            {text:'钥匙扣',href: '/shop.html', iconClass: 'wa-chain'},
            {text:'团扇',href: '/shop.html', iconClass: 'wa-round-fan'}
          ],
          [
            {text:'地垫',href: '/shop.html', iconClass: 'wa-ground-mat'}
          ]
        ]
      }
    },
    methods: {

    }
  }
</script>
