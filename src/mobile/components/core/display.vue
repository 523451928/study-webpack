<template>
  <div :class="[defaultClass, adClass]">
    <a :href="href">
      <component class="product-box"
     :length="100"
     :keep-alive="false"
     :is="displayer"
     :canvas="'Custom'"
     :editstatus="false"
     :displays="display"
     :pictures="picture"
     :entry = "entry"
     :isproduct="false">
    </a>
    <div class="info" flex="dir:left cross:center main:justify">
      <div class="price">¥{{Math.floor(money/100)}}</div>
      <div class="like-box" flex="dir:left cross:center">
        <i class="wa-heart-fill wa" :class="liked&&'liked'"></i>
        <span class="like-count">{{likeCount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { newCustom } from "../custom/core/custom" // custom组件 核心s
import DisplayComponents from "components/custom/display/components" 
import { getDisplayer } from "components/custom/display/display-util" // 判断当前品类应该用哪个物料渲染模版
import { mergeCategory, filterIncomeMat, picVersaSerialization } from "scripts/core/utils.js" // 常见的工具类方法
import { getEntries } from 'components/custom/display/entry.js'
import {
  DecorativeCategories as dc,
  MaterialTypes as mt,
} from "scripts/utils/custom/consts.js" // 一些常量
export default {
  data() {
    return {
      custom: newCustom(),
      isrender: false,
      defaultClass: 'm-display'
    }
  },
  props: {
    // 单品id
    entryId: {
      type: Number,
      default() {
        return 559
      }
    },
    // 新品类的产品id
    productId: {
      type: Number,
      default() {
        return 0
      }
    },
    // 品类id
    categoryId: {
      type: Number,
      default() {
        return 1
      }
    },
    // 图片数据
    pictures: {
      type: Array,
      default() {
        return [
          {
            DPI: 100,
            Image: {
              File: "9ad69916ddc8c3b5ef148aeddc5e3966-1920x1080.jpg",
              Id: 103
            },
            ImageFile: "9ad69916ddc8c3b5ef148aeddc5e3966-1920x1080.jpg",
            ImageId: 103,
            Index: 0,
            OutPut: {
              Full: 2,
              Size: [220, 220]
            },
            Rotate: 0,
            ScaleX: 81,
            ScaleY: 81,
            TranslateX: 0,
            TranslateY: 0
          }
        ]
      }
    },
    // 作品id
    workId: {
      type: Number,
      default() {
        return 90
      }
    },
    // display数据
    displays: {
      type: Array,
      default() {
        return [{
          Back: "#FFF-1020x1020",
          Fore: "082039f1f29eae9f0e9d93943d0b75dc-1496x1496.png",
          Hole: [0, 0, 0, 0],
          Left: 238,
          Top: 238,
          Type: 0
        }]
      }
    },
    // 是否喜欢
    liked: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 喜欢的数量
    likeCount: {
      type: Number,
      default() {
        return 10
      }
    },
    // 价格
    money: {
      type: Number,
      default() {
        return 7600
      }
    }
  },
  computed: {
    href() {
      return `/work/${this.workId}?CategoryId=${this.categoryId}`
    },
    displayer() {
      return getDisplayer(this.entry)
    },
    display() {
      if (this.displays.constructor === Array) {
        return this.displays[0]
      } else if (this.displays.constructor === Object) {
        return this.displays
      }
    },
    picture() {
      return picVersaSerialization(this.pictures)
    },
    entry() {
      let res = {}
      res['Id'] = Number(this.entryId)
      res['CategoryId'] = Number(this.categoryId)
      if (this.productId) {
        res['ProductId'] = Number(this.productId)
      }
      if (Number(this.categoryId) === dc.Rimless) {
        let display = this.display
        res.Decorative = {}
        res.Decorative.Stack = this.display.Stack
        res.Decorative.Thick = this.display.Thick
        res.Decorative.Size = this.picture[0].Output.Size
      }
      return res
    },
  },
  components: {
    ...DisplayComponents
  },
  mounted() {
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';
@import '~styles/scss/core/utils.scss';

.m-display {
  padding: .1rem 0;
  background-color: $c-nc-1;
  border: 1px solid $c-bc-1;
  border-radius: 2px;
   > a {
     margin-bottom: mobileSize(40px);
     display: block;
     >.product-box {
       margin: 0 auto;
     }
   }
   >.info {
     padding: 0 10px;
     .price {
       color: $c-jxc-4;
     }
     .like-box {
       color: $c-fc-3;
       >.wa {
         &.liked {
           color: $c-jxc-2;
         }
       }
     }
   }
}
</style>

