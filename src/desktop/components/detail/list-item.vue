<!-- Copyright 2016 Chen Xianren. All rights reserved. -->
<template>
<div class="li-icon" v-if="icon">
  <div class="li-color" v-if="icon[0] === '#'"
    :title="name" :style="{'background-color': icon}">
  </div>
  <div class="li-image" v-else>
    <img class="lazyload" :alt="name" :title="name"
      :src="$thumb('material', id, 120, icon)">
  </div>
</div>
<div class="li-name" v-else>{{name}}</div>
</template>

<script>
export default {
  props: {
    id: {type: Number, default: 0},
    name: {type: String, default: ''},
    icon: {type: String, default: ''}
  }
}
</script>
