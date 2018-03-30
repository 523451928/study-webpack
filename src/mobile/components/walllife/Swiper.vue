<template>
  <div class="carousel-wrapper" ref="carouselWrapper" @mouseenter="inContainer=true" @mouseleave="inContainer=false">
    <ul :style="carouselStyle" class="carousel-content clearfix" ref="carouselContent">
      <li v-for="(item,index) in carouselArr" :style="{width:wrapperWidth+'px'}">
        <img :src="item.img">
        <div class="row-text ">
          <h1>{{ item.title }}</h1>
          <p>{{ item.link }}</p>
          <a :href="item.url" class="btn-detail">了解详情</a>
        </div>
      </li>
      <!--<li v-for="(item, idx) in carouselArr"  :key="item.title" class="carousel-item" :style="{backgroundImage: 'url('+item.img+')', width: wrapperWidth+'px'}">-->
        <!--<div class="row-text ">-->
          <!--<h1>{{ item.title }}</h1>-->
          <!--<span>{{ item.link }}</span>-->
          <!--<a :href="item.url" class="btn-detail">了解详情</a>-->
        <!--</div>-->
      <!--</li>-->
    </ul>
    <div class="dot-wrapper">
      <ol>
        <li v-for="(item,index) in imgArr" @click.stop="changeIndex(index)" @mouseenter="changeIndex(index)" @mouseleave="autoPlay">
          <button
            :class="index===Math.round(activeIndex)-1?
                    'active':index===0&&Math.round(activeIndex)===carouselArr.length-1?
                    'active':index===imgArr.length&&Math.round(activeIndex)===1?'active':''"></button>
        </li>
      </ol>
    </div>
    <transition name="slide-left">
      <a class="prev-btn" @mouseleave="autoPlay" v-show="inContainer && clientType=='pc' " @click="prevCarousel">
        <span>←</span>
      </a>
    </transition>
    <transition name="slide-right">
      <a class="next-btn" @mouseleave="autoPlay" v-show="inContainer && clientType=='pc' " @click="nextCarousel">
        <span>→</span>
      </a>
    </transition>
  </div>
</template>

<script>
  import { getSlideDirection } from 'scripts/tools/slideDirection'
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
      imgArr: {
        type: Array,
        default() {
          return []
        }
      },
      hasDot: {
        type: Boolean,
        default: true
      },
      triggerType: {
        type: String,
        default: 'hover'
      },
      clientType: {
        type: String,
        default: 'pc'
      },
      duration: {
        type: Number,
        default: 10000
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
      defaultIndex: {
        type: Number,
        default: 1
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
        let data = Object.assign([], this.imgArr)
        let length = this.imgArr.length - 1
        data.push(this.imgArr[0])
        data.unshift(this.imgArr[length])
        return data
      }
    },
    methods: {
      changeIndex(index) {
        if (this.clientType !== 'pc') {
          return
        }
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
        if (this.clientType === 'pc' && this.isDrag) {
          this.$refs.carouselWrapper.addEventListener('mousedown', this.startFn)
          this.$refs.carouselWrapper.addEventListener('mousemove', this.moveFn)
          this.$refs.carouselWrapper.addEventListener('mouseup', this.endFn)
        } else if (this.clientType === 'mobile') {
          this.$refs.carouselWrapper.addEventListener('touchstart', this.startFn)
          this.$refs.carouselWrapper.addEventListener('touchmove', this.moveFn)
          this.$refs.carouselWrapper.addEventListener('touchend', this.endFn)
        }
      },
      startFn(e) {
        if (this.clientType === 'pc') {
          this.eventObj.startX = e.clientX
        } else {
          this.eventObj.startX = e.touches[0].clientX
          this.eventObj.startY = e.touches[0].clientY
        }
        this.eventObj.isLock = true
        this.eventObj.startIndex = this.activeIndex

        if (this.interval) {
          clearInterval(this.interval)
        }
      },
      moveFn(e) {
        let diffX = 0
        if (this.eventObj.isLock) {
          if (this.clientType === 'pc') {
            diffX = e.clientX - this.eventObj.startX
          } else {
            diffX = e.touches[0].clientX - this.eventObj.startX
            let direction = getSlideDirection(this.eventObj.startX, this.eventObj.startY, e.touches[0].clientX, e.touches[0].clientY)
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
        this.eventObj.isLock = false
        this.transitonStyle = 'all .5s'
        if (this.eventObj.diffX <= -this.distance) {
          this.activeIndex = Math.ceil(this.activeIndex)
        } else if (this.eventObj.diffX >= this.distance) {
          this.activeIndex = Math.floor(this.activeIndex)
        } else {
          this.activeIndex = Math.round(this.activeIndex)
        }

        if (this.activeIndex === -0 || this.activeIndex === 0) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = this.carouselArr.length - 2
          }, 350)
        }
        if (this.activeIndex >= this.carouselArr.length - 1) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = 1
          }, 350)
        }
        if (this.isAuto) {
          this.autoPlay()
        }
      },
      prevCarousel(flag) {
        this.activeIndex++
        this.transitonStyle = 'all .5s'
        if (flag !== true) {
          clearInterval(this.interval)
        }
        if (this.activeIndex >= this.carouselArr.length - 1) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = 1
          }, 350)
        }
      },
      nextCarousel() {
        this.activeIndex--
        this.transitonStyle = 'all .5s'
        clearInterval(this.interval)
        if (this.activeIndex === 0) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = this.carouselArr.length - 2
          }, 350)
        }
      },
      autoPlay() {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
          this.prevCarousel(true)
        }, this.duration)
      },
      refresh() {
        this.bindEvents()
        this.wrapperWidth = this.$refs.carouselWrapper.clientWidth
        this.$refs.carouselContent.style.width = this.$refs.carouselWrapper.clientWidth * this.carouselArr.length + 'px'
      }
    },
    mounted() {
      if (this.isAuto) {
        this.autoPlay()
      }
      this.refresh()
      this.activeIndex = Math.min(this.defaultIndex, this.imgArr.length)
      window.addEventListener('resize', this.refresh)
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
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
    top:0;
    /*max-height: 300px;*/
    margin: 0 auto;
    overflow: hidden;
  }

  .carousel-content li {
    float: left;
    /*width:1000px;*/
    list-style: none;
    position: relative;

  }
  .carousel-content li .row-text{
    position: absolute;
    top: 50%;
    text-align: center;
    width: 100%;
  }
  .carousel-content li .row-text p{
    color: #fff;
    font-size: 16px;
  }
  .carousel-content li .row-text .btn-detail{
    padding: 6px 12px;
    font-size: 14px;
  }
  .carousel-content li img {
    width: 100%;
  }

  .dot-wrapper {
    position: absolute;
    width: 100%;
    height: 20px;
    text-align: center;
    bottom: 80px;
  }

  .dot-wrapper li {
    list-style: none;
    display: inline-block;
    background-color: transparent;
    padding: 10px 12px;
    cursor: pointer;
  }

  .dot-wrapper li button {
    display: block;
    opacity: .48;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #000;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    /*transition: .3s;*/
  }

  .dot-wrapper li .active {
    background: #26a7c7;
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
