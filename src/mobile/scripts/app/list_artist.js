/* eslint-disable */
require('scripts/app/_global')
require('scripts/tools/setfontsize')
require('scripts/tools/vue-tips.js')
require('styles/public/tips.css')
require('styles/scss/user/work')
import { getUrlParams } from 'scripts/tools/getUrlParams'
import Loadmore from 'scripts/tools/loadmore'

let vue = new Vue({
    el: '.bd',
    components: {
        'artistHead': require('components/artist/artistHead.vue'),
        'like': require('components/public/personal/like.vue'),
        'display': require('components/list/display.vue')
    },
    mounted() {
        this.categoryId = Number(getUrlParams().CategoryId)
        let itemWidth = 90
        this.$nextTick(() => {
            let domList = document.querySelectorAll('.tags-list-ul li')
            let categoryList = []
            for (let i = 0; i < domList.length; i++) {
                categoryList.push({id: domList[i].getAttribute('categoryId')})
            }
            categoryList.forEach((item, index) => {
                if (item.id == this.categoryId) {
                    if (index >= 3 && index < categoryList.length - 3) {
                        this.$refs.categoryNav.scrollLeft = (index - 2) * itemWidth
                    }
                    if (index >= categoryList.length - 3) {
                        this.$refs.categoryNav.scrollLeft = (categoryList.length - 3) * itemWidth
                    }
                }
            })
            this.horizontalInstance = new Loadmore({
                el: '.tags-list-ul',
                scrollDirection: 'horizontal',
                elasticRolling: true
            })
        })
    }
})
$(() => {
    let loadmoreInstance = new Loadmore({
        el: document.querySelector('.loadmore-wrapper'),
        sideSlipDisabled: true,
        topMethod() {
            setTimeout(() => {
                loadmoreInstance.onTopLoaded()
            }, 1000)
        },
        autoFill: false,
        bottomMethod: function () {
            let url = $('.next-page').last().attr('href')
            $('.next-page').last().remove()
            if (url) {
                request({ url }).then((res) => {
                    console.log(res)
                    $('.loadmore-content li').last().after(res.body)
                    // 只能挂载在loadmore-wrapper之下的元素,不然会导致loadmore实例失效
                    new Vue({
                        el: '.loadmore-content',
                        components: {
                            'like': require('components/public/personal/like.vue'),
                            'display': require('components/list/display.vue')
                        }
                    })
                    bindEvent()
                    loadmoreInstance.onBottomLoaded()
                })
            } else {
                loadmoreInstance.destroy()
                loadmoreInstance.onBottomLoaded()
            }
        }
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
                        $(self).find('.wa').addClass('like')
                    } else {
                        count -= 1
                        $(self).find('.like-count').html(count)
                        $(self).find('.wa').removeClass('like')
                    }
                })
            }
        })
    }
    bindEvent()
})