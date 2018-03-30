<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="li-icon" v-if="icon">
  <div class="li-color" v-if="icon[0] === '#'"
    :title="name" :style="{'background-color': icon}">
  </div>
  <div v-else class="li-image">
    <img class="lazyload" :alt="name" :title="name"
      :src="thumb()">
  </div>
</div>
<div class="li-name" v-else>{{name}}</div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      iconSrc: ''
    }
  },
  props: {
    size: {type: Number, default: 120},
    id: {type: Number, default: 0},
    name: {type: String, default: ''},
    icon: {type: String, default: ''}
  },
  computed: {
    imageSize() {
      return Number(this.size)
    }
  },
  created() {
    
  },
  methods: {
    thumb() {
      // http://m.wallwa.xxx//thumbnail/image
       return `http://m.wallwa.xxx/thumbnail/image/${this.id}/${this.size}/${this.icon}`
      
    }
  }
}
</script>
