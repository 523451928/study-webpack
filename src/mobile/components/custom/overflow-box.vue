<!-- 物料超出一行后隐藏的组件 默认title+一行物料为92px -->

<template>
  <div  class="over-flow-box">
    <slot></slot>
  </div>
</template>
<style lang="sass">
  .over-flow-box {
    overflow: auto;
    background-color: transparent;
    padding: 0 5px;
    &.horizontal {
      height: auto;
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
    }
    .vertical {
      height: 100%;
      width: auto;
    }
  }
</style>
<script>
  export default {
    data() {
      return {
        showDetail: false
      }
    },
    props: {
      bomlength: {type: Number, default: 1}
    },
    methods: {
      toggleDetail() {
        this.showDetail = !this.showDetail
      }
    }
  }
</script>
