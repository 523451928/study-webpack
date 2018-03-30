<template>
  <label class="wa-switch">
    <input class="wa-switch-input" :disabled="disabled" @change="$emit('change', currentValue)" type="checkbox" v-model="currentValue">
    <span class="wa-switch-core"></span>
    <div class="wa-switch-label"><slot></slot></div>
  </label>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'wa-switch',
    props: {
      value: Boolean,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      currentValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

<style>
  .wa-switch{
    position: relative;
  }
  .wa-switch-input{
    display: none;
  }
  .wa-switch-input:checked+.wa-switch-core{
    border-color: #74A647;
    background: #74A647;
  }
  .wa-switch-core{
    display: inline-block;
    position: relative;
    width: 38px;
    height: 22px;
    border: 1px solid #d9d9d9;
    border-radius: 11px;
    box-sizing: border-box;
    background: #d9d9d9;
  }
  .wa-switch-input:checked+.wa-switch-core:before{
    transform: scale(0);
  }
  .wa-switch-input:checked+.wa-switch-core:after{
    transform: translateX(16px);
  }
  .wa-switch-core:before{
    width: 36px;
    height: 20px;
    background-color: #fdfdfd;
  }
  .wa-switch-core:after, .wa-switch-core:before{
    content: " ";
    top: 0;
    left: 0;
    position: absolute;
    transition: transform .3s;
    border-radius: 10px;
  }
  .wa-switch-core:after{
    width: 20px;
    height: 20px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,.4);
  }
</style>
