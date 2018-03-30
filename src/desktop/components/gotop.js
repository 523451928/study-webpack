export function initGo2Top() {
  let dom = $('#back-to-top')
  $(window).on('scroll', function(e) {
    goTopFn(dom, $(this).scrollTop())
  })
  goTopFn(dom, $(window).scrollTop())
}
export function gotop() {
  $('html, body').animate({scrollTop: 0}, 500, function() {
    $('#back-to-top').removeClass('active')
  })
}
export function isBottom() {
  var $cartsummary = $('.cart-summary')
  var $contWrap = $('.cart-cont')
  var $cartList = $contWrap.find('.cart-table')
  var dis2 = $('.cart-table').offset().top + $('.cart-table').height()
  var dis1 = $(document).scrollTop() + $(window).height()
  setTimeout(function() {
    dis2 = $cartList.offset().top + $cartList.height()
  }, 1000)
  if (dis2 > dis1) {
    $cartsummary.addClass('fix')
  }
  $(window).on('scroll', function(e) {
    dis1 = $(document).scrollTop() + $(window).height()
    if (dis1 > dis2) {
      $cartsummary.removeClass('fix')
    } else {
      $cartsummary.addClass('fix')
    }
  })
}
function goTopFn(dom, scrollNum) {
  if (scrollNum > 120) {
    dom.addClass('active')
  }
  if (scrollNum === 0) {
    dom.removeClass('active')
  }
}
// 获取页面高度
export function H() {
  var windowH = $('body').height()
  $('.bnr-1').css('height', windowH)
}

// 爱宠
export function effect() {
  var skrollr = require('js/skrollr.js')
  var windowH = $('body').height()
  var windowW = $('body').width()
  var $fixedBox = $('.scroll-fixed-box')
  var $holdBox = $('.holder-box')
  var resizeTimer
  var $navBar = $('.navbar')
  $('.list').css('height', windowH)
  $fixedBox.css('height', windowH)
  $holdBox.css('height', windowH * 6)
  $fixedBox.attr('data-' + windowH * 3, 'display:block')
  $fixedBox.attr('data-' + windowH * 10, 'display:none')
  $fixedBox.find('.cont-img-1-cover').attr('data-' + (windowH * 3 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-1-cover').attr('data-' + windowH * 4, 'height: 0px')
  $fixedBox.find('.scroll-1 .cont-text-area').attr('data-' + (windowH * 3.3), 'display: none;')
  $fixedBox.find('.scroll-1 .cont-text-cover').attr('data-' + windowH * 3.3, 'display: block; opacity:0; transition: all .5s; transform: translateY(50px);')
  $fixedBox.find('.scroll-1 .cont-text-cover').attr('data-' + windowH * 3.8, 'display:block; opacity: 1; transform: translateY(0px);')
  $fixedBox.find('.scroll-1').attr('data-' + windowH * 4, 'display:block; top: 0px')
  $fixedBox.find('.scroll-1').attr('data-' + windowH * 5, 'display:block; top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-2-cover').attr('data-' + (windowH * 5 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-2-cover').attr('data-' + windowH * 6, 'height: 0px')
  $fixedBox.find('.scroll-2 .cont-text-area').attr('data-' + (windowH * 5.3), 'display:none;')
  $fixedBox.find('.scroll-2 .cont-text-cover').attr('data-' + windowH * 5.3, 'display:block; opacity:0; transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-2 .cont-text-cover').attr('data-' + windowH * 5.8, 'display:block; opacity:1; transform: translateY(0px);')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 4, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 5, 'display:block; top:0px')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 6, 'display:block; top:0px')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 7, 'display:block; top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-3-cover').attr('data-' + (windowH * 7 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-3-cover').attr('data-' + windowH * 8, 'height:0px')
  $fixedBox.find('.scroll-3 .cont-text-area').attr('data-' + (windowH * 7.3), 'display:none;')
  $fixedBox.find('.scroll-3 .cont-text-cover').attr('data-' + windowH * 7.3, 'display:block;opacity:0;transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-3 .cont-text-cover').attr('data-' + windowH * 7.8, 'display:block;opacity:1;transform: translateY(0px);')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 6, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 7, 'display:block;top:0px')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 8, 'display:block;top:0px')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 9, 'display:block;top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-4-cover').attr('data-' + (windowH * 9 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-4-cover').attr('data-' + windowH * 10, 'height:0px')
  $fixedBox.find('.scroll-4 .cont-text-area').attr('data-' + (windowH * 9.3), 'display:none;')
  $fixedBox.find('.scroll-4 .cont-text-cover').attr('data-' + windowH * 9.3, 'display:block; opacity:0; transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-4 .cont-text-cover').attr('data-' + windowH * 9.8, 'display:block; opacity:1; transform: translateY(0px);')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 8, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 9, 'display:block; top:0px')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 10, 'display:block; top:0px')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 11, 'display:block; top:' + (-windowH) + 'px')
  if (windowW <= 1200) {
    $fixedBox.find('.cont-img-height img').css('height', windowH)
  }
  $(window).resize(function() {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(function() {
      location.reload()
    }, 300)
  })
  $(document).scroll(function() {
    var st = $(document).scrollTop()
    var scrollHeight = $(window).height() - 200
    $(window).mousemove(function(e) {
      var y = e.pageY
      var gap = y - st
      if (st > 200 && gap > 200) {
        $navBar.addClass('ani-hide')
      } else {
        $navBar.removeClass('ani-hide')
      }
    })
    $('.list').each(function() {
      var top = $(this).offset().top
      if (st + scrollHeight >= top && !$(this).hasClass('active')) {
        $(this).addClass('active')
      }
    })
    $('.list-detail').each(function() {
      var top = $(this).offset().top
      if (st + scrollHeight >= top && !$(this).hasClass('active')) {
        $(this).addClass('active')
      }
    })
  })
  // 第一屏文字向上滚动
  $(document).ready(function() {
    $('.list-first').addClass('active')
  })
  skrollr.init({
    edgeStrategy: 'set',
    easing: {
      WTF: Math.random,
      inverted: function(p) {
        return 1 - p
      }
    }
  })
}

