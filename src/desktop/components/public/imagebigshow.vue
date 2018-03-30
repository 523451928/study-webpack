<template>
	<div class="img-popups" @click="onPopHide()">
		<viewer :isOrder="isOrder" :entries="entries" :pictures="pictures" :isClick="isClick" :length="length"></viewer>
	</div>
</template>

<script type="text/javascript">
/* eslint-disable */
import Viewer from 'components/custom/display/viewer.vue'
const WINDOW_W = 1920
export default {
	data() {
		return {
			length: 800
		}
	},
	mounted() {
		let initW = window.innerWidth
		this.length = ((initW - WINDOW_W)/WINDOW_W) * this.length + this.length
		window.onresize = () => {
			let resW = window.innerWidth
			this.length = ((resW - WINDOW_W)/WINDOW_W) * this.length + this.length
		}
	},
	props: {
		photoWall: { type: Object },
    entries: { type: Array, required: true, validator: v => v.length > 0 },
    pictures: { type: Array, required: true },
    isOrder: { type: Boolean, required: false },
    isClick: { type: Boolean, default: true} // 是否添加点击事件
	},
	components: {
		Viewer
	},
	methods: {
		onPopHide() {
			this.$emit('popHide', false)
		}
	}
}
</script>

<style lang="sass">
	.img-popups {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 3000;
		cursor: pointer;
		background-color: rgba(0,0,0,0.8);
		.display-wrapper{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
		}
    .display-canvas{
      .order-img{
        max-width: 500px;
        max-height: 500px;
      }
    }
	}
</style>
