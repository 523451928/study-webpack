<!-- Copyright 2016 CHEN Xianren. All rights reserved. -->

<template>
  <div class="table-stage">
    <div class="cell-wrap">
      <div class="callback-wrap">
        <div class="info">
          <h2>退出成功</h2>
          <p><strong class="countdown">{{count}}</strong> 秒后自动跳转至首页！</p>
          <p><a href="/" class="uline-link">立即跳转</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 5 }
  },
  mounted() {
    request.do('POST', 'user/logout').then(res => {
      if (res.take() === true) {
        let timer = setInterval(() => {
          this.count--
          if (this.count <= 0) {
            clearInterval(timer)
            window.location.href = '/'
          }
        }, 1000)
      }
    })
  }
}

</script>
