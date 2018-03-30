/* eslint-disable */
/**
 * Created by admin on 2016/11/22.
 */
require('scripts/qiyu.js')
require('scripts/app/_global')
require('styles/scss/detail/detail')
require('styles/swiper-4.1.0.min.css')
import Panel from 'components/core/panel.vue'

import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
} from "scripts/utils/custom/consts.js" // 一些常量
let Swiper = require('scripts/swiper-4.1.0.min.js')

const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    { path: '/work/:id', meta: { title: '墙蛙 - 定制' } }
  ]
})

let win = window
let doc = win.document
let docEl = doc.documentElement
let tid

function refreshRem() {
 let w = docEl.getBoundingClientRect().width
 if (w > 540) {
   w = 540
 }
 docEl.style.fontSize = (w / 3.75) + 'px'
}
refreshRem()
win.addEventListener('resize', function() {
  clearTimeout(tid)
  tid = setTimeout(refreshRem, 300)
}, false)

new Vue({
  el: '.bd',
  router,
  components: {
    Panel,
    WorkDetail: require('components/detail/work-detail.vue'),
    Display: require('components/core/display.vue')
  },
  data() {
    return {
      defaultClass: 'detail-layout',
      detailHref: '', // 详情页图片地址
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initRests()
      this.initMore()
    })
  },
  created() {
    this.getDetail()
  },
  methods: {
    initRests() {
      this.$nextTick(() => {
        console.log('调用')
        let swiper = new Swiper('#js_rests', {
          direction : 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 20
        })
      })
    },
    initMore() {
      this.$nextTick(() => {
        let swiper = new Swiper('#js_more', {
          direction : 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 20
        })
      })
    },
    // 获取详情页
    getDetail() {
      let detail = this.$route.query.Detail
      let catId = Number(this.$route.query.CategoryId)
      if (detail) {
        // 获取指定详情页
      } else {
        this.detailHref = require(`assets/images/detail/bg-${catId}.jpg`)
      }
    }
  }
})
