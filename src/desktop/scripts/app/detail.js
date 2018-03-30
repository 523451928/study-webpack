/* eslint-disable */
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/app/_global')
require('styles/scss/detail/detail')
require('scripts/app/public/vue-tips')
require('styles/public/tips.css')
require('scripts/app/public/flycart.js')
let Swiper = require('scripts/utils/swiper.min.js')
/* eslint-disable no-new */
import WorkDetail from 'components/work-detail/work-detail.vue'
import Detail from 'components/work-detail/detail'
import WorkDisplay from 'components/work-detail/work-display'
import { InterfaceMap as Interf } from 'scripts/interfaceConst.js'
import { catNameIdMap } from 'scripts/utils/custom/consts.js'
import MoreList from 'components/detail/more-list'
import Comment from 'components/work-detail/comment'
import { UrlUtils } from  'scripts/utils/url-utils.js'
let urlUtils = new UrlUtils()
const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    { path: '/work/:id', meta: { title: '墙蛙 - 定制' } }
  ]
})
// 'display': require('components/list/display.vue'),
// 'proStage': require('components/detail/pro-stage.vue'),
new Vue({
  el: '.bd',
  router,
  components: {
    WorkDetail,
    WorkDisplay,
    Comment,
  },
  data: {
    itemId: undefined,
    // catEName: undefined,
    categoryId: undefined,
    showQRcode: false,
    QRcodeContent: '',
    tabIndex: 'others', // others:其他产品
    msgInit: false,
    current: 3,
    commentL: 0,
    commentData: undefined,
    detail: undefined,
    render: false
  },
  created() {
    this._getCategory().then(() => {
      this.initSwiper()
      this.render = true
    })
  },
  mounted() {
    let categoryId = urlUtils.getParams('CategoryId')
    this.detail = require(`assets/images/custom/detail-${categoryId}.jpg`)
  },
  methods: {
    updateLikeStatus() {
      let self = this
      let likedHeartDOM = this.$refs['wa-heart-fill']
      request({
        method: 'POST',
        url: `${Interf.updateLikeStatus}?ItemId=${this.itemId}`
      }).then(res => {
        let liked = res.data.Data
        if (liked) {
          !likedHeartDOM.contains('active') && likedHeartDOM.classList.add('active')
          self.likedCount++
        } else {
          likedHeartDOM.contains('active') && likedHeartDOM.classList.remove('active')
          self.likedCount--
        }
      }, res => {
        res.hide()
        layer.toast(res.take('Error'))
      })
    },
    sharePro(type) {
      request({
        method: 'POST',
        url: `${Interf.shareProduct}${type}?ItemId=${this.itemId}`
      }).then(res => {
        let data = res.data.Data
        if (type === 'weixin') {
          this.showQRcode = true
          this.QRcodeContent = data['qr']
        } else {
          let w = window.open()
          setTimeout(function() {
            w.location = data
          }, 500)
          return false
        }
      })
    },
    tabClick(index) {
      this.current = index
    },
    // protool() {
    //   // 产品配件的点击事件
    //   layer.open({
    //     isImg: true,
    //     content: `<img class="img-responsive" src=/static/images/product/proTool${this.catEName}.jpg />`
    //   })
    // },
    commentData(v) {
      let l = v.length
      if (l > 99) {
        this.commentL = 99
      } else {
        this.commentL = l
      }
    },
    initSwiper() {
      this.$nextTick(() => {
        let swiperEl = document.getElementsByClassName('swiper-container')[0]
        let swiper = new Swiper(swiperEl, {
          navigation: {
            nextEl: '.wa-left',
            prevEl: '.wa-right',
          },
          speed: 300,
          slidesPerView: 4,
          slidesPerGroup: 4
        })
        swiper.updateSize()
      })
    },
    _getCategory() {
      return new Promise((resolve, reject) => {
        if (window.$categories) {
          resolve()
        } else {
          this.$request.list('category').then(res => {
            let m = new Map()
            res.take('Data').forEach(item => {
              m.set(item.Id, item)
            })
            window.$categories = m
            resolve()
          })
        }
      })
    },
    // 关注
    onFollow(type, userId) {
      let t
      let id = Number(userId)
      let myId = Number(this.$user.UserId)
      let el = this.$refs.follow
      if (typeof type === 'string') {
        if (type === 'true') {
          t = true
        } else if (type === 'false') {
          t = false
        }
      } else {
        t = type
      }
      if (id === myId) {
        this.$notify({
          text: '不能自己关注自己'
        })
        return
      } else {
        this.$request.submit('follow/user', {
          UserId: id
        }).then(res => {
          let s = res.take('Data')
          if (!s) {
            el.innerHTML = '关注TA'
          } else {
            el.innerHTML = '取消关注'
          }
        })
      }
    },
    // 跳转用户主页
    onHref(id, catId) {
      let myId = Number(this.$user.UserId)
      if (Number(id) === myId) {
        window.location.href = '/user/work.html'
      } else {
        window.location.href = `/artist/${id}?CategoryId=${catId}`
      }
    },
    // 跳转商店页
    onHref2(search) {
      window.location.href = `/work?CategoryId=8&Query=${search}`
    }
  }
})
