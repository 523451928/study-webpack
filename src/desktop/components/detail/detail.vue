<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->
<template>
<div class="ww-wrap product-wrap">
  <div class="pro-detail-box" id="pro-detail-box">
    <div class="product-detail-con">
      <div class="product-edit-wrapper">
        <slot name='bread-crumbs'></slot>
        <slot name='detailWrap'></slot>
        <div class="product-social-box">
          <div class="share-align-center clearfix">
            <div class="">
              <div class="pull-left like-btn">
                <div @click="updateLikeStatus(likeStatus)" class="like-btn">
                  <span class="wa wa-heart-fill" :class="likeStatus ? 'active' : ''"></span>
                  <span id="like-count">{{likedCount}}</span>
                </div>
              </div>
              <div class="share-area clearfix" id="share-area">
                <span class="share-tit">
                     分享:
                  </span>
                <a class="share-social" @click="sharePro('weibo')">
                    <i class="wa wa-weibo-circle"></i>
                  </a>
                <a class="share-social" @click="sharePro('qzone')">
                    <i class="wa wa-qq-circle"></i>
                  </a>
                <a class="share-social" @click="sharePro('weixin')" @mouseover="sharePro('weixin')" @mouseleave="showQRcode = false">
                    <i class="wa wa-wechat-circle"></i>
                  </a>
                <a class="share-social" @click="sharePro('douban')">
                    <i class="wa wa-douban-circle"></i>
                  </a>
                <div class="share-erweima" v-show="showQRcode">
                  <button type="button" class="close" aria-label="Close" @click="showQRcode = false"><span aria-hidden="true">×</span></button>
                  <p>扫一扫进行分享,打开网页后点击屏幕右上角分享按钮</p>
                  <div class="code-wrap">
                    <img :src="`data:image/png;base64,${QRcodeContent}`" alt="墙蛙微信分享二维码" class="code">
                  </div>
                </div>
              </div>
              <a class="btn btn-default hide detail-edit-btn" href="/item/new">编辑产品</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pro-control-pannel">
      <div class="pro-control-container clearfix">
        <slot name='autor'></slot>
        <div class="pro-tabs-nav">
          <ul class="pro-tabs-nav-list">
            <li @click="tabClick('description')" :class="tabIndex=='description'?'active':''">
              <label> 产品详情</label>
              <strong class="wa wa-all-product"></strong>
            </li>
            <li @click="tabClick('others')" :class="tabIndex=='others'?'active':''">
              <label> 其他产品</label>
              <slot name="otherCount"></slot>
            </li>
            <li @click="tabClick('author')" :class="tabIndex=='author'?'active':''">
              <label> 作者说</label>
              <strong class="wa wa-about"></strong>
            </li>
            <li @click="messageClick('message')" :class="tabIndex=='message'?'active':''">
              <label> 用户评论</label>
              <strong class="comment-count" id="comment-count">
                  {{comCount}}
                </strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="pro-detail-white-area">
      <div class="pro-detail-pannel">
        <div class="pro-detail-container pro-detail-area " id="pro-detail-area">
          <!-- descripation: 产品详情 -->
          <div class="pro-detail-box" v-show="tabIndex == 'description'" id="pro-detail-des">
            <div class="load-wrap">
              <div class="ww-loading"></div>
            </div>
            <!-- Place somewhere in the <body> of your page -->
            <div class="bom-detail-slider active">
              <img class="lazy normal" :src="`/static/images/bom-detail/${catEName}.jpg`" style="display: inline">
            </div>
            <h2 class="des-title">物流与包装</h2>
            <div class="des-con">
              <p>墙蛙为您考虑到每一步，采用行业专用包装方案——用缓冲层抗挤压，抗摔落；专用气泡塑料包裹，抗潮湿，防止液体流入。确保在快递与转运过程中，多次周转无破损。 请您放心，如果您的商品不幸在物流中遭遇百斤挤压/重力撞击/野蛮踩踏/高空坠落，外伤与内伤并发，墙蛙会尽千分之千的努力，为您补发商品，直到您满意为止！</p>

              <p>1.墙蛙网合作物流为<span class="txt-blue">顺丰包邮</span>；</p>

              <p>2.墙蛙网产品均为手工工艺品，制作需耗费时间，墙蛙承诺在您付款后48小时内发货（周日及法定节假日不发货），还请耐心等待。</p>
            </div>
            <div class="des-other row">
              <div class="col-md-6">
                <h2 class="des-title">产品尺寸</h2>
                <div class="des-detail-list">
                  完成尺寸: <span id="completeSize"></span>
                </div>
                <div class="des-detail-list">
                  画芯尺寸: <span id="paintSize"></span>
                </div>
                <div class="des-detail-list show-hover-pic">
                  <a id="size-real-btn" class="underline-link">查看实物参照比例</a>
                </div>
              </div>
              <div class="col-md-6">
                <h2 class="des-title">其他细节</h2>
                <div class="show-hover-pic des-detail-list">
                  <a id="pro-tool-btn" @click="protool" class="underline-link">产品配件</a>
                </div>
              </div>
            </div>
          </div>
          <!-- others list: 其他产品-->
          <div class="pro-detail-box product-list-con pb0" v-show="tabIndex == 'others'" id="pro-detail-products">
            <%range $i, $p := $.Pieces%>
            <div class="pro-list">
              <div class="pro-pic text-center">
                <a class="pic-link" href="/work/<%$.Work.Id%>?CategoryId=<%$p.Category.Id%>"></a>
                <display entry-id="<%$p.Entry.Id%>" category-id="<%$p.Category.Id%>" product-id="<%$p.Entry.ProductId%>" pictures="<%call $.Marshal $p.Pictures%>" displays="<%call $.Marshal $p.Displays%>"> </display>
              </div>
              <div class="pro-detail clearfix">
                <div class="pro-title text-center">
                  <a href="/work/<%$.Work.Id%>?CategoryId=<%$p.Category.Id%>">
                    <%$p.Category.Name%> <span>￥ <%$p.Money%></span>
                  </a>
                </div>
              </div>
            </div>
            <%end%>
          </div>
          <!-- auto: 作者说-->
          <div class="pro-detail-box" v-show="tabIndex == 'author'">
            <h2 class="des-title">产品描述</h2>
              <div class="des-con" id="pro-des"><%$.Work.Description%></div>
              <h2 class="des-title">产品标签</h2>
              <div class="tags-con" id="pro-tags">
                <ul class="detail-tags-list">
                  <%range $index, $tag := $.Work.Tags%>
                  <li><%$tag.Name%></li>
                  <%end%>
                </ul>
              </div>
          </div>
          <!-- comment：用户评论-->
          <div class="pro-detail-box pro-detail-comments" v-show="tabIndex == 'message'" id="pro-detail-comments">
            <Message ref="msg" :has-login="hasLogin" :u-id="uId" :item-id="ItemId" :work-id="WorkId"></Message>
          </div>
        </div>
      </div>
      <!-- more-list -->
      <div class="pro-detail-container">
        <div class="product-list-con">
          <div class="more-Product product-list-area clearfix">
            <h2 class="text-center mb20 mt0">本店更多的产品</h2>
            <more-list more-length="<%len $.MorePieces%>">
              <div slot="more-list-content" class="product-list-area more-pro clearfix">
                <%range $i, $p := $.MorePieces%>
                <div class="pro-list">
                  <div class="pro-pic text-center">
                    <a class="pic-link" href="/work/<%$p.WorkId%>?CategoryId=<%$p.Category.Id%>">
                    </a>
                    <display class="displays" entry-id="<%$p.Entry.Id%>" category-id="<%$p.Category.Id%>" product-id="<%$p.Entry.ProductId%>" pictures="<%call $.Marshal $p.Pictures%>" displays="<%call $.Marshal $p.Displays%>"></display>
                  </div>
                  <div class="pro-detail clearfix">
                    <div class="pro-title text-center">
                      <a href="/work/<%$p.WorkId%>?CategoryId=<%$p.Category.Id%>">
                        <span>￥ <%$p.Money%></span>
                      </a>
                    </div>
                  </div>
                </div>
                <%end%>
              </div>
            </more-list>
          </div>
          <div class="history-Product product-list-area clearfix mb20">
            <h2 class="text-center mb20 mt0"> 最近浏览</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
