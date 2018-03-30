<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<button class="btn btn-secondary btn-sm" @click="toggleFS()">
  <i class="material-icons">{{isFS ? 'fullscreen_exit' : 'fullscreen'}}</i>
</button>
</template>

<script>
import sf from 'screenfull'
import { openToast } from 'components/prompt'

export default {
  data() {
    return {isFS: sf.isFullscreen}
  },
  methods: {
    toggleFS() {
      if (sf.enabled) {
        sf.toggle()
        this.isFS = sf.isFullscreen
      } else {
        openToast({
          mask: false,
          cancel: true,
          time: 2,
          icon: false,
          message: '全屏未启用'
        })
      }
    }
  }
}
</script>
