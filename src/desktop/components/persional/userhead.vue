<template>
<div class="user-hear-warp">
  <!--问题联系浮动二维码开始-->
  <!-- <div class="contact-wechat" v-show="seen">
    <div class="contact-box">
      <a class="contact-close" href="javascript:void(0)" @click="seen=false">
          <img src="~images/contact/contact-kf.png" />
        </a>
      <div class="wechat-erwm">
        <img src="~images/contact/contact-weixin.png" />
      </div>
    </div>
  </div> -->
  <!--问题结束-->
  <!--用户背景图片开始-->
  <div class="user-head-bnr" :style="userBanner">
    <div class="user-content">
      <div class="follow">
        <a class="btn u-primary-btn" :class="{active:isFollowed}" id="follow-btn">
          <follow :is-followed="isFollowed" :user-id="artistId"></follow>
        </a>
      </div>
      <div class="user-bnr-info">
        <a class="head-icon layout-avatar" href="javascript:;">
          <img class="item" :src="userAvatar" :alt="artistNickname">
        </a>
        <div class="user-info">
          <div class="line">
            <div class="user-info-name" v-text="artistNickname"></div>
            <div class="user-date" v-text="userJoinDate"></div>
          </div>
          <!-- <p class="user-introduction" v-text="artistIntroduction"></p> -->
        </div>
        <!-- <div class="text-center user-info-name" v-text="artistNickname"></div> -->
      </div>
    </div>
  </div>
  <!--用户背景图片结束-->

  <!--用户导航nav开始-->
  <div class="user-nav">
    <ul class="user-nav-ul clearfix">
      <li class="li-link" :class="{active:tabFlag=='pro'}" @click="tabClick('pro')">
        <a class="default-link">产品</a>
      </li>
      <li class="li-link" :class="{active:tabFlag=='intro'}" @click="tabClick('intro')">
        <a class="default-link">简介</a>
      </li>
      <li class="li-link" :class="{active:tabFlag=='likeList'}" @click="tabClick('likeList')">
        <a class="default-link">喜欢</a>
      </li>
      <li class="li-link" :class="{active:tabFlag=='followList'}" @click="tabClick('followList')">
        <a class="default-link">正在关注</a>
      </li>
    </ul>
  </div>
  <!--用户导航nav结束-->
</div>
</template>
<script>
// import {
//   InterfaceMap as Interf
// } from 'scripts/interfaceConst'
import Follow from 'components/public/personal/follow.vue'
export default {
  components: {
    Follow
  },
  props: {
    artistIntroduction: {
      type: String
    },
    artistJoindate: {
      type: Number
    },
    isFollowed: {
      type: String,
      require: true
    },
    bannerId: {
      type: String,
      require: true
    },
    bannerImg: {
      type: String,
      require: true
    },
    bannerTitle: {
      type: String,
      require: true
    },
    artistId: {
      type: String,
      require: true
    },
    artistNickname: {
      type: String,
      require: true
    },
    artistAvatar: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      seen: true,
      tabFlag: 'pro'
    }
  },
  mounted() {
    console.log(this.artistIntroduction)
  },
  methods: {
    tabClick(str) {
      this.tabFlag = str
      this.$bus.$emit('toggle-personal-tab', str)
    }
  },
  computed: {
    /**
     * 获取用户注册时间
     */
    // userJoinDate() {
    //   let date = String(this.artistJoindate)
    //   const y = 4
    //   const m = 6
    //   return `${date.slice(0, y)}.${date.slice(y, m)}.${date.slice(m)}加入墙蛙`
    // },
    /**
     * 返回用户的背景图
     */
    userBanner() {
      return {
        background: `url(http://192.168.1.6:8000/thumbnail/banner/${this.bannerId}/1920/${this.bannerImg})`
      }
    },
    userAvatar() {
      return `http://192.168.1.6:8000/thumbnail/avatar/${this.artistId}/100/${this.artistAvatar}`
    }
  }
}
</script>
<style lang="sass">
 @import "../../styles/scss/user-head.scss";
</style>
