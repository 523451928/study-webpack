<template>
  <div :class="[defaultClass, options.size, adClass]">
    <div class="number-content" flex="dir:left cross:center box:justify">
      <div class="reduct i-handle" flex="cross:center main:center" @click="selectCount('reduct')">
        <i class="wa wa-minus" :class="count === 1 && 'disable'"></i>
      </div>
      <div class="input-wrap">
        <input type="text" :value="count">
      </div>
      <div class="add i-handle" flex="cross:center main:center" @click="selectCount('add')">
        <i class="wa wa-plus" :class="count >= options.maxNumber && 'disable'"></i>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      defaultClass: 'm-select-number', // 默认类名
      count: 1, // 当前数量
    }
  },
  props: {
    // 补充的类名
    adClass: {
      type: String,
      default() {
        return ''
      }
    },
    // 配置项
    options: {
      type: Object,
      default() {
        return {
          maxNumber: 99,
          size: 'medium' // 计时器组件的尺寸
        }
      }
    }
  },
  methods: {
    selectCount(type) {
      const self = this
      const MAX = self.options.maxNumber
      const MIN = 1
      let n = self.count
      if (type === 'add' && n <= MAX) {
        self.count++
      } else if (type == 'reduct' && n > MIN ) {
        self.count--
      }
      self.$emit('select-count', self.count)
    }
  },
  created() {
    this.$emit('select-count', this.count)
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';
@import '~styles/scss/core/element.scss';
@import '~styles/scss/core/utils.scss';

.medium {
  width: mobileSize(200px);
  height: mobileSize(76px);
}
.m-select-number {
  @include selectNumber();
}
</style>


