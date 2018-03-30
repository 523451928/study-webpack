/* eslint-disable */
import Vue from 'vue'
import { InterfaceMap as Interf } from 'scripts/interfaceConst'

export function _user(http){
	return new Vue({
		data() {
			return {
				IsLogin: false,
				UserId: 0,
				Avatar: '',
				Nickname: '',
				CartCount: 0
			}
		},
		created() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				let self = this
				http({url: Interf.getUserHead}).then(res =>{
					let v = res.data
					if (v.UserId) {
			            self.UserId = v.UserId
			            self.IsLogin = true
			            if (v.Avatar !== '') {
			                self.Avatar = `${Interf.baseUrl}/thumbnail/avatar/${v['UserId']}/100/${v['Avatar']}`
			            } else {
			                self.Avatar = '/static/images/user/default-profile.jpg'
			            }
			            if (v.Nickname) {
			                self.Nickname = v.Nickname
			            } else {
			                self.Nickname = 'U' + v.UserId
			            }
			            self.CartCount = v.CartCount
			        }
				})
			}
		}
	})
}