<template>
  <div class="m-children-item">
    <ul class="conmment-list" v-if="parentsComment">
      <li v-for="(item, index) in parentsComment" flex="dir:left cross:top">
        <div class="avatar">
          <img :src="setAvatar(item.User.Avatar)" alt="头像">
        </div>
        <div class="info" flex="dir:top">
          <p>{{item.User.Nickname}} : <span v-if="item.User.Id !== item.ParentUser.Id">回复{{item.ParentUser.Nickname}} : </span>{{item.Content}}</p>
          <div class="footnote" flex="dir:left cross:center main:justify">
            <p class="date">{{setDate(item.Inserted)}}</p>
            <div class="operation">
              <span @click="focusComment(item.User, item.Id)">回复</span>
            </div>
          </div>
        </div>
      </li>
      <li v-show="isFold" @click="onUnloadMore" class="more">更多</li>
    </ul>
    <div class="comment">
      <div class="textarea-box">
        <textarea name="comment" :placeholder="`回复 ${reply.Nickname}`" v-model="content">
        </textarea>
      </div>
      <div class="button-wrap">
        <div class="submit-hover" @click="onSubmitComment">点击发布</div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
export default {
  props: {
    workId: {type: Number}, // 作品id
    count: {type: Number}, // 数量
    user: {type: Object}, // 最父级的用户数据
    parentId: {type: Number}, // 最父级的评论id
  },
  data() {
    return {
      parentsComment: [], // 子评论列表
      reply: this.user, // 回复的对象
      isFold: true, // 是否展开楼层,当子评论过多时隐藏
      content: '', // 回复的内容
      parentId2: this.parentId, // 展开评论列表时,优先评论最父级的
      page: 1, // 评论的楼层数
    }
  },
  methods: {
    // 评论
    onSubmitComment() {
      let content = this.content
      if (!content.length) {
        this.$notify({
          type: 'wa-warning',
          text: '请输入内容'
        })
        return
      }
      this.$request.submit('comment/add', {
        ItemId: window.sessionStorage.getItem('merchandiseId'),
        Content: content,
        ParentId: this.parentId2
      }).then(res => {
        this.page = 1
        this.content = ''
        this.$emit('add-comment', 1)
        this.initParentUser('init')
      })
    },
    initParentUser(type) {
      this.$request.list('comment', {
        params: {
          WorkId: this.workId,
          Page: this.page,
          ParentId: this.parentId
        }
      }).then(res => {
        let data = res.take('Data')
        if (type === 'init') {
          this.parentsComment = data
        } else if (type === 'more') {
          this.parentsComment = [...this.parentsComment, ...data]
        }
        if (data && data.length >= 10) {
          this.isFold = true
        } else {
          this.isFold = false
        }
      })
    },
    setDate(d) {
      let date = new Date(d)
      return `
        ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    },
    setAvatar(avatar) {
      return `//192.168.1.6:8000/thumbnail/avatar/1/100/${avatar}`
    },
    focusComment(item, id) {
      this.reply = item
      this.parentId2 = id
    },
    onUnloadMore() {
      this.page++
      this.initParentUser('more')
    }
  },
  mounted() {
    this.initParentUser('init')
  }
}
</script>

<style lang="sass" scoped>
@import '~../../styles/scss/public/variable.scss';
@import '~../../styles/scss/public/mixin.scss';
@import '~../../styles/scss/public/element.scss';
p {
  margin-bottom: 0;
}
.m-children-item {
  padding: 20px;
  background-color: $c-bg-1;
  .conmment-list {
    > li {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px dashed $c-bc-2;
      &.more {
        cursor: pointer;
        text-align: center;
      }
      .avatar {
        margin-right: 10px;
        width: 40px;   
        height: 40px;
        >img {
          width: inherit;
          height: inherit;
          border-radius: 50%;
        }
      }
      .info {
        width: 100%;
        > p {
          margin-bottom: 20px;
          &:first-child{
            margin-top: 5px;
          }
        }
        >.footnote {
          width: inherit;
          .operation {
            cursor: pointer;
            &:hover {
              color: $c-jxc-1;
            }
          }
        }
      }
    }
  }
  .comment {
    @include clearFloat
    padding: 10px;
    background-color: $c-nc-1;
    >.textarea-box {
      margin-bottom: 10px;
      width: 100%;
      height: 40px;
      >textarea {
        padding: 0  10px;
        width: inherit;
        height: inherit;
        line-height: 38px;
        color: $c-fc-1;
        resize: none;
      }
    }
    >.button-wrap {
      .submit-hover {
        float: right;
        @include btn()
        width: 100px;
        height: 30px;
        padding: 0;
        line-height: 30px;
      }
    }
  }
}
</style>


