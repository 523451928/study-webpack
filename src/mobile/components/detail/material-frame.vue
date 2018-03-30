<!-- Copyright Wallwa.com. All rights reserved. -->
<!-- 有框画因为卡纸的原因把物料拆出来一个模板 -->
<template>
  <div class="bom ">
    <h3 class="tit active">{{name}} <span v-if="fixTextBom" class="fixed-text-bom">{{using.Name}}</span></h3>
    <div v-if="!fixTextBom">
      <ul v-if="isMat" class="cont line-cont" style="display: block;">
        <!--卡纸类型  *TYPE=1 图片 Type=0 颜色-->
        <li class="item bom-item icon" :class="{'active': using.Property.OptionId === 0}" @click = "selectMaterial()"><div class="li-name">无卡纸</div></li>
        <li v-for="i in selects" class="item icon" :class="{'active': i.Property.OptionId === using.Property.OptionId}"
            @click = "selectMaterial(i)">
          <list-item :id="i.Property.OptionId" :name="i.Property.Value" :icon="i.Property.Icon"></list-item>
        </li>
      </ul>
      <ul v-else class="cont line-cont" style="display: block;">
        <li v-for="s in selects" class="item bom-item icon" :class="{'active': s.Id === using.Id}"
            @click = "selectMaterial(s)">
          <list-item :id="s.Id" :name="s.Name" :icon="s.Icon"></list-item>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ListItem from './list-item'
import {MaterialTypes as mt} from 'scripts/utils/custom/consts'
export default {
  components: {ListItem},
  props: {
    bomType: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    selects: {
      type: Object,
      default: [],
      required: true
    },
    catId: {
      type: Number,
      required: true
    },
    using: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      fixTextBom: false
    }
  },
  mounted() {
    switch (this.bomType) {
      case mt.Paper:
      case mt.Glass:
        this.fixTextBom = true
        break
    }
  },
  methods: {
    selectMaterial(m) {
      let self = this
      let param = {}
      if (m) {
        //  普通物料
        param.material = m
        param.catId = self.catId
        param.type = 'material'
        if (self.isMat) {
          self.checkingId = m.Property.OptionId
        } else {
          self.checkingId = m.Id
        }
      } else {
        //  无卡纸选项
        param.material = {
          Name: '无卡纸',
          Property: {
            OptionId: 0
          }
        }
        param.catId = self.catId
        param.type = 'matLess'
      }
      self.$emit('selectMaterial', param)
    },
    setSelectBom() {
      let self = this
      let param = {}
      param.bomType = self.bomType
      param.catId = self.catId
      param.name = self.name

      self.$emit('setSelectBom', param)
    }
  },
  computed: {
    isMat() {
      let type = this.bomType
      return type === mt['Mat']
    }
  }
}
</script>
