<template>
  <div :class="[defaultClass, options.size, adClass]" 
  @click="btnCallback">
    <div flex="dir:left cross:center main:center"> 
      {{text}}
    </div>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      defaultClass: 'm-btn'
    }
  },
  props: {
    adClass: {
      type: String,
      default() {
        return ''
      }
    },
    text: {
      type: String,
      default() {
        return '按钮'
      }
    },
    options: {
      type: Object,
      default() {
        return {
          size: 'small'
        }
      }
    }
  },
  methods: {
    btnCallback() {
      this.$emit("clickBtn", true)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';
@import '~styles/scss/core/element.scss';
@import '~styles/scss/core/utils.scss';

.m-btn {
  @include btn();
}
// 定义规格的尺寸
.small {
  width: 80px;
  height: 40px;
}

</style>



