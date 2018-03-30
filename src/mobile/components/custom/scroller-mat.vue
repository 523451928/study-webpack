<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div class="material-wrap">
    <div class="material-header" v-show="showHeader" >
      <!--尺寸里的方形、竖形-->
      <div class="material-size-header" >
        <scroll-to :target="'size-shape'" :active="sizeShape"></scroll-to>
      </div>
      <ul ref="size" class="scroll-list scroll-text-list clearfix">
        <li v-for="s of m2.sizes[sizeShape]" :class="getSizeClass(s)" @click="selectSize(s, 'size')">
          <div class="li-name size">{{formatSize(s)}}</div>
        </li>
      </ul>
      <!--卡纸的第几层-->
      <!--<div class="material-size-header" v-show="headerType === 'color'">-->
        <!--<mat-stack></mat-stack>-->
      <!--</div>-->
    </div>
    <!--卡纸-->
    <div class="mat-scroller" v-show="!showHeader">
      <div class="scroller-header clearfix">
        <!--卡纸第几层-->
        <mat-stack v-show="view === 'color' &amp;&amp; max > 1" :max="max"
                   :stack="stack" :index="index"></mat-stack>
      </div>
      <ul ref="scrollList" class="scroll-list scroll-icon-list scroll-wrap">
        <li class="list-item list-item-text" :class="{'active': stack == 0}" @click="noneMat">无卡纸</li>
        <li class="list-item" v-for="(i, index) in options" :class="getOptionClass(i)" @click="changeOption('set', i, index)">
          <list-item :id="i.Property.OptionId" :name="i.Property.Value" :icon="i.Property.Icon"></list-item>
        </li>
      </ul>
      <toast :show.sync="show" :message="message" :time="2"
             :icon="false" :mask="false" :cancel="true"></toast>
    </div>
  </div>
</template>
<style lang="sass">
   .list-item-text{
      width: 70px;
      height: 70px;
      line-height: 70px;
      text-align: center;
   }
   .list-item {
      img {
        width: 70px;
        height: 70px;
      }
   }
