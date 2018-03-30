<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
  <div>
    <div class="scroller-header">
      <scroll-to target="size-shape" :active="sizeShape"></scroll-to>
    </div>
    <ul class="scroll-list scroll-text-list clearfix" v-if="m2.sizes[sizeShape].length > 0">
      <li class="list-item" v-for="i of m2.sizes[sizeShape]" :class="getClass2(i)" @click="select2(i)">
        <div class="li-name size">{{formatSize(i)}}</div>
      </li>
    </ul>
    <ul v-else class="scroll-list scroll-text-list clearfix">
      <li class="list-item">暂无</li>
    </ul>
  </div>
</template>

<script>
  import { DecorativeCategories as dc, MaterialTypes as mt, Angles, Directions } from 'scripts/utils/custom/consts'
  import { mixin } from './app/scroller-util'
  import { formatSize, sizeShape, equalSize, copySize, swapSize } from 'scripts/utils/custom/utils'

  function pack(s) {
    return {Type: mt.Size, Size: s}
  }

  export default {
    mixins: [mixin],
    data() {
      return {
        type: mt.Size,
        sizeShape: 'v'
      }
    },
    mounted() {
      this._d = _.mergeFuncs(
        this.$onBus('show-tab', (t, v) => {
//          if (!this._isAttached || this.no) return
          if (t === 'size-shape') {
            this.sizeShape = v
          }
        }, this)
      )
    },
    methods: {
      formatSize,
      getTitle() {
        if (this.no) return
        let x = this.material
        return formatSize(x.Size)
      },
      isActive(i) {
        if (this.no) return
        let x = this.material
        return i.Type === mt.Size && equalSize(x.Size, i.Size)
      },
      getClass2(i) {
        return this.getClass(pack(i), 'size-shape-' + sizeShape(i))
      },
      select2(i) {
        this.select(pack(i))
      }
    },
    computed: {
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
      materials2() {
        if (this.no) return
        let a = {h: [], v: [], s: []}
        let f = s => {
          let type = sizeShape(s)
          for (let v of a[type]) {
            if (equalSize(v, s)) return
          }
          a[type].push(s)
        }
        this.materials.filter(v => v.Type === mt.Size).forEach(v => {
          f(copySize(v.Size))
          f(swapSize(v.Size))
        })
        for (var t in a) {
          a[t].sort((i, j) => {
            let x = sizeShape(j).localeCompare(sizeShape(i))
            if (x === 0) return i[0] - j[0] || i[1] - j[1]
            return x
          })
        }
        return a
      }
    }
  }
</script>
