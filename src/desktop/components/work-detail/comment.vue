<template>
  <div class="m-comment">
    <div class="layout-content">
      <h5 class="detail-title">
        欢迎留言
      </h5>
      <!-- 留言区 -->
      <div class="leave-message">
          <textarea 
          name="message" 
          id="message"
          v-model="content"
          placeholder="喜欢这个作品吗?给作者点个赞,留个脚印吧~"
          ></textarea>
          <div class="u-primary-btn submit-message" @click="_addMessage">点击发布</div>
      </div>
      <ul class="comment-list" v-if="commentData">
        <li v-for="(item, index) in commentData.Data">
          <comment-item
          :comment="item"
          :work-id="workId"
          :parent-page="page"
          >
          </comment-item>
        </li>
      </ul>
      <pagination v-if="commentData"  :nextDisable="nextDisable" :pager="commentData.Pager" @updatePage="updatePageIndex"></pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import CommentItem from './comment-item'
import Pagination from 'components/public/Pager.vue'
export default {
  data() {
    return {
       content: '', // 评论的内容
       page: 1,
       commentData: undefined, // 评论数据
       commentCount: 0, // 总评论数
    }
  },
  components: {
    CommentItem,
    Pagination
  },
  props: {
    workId: {
      type: Number,
      default: 141
    }
  },
  mounted() {
    this._initCommentData(this.workId)
    .then(res => {
      this.commentData = res
      this.$nextTick(() => {
        if (res) {
          this.CommentCount = res.CommentCount >= 999 ? 999 : res.CommentCount
          document.getElementById('js_comment').innerHTML = this.CommentCount
        }
      })
    })
  },
  methods: {
    _initCommentData(id = this.workId) {
      return new Promise((resolve, reject) => {
        this.$request.list('comment', {
          params: {
            WorkId: id,
            Page: this.page
          }
        })
        .then(commentData => {
          resolve(commentData.body)
        })
      })
    },
    _addMessage(parentId) {
      let mcdId = window.sessionStorage.getItem('merchandiseId')
      let content = this.content
      if (this.$user.UserId === 0) {
        this.$notify({
          type: 'wa-warning',
          text: '你还没登录,请先登录'
        })
      } else {
        if (this.content === '') {
          this.$notify({
            type: 'wa-warning',
            text: '请输入内容'
          })
        } else {
          this.$request.submit('comment/add', {
            ItemId: mcdId,
            Content: content
          }).then(res => {
            this._initCommentData()
            .then(res => {
              if (res) {
                this.content = ''
                this.commentData = res
                this.CommentCount = res.CommentCount >= 999 ? 999 : res.CommentCount
                document.getElementById('js_comment').innerHTML = this.CommentCount
              }
            })
          })
        }
      }
    },
    onInput(e) {
      let value = e.target.value
      this.content = value
    },
    updatePageIndex(n) {
      this.page = n
      this._initCommentData(this.workId).then(res => {
        console.log(res)
        this.commentData = res
      })
    }
  },
  computed: {
    nextDisable() {
      if (this.commentData) {
        return this.commentData.Data.length < 10
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~../../styles/scss/public/variable.scss';
@import '~../../styles/scss/public/mixin.scss';
.m-comment {
  margin-bottom: 60px;
  .detail-title {
    text-align: center;
    margin-bottom: 20px;
  }
  .leave-message {
    margin-bottom: 40px;
    @include clearFloat;
    >textarea {
      width: 980px;
      height: 150px;
      padding: 15px;
      resize: none;
      &:focus {
        border-color: $c-jxc-1;
      }
    }
    >.submit-message {
      float: right;
      width: 160px;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>


