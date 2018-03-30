<!-- scroll bar -->
<template>
  <div class="custom-toolbar" :class="{ 'disable':!pic}">
    <div class="ope-area zoom-area">
      <a class="ope-btn zoom-btn zoomin" @click="op('scale', 'out')" title="缩小">
        <i class="wa wa-minus-o minus-i"></i>
      </a>
      <div class="zoom-bar"  @mouseup="scrollEnd" v-touch:panstart ="scrollStart" v-touch:panmove="scrollMoving"
           v-touch:panend="scrollEnd" @click.stop="setScaleByClick($event)">
        <div class="zoom-line">
          <span class="zoom-active-line" :style="style.line"></span>
        </div>
        <span class="zoom-ball"  :style="style.ball">
          <i class="ww-icon ball"></i>
        </span>
      </div>
      <a class="ope-btn zoom-btn zoomout" @click="op('scale', 'in')" title="放大">
        <i class="wa wa-plus-o plus-i"></i>
      </a>
      <span id="scale-count" class="scale-count">{{diaplayScale}}%</span>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { getInitFitScaleMin } from 'components/custom/picture/picture.js'
  import { Fulls } from 'scripts/utils/custom/consts.js'
  
  const ScaleMax = 100
  export default {
    data() {
      return {
        canMove: false,
        lineWidth: null,
        initOffset: null,
        ballOffset: null,
        dragPos: null
      }
    },
    props: {
      pic: {type: Object},
      initScale: {type: Number, default: 100},
      catId: {type: Number, required: true}
    },
    mounted() {
      this.lineWidth = $('.zoom-line').width()
    },
    computed: {
      // 实际显示区域
      diaplayScale() {
        return this.pic ? (100 + (this.curScale - this.scaleMin)) : 100
      },
      curScale() {
        let { pic } = this
        return pic ? Math.abs(pic.ScaleX) : this.initScale
      },
      diffScale() {
        return this.pic ? (ScaleMax - this.scaleMin) + 1 : 0
      },
      // 最小尺寸
      scaleMin() {
        let { pic } = this
        if (!pic.hasOwnProperty('Image')) {
          pic.Image = {
            Id: pic.ImageId,
            File: pic.ImageFile,
            Info: {
              Rotate: pic.Rotate
            }
          }
        }
        return pic ? (pic.Output.Full === Fulls.Always
          ? getInitFitScaleMin(pic.Output, pic.Image, pic.DPI) : 1) : 0
      },
      style() {
        let per = this.pic
          ? (this.curScale - this.scaleMin) / (ScaleMax - this.scaleMin) * 100
          : 0
        per = Math.min(per, 100) + '%'
        let o = {}
        o.ball = {
          left: per
        }
        o.line = {
          width: per
        }
        return o
      }
    },
    methods: {
      setScaleByClick(evt) {
        if (!this.pic) return
        let barLeft = $('.zoom-bar').offset().left
        let barWidth = $('.zoom-bar').width()
        if ((evt.pageX - barLeft) > barWidth) return
        this.op('scale', ~~((this.scaleMin + (evt.pageX - barLeft) / barWidth * this.diffScale)))
      },
      op(a, p) {
        if (!this.pic) return
        // scale 
        // 滚动的数值
        this.$emit('set-image', a, p, this.catId)
        this.$emit('reset-image', 'overstep')
      },
      scrollStart(e) {
        if (!this.pic) return
        this.canMove = true
        this.ballOffset = $('.zoom-ball').position().left
        this.dragPos = e.deltaX // 记录刚开始拖拽zoom-ball的touch位置
      },
      scrollMoving(e) {
        if (!this.canMove) return
        let lineW = this.lineWidth // zoom-line的宽度
        let offL = this.ballOffset // zoom-ball的位置
        let dragOffset = e.deltaX - this.dragPos
        let diffX = offL + dragOffset
        let per = diffX / lineW
        this.op('scale', Math.min(ScaleMax, Math.max(this.scaleMin,
          parseInt(this.diffScale * per + this.scaleMin))))
        // this.op('scale', 'x')
      },
      scrollEnd() {
        this.ballOffset = $('.zoom-ball').position().left
        this.canMove = false
      }
    }
  }
</script>
