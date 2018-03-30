<template>
  <div class="wa-head">
    <img src="~images/logo/logo-wallwa-normal.png">
    <a href="/user/message.html" class="bell-wrapper">
      <span class="wa-bell"></span>
      <em class="dot"></em>
    </a>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    data() {
      return {

      }
    }
  }
</script>

<style>
  .wa-head{
    height: 44px;
    position: relative;
  }
  .wa-head img{
    height: 24px;
    margin: 8px;
  }
  .bell-wrapper{
    position: absolute;
    right: 0px;
    top: 0px;
    height: 44px;
    width: 44px;
    text-align: center;
    line-height: 44px;
  }
  .wa-bell{
    font-size: 20px;
    color: #82888a;
  }
  .dot{
    position: absolute;
    top: 11px;
    right: 15px;
    width: 4px;
    height: 4px;
    background: #ff0000;
    border-radius: 50%;
  }
</style>
