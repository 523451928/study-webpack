<template>
	<div class="page-1 page" ref="homePage">
    <div class="background">
      <component class="mobile product" ref='display' v-if="custom.entries.length>0" :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="editStatus" :entry="custom.current.entry" :displays="custom.displays" :pictures="custom.current.pictures" :xi="custom.xi" :di="custom.di" :isPc="false"></component>
      <div class="product-info">
        <h5 class="product-name" v-if="custom.entries.length>0">{{custom.current.entry.Name}}</h5>
        <p class="author-name">小花</p>
      </div>
    </div>
    <div class="more icon">
      <img src="/src/desktop/assets/images/icon/ic-bottom-next.png">
    </div>
  </div>
</template>

<script>
import {newCustom} from '../custom/core/custom'
import { getDisplayer } from '../custom/display/display-util'
import Displays from '../custom/display/components.js'
import * as customUtils from 'scripts/utils/custom/utils.js'
export default {
	data() {
		return {

		}
	},
	components: {
    ...Displays
  },
	props: {
		custom: {
			type: Object,
			default: {}
		}
	}
}
</script>