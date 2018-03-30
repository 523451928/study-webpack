<template>
  <div class="layer1">
    <div class="layer2">
      <ul class="content text-center walllife">
        <transition name="fade">
          <li v-for="(item, index) in bannerData" v-if="activeId===index" class="list">
            <img :src="item.img" class="item"/>
          </li>
        </transition>
        <ol class="carousel-indicators" v-if="hasDot">
          <li v-for="(item,index) in bannerData" :class="{'active':index===activeId}"
              @click="changeBanner(index)" @mouseenter="changeBanner(index)"></li>
        </ol>
        <a href="javascript:void(0)" class="carousel-control left" @click="prev" @mouseleave="autoPlay"></a>
        <a href="javascript:void(0)" class="carousel-control right" @click ="next" @mouseleave="autoPlay"></a>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      bannerData: {
        type: Array,
        default() {
          return []
        }
      },
      duration: {
        type: Number,
        default: 5000
      },
      hasDot: {
        type: Boolean,
        default: true
      },
      triggerType: {
        type: String,
        default: 'hover'
      }
    },
    data() {
      return {
        activeId: 0,
        interval: null
      }
    },
    methods: {
      autoPlay() {
        if (this.interval) {
          this.stopInterval()
        }
        this.interval = setInterval(() => {
          this.prev()
        }, this.duration)
      },
      prev() {
        this.activeId --
        if (this.activeId < 0) {
          this.activeId = this.bannerData.length - 1
        }
        this.stopInterval()
      },
      stopInterval() {
        clearInterval(this.interval)
      },
      next() {
        this.activeId ++
        if (this.activeId > this.bannerData.length - 1) {
          this.activeId = 0
        }
        this.stopInterval()
      },
      changeBanner(idx) {
        if (this.triggerType === 'click') {
          this.activeId = idx
        }
        if (this.triggerType === 'hover') {
          this.activeId = idx
        }
      }
    }
  }
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0;
  }
</style>
