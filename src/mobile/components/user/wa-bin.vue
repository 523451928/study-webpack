<template>
  <div class="warp">
    <div class="profile-head">
      <a href="./user.html" class="pull-left back">
        <i class="wa wa-left"></i>返回
      </a>蛙币
    </div>
    <div class="balance-panel">
      <div class="top">
        <span class="desc">
          墙蛙网账户可用蛙币
          <strong>{{waObj.Available / 100}}</strong> 元
        </span>
        <a href="/faq.html" class="link pr20">常见问题</a>
      </div>
    </div>
  </div>
</template>
<script>
  import { InterfaceMap as Interf } from 'scripts/interfaceConst'
  export default {
    data() {
      return {
        waObj: []
      }
    },
    mounted() {
      let self = this
      request({ url: Interf.getBalance }).then(res => {
        self.waObj = res.take('Data')
      })
    }
  }
</script>
