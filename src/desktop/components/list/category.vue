<template>
<div class="pro-category-nav" @mouseenter.prevent="anihide = false" @mouseleave.prevent="refreshChild" :class="{'ani-hide':anihide}">
  <!--<ul class="pro-cate-list clearfix">-->
    <!--<li :class="sort==='frames'?'active':''">-->
      <!--<a href="/work?CategoryId=1" class="default-link cate-box">-->
          <!--<span class="wa youkuanghua"></span>-->
          <!--<p>装饰画</p>-->
          <!--<div class="right-line"></div>-->
        <!--</a>-->
    <!--</li>-->
    <!--<li :class="sort==='furniture'?'active':''">-->
      <!--<a href="/work?CategoryId=11" class="default-link cate-box">-->
          <!--<span class="wa baozhen"></span>-->
          <!--<p>家具用品</p>-->
          <!--<div class="right-line"></div>-->
        <!--</a>-->
    <!--</li>-->
    <!--<li :class="sort==='shirt'?'active':''">-->
      <!--<a href="/work?CategoryId=14" class="default-link cate-box">-->
          <!--<span class="wa T-Shirt"></span>-->
          <!--<p>T恤</p>-->
          <!--<div class="right-line"></div>-->
        <!--</a>-->
    <!--</li>-->
    <!--<li :class="sort==='digital'?'active':''">-->
      <!--<a href="/work?CategoryId=10" class="default-link cate-box disabled">-->
          <!--<span class="wa phone-case"></span>-->
          <!--<p>电子产品</p>-->
          <!--<div class="right-line"></div>-->
        <!--</a>-->
    <!--</li>-->
    <!--<li :class="sort==='fashion'?'active':''">-->
      <!--<a href="/work?CategoryId=17" class="default-link cate-box">-->
          <!--<span class="wa fanbudai"></span>-->
          <!--<p>时尚佩饰</p>-->
          <!--<div class="right-line"></div>-->
        <!--</a>-->
    <!--</li>-->
    <!--<li class="last" :class="sort==='wencuang'?'active':''">-->
      <!--<a href="/work?CategoryId=19" class="default-link cate-box">-->
          <!--<span class="wa notebook "></span>-->
          <!--<p>文教用品</p>-->
        <!--</a>-->
    <!--</li>-->
  <!--</ul>-->
  <!--<ul class="pro-cate-list pro-cate-detail-list clearfix" :class="{'ani-show':subhide}">-->
    <!--<li class="active">-->
      <!--<a href="/work?CategoryId=1" class="default-link pro-cate-detail">有框画</a>-->
      <!--<a href="/work?CategoryId=2" class="default-link pro-cate-detail">布艺画</a>-->
      <!--<a href="/work?CategoryId=4" class="default-link pro-cate-detail">卷轴画</a>-->
    <!--</li>-->
    <!--<li>-->
      <!--<a href="/work?CategoryId=11" class="default-link pro-cate-detail">抱枕</a>-->
      <!--<a href="/work?CategoryId=12" class="default-link pro-cate-detail">旅行杯</a>-->
    <!--</li>-->
    <!--<li>-->
      <!--<a href="/work?CategoryId=14" class="default-link pro-cate-detail">男士圆领T</a>-->
      <!--<a href="/work?CategoryId=15" class="default-link pro-cate-detail">女士圆领T</a>-->
      <!--<a href="/work?CategoryId=16" class="default-link pro-cate-detail">儿童圆领T</a>-->
    <!--</li>-->
    <!--<li>-->
      <!--<a href="/work?CategoryId=10" class="default-link pro-cate-detail">手机壳</a>-->
      <!--<a href="/work?CategoryId=18" class="default-link pro-cate-detail">iPad壳</a>-->
    <!--</li>-->
    <!--<li>-->
      <!--<a href="/work?CategoryId=17" class="default-link pro-cate-detail">单肩包</a>-->
    <!--</li>-->
    <!--<li class="last">-->
      <!--<a href="/work?CategoryId=19" class="default-link pro-cate-detail">笔记本</a>-->
    <!--</li>-->
  <!--</ul>-->
  <div class="category-wrapper">
    <ul class="category-list">
      <li  @mouseenter="selectChild(item, index)" v-for="(item, index) in categoryList" :class="{'last-li': index==categoryList.length-1, 'active': item.id==categoryId}">
        <a :href="'/work?CategoryId='+item.id">{{item.text}}</a>
      </li>
    </ul>
  </div>
  <div class="child-category-wrapper" @mouseleave="childShow = false" :class="{'child-show': childShow}">
    <ul class="child-category-list" >
      <li @mouseenter="setActive(item)" @mouseleave="item.isActive=false" v-for="(item, index) in childCategoryList" :class="{'first-li': index==0}">
        <a :href="'/work?CategoryId='+item.id">
          <!--<span class="icon" :class="item.iconClass"></span>-->
          <img v-if="item.isActive" :src="mapIcon(item.id, 1)" >
          <img v-else :src="mapIcon(item.id, 0)" >
          <p>{{item.text}}</p>
        </a>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
/* eslint-disable */
import {
  getParameter
} from 'js/getParameter.js'
import {
  getSortPicById
} from 'scripts/utils/custom/utils.js'
export default {
  data() {
    return {
      anihide: false,
      subhide: false,
      sort: 'frames',
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
      ],
      childCategoryList: [],
      childShow: false,
      activeIndex: -1,
      categoryId: -1
    }
  },
  methods: {
    refreshChild() {
      this.childShow = false
      this.$bus.$emit('changeChildCategory', this.categoryId, getParameter('CategoryId'))
    },
    selectChild(item, index) {
      this.activeIndex = index
//      this.categoryId = -1
      this.childCategoryList = item.childCategory
      this.$bus.$emit('changeChildCategory', item.id, getParameter('CategoryId'))
      this.childShow = true
    },
    mapIcon(id, type) {
      if (type === 0) {
        return require(`../../assets/images/header/icon-${id}.svg`)
      } else if (type === 1) {
        return require(`../../assets/images/header/active/icon-${id}.svg`)
      }
    },
    setActive(item) {
      this.$set(item, 'isActive', true)
    }
  },
  mounted() {
    let self = this
    let catId = Number(getParameter('CategoryId')) || 1
    this.categoryId = catId
    this.categoryList.forEach((item) => {
      item.childCategory.forEach((itm) => {
        if (itm.id === catId) {
          this.categoryId = item.id
        }
      })
    })
    this.$bus.$emit('changeChildCategory', this.categoryId, catId)
    this.sort = getSortPicById(catId)
    window.onscroll = function(e) {
      if (window.scrollY > 100) {
        self.anihide = true
      } else {
        self.anihide = false
      }
    }
    this.$onBus('tophover', function() {
      self.anihide = false
    })
  }
}
</script>
