<template>
  <div :class="[defaultClass, adClass]">
    <div>
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultClass: 'm-panel'
    }
  },
  props: {
    adClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';
@import '~styles/scss/core/element.scss';

.m-panel {
  @include panel();
}
</style>
