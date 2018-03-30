// Copyright 2016 CHEN Xianren. All rights reserved.

require('scripts/app/_global')
require('js/jquery.lazyload.js')
require('scripts/app/public/vue-tips.js')
require('styles/public/tips.css')
/* eslint-disable no-new */
new Vue({
  el: '.bd',
  components: {
    'top': require('components/top.vue'),
    'HeadNav': require('components/custom/head-nav'),
    'banner': require('components/walllife/banner.vue'),
    'goodlife': require('components/walllife/goodlife.vue'),
    'foot': require('components/footer.vue'),
    'custom': require('components/walllife/custom.vue'),
    'customize': require('components/walllife/customize.vue'),
    'news': require('components/walllife/news.vue'),
    'shop': require('components/walllife/shop.vue'),
    'star': require('components/walllife/star.vue'),
    'coupon': require('components/walllife/coupon.vue')
  }
})
$(function() {
  $('img.lazy').lazyload({effect: 'fadeIn'})
  setTimeout(() => {
    $('#receiveCoupon').show()
  }, 500)
  $('.customize-content-center').mouseover(function() {
    $(this).parent().siblings().find('.customize-line').css({'opacity': 0})
  })
  $('.customize-content-center').mouseout(function() {
    $(this).parent().siblings().find('.customize-line').css({'opacity': 1})
  })
  function btnRight() {
    $('.Carousel-content ul').stop().animate({'margin-left': '-1002px'}, 600, 'swing', function() {
      $('.Carousel-content ul li:eq(0)').appendTo($('.Carousel-content ul')); $('.Carousel-content ul').css({'margin-left': 0})
    }) }
  function btnleft() {
    $('.Carousel-content ul li:eq(1)').css({'margin-left': '-2004px'})
    $('.Carousel-content ul').stop().animate({'margin-left': '1002px'}, 600, 'swing', function() {
      $('.Carousel-content ul li:eq(1)').prependTo($('.Carousel-content ul'))
      $('.Carousel-content ul li:eq(0)').css({'margin-left': 0})
      $('.Carousel-content ul').css({'margin-left': 0})
    }) }
  $('.Carousel-right').click(btnRight)
  $('.Carousel-left').click(btnleft)
})
