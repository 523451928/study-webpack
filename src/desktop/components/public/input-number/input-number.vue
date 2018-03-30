<template>
  <div class="u-input-number" flex="dir:left corss:top">
    <div class="input-wrap">
      <input type="text" v-model="selectNumber" @input="inputNumber()">
    </div>
    <div class="change-num" flex="dir:top box:mean main:center cross:center">
      <div class="add" @click="changeNum('add')">+</div>
      <div class="subtract" @click="changeNum('subtract')">-</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      selectNumber: 1
    }
  },
  methods: {
    changeNum(type) {
      let n = this.selectNumber
      switch (type) {
        case 'add':
          if (n >= 99) {
            layer.toast('最多选择99件')
            return
          }
          this.selectNumber++
          break;
        default:
          if (n <= 1) {
            layer.toast('至少选择一件')
            return
          }
          this.selectNumber--
          break;
      }
      this.$emit('selectNumber', this.selectNumber)
    },
    inputNumber() {
      const REGE = /^[0-9]*$/
      if (!REGE.test(this.selectNumber)) {
        layer.toast('请输入数字')
        return
      }
      if (Number(this.selectNumber) >= 99) {
        this.selectNumber = 99
      } else if (Number(this.selectNumber) < 0) {
        this.selectNumber = 1
      }
      this.$emit('selectNumber', this.selectNumber)
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~../../../styles/scss/public/variable.scss';
.u-input-number {
  width: 84px;
  height: 45px;
  box-sizing: border-box;
  border: 1px solid $c-bc-1;
  >.input-wrap {
    box-sizing: border-box;
    width: 58px;
    >input {
      width: inherit;
      height: 100%;
      border: none;
      overflow: hidden;
      text-align: center;
    }
  }
  >.change-num {
    width: 24px;
    border-left: 1px solid $c-bc-1;
    cursor: pointer;
    background-color: $c-bg-2;
    >div {
      width: 100%;
      text-align: center;
      color: $c-fc-2;
    }
    >.add {
      border-bottom: 1px solid $c-bc-1;
    }
  }
}
</style>


