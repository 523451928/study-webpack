/* eslint-disable */
export const mixin = {
  methods: {
    contact() {
      let userInfo = {
        uid: '', // 用户ID
        name: '访客', // 昵称
        email: '', // 信箱
        mobile: '' // 手机
      }
      if (this.$user.IsLogin) {
        request({url: 'user/improve'}).then((res) => {
          let data = res.body.Data
          userInfo = {
            uid: data.Id, // 用户ID
            name: data.Nickname, // 昵称
            email: data.Email, // 信箱
            mobile: data.Mobile // 手机
          }
        })
      }
      ysf.config(userInfo)
      ysf.open()
    }
  }
}
