<template>
  <transition name="scale">
    <div class="big-img-wrapper" @click="hideImg">
      <viewer :entries="displayData.Entries" :pictures="displayData.Pictures" :length="350" ref="display" :isClick="false"></viewer>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable*/
  import Viewer from 'components/custom/display/viewer.vue'
  export default {
    components: {
      Viewer
    },
    data() {
      return {
        editStatus: false
      }
    },
    props: {
      displayData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      hideImg() {
        this.$emit('hideImg')
      }
    }
  }
</script>

<style>
.scale-enter-active, .scale-leave-active {
  transition: all .5s;
}
.scale-enter, .scale-leave-active {
  opacity: 0;
}
.big-img-wrapper{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background:rgba(0,0,0,0.8);
  z-index: 1000;
}
.viewer{
  height: 100%;
}
.big-img-wrapper .display-wrapper{
  top: 50%;
  transform: translateY(-50%);
}
</style>
