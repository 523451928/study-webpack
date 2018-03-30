<template>
  <div class="m-slider">
    <range v-model="scale" :end-func="endFun" :step="5"></range>
  </div>
</template>

<script>
/* eslint-disable */
let Range = require('components/range/index.vue')
// import Range from 'components/range/index.vue'
export default {
  data() {
    return {
      value1: 20
    }
  },
  props: {
    scale: {
      type: Number
    },
  },
  components: {
    Range
  },
  methods: {
    endFun() {
      this.$emit('endScale', this.scale)
    }
  }
}
</script>

