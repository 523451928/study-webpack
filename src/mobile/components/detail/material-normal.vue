<!-- Copyright Wallwa.com. All rights reserved. -->
<template>
  <div class="bom ">
    <h3 class="tit active">{{name}} <span v-if="fixTextBom" class="fixed-text-bom">{{selects[0].Name}}</span></h3>
    <div v-if="!fixTextBom">
      <ul class="cont size-cont" v-if="isSize" style="display: block;">
        <li v-for="s in selects" @click = "selectMaterial(s)" class="item bom-item text" :class="{'active': isChecked(s)}">
          <list-item :name="getName(s)" ></list-item>
        </li>
      </ul>
      <ul class="cont" v-else style="display: block;">
        <li v-for="s in selects" @click = "selectMaterial(s)" class="item bom-item icon" :class="{'active': isChecked(s)}">
          <list-item :id="s.Id" :name="s.Name" :icon="s.Icon"></list-item>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ListItem from './list-item'
import {MaterialTypes as mt, DecorativeCategories as dc} from 'scripts/utils/custom/consts'
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
      case mt.Canvas:
        this.fixTextBom = true
        break
    }
  },
  methods: {
    isChecked(s) {
      let checked = false
      let using = this.using
      if (this.isSize) {
        checked = using[0] === s[0] && using[1] === s[1]
      } else {
        checked = s.Id === using.Id
      }
      return checked
    },
    getName(m) {
      let size = m
      return size[0] / 10 + 'x' + size[1] / 10 + 'cm'
    },
    selectMaterial(m) {
      let self = this
      let param = {}
      param.material = m
      param.catId = self.catId
      if (self.isSize) {
        param.type = 'size'
        self.checkingSize = m
      } else {
        param.type = 'material'
        self.checkingId = m.Id
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
    isSize() {
      let type = this.bomType
      return type === mt['Size']
    },
    isScrollCanvas() {
      let type = this.bomType
      let catId = this.catId
      return type === mt['Canvas'] && catId === dc['Scroll']
    }
  }
}
</script>
