<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="pagination-area" v-if="pageStatus">
    <div class="page-detail pull-left">
      <span>{{curpage}}</span>/
      <span>{{totalpages}}</span>
    </div>
    <div class="center">
      <a class="ctr-label"  :class="{ 'disable':isMinPage}"  @click="changePage('minus')" href="javascript:void(0)"><i class="wa wa-caret-left"></i></a>
      <input class="form-control" v-model="inputPage">
      <a class="ctr-label"  :class="{ 'disable':isMaxPage}" @click="changePage('plus')" href="javascript:void(0)"><i class="wa wa-caret-right"></i></a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageStatus: true,
      isMinPage: true,
      isMaxPage: false
    }
  },
  props: {
    totalpages: {type: Number, default: 1},
    curpage: {type: Number, default: 1}
  },
  computed: {
    pageStatus() {
      return this.totalpages > 1
    },
    inputPage: {
      get: function() {
        return this.curpage
      },
      set: function(newValue) {
        this.page = newValue.replace(/[^\d]/g, '') || this.curpage
      }
    }
  },
  methods: {
    changePage(action) {
      if (action === 'plus') {
        this.curpage += this.curpage
        this.isMaxPage = this.curpage >= this.totalpages
        this.isMinPage = false
        this.curpage = this.curpage > this.totalpages ? this.totalpages : this.curpage
      } else if (action === 'minus') {
        this.curpage = this.curpage - 1
        this.isMinPage = this.curpage <= 1
        this.isMaxPage = false
        this.curpage = this.curpage === 0 ? 1 : this.curpage
      }
      this.$emit('input', this.curpage)
    }

  }
}
</script>

