<template>
  <div class="m-nav-bar">
    <div class="layout-content" flex="dir:left cross:center main:justify">
      <div class="user-avatar">
        <div class="avatar">
          <img :src="userAvatar" alt="">
        </div>
        <div class="user-info">
          <h5 class="name">{{userName}}</h5>
          <div class="follow-btn" @click="onAttention">
            {{isFollow ? '取消关注' : '关注'}}
          </div>
        </div>
      </div>
      <ul class="tab-nav" flex="dir:left cross:center main:left">
        <li class="nav-item" :class="current===0 && 'active'"
        @click="toggleBar(0)" 
        flex="dir:top main:center cross:center">
          <p>详情说明</p>
          <p>...</p>
        </li>
        <li class="nav-item" :class="current===1 && 'active'"
        @click="toggleBar(1)"  
        flex="dir:top main:center cross:center">
          <p>其他商品</p>
          <p>{{length}}</p>
        </li>
        <li class="nav-item" :class="current===2 && 'active'" 
        @click="toggleBar(2)" 
        flex="dir:top main:center cross:center">
          <p>作者说</p>
          <p>
            <span class="wa wa-about"></span>
          </p>
        </li>
        <li class="nav-item" :class="current===3 && 'active'"
        @click="toggleBar(3)"  
        flex="dir:top main:center cross:center">
          <p>用户评论</p>
          <p>{{commentLength}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    userId: { //  艺术家id
      type: Number
    },
    userAvatar: { //  艺术家头像
      type: String
    },
    followed: { //  是否关注
      type: Boolean
    },
    userName: {
      type: String,  // 艺术家姓名
      default: 'NKOHC'
    },
    length: {
      type: Number
    },
    commentLength: {
      type: Number
    }
  },
  data() {
    return {
      isFollow: this.followed,
      current: 1
    }
  },
  methods: {
    toggleBar(index) {
      this.current = index
      this.$emit('toggleCurrent', this.current)
    },
    onAttention() {
      let userId = this.$user.UserId
      let artistId = this.userId
      if (userId === 0) {
        this.$notify({
          type: 'wa-warning',
          text: '你还没登录,请先登录'
        })
        return
      } else if (userId == artistId) {
        this.$notify({
          type: 'wa-warning',
          text: '你不能自己关注自己'
        })
        return
      } else {
        this.$request.submit('follow/user', {
          UserId: artistId
        }).then(res => {
          this.isFollow = !this.isFollow
        })
      }
    }
  }
}

</script>

<style lang="sass" scoped>

</style>

