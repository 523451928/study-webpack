<template>
  <div class="background">
    <component class="mobile product" ref='display' v-if="custom.entries.length>0" :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="editStatus" :entry="custom.current.entry" :displays="custom.displays" :pictures="custom.current.pictures" :xi="custom.xi" :di="custom.di" :isPc="false"></component>
    <div class="product-info">
      <h5 class="product-name" v-if="custom.entries.length>0">{{custom.current.entry.Name}}</h5>
      <p class="author-name">{{userName}}</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {newCustom} from '../../custom/core/custom'
import { getDisplayer } from '../../custom/display/display-util'
import Displays from '../../custom/display/components.js'
import * as customUtils from 'scripts/utils/custom/utils.js'
export default {
  props: {
    entry: {
      type: Object,
      default: {}
    },
    userName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      custom: newCustom(),
      customCanvas: 'Custom',
      editStatus: true 
    }
  },
  created() {
    this.initCustom()
  },
  components: {
    ...Displays
  },
  methods: {
    // 初始化customz组件
    initCustom() {
      let c = this.custom
      let p = customUtils.reversePicturesData(this.entry.p)
      const entryId = this.entry.e.CategoryId
      c.initialize(entryId, undefined, this.entry.e, undefined, (entries) => {
        entries[0].pictures = p
        console.log(entries)
        this.$nextTick(() => {
          this.initSize()
        })
      })
    },
    // 初始化页面尺寸
    initSize() {
      let display = this.$refs.display.$el
      // let page2 = this.$refs.page2
      // let page2H = page2.clientHeight
      let w = document.body.clientWidth
      let h = document.body.clientHeight
      let dw = parseInt(this.$refs.display.$el.style.width.match(/\d+/g)[0])
      const SCALE1 = (w - 200) / dw
      display.style.transform = `scale(${SCALE1}) translateX(-50%)`
      display.style.transformOrigin = `top left`
      this.initBackground()
      // 处理Page
      // if (h > page2H) {
      //   this.page2H = `height: ${h}px`
      // }
      // const SCALE1 = w / this.$refs.display
      // this.initBackground()
    },
    // 返回背景色
    initBackground() {
      let display = this.$refs.display.$el
      let $display = $(display)
      const img = $display.find('img').attr('src')
      let self = this
      window.RGBaster.colors(img, {
        success: function(payload) {
          self.$bus.$emit('setBackground', [payload.dominant, payload.secondary])
        }
      })
    }
  },
  computed: {
    displayer() {
      let c = this.custom
      if (c.waiting) return
      return getDisplayer(c.current.entry, c.di)
    }
  }
 
// data() {
// 	return {

// 	}
// },
// components: {
//   ...Displays
// },
// props: {
// 	custom: {
// 		type: Object,
// 		default: {}
// 	}
// }
}
</script>