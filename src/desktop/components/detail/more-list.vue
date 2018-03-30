<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div class="carousel slide">
    <!--轮播内容-->
    <div class="carousel-inner">
      <div class="item" :style="{width:listLength*250+'px', transform: 'translate3d('+(-serial*1000)+'px, 0px, 0px)'}">
       <slot name="more-list-content"></slot>
      </div>
    </div>
    <!--轮播导航-->
    <a href="javascript:void(0)" class="carousel-control left" :class="{disable:serial<1}" @click="serial--"></a>
    <a href="javascript:void(0)" class="carousel-control right" :class="{disable:(serial+1)*4 >= listLength}" @click="serial++"></a>
  </div>
</template>
<script>
  export default {
    props: {
      moreLength: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        listLength: Number(this.moreLength),
        serial: 0
      }
    },
    mounted() {
    }
  }
</script>
<style lang="sass">
  .carousel-control{
    &.right,&.left{
      background: none;
    }
    &.disable{
     display: none !important;
    }
  }
  .carousel-inner .item{
    -webkit-transition: all 0.6s;
    -moz-transition: all 0.6s;
    -ms-transition: all 0.6s;
    -o-transition: all 0.6s;
    transition: all 0.6s;
  }
  .product-list-area{
    &.more-list{
      margin: 0;
      width:100%;
    }
  }
</style>
