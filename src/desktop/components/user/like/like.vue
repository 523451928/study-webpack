<template>
  <div class="ww-wrap user-center-wrap bg-white">
    <div class="mt20 clearfix">
      <div class="user-list">
        <div class="like-list-area clearfix">
          <div v-if="!isBlank">
            <div class="product-list-con clearfix">
              <public-pro-list :listData = "likeList"></public-pro-list>
            </div>
          </div>
          <div v-else class="no-pro-msg text-center">
            <h2>╮(╯▽╰)╭ 这里空空如也&nbsp;&nbsp;<a href="/list.html" class="underline-link"> 去逛逛 >> </a></h2>
          </div>
        </div>
      </div>
      <div v-if="noMore" class="no-more">没有更多了。。。</div>
    </div>
  </div>
</template>

<script>
  import {InterfaceMap} from 'scripts/interfaceConst'
  import PublicProList from 'components/user/public-pro-list'
  export default {
    components: {PublicProList},
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
        noMore: false
      }
    },
    mounted() {
      this.pullLikeList()
      window.onscroll = _.throttle(() => {
        if (this.noMore) {
          return
        }
        if (!this.loading && $(window).scrollTop() === $(document).height() - $(window).height()) {
          this.pullLikeList()
        }
      }, 1000)
    },
    methods: {
      pullLikeList() {
        let params = {
          'Page': this.currentPage
        }
        if (this.authorId) {
          params.ArtistId = this.authorId
        }
        this.loading = true
        request({url: InterfaceMap.getLikeList, params}).then(res => {
          let data = res.data
          if (!data.Data || data.Data.length === 0) {
            this.noMore = true
            return
          }
          this.loading = false
          this.currentPage++
          this.likeList = this.likeList.concat(data.Data)
        }, res => {
          res.hide()
          // layer.toast(res.take('Error'))
        })
      }
    },
    computed: {
      isBlank() {
        return !this.likeList || this.likeList.length === 0
      }
    }
  }
</script>
