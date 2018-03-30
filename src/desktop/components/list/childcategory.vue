<template>
  <div class="category-list child-list">
    品类：<span v-for="(item, index) in list" >
          <a :href="'/work?CategoryId='+item.id" :class="{'active': item.id==catId}">{{item.text}}</a>
        </span>
  </div>
</template>

<script>
  /* eslint-disable */
  export default{
    data() {
      return {
        categoryId: -1,
        catId: -1,
        categoryList: [
          {text: '装饰画', id: 8, childCategory: [
            {text: '有框画', id:8, iconClass:'youkuanghua'},
            {text: '布艺画', id:2, iconClass:'buyihua'},
            {text: '卷轴画', id:4, iconClass:'juanzhouhua'},
            {text: '磁贴画', id:24, iconClass:'juanzhouhua'}
          ]},
          {text: '家居用品', id: 11, childCategory: [
            {text: '抱枕', id:11, iconClass:'baozhen'},
            {text: '挂钟', id:20, iconClass:'clock'},
            {text: '旅行杯', id:12, iconClass:'lvxingbei'},
            {text: '钥匙扣', id:25, iconClass:'Key-chain'},
            {text: '地垫', id:29, iconClass:'ground-mat'}
          ]},
          {text: 'T恤', id: 14, childCategory: [
            {text: '男士T', id:14, iconClass:'T-Shirt'},
            {text: '女士T', id:15, iconClass:'T-Shirt'},
            {text: '儿童T', id:16, iconClass:'T-Shirt'}
          ]},
          {text: '手机壳·IPAD壳', id: 10, childCategory: [
            {text: '手机壳', id:10, iconClass:'phone-case'},
            {text: 'Ipad壳', id:18, iconClass:'iPad-case'}
          ]},
          {text: '时尚佩饰', id: 17, childCategory: [
            {text: '单肩包', id:17, iconClass:'fanbudai'},
            {text: '丝巾', id: 26}
          ]},
          {text: '文教用品', id: 19, childCategory: [
            {text: '笔记本', id:19, iconClass:'Pen-bag'},
            {text: '笔袋', id: 28},
            {text: '团扇', id: 27},
            {text: '拼图', id: 21}
          ]}
        ]
      }
    },
    created() {
      this.$onBus('changeChildCategory', (id, catId) => {
        this.categoryId = Number(id)
        this.catId= Number(catId)
      })
    },
    computed: {
      list() {
        let arr = this.categoryList.filter((item) => {
          return item.id === this.categoryId
        })
        if (arr[0]) {
          return arr[0].childCategory
        }
      }
    }
  }
</script>

<style>
  .category-list{
    width: 980px;
    height: 50px;
    margin: 0 auto;
    line-height: 50px;
    color: #aaaaaa;
    box-sizing: border-box;
    border-bottom: 1px solid #DCE0E0;
  }
  .category-list span{
    margin: 0 20px 0 15px;
    color: #565A5C;
  }
  .category-list span a{
    color: #565A5C;
    text-decoration: none;
  }
  .category-list span .active{
    color: #26A7C7;
  }
</style>
