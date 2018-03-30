<template>
  <div>
    <div class="pro-category-nav" ref="categoryNav" >
      <ul>
        <li v-for="(item, index) in navList" :class="{'active': item.id == categoryId}">
          <a :href="formatHref(item.id)" target="_self" >{{item.text}}</a>
       </li>
      </ul>
      <span class="wa-icon wa-angle-down" @click="showAll"></span>
    </div>
    <all-category ref="allCategory" :categoryId="categoryId"></all-category>
  </div>
</template>
<script>
  /* eslint-disable */
  import { getUrlParams } from 'scripts/tools/getUrlParams'
  import allCategory from './allCategory.vue'
  export default{
    components: {
      allCategory
    },
    data() {
      return {
        navList: [
          {text: '有框画', id:8, iconClass:'youkuanghua'},
          {text: '布艺画', id:2, iconClass:'buyihua'},
          {text: '卷轴画', id:4, iconClass:'juanzhouhua'},
          {text: '磁贴画', id:24, iconClass:'juanzhouhua'},
          {text: '抱枕', id:11, iconClass:'baozhen'},
          {text: '挂钟', id:20, iconClass:'clock'},
          {text: '旅行杯', id:12, iconClass:'lvxingbei'},
          {text: '男士T', id:14, iconClass:'T-Shirt'},
          {text: '女士T', id:15, iconClass:'T-Shirt'},
          {text: '儿童T', id:16, iconClass:'T-Shirt'},
          {text: '手机壳', id:10, iconClass:'phone-case'},
          {text: 'iPad壳', id:18, iconClass:'iPad-case'},
          {text: '帆布包', id:17, iconClass:'fanbudai'},
          {text: '地垫', id:29, iconClass:'fanbudai'},
          {text: '钥匙扣', id:25, iconClass:'fanbudai'},
          {text: '丝巾', id:26, iconClass:'fanbudai'},
          {text: '团扇', id:27, iconClass:'fanbudai'},
          {text: '笔袋', id:28, iconClass:'fanbudai'},
          {text: '笔记本', id:19, iconClass:'Pen-bag'}
        ],
        categoryId: ''
      }
    },
    mounted() {
      this.categoryId = Number(getUrlParams().CategoryId)
      let itemWidth = 80
      this.navList.forEach((item, index) => {
        if (item.id === this.categoryId) {
          if (index >=3 && index < this.navList.length - 3) {
            this.$refs.categoryNav.scrollLeft = (index - 2) * itemWidth
          }
          if (index >= this.navList.length - 3) {
            this.$refs.categoryNav.scrollLeft = (this.navList.length - 3) * itemWidth
          }
        }
      })
    },
    methods: {
      showAll() {
        this.$refs.allCategory.show()
      },
      formatHref(id) {
        return '/work?CategoryId=' + id
      }
    }
  }
</script>
