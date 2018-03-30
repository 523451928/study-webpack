// Copyright 2016 Chen Xianren. All rights reserved.

import SelectImage from '../select-image'
import Loading from 'components/public/loading.vue'
import MaterialNormal from '../material-normal'
import MaterialFrame from '../material-frame'
import MaterialPro from '../material-pro'
import FrameSize from '../frame-size'
import SetBonus from '../set-bonus'
import ProductDesFrom from '../product-des-from.vue'
import ListItem from '../list-item.vue'
import Scrollbar from 'components/custom/scroll-bar.vue'

// 引入display组件
import displayComponents from 'components/custom/display/components'

export const mixin = {
  SelectImage,
  Loading,
  MaterialNormal,
  MaterialFrame,
  MaterialPro,
  FrameSize,
  ListItem,
  SetBonus,
  ProductDesFrom,
  Scrollbar,
  ...displayComponents
}
