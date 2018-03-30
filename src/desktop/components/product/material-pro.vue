<!-- Copyright Wallwa.com. All rights reserved. -->
<!-- 产品是把产品数组作为第一个物料， option项作为其他物料，和装饰画区别较大 -->
<template>
  <div class="bom ">
    <h3 class="tit active" :class="{'normal': !singleText}">
      {{name}}
      <span v-if="singleText" class="fixed-text-bom">{{using.Value}}</span>
    </h3>
    <ul v-if="!singleText" class="cont" style="display: block;">
      <li v-for="s in selects" @click = "selectMaterial(s)" class="item bom-item" :class="{'active': isActive(s), 'text': !s.Icon, 'icon': !!s.Icon}">
        <list-item :id="s.Id" :name="s.Value" :icon="s.Icon"></list-item>
      </li>
      <!--<li v-if="bomType !== 'product'" class="set-bom-btn icon" @click = "setSelectBom(s)">-->
        <!--<span class="name">设置{{name}}</span>-->
        <!--<div class="mask"></div>-->
      <!--</li>-->
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
    data() {
      return {
        singleBom: false
      }
    },
    mounted() {
      this.singleBom = this.selects.length === 1
    },
    methods: {
      selectMaterial(m) {
        let param = {
          material: m,
          catId: this.catId,
          type: this.isOption ? 'productMat' : 'product'
        }
        this.checkingId = this.isOption ? m.OptionId : m.Id
        this.$emit('selectMaterial', param)
      },
      setSelectBom() {
        let param = {
          bomType: this.bomType,
          catId: this.catId,
          name: this.name
        }
        this.$emit('setSelectBom', param)
      },
      isActive(s) {
        let status
        let using = this.using
        if (this.isOption) {
          status = using.OptionId === s.OptionId
        } else {
          status = using.Id === s.Id
        }
        return status
      }
    },
    computed: {
      isOption() {
        return this.using.hasOwnProperty('OptionId')
      },
      singleText() {
        return this.singleBom && !this.using.Icon
      }
    }
  }
</script>
