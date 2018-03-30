<template>
	<div class="dialog-wrap">
		<div class="dialog">
			<h5>{{title}}</h5>
			<viewer v-if="isDisplay" :entries="entries" :pictures="pictures" :length="150" :isClick="isClick"></viewer>
			<div v-if="!isDisplay" class="content">
				
			</div>
			<div class="dialog-btn" flex="dir:left cross:center box:mean">
				<div class="confirm" @click="onCallback(true)">确认</div>
				<div class="cancel" @click="onCallback(false)">取消</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
/* eslint-disable */
import Viewer from 'components/custom/display/viewer.vue'

export default {
	props: {
		photoWall: { type: Object },
    entries: { type: Array, required: true, validator: v => v.length > 0 },
    pictures: { type: Array, required: true },
    length: { type: Number, default: 200 },
    isClick: { type: Boolean, default: true}, // 是否添加点击事件
    title: {type: String, default: '默认文字'},
    isDisplay: {type: Boolean, default: false},
    id: {type: Number, default: -1}
	},
	components: {
		Viewer
	},
	methods: {
		onCallback(type) {
			if (type) {
				this.$emit('callback', this.id)
			} else {
				this.$emit('callback', type)
			}
		}
	}
}
</script>

<style lang="sass">
	.dialog-wrap{
		position: fixed;
		z-index: 3000;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.6);
		.dialog{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			width: 90%;
			max-width: 640px;
			box-shadow: 0 0 8px rgba(0, 0, 0, .1);
			border-radius: .25rem;
			background-color: #ffffff;
			>h5{
				margin: 0;
				padding: 10px 0;
				font-size: 20px;
				line-height: 2;
				text-align: center;
				border-bottom: 1px solid #f6f6f6;
			}
			>.content{
				padding: 30px;
			}
			>.viewer{
				padding: 30px;
			}
			>.dialog-btn{
				border-top: 1px solid #f6f6f6;
				height: 45px;
				>div {
					cursor: pointer;
					text-align: center;
					&.confirm{
						&:hover {
							color: blue;
						}
					}
					&.cancel{
						&:hover {
							color: red;
						}
					}
				}
			}
		}
	}
</style>