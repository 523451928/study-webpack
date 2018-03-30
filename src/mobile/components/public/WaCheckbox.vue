<template>
  <label>
    <input class="wa-checkbox-input" :disabled="disabled" @change="$emit('change', currentValue)" type="checkbox" v-model="currentValue"/>
    <span class="ww-icon icheck cb" :class="{'checked': currentValue}" ></span>
    <slot></slot>
  </label>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'wa-checkbox',
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

<style lang="sass" >
  .wa-checkbox-input{
    display: none;
  }
  .ww-icon {
    &.icheck {
      width: 18px;
      height: 18px;
      position: relative;
      top: 3px;
      margin-right: 3px;
    &.cb {
       background: url('~images/icon/icheck-cb.png') no-repeat;
       background-position: 0 0;
       background-size: cover;
        &.checked {
         background: url('~images/icon/icheck.png') no-repeat;
         background-position: 0 0;
         background-size: cover;
       }
      }
    }
  }
</style>
