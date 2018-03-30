<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="li-icon" v-if="icon">
  <div class="li-color" v-if="isBgColor"
    :title="name" :style="{'background-color': icon}">
  </div>
  <div v-else class="li-image">
    <img class="lazyload" :alt="name" :title="name"
      :src="$request.thumb('material', id, imageSize, icon)">
  </div>
</div>
<div class="li-name" v-else>{{name}}</div>
</template>

<script>
/*eslint-disable*/
export default {
  props: {
    size: {type: Number, default: 120},
    id: {type: Number, default: 0},
    name: {type: String, default: ''},
    icon: {type: String, default: ''}
  },
  computed: {
    imageSize() {
      return Number(this.size)
    },
    isBgColor() {
      return this.icon[0] === '#' ? true : false
    }
  }
}
</script>

<style lang="sass" scoped>
.li-icon {
  width: 100%;
  height: 100%;
  .li-color {
    width: 100%;
    height: 100%;
  }
}
</style>

