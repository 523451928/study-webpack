<template>
  <ul class="pagination">
    <li class="page-item" v-for="thisP in recentPage" @click="selectCurPage(thisP)" :class="{active: curPage === thisP}"><span class="page-link">{{curPage}}</li>
    <li class="page-item" @click="loadNextPage"><span class="page-link">... <span class="sr-only">(next)</span></span></li>
  </ul>
</template>
<script>
export default {
  props: {
    totalPage: {
      type: Number,
      required: true
    },
    initCurPage: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      curPage: this.initCurPage,
      recentPage: this.totalPage
    }
  },
  methods: {
    loadNextPage() {
      let self = this
      let newTotalPage = self.recentPage + 1
      self.$emit('updateTotalPage', newTotalPage)
    },
    selectCurPage(p) {
      this.curPage = p
      this.$emit('updateCurPage', p)
    }
  }
}
</script>
<style lang="sass">
</style>
