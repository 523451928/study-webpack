<template>
  <div class="carousel-wrapper " ref="carouselWrapper" @mouseenter="inContainer=true" @mouseleave="inContainer=false">
    <ul :style="carouselStyle"  class="carousel-content clearfix" ref="carouselContent">
      <li v-for="(item,index) in carouselArr" :style="{width:wrapperWidth+'px'}" >
        <a :href="item.url" target="_blank" @click="item.callback && item.callback()">
          <img :src="item.img" ref="imgs">
        </a>
      </li>
    </ul>
    <div class="dot-wrapper">
      <ol>
        <li v-for="(item,index) in imgArr" @click.stop="changeIndexByClick(index)" @mouseenter="changeIndex(index)">
          <button
            :class="index===activeIndex-1?
                    'active':index===0&&activeIndex===carouselArr.length-1?
                    'active':index===imgArr.length&&activeIndex===1?'active':''"></button>
        </li>
      </ol>
    </div>
    <transition name="slide-left">
      <a class="carousel-control left" @mouseleave="autoPlay" v-show="inContainer" @click="prevCarousel">
        <!--<span>←</span>-->
      </a>
    </transition>
    <!--<a href="javascript:void(0)" class="carousel-control left" @click="prev" @mouseleave="autoPlay"></a>-->
    <!--<a href="javascript:void(0)" class="carousel-control right" @click ="next" @mouseleave="autoPlay"></a>-->
    <transition name="slide-right">
      <a class="carousel-control right" @mouseleave="autoPlay" v-show="inContainer" @click="nextCarousel">
        <!--<span>→</span>-->
      </a>
    </transition>
  </div>
</template>

<script>
  /* eslint-disable */
  export default{
    data() {
      return {
        activeIndex: 1,
        transitonStyle: 'all .8s',
        mouseEvent: {},
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
        default: 'click'
      },
      duration: {
        type: Number,
        default: 8000
      },
      isAuto: {
        type: Boolean,
        default: true
      },
      isDrag: {
        type: Boolean,
        default: true
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
        if (this.triggerType === 'hover') {
          this.activeIndex = index + 1
        }
      },
      changeIndexByClick(index) {
        if (this.triggerType === 'click') {
          this.activeIndex = index + 1
        }
      },
      bindMouseEvents() {
        this.$refs.carouselWrapper.addEventListener('mousedown', this.downFn)
        this.$refs.carouselWrapper.addEventListener('mousemove', this.moveFn)
        this.$refs.carouselWrapper.addEventListener('mouseup', this.upFn)
      },
      downFn(e) {
        this.mouseEvent.startX = e.clientX
        this.mouseEvent.isDown = true
        this.mouseEvent.startIndex = this.activeIndex
        e.stopPropagation()
        e.preventDefault()
        if (this.interval) {
          clearInterval(this.interval)
        }
      },
      moveFn(e) {
        let diffX = 0
        if (this.mouseEvent.isDown) {
          diffX = e.clientX - this.mouseEvent.startX
          this.transitonStyle = ''
          this.activeIndex = this.mouseEvent.startIndex - (diffX / this.$refs.carouselWrapper.clientWidth)
        }
      },
      upFn(e) {
        this.mouseEvent.isDown = false
        this.transitonStyle = 'all .5s'
        this.activeIndex = Math.round(this.activeIndex)
        if (this.activeIndex === -0 || this.activeIndex === 0) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = this.carouselArr.length - 2
          }, 600)
        }
        if (this.activeIndex >= this.carouselArr.length - 1) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = 1
          }, 600)
        }
        this.autoPlay()
      },
      prevCarousel(flag) {
        this.activeIndex ++
        this.transitonStyle = 'all .5s'
        if (flag !== true) {
          clearInterval(this.interval)
        }
        if (this.activeIndex >= this.carouselArr.length - 1) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = 1
          }, 600)
        }
      },
      nextCarousel() {
        this.activeIndex --
        this.transitonStyle = 'all .5s'
        clearInterval(this.interval)
        if (this.activeIndex === 0) {
          setTimeout(() => {
            this.transitonStyle = ''
            this.activeIndex = this.carouselArr.length - 2
          }, 600)
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
        if (this.isDrag) {
          this.bindMouseEvents()
        }
        this.wrapperWidth = 1920 || this.$refs.carouselWrapper.clientWidth
        this.$refs.imgs.forEach((item) => {
          item.style.marginLeft = (1920 - this.$refs.carouselWrapper.clientWidth) / -2 + 'px'
        })
        this.$refs.carouselContent.style.width = this.wrapperWidth * this.carouselArr.length + 'px'
      }
    },
    mounted() {
      if (this.isAuto) {
        this.autoPlay()
      }
      this.refresh()
      window.addEventListener('resize', this.refresh)
    }
  }
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
  .clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
  .clearfix{*+height:1%;}
  .slide-left-enter-active, .slide-left-leave-active,.slide-right-enter-active, .slide-right-leave-active {
    transition: all .5s;
  }
  .slide-left-enter, .slide-left-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    transform: translateX(-100%);
  }
  .slide-right-enter,.slide-right-leave-to{
    transform: translateX(100%);
  }
  .carousel-wrapper{
    position: relative;
    height: 450px;
    width:100%;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 60px;
  }
  .carousel-content li{
    float: left;
    list-style: none;
  }
  .carousel-content li a{
    width: 100%;
  }
  .carousel-content li img{
    width: auto;
    height: 100%;
    position: relative;
    /*left: 50%;*/
    /*margin-left: -50%;*/
  }
  .dot-wrapper{
    position: absolute;
    width: 100%;
    height: 20px;
    text-align: center;
    bottom:22px;
  }
  .dot-wrapper li{
    list-style: none;
    display: inline-block;
    background-color: transparent;
    padding: 12px ;
    cursor: pointer;
  }
  .dot-wrapper li button{
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: #999;
    border: 1px solid #999;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: .3s;
  }
  .dot-wrapper li .active{
    background: none;
    border: 1px solid #26A7C7;
  }
  .prev-btn,.next-btn{
    top: 0;
    position: absolute;
    text-align: center;
    line-height: 100%;
    cursor: pointer;
    height: 100%;
    width:40px;
    color: red;
    font-size: 30px;
  }
  .prev-btn span,.next-btn span{
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .prev-btn{
    left: 0;
  }
  .next-btn{
    right: 0;
  }
</style>