</style>
<script>
  /* eslint-disable */
  import { DecorativeCategories as dc, MaterialTypes as mt,
    Angles, Directions, Degrees } from 'scripts/utils/custom/consts'
  import { equalOption, equalSize, copySize, swapSize,
    formatSize, sizeShape } from 'scripts/utils/custom/utils'
  import { freshMatOptions } from 'scripts/utils/custom/entry'
  import { mixin } from './app/scroller-util'
  import MatStack from './mat-stack'

  function getMax(categoryId) {
    switch (categoryId) {
      case dc.Frame:
        return 3
      case dc.MultiHole:
        return 1
    }
  }

  export default {
    components: {MatStack},
    mixins: [mixin],
    props: {
      fix: {type: Array},
      showHeader: {
        type: Boolean,
        default: false
      },
      headerType: {
        type: String,
        default: 'size'
      }
    },
    data() {
      return {
        type: 'mat',
        view: 'shape',
        index: 0,
        show: false,
        message: '',
        sizeShape: 'h'
      }
    },
    computed: {
      stack() {
        if (this.no) return
        return this.material.options.length
      },
      matType() {
        if (this.no) return
        return this.material.mat.Type
      },
      max() {
        if (this.no) return
        return getMax(this.material.mat.CategoryId)
      },
      size() {
        if (this.no) return
        let x = this.material
        let s = x.mat.Properties.Size
        let rs
        switch (x.mat.Type) {
          case mt.Size:
            rs = copySize(x.mat.Size)
            break
          case mt.Mat:
            rs = x.angle === Angles.Left || x.angle === Angles.Right
              ? swapSize(s) : copySize(s)
        }
        this.sizeShape = sizeShape(rs)
        return rs
      },
      m2() {
        if (this.no) return {} //
        let holes = new Array(3).fill(0)  //  每个形状属性下的卡纸数量
        let sizes = {h: [], v: [], s: []}  // 尺寸
        let mixs = []  // 合并后卡纸数组
        let push = (shapeArray, s) => {  // 判断是否有重复的  若没有  把SIZE放到对应的SHAPEARRAY
          for (let i of shapeArray) {
            if (equalSize(i, s)) return
          }
          shapeArray.push(s)
        }
        let fix = this.fix

        if (fix) push(copySize(fix))

        let f = s => !fix || equalSize(fix, s)
        this.materials.forEach(v => {
          let s, h
          if (v.Type === mt.Size) {
            //  初始化SIZE相关
            s = copySize(v.Size)
            if (f(s)) {
              push(sizes[sizeShape(s)], s)
              holes[0]++
              //  每一个SIZE默认插入一个无卡纸的
              mixs.push({
                hole: 0,
                size: s,
                mat: {Type: mt.Size, Size: s},
                name: '无卡纸',
                angle: Angles.Up
              })
            }
            s = swapSize(v.Size)  //  后台取到的数据是去重的，任一个横行的SIZE可转成对应竖形  反之亦然
            if (equalSize(s, v.Size)) return
            if (f(s)) {
              push(sizes[sizeShape(s)], s)
              holes[0]++
              mixs.push({
                hole: 0, // 单孔  多孔
                size: s, //  对应SIZE
                mat: {Type: mt.Size, Size: s},  //  卡纸
                name: '无卡纸',
                angle: Angles.Up   // 卡纸 和后台对应卡纸的旋转状态  0：top 90:left 180:down 270:right 现在只有正和反
              })
            }
          } else if (v.Type === mt.Mat) {
            //  初始化卡纸
            h = v.CategoryId === dc.Frame ? 1
              : (v.CategoryId === dc.MultiHole ? 2 : -1)  //  判断形状里的状态 无卡纸  单孔  多孔
            if (h === -1) return
            s = copySize(v.Properties.Size)
            if (f(s)) {
              push(sizes[sizeShape(s)], s)
              holes[h] += 2
              mixs.push({
                hole: h,
                size: s,
                mat: v,
                id: v.Id,
                name: v.Name + Directions[Angles.Up],
                icon: v.Icon,
                angle: Angles.Up
              }, {
                hole: h,
                size: s,
                mat: v,
                id: v.Id,
                name: v.Name + Directions[Angles.Down],
                icon: v.Icon,
                angle: Angles.Down
              })
            }
            s = swapSize(v.Properties.Size)
            if (equalSize(s, v.Properties.Size)) return
            if (f(s)) {
              push(sizes[sizeShape(s)], s)
              holes[h] += 2
              mixs.push({
                hole: h,
                size: s,
                mat: v,
                id: v.Id,
                name: v.Name + Directions[Angles.Left],
                icon: v.Icon,
                angle: Angles.Left
              }, {
                hole: h,
                size: s,
                mat: v,
                id: v.Id,
                name: v.Name + Directions[Angles.Right],
                icon: v.Icon,
                angle: Angles.Right
              })
            }
          }
        })

        for (let ss in sizes) {
          sizes[ss].sort((i, j) => {
            let x = sizeShape(j).localeCompare(sizeShape(i))
            if (x === 0) return i[0] - j[0] || i[1] - j[1]
            return x
          })
        }
        // bubble
        let n = mixs.length
        let t
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n - 1; j++) {
            if (mixs[j + 1].hole < mixs[j].hole) {
              t = mixs[j + 1]
              mixs[j + 1] = mixs[j]
              mixs[j] = t
            }
          }
        }
        n = 0
        holes.forEach(v => {
          if (v > 0) n++
        })
        return {holes: n, sizes: sizes, mixs: mixs}
      },
      shapes() {
        if (this.no) return

        let a = this.m2.mixs
        let s = this.size
        if (a && s) return a.filter(v => equalSize(s, v.size))
      },
      options() {
        if (this.no) return
        let mat = this.material.mat
        if (mat.Type === mt.Mat) return mat.Properties.Options
      }
    },
    mounted() {
      switch (this.matType) {
        case mt.Mat:
          this.view = 'color'
          break
        case mt.Size:
          this.view = 'shape'
          break
      }
      new Loadmore({
        el: document.querySelector('.scroll-wrap'),
        scrollDirection: 'horizontal',
        elasticRolling: true
      })
      this._d = _.mergeFuncs(
        this.$onBus('show-tab', (t, v) => {
//          if (!this._isAttached || this.no) return
          if (this.no) return
          switch (t) {
            case 'mat-view':
              if (v === 'color' && this.matType === mt.Size) {
                this.show = true
                this.message = '无可选颜色'
              } else {
                this.view = v
              }
              break
            case 'size-shape':
              this.sizeShape = v
              break
            case 'mat-hole':
//              if (this.view === 'shape')
              break
          }
        }, this),
        this.$onBus('change-mat-stack', (action, index, stack) => {
//          if (!this._isAttached || this.no) return
          if (this.no) return
          if (this.view === 'color') {
            switch (action) {
              case 'touch':
                break
              case 'add':
                this.changeOption('add')
                break
              case 'remove':
                this.changeOption('remove')
                break
              case 'setMatless':
                this.changeOption('setMatless')
                break
            }
            this.index = index
          }
        }, this))
    },
    methods: {
      formatSize: formatSize,
      noneMat() {
        this.$bus.$emit('change-mat-stack', 'setMatless', undefined, 0)
      },
      getTitle() {
        if (this.no) return
        let x = this.material
        let s = formatSize(this.size)
        let f = () => {
          switch (this.matType) {
            case mt.Mat:
              return s + x.mat.Name + Directions[x.angle]
            case mt.Size:
              return s + '无卡纸'
          }
        }
        switch (this.view) {
          case 'size':
            return s
          case 'shape':
            return f()
          case 'color':
            let o = x.options[this.index]
            s = '第' + (this.index + 1) + '层'
            if (o) s = (this.max > 1 ? s : '') + o.Property.Value
            return s
        }
      },
      getMixStyle(i) {
        if (this.no) return
        if (i.icon) return 'transform: rotate(' + Degrees[i.angle] + 'deg)'
      },
      isActiveMix(i) {
        if (this.no) return
        let x = this.material
        return equalSize(this.size, i.size) && x.mat.Type === i.mat.Type &&
          ((x.mat.Type === mt.Size) || (x.mat.Type === mt.Mat &&
          x.angle === i.angle && x.mat.Id === i.mat.Id &&
          x.mat.CategoryId === i.mat.CategoryId))
      },
      getMixClass(i) {
        if (this.no) return
        let a = ['mat-hole-' + i.hole]
        if (this.isActiveMix(i)) a.push('active')
        return a.join(' ')
      },
      getSizeClass(i) {
        if (this.no) return
        let a = ['size-shape-' + sizeShape(i)]
        equalSize(this.size, i) && a.push('active')
        return a.join(' ')
      },
      getOptionClass(i) {
        if (this.no) return
        let o = this.material.options
        if (equalOption(o[this.index], i, true)) return 'active'
      },
//      卡纸子选项点击事件
      changeOption(action, i, index) {
        if (index > 2) {
          this.$refs.scrollList.scrollLeft = (index - 2) * 72
        } else {
          this.$refs.scrollList.scrollLeft = 0
        }
        if (this.no) return
        let x = this.material
        let o = x.options.slice()
        switch (action) {
          case 'set':
            if (equalOption(o[this.index], i, true)) return
            this.$set(o, this.index, i)
            break
          case 'add':
            o.push(o.length > 0 ? o[o.length - 1] : this.options[0])
            break
          case 'remove':
            o.pop()
            break
          case 'setMatless':
            o = []
            break
        }
        this.$bus.$emit('select-material', {
          Type: this.type,
          mat: x.mat,
          angle: x.angle,
          options: o
        })
      },
      selectMix(i) {
        if (this.no || this.isActiveMix(i)) return
        let x = this.material
        let y = {Type: this.type, mat: i.mat}
        if (y.mat.Type === mt.Mat) {
          y.angle = i.angle
          y.options = freshMatOptions(i.mat.Properties.Options, x.options)
          let max = getMax(y.mat.CategoryId)
          if (y.options.length >= max) y.options = y.options.slice(0, max)
          if (this.index >= max) this.index = 0
        } else {
          y.angle = x.angle
          y.options = x.options
        }
        this.$bus.$emit('select-material', y)
      },
      selectSize(i) {
        if (this.no || equalSize(this.size, i)) return
        let x = this.material
        let match = 0
        let j, n, mix

        for (j of this.m2.mixs) {
          if (equalSize(j.size, i)) {
            n = x.mat.Type ? (j.mat.CategoryId === x.mat.CategoryId
              ? (j.angle === x.angle ? 8 : 7) : (j.mat.CategoryId === dc.Frame
              ? (j.angle === x.angle ? 6 : 5) : 4)) : (j.mat.CategoryId === dc.Frame
              ? (j.angle === x.angle ? 3 : 2) : 1)
            if (match < n) {
              match = n
              mix = j
            }
          }
        }
        if (mix) this.selectMix(mix)
      }
    }
  }
</script>


