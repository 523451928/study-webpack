<template>
  <div class="pro-category-banner">
    <div class="cate-banner" :style="{backgroundImage:'url(~images/product/pro-list-bnr/'+category+'-bnr.jpg)'}">
    </div>
  </div>
</template>
<script>
  import { getParameter } from 'js/getParameter.js'
  export default {
    data() {
      return {
        category: 'Frame'
      }
    },
    mounted() {
      const obj = {
        'Bag-1': '单肩款',
        'Bag-2': '斜跨款'
      }
      let str = getParameter('categoryType') || 'Frame'
      const style = getParameter('style')
      if (style) {
        for (let i in obj) {
          if (obj[i] === style) {
            str = i
          }
        }
      }
      this.category = str
    }
  }
</script>
