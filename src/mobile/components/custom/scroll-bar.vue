<!-- scroll bar -->

<template>
  <div class="custom-toolbar" :class="{ 'disable':picFire}">
    <div class="ope-area zoom-area">
      <a class="ope-btn zoom-btn zoomin" @click="op('scale', 'out')">
        <i class="wa wa-minus-o minus-i"></i>
      </a>

      <div class="zoom-bar">
        <div class="zoom-line">
          <span class="zoom-active-line" :style="style.line"></span>
        </div>
        <span class="zoom-ball"  :style="style.ball" @mousedown="mouseStart" v-touch:panstart ="scrollStart" v-touch:panmove="scrollMoving"
               @mouseup = "scrollEnd">
            <i class="ww-icon ball"></i>
        </span>
      </div>
      <a class="ope-btn zoom-btn zoomout" @click="op('scale', 'in')">
        <i class="wa wa-plus-o plus-i"></i>
      </a>
      <span id="scale-count" class="scale-count">{{copScale}}%</span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        copScale: this.initscale,
        scaleMin: 100,
        diffScale: null,
        canMove: false,
        lineWidth: null,
        initOffset: null,
        ballOffset: null,
        dragPos: null
      }
    },
    props: {
      pic: {type: Object, defualt: {}},
      initscale: {type: Number, default: 100},
      catId: {type: Number, default: 1}
    },
    mounted() {
      this.lineWidth = $('.zoom-line').width()
    },
    computed: {
      picFire() {
        return _.isUndefined(this.pic)
      },
      style() {
        let per = (this.copScale - this.scaleMin) / this.diffScale * 100
        let o = {}
        o.ball = {
          left: per + '%'
        }
        o.line = {
          width: per + '%'
        }
        return o
      }
    },
    methods: {
      op(a, p) {
        if (this.picFire) return
        let emitStatus = true
        switch (p) {
          case 'in':
            this.copScale++
            if (this.copScale > this.pic.scaleMax) {
              this.copScale = this.pic.scaleMax
              emitStatus = false
            }
            break
          case 'out':
            this.copScale--
            if (this.copScale < this.scaleMin) {
              this.copScale = this.scaleMin
              emitStatus = false
            }
        }
        emitStatus && this.$bus.$emit('set-image', a, p, this.catId)
      },
      mouseStart() {
        this.canMove = true
      },
      scrollStart(e) {
        if (this.picFire) return
        this.canMove = true
        this.ballOffset = $('.zoom-ball').position().left
        this.dragPos = e.deltaX
        this.diffScale = this.pic.scaleMax - this.scaleMin
      },
      scrollMoving(e) {
        if (!this.canMove) return
        let lineW = this.lineWidth
        let offL = this.ballOffset
        let diffX = offL + e.deltaX - this.dragPos
        let per = diffX / lineW

        this.copScale = parseInt(this.diffScale * per + this.scaleMin)

        if (this.copScale > this.pic.scaleMax) {
          this.copScale = this.pic.scaleMax
        }
        if (this.copScale < this.scaleMin) {
          this.copScale = this.scaleMin
        }
        this.op('scale', this.copScale)
      },
      scrollEnd() {
        this.ballOffset = $('.zoom-ball').position().left
        this.canMove = false
      }
    }
  }
</script>