// 孩子
export function effect2() {
  var skrollr = require('js/skrollr.js')
  var windowH = $('body').height()
  var windowW = $('body').width()
  var $fixedBox = $('.scroll-fixed-box')
  var $holdBox = $('.holder-box')
  var resizeTimer
  var $navBar = $('.navbar')
  $('.list').css('height', windowH)
  $fixedBox.css('height', windowH)
  $holdBox.css('height', windowH * 8)
  $fixedBox.attr('data-' + windowH * 3, 'display:block')
  $fixedBox.attr('data-' + windowH * 12, 'display:none')
  $fixedBox.find('.cont-img-1-cover').attr('data-' + (windowH * 3 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-1-cover').attr('data-' + windowH * 4, 'height: 0px')
  $fixedBox.find('.scroll-1 .cont-text-area').attr('data-' + (windowH * 3.3), 'display: none;')
  $fixedBox.find('.scroll-1 .cont-text-cover').attr('data-' + windowH * 3.3, 'display: block; opacity:0; transition: all .5s; transform: translateY(50px);')
  $fixedBox.find('.scroll-1 .cont-text-cover').attr('data-' + windowH * 3.8, 'display:block; opacity: 1; transform: translateY(0px);')
  $fixedBox.find('.scroll-1').attr('data-' + windowH * 4, 'display:block; top: 0px')
  $fixedBox.find('.scroll-1').attr('data-' + windowH * 5, 'display:block; top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-2-cover').attr('data-' + (windowH * 5 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-2-cover').attr('data-' + windowH * 6, 'height: 0px')
  $fixedBox.find('.scroll-2 .cont-text-area').attr('data-' + (windowH * 5.3), 'display:none;')
  $fixedBox.find('.scroll-2 .cont-text-cover').attr('data-' + windowH * 5.3, 'display:block; opacity:0; transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-2 .cont-text-cover').attr('data-' + windowH * 5.8, 'display:block; opacity:1; transform: translateY(0px);')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 4, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 5, 'display:block; top:0px')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 6, 'display:block; top:0px')
  $fixedBox.find('.scroll-2').attr('data-' + windowH * 7, 'display:block; top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-3-cover').attr('data-' + (windowH * 7 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-3-cover').attr('data-' + windowH * 8, 'height:0px')
  $fixedBox.find('.scroll-3 .cont-text-area').attr('data-' + (windowH * 7.3), 'display:none;')
  $fixedBox.find('.scroll-3 .cont-text-cover').attr('data-' + windowH * 7.3, 'display:block;opacity:0;transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-3 .cont-text-cover').attr('data-' + windowH * 7.8, 'display:block;opacity:1;transform: translateY(0px);')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 6, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 7, 'display:block;top:0px')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 8, 'display:block;top:0px')
  $fixedBox.find('.scroll-3').attr('data-' + windowH * 9, 'display:block;top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-4-cover').attr('data-' + (windowH * 9 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-4-cover').attr('data-' + windowH * 10, 'height:0px')
  $fixedBox.find('.scroll-4 .cont-text-area').attr('data-' + (windowH * 9.3), 'display:none;')
  $fixedBox.find('.scroll-4 .cont-text-cover').attr('data-' + windowH * 9.3, 'display:block; opacity:0; transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-4 .cont-text-cover').attr('data-' + windowH * 9.8, 'display:block; opacity:1; transform: translateY(0px);')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 8, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 9, 'display:block; top:0px')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 10, 'display:block; top:0px')
  $fixedBox.find('.scroll-4').attr('data-' + windowH * 11, 'display:block; top:' + (-windowH) + 'px')
  $fixedBox.find('.cont-img-5-cover').attr('data-' + (windowH * 11 + 50), 'height:' + windowH + 'px')
  $fixedBox.find('.cont-img-5-cover').attr('data-' + windowH * 12, 'height:0px')
  $fixedBox.find('.scroll-5 .cont-text-area').attr('data-' + (windowH * 11.3), 'display:none;')
  $fixedBox.find('.scroll-5 .cont-text-cover').attr('data-' + windowH * 11.3, 'display:block; opacity:0; transition: all .5s;transform: translateY(50px);')
  $fixedBox.find('.scroll-5 .cont-text-cover').attr('data-' + windowH * 11.8, 'display:block; opacity:1; transform: translateY(0px);')
  $fixedBox.find('.scroll-5').attr('data-' + windowH * 10, 'display:block; top:' + windowH + 'px')
  $fixedBox.find('.scroll-5').attr('data-' + windowH * 11, 'display:block; top:0px')
  if (windowW <= 1200) {
    $fixedBox.find('.cont-img-height img').css('height', windowH)
  }
  $(window).resize(function() {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(function() {
      location.reload()
    }, 300)
  })
  $(document).scroll(function() {
    var st = $(document).scrollTop()
    var scrollHeight = $(window).height() - 200
    $(window).mousemove(function(e) {
      var y = e.pageY
      var gap = y - st
      if (st > 200 && gap > 200) {
        $navBar.addClass('ani-hide')
      } else {
        $navBar.removeClass('ani-hide')
      }
    })
    $('.list').each(function() {
      var top = $(this).offset().top
      if (st + scrollHeight >= top && !$(this).hasClass('active')) {
        $(this).addClass('active')
      }
    })
    $('.list-detail').each(function() {
      var top = $(this).offset().top
      if (st + scrollHeight >= top && !$(this).hasClass('active')) {
        $(this).addClass('active')
      }
    })
  })
  // 第一屏文字向上滚动
  $(document).ready(function() {
    $('.list-first').addClass('active')
  })
  skrollr.init({
    edgeStrategy: 'set',
    easing: {
      WTF: Math.random,
      inverted: function(p) {
        return 1 - p
      }
    }
  })
}

// 更多店铺插件
export function artist() {
  require('js/isotope.pkgd.min.js')
  require('js/jquery.imageloaded.js')
  var $container = $('#artist-box')
  var $navList = $('.artist-tab-nav-list')
  $container.imagesLoaded(function() {
    $container.isotope($container[0], {
      // options...
      itemSelector: '.artist-list',
      hiddenStyle: {
        opacity: 0
      },
      visibleStyle: {
        opacity: 1
      }
    })

    $navList.on('click', 'li', function() {
      var $this = $(this)
      var $link = $this.find('a')
      var type = $link.data('filter')

      $this.addClass('active').siblings().removeClass('active')
      if (type === '*') {
        $container.isotope('arrange', { filter: '*' })
      } else {
        $container.isotope('arrange', { filter: '.' + type })
      }
    })
  })
}
export function slider() {
  $.fn.RangeSlider = function(cfg) {
    this.sliderCfg = {
      min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
      max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
      step: cfg && Number(cfg.step) ? cfg.step : 1,
      callback: cfg && cfg.callback ? cfg.callback : null
    }

    var $input = $(this)
    var min = this.sliderCfg.min
    var max = this.sliderCfg.max
    var step = this.sliderCfg.step
    var callback = this.sliderCfg.callback
    $input.attr('min', min)
      .attr('max', max)
      .attr('step', step)

    $input.bind('input', function(e) {
      $input.attr('value', this.value)
      $input.css('background-size', this.value + '% 100%')
      if ($.isFunction(callback)) {
        callback(this)
      }
    })
  }
  var change = function($input) {
    var Value = $('input').attr('value') * 5
    var Price = Value + 200
    var Price1 = Value + 150
    var Price2 = Value + 100
    $('.proportion').text(Value + '%')
    $('.profit').text('￥' + Value)
    $('.price').text('￥' + Price)
    $('.price1').text('￥' + Price1)
    $('.price2').text('￥' + Price2)
  }
  $('input').RangeSlider({ min: 0, max: 100, step: 1, callback: change })
}
