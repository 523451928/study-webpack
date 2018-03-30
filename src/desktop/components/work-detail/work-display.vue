<template>
  <div class="m-work-display">
    <a :href="href" target="_blank" flex="dir:left cross:center main:center">
      <!-- <display v-if="isrender && display && categoryId !== 2" :entry="entry" :length="220" :productId="productId" :categoryId="categoryId" :pictures="pic" :displays="display" :canvas="'custom'"></display>
      <rimless v-if="isrender && display && categoryId === 2" :entry="entry" :length="220" :productId="productId" :categoryId="categoryId" :pictures="pic" :displays="display" :canvas="'custom'"></rimless> -->
      <component v-if="isrender && display" :keep-alive="false" :is="displayer" :canvas="'WorkRow'" :editstatus="false"
               :displays="display" :pictures="pic" :entry="entry" :isproduct="false"></component>
    </a>
    <!-- <p>{{name}}</p> -->
  </div>
</template>

<script>
/* eslint-disable */
import {
  newCustom
} from "../custom/core/custom"
import {
  categoryImgSize,
  DecorativeCategories as dc,
  MaterialTypes as mt,
  DisplayTypes as dt,
  Angles,
  StackLines,
  Fulls,
  tabs,
  product,
  Directions,
  SuggestSize as ss
} from "scripts/utils/custom/consts.js"; // 一些常量
import DisplayComponents from 'components/custom/display/components.js'
import Display from 'components/custom/display/display.vue'
import Rimless from 'components/custom/display/rimless.vue'
import { getEntries } from '../custom/display/entry.js'
import {
  reversePicturesData
} from 'scripts/utils/custom/utils.js'
import {
  getDisplayer,
} from "../custom/display/display-util" 
import {
  changePicture,
  resetPicture,
  serializePicture4
} from "components/custom/picture/picture.js";
export default {
  data() {
    return {
      custom: newCustom(),
      entry: undefined, // 请求回来的entry数据
      imageInfo: undefined,
      isrender: false,
      name: undefined,
      displayStatus: dt.Default,
      pic: undefined
    }
  },
  components: {
    ...DisplayComponents,
    Display,
    Rimless
  },
  props: {
    entryId: {
      type: Number,
      default: 385
    },
    // 品类id
    categoryId: {
      type: Number,
      default: 1
    },
    // 产品id
    productId: {
      type: Number,
      default: 0
    },
    pictures: {
      type: Array,
      default: [
        {
          DPI: 100,
          ImageFile: "2509057f4d90abd868c217726e221a4f-2160x3840.jpg",
          ImageId: 4,
          Index: 0,
          Output:{
            Full: 2,
            Size: [234, 300]
          },
          Rotate: 0,
          ScaleX: 44,
          ScaleY: 44,
          TranslateX: 0,
          TranslateY: 0
        }
      ]
    },
    workId: {
      type: Number,
      default: 131
    },
    displays: {
      type: Array,
      default: [
        {
          Back: '#FFF-480x600',
          Fore: '3c3d1c086932f8ef81db8ebe78933920-828x1028.png',
          Hole: [
            0,0,0,0
          ],
          Left: 174,
          Top: 214,
          Type: 0
        }
      ]
    }
  },
  mounted() {
    // this._initDisplay().then(() => {
    //   this.custom.initialize(this.categoryId, undefined, this.entryData, [this.entryData], () => {
    //     let p = reversePicturesData([this.pictures])
    //     this.custom.entries[0].pictures = p
    //     this.isrender = true
    //   })
    // })
    this.initDisplay()
  },
  computed: {
    displayer() {
      return getDisplayer(this.entry)
    },
    _href() {
      if (this.workId) {
        return `/work?workId=${this.workId}&entryId=${this.entryId}&categoryId=${this.categoryId}`
      }
    },
    href() {
      return `/work/${this.workId}?CategoryId=${this.categoryId}`
    },
    display() {
      // if (!this.displays) return
      // if (this.displays[0].constructor === Array) {
      //   return this.displays[0]
      // } else {
      //   return this.displays
      // }
      if (!this.displays) return
      if (this.categoryId === dc.Rimless) {
        if (this.displays.constructor === Object) {
          return [this.displays]
        } else if (this.displays.constructor === Array && this.displays[0].constructor === Array){
          return this.displays[0]
        }
      } else {
        return this.displays[0]
      }
    }
  },
  methods: {
    initDisplay() {
      this.$request.get('entry', [this.entryId]).then(data => {
        let entrys = data.take('Data')
        let entry = entrys[0]
        this.entry = entry
        this.pic = [serializePicture4(this.pictures)]
        this.isrender = true
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~../../styles/scss/public/variable.scss';
.m-work-display {
  display: block;
  &:hover {
    >a {
      background-color: $c-bg-1;
    }
  }
  >a {
    margin-bottom: 10px;
    width: 230px;
    height: 230px;
    >.product-box {
      height: inherit;
    }
  }
  >p {
    text-align: center;
  }
}
</style>


