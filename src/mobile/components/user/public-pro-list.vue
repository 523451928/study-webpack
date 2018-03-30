<template>
  <div class="product-list-area clearfix">
    <div v-for="proItem in listData" class="pro-list grey-border">
      <a :href="'/work/'+ proItem.WorkId + '?CategoryId='+ proItem.CategoryId" class="displays-link">
        <Display class="displays" :entry-id="proItem.EntryId" :category-id="proItem.CategoryId" :product-id="proItem.WorkId" :pictures="proItem.Pictures" :displays="proItem.Displays"></Display>
      </a>
      <div class="pro-detail clearfix"><span class="pro-price pull-right">¥ {{proItem.Money/100}}</span>
        <div class="pull-left pro-title">
          <a :href="'/work/'+ proItem.WorkId+ '?CategoryId'+ proItem.CategoryId" class="default-hover-link">{{proItem.WorkTitle}} </a>
        </div>
        <div class="clearfix"></div>
        <span class="pull-right">
        <a href="javascript:void(0)"  @click="updateLikeStatus(proItem)" class="default-link list-like-btn like-btn">
          <span class="wa wa-heart-fill" :class="proItem.Liked ? 'active': ''"></span>
          <span class="like-count">{{proItem.LikeCount}}</span>
        </a>
        </span>
        <div class="author-name pull-left">
          <a :href="'/artist/'+proItem.ArtistId" class="default-hover-link">{{proItem.ArtistNickname}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Display from 'components/list/display.vue'
  import {InterfaceMap} from 'scripts/interfaceConst.js'
  export default {
    components: {Display},
    props: {
      listData: {
        type: Object,
        required: true
      }
    },
    data() {
    },
    methods: {
      updateLikeStatus(item) {
        let itemId = item.ItemId
        request({method: 'POST', url: InterfaceMap.updateLikeStatus + '?ItemId=' + itemId}).then(res => {
          let liked = res.data.Data
          item.Liked = liked
          if (liked) {
            item.LikeCount++
          } else {
            item.LikeCount--
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
