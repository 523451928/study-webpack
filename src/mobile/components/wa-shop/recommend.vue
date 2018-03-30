<template>
  <div class="recommend-wrapper">
    <div class="recommend-header">
      <span>墙蛙推荐</span>
      <a href="javascript: void (0)" class="fr" >查看更多> </a>
    </div>
    <div class="recommend-container">
      <div v-for="(item, index) in recommendList">
        <viewer :entries="[item.EntryId]" :pictures="item.Pictures" :length="150" ref="display" :isClick="false"></viewer>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import viewer from 'components/custom/display/viewer'
  export default {
    components: {
      viewer
    },
    data() {
      return {
        recommendList: []
      }
    },
    methods: {
      getRecommendList() {
        let params = {
          'Page': this.currentPage || 1
        }
        request({url: 'like/list', params}).then(res => {
          let data = res.data
          if (data.Data) {
            this.recommendList = data.Data
          }
        })
      }
    },
    mounted() {
      this.getRecommendList()
    }
  }
</script>
