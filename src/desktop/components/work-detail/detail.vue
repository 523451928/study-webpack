<template>
  <div class="product-detail">
    你好
    <!-- <nav-bar 
    :user-id="userId"
    :user-avatar="userAvatar"
    :followed="isFollowed"
    :user-name="userName"
    :length="pieces.length"
    :commentLength="commentLength"
    @toggleCurrent="toggleCurrent"    
    >
    </nav-bar> -->
    <!-- 更多推荐商品 -->
    <!-- <div class="product-list" v-show="current === 1 && isrender">
      <div class="layout-content">
        <ul>
          <li class="item" v-for="(item, index) in pieces">
            <work-display 
            :entryId="item.EntryId" 
            :productId="item.ProductId" 
            :categoryId="item.CategoryId"
            :pictures="item.Pictures"
            :workId="workId"
            ></work-display>
          </li>
        </ul>
      </div>
    </div> -->
    <!-- 详情页 -->
    <!-- <div class="product-detaile" v-show="current === 0">
      <div class="layout-content">
        <img :src="`/src/desktop/assets/images/custom/detail-${categoryId}.jpg`" alt="detail">
      </div>
    </div> -->
    <!-- <user-detail v-show="current === 2"
    :user-id="userId"
    :tags="tags"
    :description="description"
    >
    </user-detail>
    <comment v-show="current === 3"
    :work-id="workId"
    @commentData="commentData"
    ></comment> -->
    <!-- 本店更多商品 -->
    <!-- <div class="swiper-wrapper">
      <div class="layout-content">
        <h5 class="detail-title">本店更多商品</h5>
        <swiper-list :list="pieces"></swiper-list>
      </div>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable */
import NavBar from './nav-bar'
import WorkDisplay from './work-display'
import SwiperList from './swiper-list'
import UserDetail from './user-detail'
import Comment from './comment'
export default {
 props: {
   // 作者id
   userId: {
     type: Number
   },
   // 品类id
   catId: {
     type: Number
   },
   workId: {
     type: Number
   },
   userAvatar: {
     type: String
   },
   followed: {
     type: Boolean
   },
   userName: {
     type: String
   },
   description: {
     type: String
   },
   tags: {
     type: Array
   }
 },
 data() {
   return {
     isFollowed: this.followed
   }
 },
 created() {
 },
 computed: {
   categoryId() {
      if (Array.isArray(this.catId)) {
        return this.catId[0]
      } else {
        return this.catId
      }
    }
 }
}
</script>
