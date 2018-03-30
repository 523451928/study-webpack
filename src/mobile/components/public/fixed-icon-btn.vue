<template>
  <a class="fixed-icon-btn" href="../cart.html">
    <i :class="'wa wa-' + icon"></i>
  </a>
</template>
<script>
  export default {
    data() {

    },
    props: {
      icon: {
        type: String,
        required: true,
        default: 'shopping-cart'
      }
//      link: {
//        type: String,
//        default: '#'
//      }
    }
  }
</script>
<style lang="sass">
  .fixed-icon-btn {
    position: fixed;
    display: block;
    right: 10px;
    bottom: 70px;
    width: 38px;
    height: 38px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    z-index: 101;
    .wa {
      font-size: 25px;
      color: #fff;
      text-align: center;
      vertical-align: middle;
      margin-left: 50%;
      margin-top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
