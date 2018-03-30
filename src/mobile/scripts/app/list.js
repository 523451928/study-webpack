require('scripts/app/_global')
require('styles/scss/list/list')
require('scripts/tools/vue-tips.js')
require('styles/public/tips.css')

/* eslint-disable */
let vue = new Vue({
  el: '.bd',
  components: {
    'category': require('components/list/category.vue'),
    'display': require('components/list/display.vue'),
    'navBar': require('components/navBar.vue'),
    'filterSelect': require('components/list/filterSelect')
  }
})
$(() => {
  function getUrlParams() {
    let url = location.search
    let strs = ""
    let theRequest = {}
    if (url.indexOf("?") != -1) {
      let str = url.substr(1)
      strs = str.split("&")
      for(let i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split("=")[0]]=encodeURIComponent(strs[i].split("=")[1])
      }
    }
    return theRequest
  }
  $(".wa-nomore-text").hide()
  window.onscroll = _.throttle(function() {
    if ($(window).scrollTop() >= $(document).height() - $(window).height() -80) {
      let url = $('.next-page').last().attr('href')
      $('.next-page').last().remove()
      if (url) {
        vue.$loading('加载中...')
        request({ url}).then((res) => {
          console.log(res)
          vue.$loading.close()
          $('.product-list-area').append(res.body)
          new Vue({
            el: '.product-list-area',
            components: {
              'display': require('components/list/display.vue')
            }
          })
          document.documentElement.scrollTop += 50
          bindEvent()
        })
      } else {
        $(".wa-nomore-text").show()
      }
    }
  }, 1000)
  let tagsMask = $('.tags-mask')
  $('.cancel-btn').on('click', () => {
    $('html').removeClass('scroll-hidden')
    tagsMask.slideUp()
  })
  $('#wa-menu').on('click', () => {
    $('html').addClass('scroll-hidden')
    tagsMask.slideDown()
  })
  $('.reset-btn').on('click', () => {
    if (getUrlParams().CategoryId) {
      window.location.href = '/work?CategoryId=' + getUrlParams().CategoryId
    }
  })
  $('.tags-container').on('click', (e) => {
    e.stopPropagation()
  })
  tagsMask.on('click', (e) => {
    tagsMask.slideUp()
  })
  function bindEvent() {
    $('.list-like-btn').on('click', function () {
      if (!vue.$user.IsLogin) {
        vue.$notify({
          message: '请先登录'
        })
        return
      }
      let params = {
        Action: 3,
        CategoryId: $(this).attr('category-id'),
        WorkId: $(this).attr('work-id'),
        Packets: JSON.parse($(this).attr('packets')),
        EntryId: $(this).attr('entry-id')
      }
      let ItemId = $(this).attr('ItemId') || ''
      let self = this
      if (ItemId.length == 0) {
        request({ url: 'item/build', params }).then((res) => {
          ItemId = res.body.Id
          $(self).attr('ItemId', ItemId)
          changeLike()
        })
      } else {
        changeLike()
      }
      function changeLike() {
        let count = parseInt($(self).find('.like-count').html())
        request.submit('like/item', {
          ItemId
        }).then((res) => {
          if (res.body.Data) {
            count += 1
            $(self).find('.like-count').html(count)
            $(self).find('.wa').addClass('active')
          } else {
            count -= 1
            $(self).find('.like-count').html(count)
            $(self).find('.wa').removeClass('active')
          }
        })
      }
    })
  }
  bindEvent()
})
