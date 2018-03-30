<template>
  <div>
    <div class="carousel-wrapper" ref="carouselWrapper" @mouseenter="inContainer=true" @mouseleave="inContainer=false">
      <ul :style="carouselStyle" class="carousel-content clearfix" ref="carouselContent">
        <li v-for="(item, index) in carouselArr" :style="{width:wrapperWidth+'px'}">
          <a :href="itm.href" class="category-item" v-for="(itm, idx) in item">
            <span class="wa-icon" :class="itm.iconClass"></span>
            <p>{{itm.text}}</p>
          </a>
        </li>
      </ul>
      <div class="dot-wrapper" v-if="hasDot&&swiperData.length>1">
        <ol>
          <li v-for="(item,index) in swiperData" @click.stop="changeIndex(index)" @mouseenter="changeIndex(index)" @mouseleave="autoPlay">
            <button
              :class="index===Math.round(activeIndex)-1?
                    'active':index===0&&Math.round(activeIndex)===carouselArr.length-1?
                    'active':index===swiperData.length&&Math.round(activeIndex)===1?'active':''"></button>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI
  }
  function GetSlideDirection(startX, startY, endX, endY) {
    var dy = startY - endY
    var dx = endX - startX
    var result = 0
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    }
    // 1上   2下   3左   4右
    var angle = GetSlideAngle(dx, dy)
    if (angle >= -45 && angle < 45) {
      result = 4
    } else if (angle >= 45 && angle < 135) {
      result = 1
    } else if (angle >= -135 && angle < -45) {
      result = 2
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3
    }
    return result
  }
  export default{
    data() {
      return {
        activeIndex: 1,
        transitonStyle: 'all .5s',
        eventObj: {},
        interval: null,
        inContainer: false,
        wrapperWidth: 0
      }
    },
    props: {
      swiperData: {
        type: Array,
        default() {
          return []
        }
      },
      dragDisable: {
        type: Boolean,
        default: false
      },
      hasDot: {
        type: Boolean,
        default: true
      },
      triggerType: {
        type: String,
        default: 'hover'
      },
      clientType:{
        type: String,
        default: 'mobile'
      },
      duration: {
        type: Number,
        default: 3000
      },
      isAuto: {
        type: Boolean,
        default: true
      },
      isDrag: {
        type: Boolean,
        default: true
      },
      distance: {
        type: Number,
        default: 100
      },
      playDirection: {
        type: String,
        default: 'left'
      }
    },
    computed: {
      carouselStyle() {
        return {
          transform: `translateX(-${this.activeIndex * 100 / this.carouselArr.length}%)`,
          transition: this.transitonStyle
        }
      },
      carouselArr() {
        let data = Object.assign ([], this.swiperData)
        if( this.swiperData.length > 1){
          let length = this.swiperData.length - 1
          data.push (this.swiperData[0])
          data.unshift (this.swiperData[length])
        }
        return data
      }
    },
    methods: {
      changeIndex(index) {
        clearInterval(this.interval)
        if (!this.transitonStyle) {
          this.transitonStyle = 'all .5s'
        }
        if (this.triggerType === 'click') {
          this.activeIndex = index + 1
        }
        if (this.triggerType === 'hover') {
          this.activeIndex = index + 1
        }
      },
      bindEvents() {
        if(this.clientType==='pc' && this.isDrag){
          this.$refs.carouselWrapper.addEventListener ('mousedown', this.startFn)
          this.$refs.carouselWrapper.addEventListener ('mousemove', this.moveFn)
          this.$refs.carouselWrapper.addEventListener ('mouseup', this.endFn)
        }else if(this.clientType==='mobile' && this.swiperData.length > 1){
          this.$refs.carouselWrapper.addEventListener ('touchstart', this.startFn)
          this.$refs.carouselWrapper.addEventListener ('touchmove', this.moveFn)
          this.$refs.carouselWrapper.addEventListener ('touchend', this.endFn)
        }
      },
      startFn(e) {
        if(this.clientType==='pc'){
          this.eventObj.startX = e.clientX
        }else{
          this.eventObj.startX = e.touches[0].clientX
          this.eventObj.startY = e.touches[0].clientY
        }
        this.eventObj.isLock = true
        this.eventObj.startIndex = this.activeIndex
        if (this.interval) {
          clearInterval (this.interval)
        }
      },
      moveFn(e) {
        let diffX = 0
        if (this.dragDisable) {
          return
        }
        if (this.eventObj.isLock) {
          if(this.clientType==='pc'){
            diffX = e.clientX - this.eventObj.startX
          }else{
            diffX = e.touches[0].clientX - this.eventObj.startX
            let direction = GetSlideDirection(this.eventObj.startX, this.eventObj.startY, e.touches[0].clientX, e.touches[0].clientY)
            if (direction === 1 || direction === 2) {
              return
            } else {
              e.stopPropagation()
              e.preventDefault()
            }
          }
          this.eventObj.diffX = diffX
          this.transitonStyle = ''
          this.activeIndex = this.eventObj.startIndex - (diffX / this.$refs.carouselWrapper.clientWidth)
        }
      },
      endFn(e) {
        if (this.dragDisable) {
          let direction = GetSlideDirection(this.eventObj.startX, this.eventObj.startY, e.changedTouches[0].clientX, e.changedTouches[0].clientY)
          let distance = Math.abs(this.eventObj.startX - e.changedTouches[0].clientX)
          if (direction===3 && distance > 10) {
            this.activeIndex++
          }
          if (direction===4 && distance > 10) {
            this.activeIndex--
          }
        }
        this.eventObj.isLock = false
        this.transitonStyle = 'all .5s'
        if(this.eventObj.diffX <= -this.distance){
          this.activeIndex = Math.ceil(this.activeIndex)
        }else if(this.eventObj.diffX >= this.distance){
          this.activeIndex = Math.floor(this.activeIndex)
        }else{
          this.activeIndex = Math.round(this.activeIndex)
        }
        if (this.activeIndex === -0 || this.activeIndex === 0) {
          setTimeout (() => {
            this.transitonStyle = ''
            this.activeIndex = this.carouselArr.length - 2
          }, 350)
        }
        if (this.activeIndex >= this.carouselArr.length - 1) {
          setTimeout (() => {
            this.transitonStyle = ''
            this.activeIndex = 1
          }, 350)
        }
        if (this.isAuto && this.swiperData.length > 1) {
          this.autoPlay ()
        }
      },
      prevCarousel(flag) {
        this.activeIndex++
        this.transitonStyle = 'all .5s'
        if (flag !== true) {
          clearInterval (this.interval)
        }
        if (this.activeIndex >= this.carouselArr.length - 1) {
          setTimeout (() => {
            this.transitonStyle = ''
            this.activeIndex = 1
          },350)
        }
      },
      nextCarousel(flag) {
        this.activeIndex--
        this.transitonStyle = 'all .5s'
        if(flag !== true) {
          clearInterval(this.interval)
        }
        if (this.activeIndex === 0) {
          setTimeout (() => {
            this.transitonStyle = ''
            this.activeIndex = this.carouselArr.length - 2
          }, 350)
        }
      },
      autoPlay() {
        if (this.interval) {
          clearInterval (this.interval)
        }
        this.interval = setInterval (() => {
          if (this.playDirection === 'left') {
            this.prevCarousel (true)
          } else {
            this.nextCarousel(true)
          }
        }, this.duration)
      },
      refresh() {
        this.bindEvents ()
        this.wrapperWidth = this.$refs.carouselWrapper.clientWidth
        this.$refs.carouselContent.style.width = this.$refs.carouselWrapper.clientWidth * this.carouselArr.length + 'px'
      }
    },
    mounted() {
      if (this.isAuto && this.swiperData.length >1 ) {
        this.autoPlay()
      }
      if(this.swiperData.length === 1){
        this.activeIndex = 0
      }
      this.refresh ()
      window.addEventListener ('resize', this.refresh)
      window.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 100) {
          if (this.interval) {
            clearInterval (this.interval)
          }
        }
      })
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  .carousel-wrapper ul, .carousel-wrapper li, .carousel-wrapper ol{
    margin-bottom: 0;
  }
  .category-item{
    display: inline-block;
    width: 25%;
    text-align: center;
  }
  .category-item p{
    margin-bottom: .12rem;
    color: #565a5c;
  }
  .category-item .wa-icon{
    font-size: .32rem;
    color: #26A7C7;
  }
  .partner-img{
    width: 100%;
  }
  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }
  .clearfix {
    *+height: 1%;
  }
  .slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
    transition: all .5s;
  }
  .slide-left-enter, .slide-left-leave-to /* .fade-leave-active in below version 2.1.8 */
  {
    transform: translateX(-100%);
  }
  .slide-right-enter, .slide-right-leave-to {
    transform: translateX(100%);
  }
  .carousel-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    padding: .2rem 0 .3rem 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .carousel-content li {
    float: left;
    /*width:1000px;*/
    list-style: none;
  }
  .carousel-content li img {
    width: 100%;
  }
  .dot-wrapper {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 10px;
  }
  .dot-wrapper li {
    list-style: none;
    display: inline-block;
    background-color: transparent;
    padding: 0 6px;
    cursor: pointer;
  }
  .dot-wrapper li button {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #999;
    border: 1px solid #999;
    box-sizing: border-box;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    /*transition: .3s;*/
  }
  .dot-wrapper li .active {
    background: none;
    border: 1px solid #26A7C7;
    box-sizing: border-box;
  }
  .prev-btn, .next-btn {
    top: 0;
    position: absolute;
    text-align: center;
    line-height: 100%;
    cursor: pointer;
    height: 100%;
    width: 40px;
    color: red;
    font-size: 30px;
  }
  .prev-btn span, .next-btn span {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .prev-btn {
    left: 0;
  }
  .next-btn {
    right: 0;
  }
</style>
