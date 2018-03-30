// Copyright 2016 Chen Xianren. All rights reserved.

// 引入display组件
import displayComponents from './display/components'
// 导入物料相关组件
import materialComponents from './material/index.js'
// 导入public公用组件
import ListItem from './material/list-item'
// 导入页面其他组件
import Scrollbar from './scroll-bar.vue'
// 导入custom页面特有的组件
import CustomProDetail from './custom-pro-detail'

export const mixin = {
  components: {
    ListItem,
    Scrollbar,
    CustomProDetail,
    ...materialComponents,
    ...displayComponents
  }
}
