/*eslint-disable*/
import Vue from 'vue'
/**
 * 初始化一个Vue实例,绑定到全局实例中去,作为数据共享
 *
 * @param      {Object}  http    全局封装的HTTP方法
 * @return     {Vue}     返回一个Vue实例
 */
export function initPublicData(http) {
	return new Vue({
		data() {
			return {
			}
		},
		created() {
		},
		methods: {
			/**
			 * 公共组件做通信处理
			 *
			 * @param      {<string>}    event     事件名称
			 * @param      {Function}  callback  The 回调函数
			 * @return     {<type>}    { description_of_the_return_value }
			 */
			onBus(event, callback) {
				this.$on(event, callback)
				return () => this.$off(event, callback)
			}
		} 
	})
}