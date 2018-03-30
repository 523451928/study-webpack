/**
 * Created by admin on 2016/11/22.
 * 商店页面
 */
require('scripts/app/_global')
require('styles/scss/list/list')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')

/* eslint-disable */
let vue = new Vue({
  el: '.bd',
  components: {
    'category': require('components/list/category.vue'),
    'banner': require('components/list/banner.vue'),
    'display': require('components/list/displayShopHover.vue'),
    'tags': require('components/list/taglist.vue'),
    'childcategory': require('components/list/childcategory.vue')
  }
})
$(function() {
  function getParameter(name) {
    var r = new RegExp('(\\?|#|&)' + name + '=([^&#]*)(&|#|$)')
    var m = location.href.match(r)
    return (!m ? '' : decodeURIComponent(m[2]))
  }
  let queryString = getParameter('Query')
  if (queryString) {
    $('.search-query').html(`已找到“${queryString}”相关的产品`).show()
  }
  if (getParameter('TagId')) {
    $('.more-sort').addClass('more-sort-up')
    $('.tags').show()
  }
  $('.more-sort').on('click', function() {
    if ($(this).hasClass('more-sort-up')) {
      $(this).removeClass('more-sort-up')
      $('.tags').slideUp()
    } else {
      $(this).addClass('more-sort-up')
      $('.tags').slideDown()
    }
  })
  $('.list-like-btn').on('click', function() {
    if (!vue.$user.IsLogin) {
      vue.$notify({
        text: '请先登录'
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
})
