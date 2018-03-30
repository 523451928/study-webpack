<template lang="html">
  <span class="flw-text"
    v-text="followText"
    @mouseover.stop="changeText('over')"
    @mouseleave.stop="changeText('leave')"
    @click.stop="changeFollowStatus()"></span>
</template>

<script>
// import { InterfaceMap as interf } from 'scripts/interfaceConst.js'
export default {
  props: {
    isFollowed: {
      type: String,
      require: true
    },
    userId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      followStatus: this.isFollowed === 'true',
      followText: '+ 关注'
    }
  },
  mounted() {
    this.followText = this.followStatus ? '已关注' : '+ 关注'
  },
  methods: {
    changeText(action) {
      if (this.followStatus) {
        this.followText = action === 'over' ? '取消关注' : '已关注'
      }
    },
    changeFollowStatus() {
      this.$request.submit('follow/user', {
        UserId: this.userId
      }).then(res => {
        const str = res.take('Data') ? '关注成功' : '取消关注'
        const text = res.take('Data') ? '取消关注' : '关注成功'
        this.$notify({
          type: 'wa-warning',
          text: str
        })
        this.followText = text
      })
      // request({url: interf.updateFollowUser, params}).then(res => {
      //   const str = res.take('Data') ? '关注成功' : '取消关注成功'
      //   layer.toast(str)
      // }, err => {
      //   err.hide()
      //   layer.toast(err.take('Error'))
      // })
    }
  }
}
</script>

<style lang="sass">
</style>
