<template>
  <div class="pro-pic text-center">
    <img class="hover-img" :src="imgSrc" ref="hoverImg">
    <display :entryId="entryId" :productId="productId" :categoryId="categoryId" :pictures="pictures" :displays="displays"></display>
  </div>
</template>

<script>
  /* eslint-disable */
  const MAX_WIDTH = 230
  import display from './display.vue'
  export default {
    props: ['displays', 'pictures', 'entryId', 'productId', 'categoryId'],
    data() {
      return {
      }
    },
    computed: {
      imgSrc() {
        return this.$thumb('image', this.pictures[0].ImageId, 720, this.pictures[0].ImageFile)
      }
    },
    components: {
      display
    },
    mounted() {
    },
    methods: {
      
    }
  }
</script>
<style>
  .hover-img{
    height: 230px;
    width: auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%) scale(1.5);
    z-index: 100;
    opacity: 0;
    transition: all .3s;
  }
  .pro-pic:hover .hover-img{
    opacity: 1;
    transition: all .3s;
  }
</style>
