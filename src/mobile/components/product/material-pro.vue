<!-- Copyright Wallwa.com. All rights reserved. -->
<!-- 产品是把产品数组作为第一个物料， option项作为其他物料，和装饰画区别较大 -->
<template>
  <div class="bom ">
    <h3 class="tit active">{{name}}</h3>
    <ul class="cont" style="display: block;">
      <li v-for="s in selects" @click = "selectMaterial(s)" class="item bom-item icon" :class="{'active': isActive(s)}">
        <list-item :id="s.Id" :name="s.Name" :icon="s.Icon"></list-item>
      </li>
      <li v-if="bomType !== 'product'" class="set-bom-btn icon" @click = "setSelectBom(s)">
        <span class="name">设置{{name}}</span>
        <div class="mask"></div>
      </li>
    </ul>
  </div>
</template>

<script>
  import ListItem from './list-item'
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
        type: Number,
        required: true
      }
    },
    methods: {
      selectMaterial(m) {
        let self = this
        let param = {}
        param.material = m
        param.catId = self.catId
        if (self.isOption) {
          param.type = 'productMat'
          self.checkingId = m.OptionId
        } else {
          param.type = 'product'
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
      },
      isActive(s) {
        let self = this
        let status
        let using = this.using
        if (self.isOption) {
          status = using.OptionId === s.OptionId
        } else {
          status = using.Id === s.Id
        }
        return status
      }
    },
    computed: {
      isOption() {
        let isOption = this.using.hasOwnProperty('OptionId')
        return isOption
      }
    }
  }
</script>
