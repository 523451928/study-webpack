/*eslint-disable*/
/*url-utils工具类方法*/
export class UrlUtils {
	constructor() {
		this.urlMap = new Map()
		this.initUrlData()
	}
	// 将url上的数据放在一个map类中
	initUrlData() {
		let self = this
		let search = window.location.search
		if (search.startsWith('?')) {
			search = search.slice(1)
			let a = search.split('&')
			a.forEach(item => {
				let i = item.indexOf('=')
				self.urlMap.set(item.slice(0, i), item.slice(i + 1))
			})
		} else {
			let a = search.split('&')
			a.forEach(item => {
				let i = item.indexOf('=')
				self.urlMap.set(item.slice(0, i), item.slice(i + 1))
			})
		}
	}
	// 接受一个参数,返回url上的参数
	getParams(v) {
		return this.urlMap.get(v)
	}
}