<template>
  <div class="wrap">
    <div class="user-head">
      <a href="./user.html" class="pull-left back">
        <i class="wa wa-left"></i>
      </a>
      <h2 class="title">喜欢商品</h2>
    </div>
    <div class="user-list">
      <loadmore v-if="!isBlank" :is-auto-loadmore="true" :top-method="loadTop" :bottom-method="pullLikeList" :all-bottom-loaded="allLoaded"
                ref="loadmore">
        <div class="like-list-area clearfix">
          <div>
            <div class="product-list-con clearfix">
              <public-pro-list :listData = "likeList"></public-pro-list>
            </div>
          </div>
        </div>
      </loadmore>
      <div v-else class="no-pro-msg text-center">
        <h2>╮(╯▽╰)╭ 这里空空如也&nbsp;&nbsp;<a href="/" class="underline-link"> 去逛逛 >> </a></h2>
      </div>
    </div>
    <a href="../cart.html" class="cart-icon">
      <i class="wa-shopping-cart"></i>
      <span class="red-dot"></span>
    </span>
  </div>
</template>

<script>
  /* eslint-disable */
  import {InterfaceMap} from 'scripts/interfaceConst'
  import PublicProList from 'components/user/public-pro-list'
  import loadmore from '../../public/loadmore.vue'
  export default {
    components: {PublicProList, loadmore},
    props: {
      authorId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        currentPage: 1,
        likeList: [],
        allLoaded: false,
        isBlank: false
      }
    },
    methods: {
      loadTop() {
        setTimeout(() =>{
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      },
      pullLikeList() {
        let params = {
          'Page': this.currentPage || 1
        }
        if (this.authorId) {
          params.ArtistId = this.authorId
        }
        this.loading = true

        request({url: InterfaceMap.getLikeList, params}).then(res => {
          let data = res.data
          if (data.Data) {
            setTimeout(() => {
              this.currentPage++
              this.allLoaded = false
            , 100})
            this.likeList = this.likeList.concat(data.Data)
          } else {
            this.allLoaded = true
          }
          if (this.likeList.length === 0) {
            this.isBlank = true
          }
          this.$refs.loadmore.onBottomLoaded()
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
<style>
  body{
    padding-top: 50px;
  }
  body,html,.bd{
    height: 100%;
  }
  .product-list-area{
    padding-bottom: 0;
  }
  .wa-heart-fill{
    position: relative;
    top: 2px;
  }
</style>
