<template>
  <div class="wa-loading-wrap">
    <div class="wa-loading"></div>
  </div>
</template>

<style lang="sass">
  .wa-loading-wrap{
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    padding-top: 200px;
    z-index: 999;
    background-color: hsla(0, 0%, 100%, .9);
    .wa-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -26.5px;
      margin-top: -39px;
      width: 53px;
      height: 78px;
      background: url('~images/loading/loading.png') 0 top no-repeat transparent;
      -webkit-animation: animate_infinity 2s steps(25) infinite;
      animation: animate_infinity 2s steps(25) infinite;
    }
  }
</style>
