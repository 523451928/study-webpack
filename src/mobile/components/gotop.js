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
export function pagescroll() {
  require('js/jquery.hammer.js')
  require('js/jquery.onepage-scroll.js')

  var $frame = $('#frame')
  var $case = $('#case')
//  var $bag = $('#bag')
  var $bolster = $('#bolster')
//  var $tShirt = $('#tShirt')
//  var $cup = $('#cup')
  var $shirtMan = $('#shirtMan')
  var $link21 = $('#link21')
  var $bag = $('#bag')
  var $cup = $('#cup')
  var $tShirt = $('#tShirt')

//  var oneagescroll = require('js/jquery.onepage-scroll.js')

  $('.main').onepagescroll({
    sectionContainer: 'section',     // 指定单页面的每个页面外部容器
    easing: 'ease',                  // 页面切换的缓动效果，可设置成 "ease", "linear", "ease-in","ease-out", "ease-in-out"
    animationTime: 600,             // 每个页面切换的时长
    pagination: false,                // 是否显示右边的导航圆形按钮
    updateURL: false,                // 切换页面的时候是否需要更新页面URL.
    beforeMove: function(index) {},  // 页面切换之前的回调，index表示页面的索引
    afterMove: function(index) {},   // 页面切换之后的回调，index表示页面的索引
    loop: false,                     // 当前页面为最后一个的时候，继续向下切换是否回到第一个页面
    keyboard: true,                  // 是否可以使用方向键来操纵页面切换
    responsiveFallback: false,        // 是否当浏览器宽度为某一个指定值的时候，去除该插件效果，如果想实现这种效果，那么可以指定一个宽度值
    direction: 'vertical'        // 页面切换方向，可选值为 "vertical"水平 和"horizontal"垂直. 默认 "vertical"

  })

  $frame.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/frame'
  })
  $case.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/case'
  })
  $bolster.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/bolster'
  })
  $shirtMan.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/shirtMan'
  })
  $bag.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/bag'
  })
  $cup.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/cup'
  })
  $tShirt.hammer().on('tap', function() {
    location.href = 'http://m.wallwa.com/custom/shirtChild'
  })
  $link21.hammer().on('tap', function() {
    location.href = '/activity/process.html'
  })

  function preventTouch() {
    event.preventDefault()
  }
  document.addEventListener('touchstart', preventTouch)
  document.addEventListener('touchmove', preventTouch)
  document.addEventListener('touchend', preventTouch)
//  var t = document.getElementById('t')
  function fontFun() {
    var winW = document.documentElement.clientWidth
    // 适配的最大的横向分辨率是768
    if (winW >= 768) {
      document.documentElement.style.fontSize = '625%'
    } else {
      document.documentElement.style.fontSize = (winW / 768 * 625) + '%'
    }
  }
  fontFun()
  window.onresize = fontFun
  //    第一屏直接滚动
  $('.list-first').addClass('active-transform')

  // 第19屏的浮动层滑动
  document.getElementById('demo')
  var touchXY = {
    xStart: 0, // 触屏开始时的坐标
    yStart: 0
  }
  var oDiv = document.getElementById('page19-float')
  oDiv.addEventListener('touchstart', function(e) {
    e.preventDefault()
    var touch = e.targetTouches[0] // 第一个触屏的手指
    var divL = oDiv.offsetLeft
    touchXY.xStart = touch.pageX // 记录触屏时刻坐标
    touchXY.yStart = touch.pageY
    oDiv.addEventListener('touchmove', function(e) {
      e.preventDefault()
      var touch = e.targetTouches[0] // 第一个触屏的手指
      var x = touch.pageX // 手指移动坐标
//      var y = touch.pageY // 手指移动坐标
      var divW = oDiv.offsetWidth
      var divChildW = document.getElementById('page19-float-child').offsetWidth
      var winW = document.body.clientWidth // 页面的可视宽度
      var l = divL - touchXY.xStart + touch.pageX
      if (l >= 0) {
        oDiv.style.left = 0
      } else if (l > (winW - divW) && l < 0) {
        oDiv.style.left = l + 'px'
      } else {
        oDiv.style.left = (winW - divW) + 'px'
      }
      oDiv.addEventListener('touchend', function() {
        if (x - touchXY.xStart < 0 && divL === 0) {
          oDiv.style.left = -(divChildW + 25) + 'px'
          oDiv.className = 'divCur'
        } else if (x - touchXY.xStart < 0 && divL === -(divChildW + 25)) {
          oDiv.style.left = -(2 * divChildW + 50) + 'px'
          oDiv.className = 'divCur'
        } else if (x - touchXY.xStart > 0 && divL === -(divChildW + 25)) {
          oDiv.style.left = 0 + 'px'
          oDiv.className = 'divCur'
        } else if (x - touchXY.xStart > 0 && divL === -(2 * divChildW + 50)) {
          oDiv.style.left = -(divChildW + 25) + 'px'
          oDiv.className = 'divCur'
        }
      })
    })
  })
}

