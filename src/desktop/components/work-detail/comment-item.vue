<template>
  <div class="m-comment-item" flex="dir:left cross:top box:first">
    <div class="avatar">
      <img :src="getAvatar" alt="头像">
    </div>
    <div class="info" flex="dir:top">
      <p class="name">{{comment.User.Nickname}}</p>
      <p class="content">{{comment.Content}}</p>
      <div class="footnote" flex="dir:left cross:center main:justify">
        <p class="date">{{getDate}}</p>
        <span class="reply" @click="toggleFloor">回复({{count}})</span>
        
      </div>
      <transition name="unfold" mode="out-in">
        <children-comment-item 
        v-if="childrenShow"
        :work-id="workId"
        :count="comment.Count"
        :user="comment.User"
        :parent-id="comment.Id"
        @add-comment="addComment"
        >
        </children-comment-item>
      </transition>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ChildrenCommentItem from './children-comment-item.vue'
export default {
  props: {
    comment: {
      type: Object
    },
    workId: {
      type: Number
    },
    parentPage: {
      type: Number
    }
  },
  data() {
    return {
      childrenShow: false, // 子评论是否展开
      count: 0,
      // parentId: this.comment., // 父评论id
    }
  },
  components: {
    ChildrenCommentItem
  },
  created() {
    this.count = this.comment.Count
  },
  computed: {
    // 日期
    getDate() {
      let date = new Date(this.comment.Inserted)
      return `
        ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    },
    // 头像
    getAvatar() {
      let avatar = this.comment.User.Avatar
      return `//192.168.1.6:8000/thumbnail/avatar/1/100/${avatar}`
    }
  },
  methods: {
    // 切换评论的楼层
    toggleFloor() {
      this.childrenShow = !this.childrenShow
    },
    addComment(n) {
      this.count += n
    }
  },
  watch: {
    parentPage(n) {
      this.childrenShow = false
    },
    comment(n) {
      this.count = n.Count
    }
  },
  

}
</script>

<style lang="sass" scoped>
@import '~../../styles/scss/public/variable.scss';
@import '~../../styles/scss/public/mixin.scss';
p {
  margin: 0;
}
.m-comment-item {
  padding: 20px 10px;
  border-bottom: 1px solid $c-line-1;
  .avatar {
    position: relative;
    margin-right: 20px;
    width: 70px;
    height: 70px;
    overflow: hidden;
    border-radius: 50%;
    >img {
      border-radius: 50%;
    }
  }
  .info {
    >p {
      margin-bottom: 20px;
    }
  }
  .name {
    font-size: 16px;
  }
  .footnote{
    .date{
      color: $c-fc-3;
    }
    .reply {
      color: $c-jxc-1;
      cursor: pointer;
    }
  }
}

</style>


