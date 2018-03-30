<template>
  <div class="share-wrapper">
    <div class="loading" v-if="custom.entries.length === 0">
      <img src="/src/desktop/assets/images/loading/loading-128.gif">
    </div>
    <div class="wrapper">
      <div class="page-1 page" ref="homePage">
        <div class="background">
          <component class="mobile product" ref='display' v-if="custom.entries.length>0" :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="editStatus" :entry="custom.current.entry" :displays="custom.displays" :pictures="custom.current.pictures" :xi="custom.xi" :di="custom.di" :isPc="false"></component>
          <div class="product-info">
            <h5 class="product-name">{{custom.current.entry.Name}}</h5>
            <p class="author-name">小花</p>
          </div>
        </div>
        <div class="more icon">
          <img src="/src/desktop/assets/images/icon/ic-bottom-next.png">
        </div>
      </div>
      <div class="page-2 page" ref="page2">
        <section class="coupon" flex="cross:center box:last">
          <div class="coupon-left"></div>
          <div class="coupon-right"></div>
        </section>
        <section class="avatar-wrap">
          <div class="avatar"></div>
          <div class="line"></div>
        </section>
        <h5 class="author-name">猫子姐</h5>
        <div class="info-wrap" v-if="userType===1">
          <p>我在墙蛙网定制了一件宝贝</p>
          <p>领取我的优惠券首单立减<span>5</span>元</p>
          <p>你也来马上试试呗</p>
        </div>
        <div class="info-wrap" v-if="userType===0">
          <p>分享你的定制作品即可获得<span>5</span>元返现</p>
          <p>赶快分享给你的朋友吧</p>
        </div>
        <div class="wx-code" v-if="userType===1">
          <img src="/src/desktop/assets/images/share-wx-logo.jpg">
        </div>
        <div class="share-btn" v-if="userType===0">
          立即分享
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {newCustom} from '../custom/core/custom'
import Displays from '../custom/display/components.js'
import { getDisplayer } from '../custom/display/display-util'
import * as customUtils from 'scripts/utils/custom/utils.js'
export default {
  data() {
    return {
      custom: newCustom(),
      customCanvas: 'Custom',
      editStatus: true,
      entries: undefined,
      categoryId: undefined, // 品类id
      opts: {
        start: 0,
        dir: 'v',
        duration: 0,
        der: 0.1
      },
      bgColor: '',
      userType: 0, // 分享者数据 0为分享者 1为接受者
      page2H: 0 // page2的高度设置
    }
  },
  components: {
    ...Displays
  },
  created() {
    this.getItemData().then(res => {
      return new Promise((resolve, reject) => {
        // 此处需要处理是否为照片墙
        let p = res.Pictures
        this.$request.get('entry', res.Entries).then(response => {
          let entry = response.take('Data')[0]
          resolve({
            e: entry,
            p: p
          })
        })
      })
    }).then(res => {
      let p = customUtils.reversePicturesData(res.p)
      this.custom.initialize(this.categoryId, undefined, res.e, undefined, (entries) => {
        // console.log(p)
        // 处理是否是照片墙
        entries[0].pictures = p
        this.$nextTick(() => {
          this.initSize()
        })
      })
    })
  },
  methods: {
    // 获得数据方法
    getItemData() {
      return new Promise((resolve, reject) => {
        this.$request.do('GET', 'item/get/5').then(res => {
          this.categoryId = res.take('Data').CategoryId
          resolve(res.take('Data'))
        })
      })
    },
    // 初始化尺寸
    initSize() {
      let w = document.body.clientWidth
      let h = document.body.clientHeight
      let h2 = this.$refs.page2.clientHeight
      let dw = parseInt(this.$refs.display.$el.style.width.match(/\d+/g)[0])
      const SCALE1 = (w - 200) / dw
      this.$refs.display.$el.style.transform = `scale(${SCALE1}) translateX(-50%)`
      this.$refs.display.$el.style.transformOrigin = `top left`
      this.$refs.homePage.style.height = `${h}px`
      if (h2 < h) {
        this.$refs.page2.style.minHeight = `${h}px`
      }
      // const SCALE1 = w / this.$refs.display
      this.initBackground()
    },
    // 初始化背景色
    initBackground() {
      let display = this.$refs.display.$el
      let $display = $(display)
      let self = this
      const img = $display.find('img').attr('src')
      window.RGBaster.colors(img, {
        success: function(payload) {
          // payload.dominant是主色，RGB形式表示
          // payload.secondary是次色，RGB形式表示
          // payload.palette是调色板，含多个主要颜色，数组
          self.setBackground(payload.dominant, payload.secondary)
        }
      })
    },
    // 设置背景色
    setBackground(a, b) {
      let map = ['-o-', '-webkit-', '-moz-', '']
      let bg = `linear-gradient(right, ${a},${b})`
      let $el = $(this.$refs.homePage)
      for (let i = 0; i < map.length; i++) {
        $el.css('background', map[i] + bg)
        if (map[i] === '') {
          $el.css('background', `linear-gradient(to right, ${a},${b})`)
        }
      }
    }
  },
  computed: {
    displayer() {
      let c = this.custom
      if (c.waiting) return
      return getDisplayer(c.current.entry, c.di)
    }
  }
}
</script>
