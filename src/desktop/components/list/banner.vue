<template>
  <div class="pro-category-banner">
    <div class="cate-banner" :style="{backgroundImage:'url(static/images/product/pro-list-bnr/'+categoryId+'.jpg)'}">
    </div>
  </div>
</template>
<script>
  import { getParameter } from 'js/getParameter.js'
  export default {
    data() {
      return {
        categoryId: 1
      }
    },
    mounted() {
      let str = getParameter('CategoryId') || 1
      this.categoryId = Number(str)
    }
  }
</script>
