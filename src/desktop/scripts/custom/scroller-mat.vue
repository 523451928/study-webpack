<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="mat-scroller">
  <div class="scroller-header">
    <scroll-to target="mat-view" :active="view"></scroll-to>
    <scroll-to v-show="view === 'size'" target="size-shape"></scroll-to>
    <scroll-to v-show="view === 'shape' &amp;&amp; m2.holes > 1" target="mat-hole"></scroll-to>
    <mat-stack v-show="view === 'color' &amp;&amp; max > 1" :max="max"
      :stack="stack" :index="index"></mat-stack>
  </div>
  <div class="scroller-title">{{getTitle()}}</div>
  <scroller v-ref:scroller>
    <ul v-el:size v-show="view === 'size'">
      <li v-for="s of m2.sizes" :class="getSizeClass(s)" @tap="selectSize(s)">
        <div class="li-name size">{{formatSize(s)}}</div>
      </li>
    </ul>
    <ul v-el:shape v-show="view === 'shape'">
      <li v-for="i of shapes" :class="getMixClass(i)" @tap="selectMix(i)" :style="getMixStyle(i)">
        <list-item :id="i.id" :name="i.name" :icon="i.icon"></list-item>
      </li>
    </ul>
    <ul v-el:color v-show="view === 'color'">
      <li v-for="i of options" :class="getOptionClass(i)" @tap="changeOption('set', i)">
        <list-item :id="i.Property.OptionId" :name="i.Property.Value" :icon="i.Property.Icon"></list-item>
      </li>
    </ul>
  </scroller>
  <toast :show.sync="show" :message="message" :time="2"
    :icon="false" :mask="false" :cancel="true"></toast>
</div>
</template>

<script>
import { DecorativeCategories as dc, MaterialTypes as mt,
  Angles, Directions, Degrees } from './consts'
import { equalOption, equalSize, copySize, swapSize,
  formatSize, sizeShape } from './util'
import { freshMatOptions } from './entry'
import { mixin } from './scroller-util'
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
    fix: {type: Array}
  },
  data() {
    return {type: 'mat', view: 'size', index: 0, show: false, message: ''}
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
      switch (x.mat.Type) {
        case mt.Size:
          return copySize(x.mat.Size)
        case mt.Mat:
          return x.angle === Angles.Left || x.angle === Angles.Right
            ? swapSize(x.mat.Properties.Size) : copySize(x.mat.Properties.Size)
      }
    },
    m2() {
      if (this.no) return {} //
      let holes = new Array(3).fill(0)
      let sizes = []
      let mixs = []
      let push = s => {
        for (let i of sizes) {
          if (equalSize(i, s)) return
        }
        sizes.push(s)
      }
      let fix = this.fix
      if (fix) push(copySize(fix))
      let f = s => !fix || equalSize(fix, s)
      this.materials.forEach(v => {
        let s, h
        if (v.Type === mt.Size) {
          s = copySize(v.Size)
          if (f(s)) {
            push(s)
            holes[0]++
            mixs.push({
              hole: 0,
              size: s,
              mat: {Type: mt.Size, Size: s},
              name: '无卡纸',
              angle: Angles.Up
            })
          }
          s = swapSize(v.Size)
          if (equalSize(s, v.Size)) return
          if (f(s)) {
            push(s)
            holes[0]++
            mixs.push({
              hole: 0,
              size: s,
              mat: {Type: mt.Size, Size: s},
              name: '无卡纸',
              angle: Angles.Up
            })
          }
        } else if (v.Type === mt.Mat) {
          h = v.CategoryId === dc.Frame ? 1
            : (v.CategoryId === dc.MultiHole ? 2 : -1)
          if (h === -1) return
          s = copySize(v.Properties.Size)
          if (f(s)) {
            push(s)
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
          // if (equalSize(s, v.Properties.Size)) return
          if (f(s)) {
            push(s)
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
      sizes.sort((i, j) => {
        let x = sizeShape(j).localeCompare(sizeShape(i))
        if (x === 0) return i[0] - j[0] || i[1] - j[1]
        return x
      })
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
  watch: {
    view(v) {
      let p = this.$parent
      p.scrollToBottom && p.scrollToBottom()
      this.nextTickScrollTo()
    }
  },
  ready() {
    switch (this.matType) {
      case mt.Mat:
        this.view = 'color'
        break
      case mt.Size:
        this.view = 'shape'
        break
    }
    this._d = this.$lodash.calls(
      this.$EE.addEvent('scroll-to', (t, v) => {
        if (!this._isAttached || this.no) return
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
            if (this.view === 'size') this.nextTickScrollTo(t + '-' + v)
            break
          case 'mat-hole':
            if (this.view === 'shape') this.nextTickScrollTo(t + '-' + v)
            break
        }
      }, this),
      this.$EE.addEvent('change-mat-stack', (action, index, stack) => {
        if (!this._isAttached || this.no) return
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
          }
          this.index = index
          this.nextTickScrollTo()
        }
      }, this))
  },
  methods: {
    formatSize: formatSize,
    scrollTo(c = 'active') {
      let s = this.$refs.scroller
      s.refresh()
      s.scrollToElement(this.$els[this.view].querySelector('li.' + c))
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
    changeOption(action, i) {
      if (this.no) return
      let x = this.material
      let o = x.options.slice()
      switch (action) {
        case 'set':
          if (equalOption(o[this.index], i, true)) return
          o.$set(this.index, i)
          break
        case 'add':
          o.push(o.length > 0 ? o[o.length - 1] : this.options[0])
          break
        case 'remove':
          o.pop()
          break
      }
      this.$EE.emit('select-material', {
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
      this.$EE.emit('select-material', y)
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

<style lang='stylus'>
.mat-scroller
  margin 1rem -15px
  .scroller-header, .scroller
    margin 0 0.5rem
  .scroller-title
    margin 0.5rem
  .scroller-header .btn
    padding 0.25rem
</style>
