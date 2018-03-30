<template>
  <div class="m-edit-pop">
    <div class="box">
      <div class="head">
        <div class="select">已选择({{current.length}}/{{material2.length}})</div>
        <div class="close" @click="closePop">
          <i class="wa wa-close"></i>
        </div>
      </div>
      <div class="content">
        <ul class="mat-list" v-if="type === 1">
          <li class="mat-item"  v-for="(item, index) in material2" :class="isSelect(item.Id) && 'current'" @click="onSelect(item.Id)">
            <img :src="$request.thumb('material', item.Id, 120, item.Icon)" alt="img">
          </li>
        </ul>
        <ul class="mat-list" v-if="type === 0">
          <li class="mat-item" v-if="item.Property.Icon[0] === '#'" v-for="(item, index) in material2" :class="isSelect(item.Property.OptionId) && 'current'" @click="onSelect(item.Property.OptionId, item)" :style="{'background-color': item.Property.Icon}">
          </li>
          <li class="mat-item" v-else v-for="(item, index) in material2" :class="isSelect(item.Property.OptionId) && 'current'" @click="onSelect(item.Property.OptionId, item)">
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
      // 物料
      material: {
        type: Array
      },
      // 选中物料的边框id或者是颜色id
      currents: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        windowH: window.innerHeight,
        body: document.body,
        current: this.currents,
        material2: undefined,
        type: -1,
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
        // 此处只有id
        let c = this.current
        let r = []
        c.forEach(v => {
          for (let k of this.material) {
            if (this.type === 1) {
              if (v === k.Id) {
                r.push(k)
                break
              }
            } else if (this.type === 0) {
              if (v === k.Property.OptionId) {
                r.push(k)
                break
              }
            }
          }
        })
        this.$emit('save-materials', r)
        this.$emit('closePop', false)
      },
      initType() {
        let state
        if (this.material2.every(v => v.Type === mt.Line)) {
          state = 1
        } else if (this.material2.every(v => v.Type === 0)) {
          state = 0
        }
        this.type = state
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
      this.material2 = this.material
      this.initType()
    },
    beforeDestroy() {
      let b = this.body
      b.style.height = 'auto'
      b.style.overflow = 'visible'
    }
  }
</script>