// import { getParameter } from 'js/getParameter.js'
import comment from './comment'
import {
  InterfaceMap as Interf
} from 'scripts/interfaceConst.js'
import { catNameIdMap } from 'scripts/utils/custom/consts.js'
export default {
  props: {
    commentCount: {
      type: String,
      required: true
    },
    liked: {
      type: String,
      required: true
    },
    likeCount: {
      type: String,
      required: true
    },
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tabIndex: 'others',
      content: '',
      hasLogin: false,
      uId: 0,
      msgInit: false,
      ItemId: 0,
      WorkId: 0,
      comCount: this.commentCount,
      likeStatus: this.liked === 'true',
      likedCount: parseInt(this.likeCount),
      catEName: undefined,
      showQRcode: false,
      QRcodeContent: ''
    }
  },
  mounted() {
    this.catEName = catNameIdMap.find(item => item.id === this.categoryId).enName
    this.$onBus('initWorkId', id => {
      this.WorkId = id
    })
    this.$onBus('refreshItemId', id => {
      this.ItemId = id
    })
    this.$onBus('plusComment', count => {
      this.comCount++
    })
    this.$onBus('minusComment', count => {
      this.comCount--
    })
  },
  components: {
    Message: comment
  },
  methods: {
    tabClick(str) {
      this.tabIndex = str
    },
    messageClick(str) {
      this.tabIndex = str
      this.uId = document.getElementById('login-status').getAttribute('data-id')
      if (this.uId) {
        this.hasLogin = true
      }
      if (!this.msgInit) {
        this.msgInit = true
        this.$refs.msg.pullComment()
      }
    },
    sharePro(type) {
      let ItemId = this.ItemId
      request({
        method: 'POST',
        url: `${Interf.shareProduct}${type}?ItemId=${ItemId}`
      }).then(res => {
        let data = res.data.Data
        if (type === 'weixin') {
          this.showQRcode = true
          this.QRcodeContent = data['qr']
        } else {
          let w = window.open()
          setTimeout(function() {
            w.location = data
          }, 500)
          return false
        }
      })
    },
    protool() {
      layer.open({
        isImg: true,
        content: `<img class="img-responsive" src=/static/images/product/proTool${this.catEName}.jpg />`
      })
    },
    updateLikeStatus() {
      let itemId = this.ItemId
      let self = this
      request({
        method: 'POST',
        url: `${Interf.updateLikeStatus}?ItemId=${itemId}`
      }).then(res => {
        let liked = res.data.Data
        self.likeStatus = liked
        if (liked) {
          self.likedCount++
        } else {
          self.likedCount--
        }
      }, res => {
        res.hide()
        layer.toast(res.take('Error'))
      })
    }
  }
}
</script>
