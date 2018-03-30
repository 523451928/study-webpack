<template>
  <ul @click="onPagerClick" class="el-pager">
    <li @click.stop="prevPage" :class="{'disabled':currentPage==1}">
      «
    </li>
    <li
      :class="{ active: currentPage === 1 }"
      v-if="pageCount > 0"
      class="number">1</li>
    <li
      class="el-icon more btn-quickprev"
      :class="[quickprevIconClass]"
      v-if="showPrevMore"
      @mouseenter="quickprevIconClass = 'el-icon-d-arrow-left'"
      @mouseleave="quickprevIconClass = 'el-icon-more'">
    </li>
    <li
      v-for="pager in pagers"
      :class="{ active: currentPage === pager }"
      class="number">{{ pager }}</li>
    <li
      class="el-icon more btn-quicknext"
      :class="[quicknextIconClass]"
      v-if="showNextMore"
      @mouseenter="quicknextIconClass = 'el-icon-d-arrow-right'"
      @mouseleave="quicknextIconClass = 'el-icon-more'">
    </li>
    <li
      :class="{ active: currentPage === pageCount }"
      class="number"
      v-if="pageCount > 1">{{ pageCount }}</li>
    <li @click.stop="nextPage" :class="{'disabled':currentPage==pageCount}">
      »
    </li>
  </ul>
</template>

<script>
  /* eslint-disable */
  export default {
    props: {
      currentPage: Number,
      pageCount: Number
    },
    watch: {
      showPrevMore(val) {
        if (!val) this.quickprevIconClass = 'el-icon-more';
      },
      showNextMore(val) {
        if (!val) this.quicknextIconClass = 'el-icon-more';
      }
    },
    methods: {
      prevPage() {
        let currentPage = this.currentPage;
        if(currentPage > 1) {
          currentPage--
          this.$emit('change', currentPage);
        }
      },
      nextPage() {
        let currentPage = this.currentPage;
        if(currentPage < this.pageCount) {
          currentPage++
          this.$emit('change', currentPage);
        }
      },
      onPagerClick(event) {
        const target = event.target;
        if (target.tagName === 'UL') {
          return;
        }
        let newPage = Number(event.target.textContent);
        const pageCount = this.pageCount;
        let currentPage = this.currentPage;
        if (target.className.indexOf('more') !== -1) {
          if (target.className.indexOf('quickprev') !== -1) {
            newPage = currentPage - 5;
          } else if (target.className.indexOf('quicknext') !== -1) {
            newPage = currentPage + 5;
          }
        }
        /* istanbul ignore if */
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }
          if (newPage > pageCount) {
            newPage = pageCount;
          }
        }
        if (newPage !== currentPage) {
          this.$emit('change', newPage);
        }
      }
    },
    computed: {
      pagers() {
        const pagerCount = 7;
        const currentPage = Number(this.currentPage);
        const pageCount = Number(this.pageCount);
        let showPrevMore = false;
        let showNextMore = false;
        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - 3) {
            showPrevMore = true;
          }
          if (currentPage < pageCount - 3) {
            showNextMore = true;
          }
        }
        const array = [];
        if (showPrevMore && !showNextMore) {
          const startPage = pageCount - (pagerCount - 2);
          for (let i = startPage; i < pageCount; i++) {
            array.push(i);
          }
        } else if (!showPrevMore && showNextMore) {
          for (let i = 2; i < pagerCount; i++) {
            array.push(i);
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.floor(pagerCount / 2) - 1;
          for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
            array.push(i);
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i);
          }
        }
        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;
        return array;
      }
    },
    data() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false,
        quicknextIconClass: 'el-icon-more',
        quickprevIconClass: 'el-icon-more'
      };
    }
  };
</script>
<style>
  .el-pager{
    position: relative;
    top: -40px;
  }
  .el-pager .disabled{
    cursor: not-allowed;
  }
  .el-pager li {
    vertical-align: top;
    font-size: 13px;
    min-width: 34px;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #ddd;
    margin-left: -1px;
  }
  .el-pager li.active{
    margin-right: 1px;
    cursor: pointer;
  }
  .el-pager li.el-icon-d-arrow-right,.el-pager li.el-icon-d-arrow-left{
    line-height: 36px;
  }
</style>
