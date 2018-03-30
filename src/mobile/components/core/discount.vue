<template>
  <div :class="[defaultClass, adClass]">
    <div flex="dir:left cross:center main:center">
      {{discount/10}}折惠
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultClass: 'm-discount'
    }
  },
  props: {
    adClass: {
      type: String,
      default: ''
    },
    discount: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';

.m-discount {
  >div {
    padding: .05rem .04rem;
    border: 1px solid $c-jxc-2;
    font-size: .14rem;
    color: $c-jxc-2;
    border-radius: 2px;
  }
}
</style>


