<template>
  <header :class="[defaultClass, adClass]">
    <i class="wa wa-left prev" @click="onHref"></i>
    <h4>{{title}}</h4>
  </header>
</template>

<script>
/*eslint-disable*/
export default {
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    prev: {
      type: String,
      default() {
        return "/home"
      }
    }
  },
  data() {
    return {
      defaultClass: 'm-header'
    }
  },
  methods: {
    onHref() {
      window.location.href = this.prev
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';
@import '~styles/scss/core/utils.scss';

.m-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: mobileSize(98px);
  z-index: 999;
  color: $c-fc-1;
  .prev {
    position: absolute;
    left: mobileSize(.3rem);
    top: 50%;
    transform: translateY(-50%);
    color: $c-fc-1;
    font-size: .14rem;
  }
  h4 {
    text-align: center;
    font-size: .16rem;
    line-height: 1;
    line-height: mobileSize(98px);
  }
}
</style>


