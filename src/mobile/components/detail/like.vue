<!--
 产品详情 主舞台  DISPLAY展示  物料组合
 -->

<template scope="props">
  <div @click="updateLikeStatus(likeStatus)" class="like-btn">
    <span class="wa wa-heart-fill" :class="likeStatus ? 'active' : ''"></span>
    <span id="like-count">{{likedCounted}}</span>
  </div>
</template>
<script>
//  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  export default{
    props: {
      liked: {
        type: String,
        required: true
      },
      likeCount: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        likeStatus: this.liked === 'true',
        likedCounted: parseInt(this.likeCount)
      }
    },
    methods: {
      updateLikeStatus(status) {
        console.log(this.itemId)
      }
    }
  }
</script>
<style lang="sass">
  .like-btn{
    cursor: pointer;
    display: inline-block;
  }
</style>
