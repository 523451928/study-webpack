<template>
  <div class="m-edit-pop">
    <div class="box">
      <div class="head">
        <div class="select">已选择({{current.length}}/6)</div>
        <div class="close" @click="closePop">
          <i class="wa wa-close"></i>
        </div>
      </div>
      <div class="content">
        <ul class="mat-list" v-if="matType === 'line'">
          <li class="mat-item" v-for="(item, index) in material2" :class="isSelect(item.Id) && 'current'" @click="onSelect(item.Id)">
            <img :src="$request.thumb('material', item.Id, 120, item.Icon)" alt="img">
          </li>
        </ul>
        <ul class="mat-list" v-if="matType === 'mat'">
          <li class="mat-item" v-for="(item, index) in material2" :class="isSelect(item.Property.OptionId) && 'current'" @click="onSelect(item.Property.OptionId, item)">
            <img :src="$request.thumb('material', item.Property.OptionId, 120, item.Property.Icon)" alt="img">
          </li>
        </ul>
      </div>
      <div class="footer">
        <div class="u-btn btn" @click="closePop">
          <p>取消</p>
        </div>
        <div class="u-primary-btn btn" @click="onEmit">
          <p>确认</p>
        </div>
      </div>
    </div>
    <div class="bg" @click="closePop">
    </div>
  </div>
</template>

<script>
  const MAX_SIZE = 6
  /* eslint-disable */
  import {
    categoryImgSize,
    DecorativeCategories as dc,
    MaterialTypes as mt,
    Angles,
    StackLines,
    Fulls,
    tabs,
    product,
    Directions,
    SuggestSize as ss
  } from "scripts/utils/custom/consts.js"; // 一些常量
  export default {
    props: {
      // 展开的物料显示,可能是线条,也可能是卡纸
      material: {
        type: Array
      },
      // 判断物料类型
      matType: {
        type: String
      },
      // 选中的id
      currents: {
        type: Array,
        default: []
      },
      id: {
        type: Number
      }
    },
    data() {
      return {
        windowH: window.innerHeight,
        body: document.body,
        current: this.currents,
        material2: undefined
      }
    },
    methods: {
      closePop() {
        this.$emit('closePop', false)
      },
      isSelect(id) {
        return this.current.some(i => {
          if (i === id) return true
        })
      },
      onSelect(id, item) {
        if (this.current.indexOf(id) !== -1) {
          if (this.current.length === 1) {
            // layer.toast('至少选择一个')
            this.$notify({
              type: 'wa-warning',
              text: '至少选择一个'
            })
          } else {
            let i = this.current.indexOf(id)
            this.current.splice(i, 1)
          }
        } else {
          if (this.current.length === MAX_SIZE) {
            this.$notify({
              type: 'wa-warning',
              text: '最多选择六个'
            })
          } else {
            this.current.push(id)
          }
        }
      },
      onEmit() {
        let c = this.current
        let t = this.matType
        let o = {
          type: t,
          current: c
        }
        this.$emit('save-material', {
          type: t,
          current: c
        })
        // this.$emit('closePop', false)
      }
    },
    computed: {
      matList() {
        return []
      }
    },
    created() {
      let b = this.body
      b.style.height = this.windowH + 'px'
      b.style.overflow = 'hidden'
      this.material2 = this.material.filter(v => v)
    },
    beforeDestroy() {
      let b = this.body
      b.style.height = 'auto'
      b.style.overflow = 'visible'
    }
  }
</script>

