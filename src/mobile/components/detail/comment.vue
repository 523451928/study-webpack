<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div>
    <h2 class="text-center comments-title">欢迎留言</h2>
    <form class="conmments-form" id="conmments-form">
      <template v-if="hasLogin">
        <textarea v-model="content" class="form-control comments-content" id="comments-content" placeholder="请填写评论内容"></textarea>
        <div class="comments-set-area clearfix">
          <button type="button" @click="newComment" class="btn btn-primary btn-lg pull-right" id="comment-submit-btn">点击发布</button>
        </div>
      </template>
      <div v-else class="conmments-login-box">
        啊哦~只有<a class="link" id="comt-login-link" href="/login.html?next=">登录</a>过的小伙伴才能评论哦
      </div>
    </form>
    <div class="conmments-area">
      <div class="conmments-list" v-for="(item, index) in commentList">
        <a class="default-link" href="">
          <img class="comt-head-img" :src="item['Avatar']">
        </a>
        <div class="conmments-detail">
          <div class="comt-user-name comt-row">
            <a class="default-link" href="">{{item['User']['Nickname']}}</a>
          </div>
          <div class="comt-user-detail comt-row">
            {{item['Content']}}
          </div>
          <div class="comt-user-date comt-row">
            {{item['CreateTime']}}
          </div>
          <div class="comt-mng-links">
            <a href="javascript:void(0)" v-if="uId == item['User']['Id']" @click="deleteComment(item['Id'],index)" class="delete-link"> 删除</a>
            <a href="javascript:void(0)" @click="reply(index,item['Id'])" class="reply-link"> 回复
              <span class="reply-num" v-if="item['Count']">( {{item['Count']}} )</span>
            </a>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="reply-area" :class="isActive==index?'active':''">
          <ul class="reply-ul">
            <li class="reply-list clearfix" v-for="(replyItem, index) in replyList">
              <a class="default-link" href="">
                <img class="reply-head-img" :src="replyItem['Avatar']">
              </a>
              <div class="reply-detail">
                <div class="reply-user-name reply-row">
                  <a class="default-link" href="">
                    <span class="reply-name">{{replyItem['User']['Nickname']}}</span>
                  </a>
                  回复  {{replyItem['ParentUser']['Id']?replyItem['ParentUser']['Nickname']:''}} ：
                </div>
                <div class="reply-user-detail reply-row">
                  {{replyItem['Content']}}
                </div>
                <div class="reply-user-date reply-row">
                  {{replyItem['CreateTime']}}
                </div>
                <div class="reply-mng-links">
                  <a href="javascript:void(0)" v-if="uId == replyItem['User']['Id']" @click="deleteReply(replyItem['Id'], index, item)" class="reply-delete-link"> 删除</a>
                  <a href="javascript:void(0)" @click="replyReply(replyItem)" class="reply-reply-link">
                    <span class="reply-num" v-if="replyItem['Count']">{{replyItem['Count']}}</span> 回复</a>
                </div>
              </div>
            </li>
          </ul>
          <form class="reply-form" :class="isActive==index?'active':''">
            <textarea v-model="replyContent" class="form-control comments-content reply-content" :placeholder="replyState?'回复 '+replyName:'回复'" rows="1"></textarea>
            <div class="comments-set-area clearfix">
              <a @click="replyComment(item)" class="btn btn-primary pull-right reply-submit-btn">点击发布</a>
            </div>
          </form>
        </div>
      </div>
      <Pagination :cur="cur" :all="all"></Pagination>
    </div>
  </div>
</template>
<script>
  import { semanticTime } from 'js/time.js'
  import pagination from './pagination'
  import {InterfaceMap} from 'scripts/interfaceConst.js'
  export default{
    props: {
      hasLogin: {
        type: Boolean,
        default: false
      },
      uId: {
        type: Number,
        default: 0
      },
      workId: {
        type: Number,
        default: 0
      },
      itemId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        content: '',
        replyContent: '',
        isActive: -1,
        commentList: [],
        replyList: [],
        replyState: 0,
        replyId: '',
        replyName: '',
        cur: 1,
        all: 0,
        total: 0,
        count: 0,
        baseUrl: InterfaceMap.base
      }
    },
    components: {
      Pagination: pagination
    },
    mounted() {
      this.$onBus('pagi', (num) => {
        this.cur = num
        this.pullComment(num)
      })
    },
    methods: {
      newComment() {
        let self = this
        if (!this.content) {
          layer.toast('评论不能为空')
          return
        }
        let params = {
          ItemId: this.itemId,
          Content: this.content
        }
        request.submit(InterfaceMap.addComment, params).then(res => {
          self.content = ''
          self.pullComment()
          self.$bus.$emit('plusComment')
          layer.toast('评论成功')
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pullComment(num) {
        let self = this
        this.cur = num || 1
        let params = {
          'WorkId': this.workId
        }
        request({url: InterfaceMap.getCommentList, params}).then(res => {
          let page = res.data['Pager']
          self.total = page['Total']
          self.count = page['Count']
          this.all = Math.ceil(page['Total'] / page['Count'])
          self.commentList = self.bycomment(res.take('Data'))
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pullReply(id) {
        let self = this
        let params = {
          'ParentId': id,
          'WorkId': this.workId
        }
        request({url: InterfaceMap.getCommentList, params}).then(res => {
          self.replyList = self.bycomment(res.take('Data'))
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      reply(i, id) {
        if (this.isActive !== i) {
          this.isActive = i
          this.pullReply(id)
        } else {
          this.isActive = -1
        }
        this.replyState = 0
      },
      replyComment(v) {
        let self = this
        if (!this.replyContent) {
          layer.toast('回复不能为空')
          return
        }
        let pId = this.replyState ? this.replyId : v['Id']
        let params = {
          ItemId: this.itemId,
          Content: this.replyContent,
          ParentId: pId
        }
        request.submit(InterfaceMap.addComment, params).then(res => {
          self.replyContent = ''
          ++v['Count']
          self.pullReply(v['Id'])
          layer.toast('评论成功')
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      replyReply(v) {
        this.replyState = 1
        this.replyId = v['User']['Id']
        this.replyName = v['User']['Nickname']
      },
      deleteComment(id, i) {
        let self = this
        request({method: 'DELETE', url: InterfaceMap.deleteCommentList + '/' + id}).then(res => {
          if (res.data['Data']) {
            layer.toast('删除成功')
            self.commentList.splice(i, 1)
            if ((--self.total / self.count) % 1 === 0) {
              self.pullComment(self.total / self.count)
            }
            self.$bus.$emit('minusComment')
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      deleteReply(id, i, v) {
        let self = this
        request({method: 'DELETE', url: InterfaceMap.deleteCommentList + '/' + id}).then(res => {
          if (res.data['Data']) {
            --v['Count']
            layer.toast('删除成功')
            self.replyList.splice(i, 1)
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      bycomment(d) {
        let baseUrl = this.baseUrl
        _.each(d, function(v) {
          v.CreateTime = semanticTime(v['CreateTime'])
          if (v['Avatar'] !== '') {
            v.Avatar = baseUrl + 'thumbnail/avatar/' + v.User.Id + '/100/' + v.User.Avatar
          } else {
            v.Avatar = '~images/profile-user-default-100x100.jpg'
          }
        })
        return d
      }
    }
  }
</script>
