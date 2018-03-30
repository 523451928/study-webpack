<!-- 物料超出一行后隐藏的组件 默认title+一行物料为92px -->

<template>
  <div  class="over-toggle-box" :class="{'over-show':showDetail}">
    <a class="bom-toggle-btn" :class="{ 'hide': bomLength < 8,'open':showDetail}" @click="toggleDetail()" href="javascript:void(0)">
    </a>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showDetail: false
      }
    },
    mounted() {
    },
    props: {
      bomLength: {type: Number, default: 1}
    },
    methods: {
      toggleDetail() {
        this.showDetail = !this.showDetail
      }
    }
  }
</script>
