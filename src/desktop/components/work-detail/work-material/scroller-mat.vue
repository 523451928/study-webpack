<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
    <div class="size-scroller m-material">
        <div class="scroller-header clearfix">
            <span class="bom-type">尺寸:</span>
        </div>
        <ul ref="size" class="scroll-list edit-size scroll-text-list clearfix" v-show="sizeShow">
            <li v-for="s of m2.sizes" :class="getSizeClass(s)" @click="selectSize(s, 'size')">
                <div class="li-name size">{{formatSize(s)}}</div>
            </li>
        </ul>
        <div class="mats-scroller">
            <overflow-box :bom-length="stack > 0 ? options.length : 0" v-ref:overflower>
                <div class="scroller-header clearfix">
                    <span class="bom-type">
                    卡纸:
                    </span>
                </div>
                <div class="mat-box" v-show="matShow">
                    <!-- <ul v-if="stack > 0" class="scroll-list scroll-icon-list clearfix" ref="shape" v-show="view === 'shape'">
                        <li v-for="i of shapes" :class="getMixClass(i)" @click="selectMix(i)" :style="getMixStyle(i)">
                            <list-item :id="i.id" :name="i.name" :icon="i.icon"></list-item>
                        </li>
                    </ul> -->
                    <ul  class="scroll-list scroll-icon-list clearfix" ref="color">
                        <li @click="changeOption2()" :class="getOptionClass2()">无卡纸</li>
                        <li v-for="i of userOptions" :class="getOptionClass(i)" @click="changeOption('set', i)">
                            <list-item :id="i.Property.OptionId" :name="i.Property.Value" :icon="i.Property.Icon"></list-item>
                        </li>
                    </ul>
                    <!-- <p v-if="stack === 0" class="no-stack">无卡纸</p> -->
                </div>
            </overflow-box>
            <toast :show.sync="show" :message="message" :time="2" :icon="false" :mask="false" :cancel="true"></toast>
        </div>
    </div>
</template>

<script>
    /* eslint-disable */
    import { filterFramesSize } from 'scripts/core/utils.js'
    import {
        DecorativeCategories as dc,
        MaterialTypes as mt,
        Angles,
        Directions,
        Degrees,
        Fulls
    } from 'scripts/utils/custom/consts.js'
    import {
        equalOption,
        equalSize,
        copySize,
        swapSize,
        formatSize,
        sizeShape,
        parseSize
    } from 'scripts/utils/custom/utils.js'
    import {
        freshMatOptions
    } from 'components/custom/core/entry.js'
    import {
        filterTypeMat
    } from 'scripts/utils/custom/material.js'
    import {
        mixin
    } from './scroller-util'
    import MatStack from './mat-stack'
    import ScrollPop from './scroll-pop'
    import {
        fitSize
    } from 'components/custom/picture/picture.js'
    function getMax(categoryId) {
        switch (categoryId) {
            case dc.Frame:
                return 3
            case dc.MultiHole:
                return 1
        }
    }
    export default {
        components: {
            MatStack,
            ScrollPop
        },
        mixins: [mixin],
        props: {
            fix: {
                type: Array
            },
            pic: {
                type: Object
            },
            userOptions: { type: Array },
            matData: { type: Array }
        },
        data() {
            return {
                type: 'mat',
                view: 'shape',
                index: 0,
                show: false,
                message: '',
                sizeShape: 'h',
                targetkey: 'size-shape',
                sizeShow: true,
                matShow: true,
                popShow: false,
                materials: undefined
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
                let s
                let rs
                if (x.mat.Type === mt.Size) {
                    s = x.mat.Size
                } else if (x.mat.Type === mt.Mat) {
                    s = x.mat.Properties.Size
                }
                switch (x.mat.Type) {
                    case mt.Size:
                        rs = copySize(x.mat.Size)
                        break
                    case mt.Mat:
                        rs = x.angle === Angles.Left || x.angle === Angles.Right ?
                            swapSize(s) : copySize(s)
                }
                this.sizeShape = sizeShape(rs)
                return rs
            },
            m2() {
                return this.matData
            },
            // m2() {
            //     if (this.no) return {} //
            //     let holes = new Array(3).fill(0) //  每个形状属性下的卡纸数量
            //     let sizes = {
            //         h: [],
            //         v: [],
            //         s: []
            //     } // 尺寸
            //     let mixs = [] // 合并后卡纸数组
            //     let push = (shapeArray, s) => { // 判断是否有重复的  若没有  把SIZE放到对应的SHAPEARRAY
            //         for (let i of shapeArray) {
            //         if (equalSize(i, s)) return
            //         }
            //         shapeArray.push(s)
            //     }
            //     let fix = this.fix
            //     if (fix) push(copySize(fix))
            //     let imageSize
            //     if (this.pic) {
            //         imageSize = parseSize(this.pic.Image.File)
            //         if (this.pic.Image.Info.Rotate / 90 % 2 === 1) {
            //             imageSize = swapSize(imageSize)
            //         }
            //     }
            //     let f = (size, hole) => {
            //         if (hole && this.current.categoryId !== dc.Matless) {
            //         size = hole
            //         }
            //         let filterStatusByImage = true
            //         let dpi = window.$categories.get(this.current.categoryId).DPI
            //         if (this.pic) {
            //             filterStatusByImage = fitSize({Full: Fulls.Always, Size: size}, imageSize, dpi)
            //         }
            //         return (!fix || equalSize(fix, size)) && filterStatusByImage
            //     }
            //     this.materials.forEach(v => {
            //         let s, h
            //         if (v.Type === mt.Size) {
            //         //  初始化SIZE相关
            //             s = copySize(v.Size)
            //             if (f(s)) {
            //                 push(sizes[sizeShape(s)], s)
            //                 holes[0]++
            //                 //  每一个SIZE默认插入一个无卡纸的
            //                 mixs.push({
            //                 hole: 0,
            //                 size: s,
            //                 mat: {
            //                     Type: mt.Size,
            //                     Size: s
            //                 },
            //                 name: '无卡纸',
            //                 angle: Angles.Up
            //                 })
            //             }
            //             s = swapSize(v.Size) //  后台取到的数据是去重的，任一个横行的SIZE可转成对应竖形  反之亦然
            //             if (equalSize(s, v.Size)) return
            //             if (f(s)) {
            //                 push(sizes[sizeShape(s)], s)
            //                 holes[0]++
            //                 mixs.push({
            //                 hole: 0, // 单孔  多孔
            //                 size: s, //  对应SIZE
            //                 mat: {
            //                     Type: mt.Size,
            //                     Size: s
            //                 }, //  卡纸
            //                 name: '无卡纸',
            //                 angle: Angles.Up // 卡纸 和后台对应卡纸的旋转状态  0：top 90:left 180:down 270:right 现在只有正和反
            //                 })
            //             }
            //         } else if (v.Type === mt.Mat) {
            //         //  初始化卡纸
            //         h = v.CategoryId === dc.Frame ? 1 : (v.CategoryId === dc.MultiHole ? 2 : -1) //  判断形状里的状态 无卡纸  单孔  多孔
            //         if (h === -1) return
            //         s = copySize(v.Properties.Size)
            //         let holeSize = v.Properties.Hole && v.Properties.Hole.slice(0, 2)
            //         if (f(s, holeSize)) {
            //             push(sizes[sizeShape(s)], s)
            //             holes[h] += 2
            //             mixs.push({
            //                 hole: h,
            //                 size: s,
            //                 mat: v,
            //                 id: v.Id,
            //                 name: v.Name + Directions[Angles.Up],
            //                 icon: v.Icon,
            //                 angle: Angles.Up
            //                 }, {
            //                 hole: h,
            //                 size: s,
            //                 mat: v,
            //                 id: v.Id,
            //                 name: v.Name + Directions[Angles.Down],
            //                 icon: v.Icon,
            //                 angle: Angles.Down
            //             })
            //         }
            //         s = swapSize(v.Properties.Size)
            //         if (equalSize(s, v.Properties.Size)) return
            //             holeSize = v.Properties.Hole && v.Properties.Hole.slice(0, 2).reverse()
            //             if (f(s, holeSize)) {
            //                 push(sizes[sizeShape(s)], s)
            //                     holes[h] += 2
            //                     mixs.push({
            //                     hole: h,
            //                     size: s,
            //                     mat: v,
            //                     id: v.Id,
            //                     name: v.Name + Directions[Angles.Left],
            //                     icon: v.Icon,
            //                     angle: Angles.Left
            //                     }, {
            //                     hole: h,
            //                     size: s,
            //                     mat: v,
            //                     id: v.Id,
            //                     name: v.Name + Directions[Angles.Right],
            //                     icon: v.Icon,
            //                     angle: Angles.Right
            //                 })
            //             }
            //         }
            //     })

            //     for (let ss in sizes) {
            //         sizes[ss].sort((i, j) => {
            //         let x = sizeShape(j).localeCompare(sizeShape(i))
            //         if (x === 0) return i[0] - j[0] || i[1] - j[1]
            //         return x
            //         })
            //     }
            //     // bubble
            //     let n = mixs.length
            //     let t
            //     for (let i = 0; i < n; i++) {
            //         for (let j = 0; j < n - 1; j++) {
            //         if (mixs[j + 1].hole < mixs[j].hole) {
            //             t = mixs[j + 1]
            //             mixs[j + 1] = mixs[j]
            //             mixs[j] = t
            //         }
            //         }
            //     }
            //     n = 0
            //     holes.forEach(v => {
            //         if (v > 0) n++
            //     })
            //     let _sizes = []
            //     for (let i in sizes) {
            //         _sizes = _sizes.concat(sizes[i])
            //     }
            //     let _m = this.materials.filter(v => v.Type === mt.Mat)
            //     let _sizes2 = filterFramesSize(_sizes, this.entrys)
            //     // 首先遍历entrys
            //     // 首先判断是不是无卡画
            //     return {
            //         holes: n,
            //         sizes: _sizes2,
            //         mixs: mixs
            //     }
            // },
            shapes() {
                if (this.no) return
                let a = this.m2.mixs
                let s = this.size
                let b
                if (a && s) b = a.filter(v => equalSize(s, v.size))
                return b.length >= 6 ? b.splice(0, 6) : b
            },
            options() {
                if (this.no) return
                let mat = this.material.mat
                if (mat.Type === mt.Mat) {
                    return this.userOptions.filter(item => {
                        let id1 = item.Property.OptionId
                        for (let k of mat.Properties.Options) {
                            let id2 = k.Property.OptionId
                            if (id1 === id2) {
                                return item
                            }
                        }
                    })
                    // return mat.Properties.Options
                }
            },
            currents() {
                let s = this.current.selects
                let r = []
                for (let v of s) {
                    if (v.Type === 'mat') {
                        v.mat.Properties.Options.forEach(i => {
                            r.push(i.Property.OptionId)
                        })
                    }
                }
                return r
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
            this._d = _.mergeFuncs(
                this.$onBus('scroll-to', (t, v) => {
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
        created() {
        },
        methods: {
            formatSize: formatSize,
            material2() {
                let current = this.current
                let mat = this.allMat.filter(v => v.Type === mt.Mat && v.CategoryId !== dc.MultiHole)
                const id = current.selects.filter(v => v.Type === 'mat')[0].mat.Id
                let f = mat.filter(v => {
                    return v.Id === id
                })[0]
                this.materials = f.Properties.Options
            },
            showMatDetail(m) {
                this.$bus.$emit('show-material-detail', m)
            },
            closePop(t) {
                this.popShow = t
            },
            togglePop(type) {
                if (type) this.material2()
                this.popShow = type
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
                // if (this.no) return
                // let size
                // if (this.catId === dc.Matless) {
                //     size = this.material.mat.Size
                // } else {
                //     if (this.material.angle === Angles.Up || this.material.angle === Angles.Down) {
                //         size = this.material.mat.Properties.Size
                //     } else {
                //         size = [this.material.mat.Properties.Size[1], this.material.mat.Properties.Size[0]]
                //     }
                // }
                // if (i[0] === size[0] && i[1] === size[1]) {
                //     return ['active']
                // }
                // // let a = ['size-shape-' + sizeShape(i)]
                // // equalSize(this.size, i) && a.push('active')
                // // return a.join(' ')
            },
            getOptionClass(i) {
                if (this.no) return
                let o = this.material.options
                if (equalOption(o[this.index], i, true)) return 'active'
            },
            getOptionClass2() {
                if (this.no) return
                if (this.material.mat.Type === mt.Size) {
                    return 'active'
                }
            },
            changeOption(action, i) {
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
                this.$emit('select-material', {
                    Type: this.type,
                    mat: x.mat,
                    angle: x.angle,
                    options: o
                })
            },
            selectMix(i, triggerBom) {
                if (this.no || this.isActiveMix(i)) return
                let x = this.material
                let y = {
                    Type: this.type,
                    mat: i.mat
                }
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
                this.$emit('select-material', y, triggerBom)
            },
            selectMix2(i, triggerBom) {
                if (this.no || this.isActiveMix(i)) return
                let x = this.material
                let y = {
                    Type: this.type,
                    mat: i.mat
                }
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
                this.$emit('select-income', y, triggerBom)
            },
            selectSize(i, triggerBom) {
                if (this.no || equalSize(this.size, i)) return
                let x = this.material
                let match = 0
                let j, n, mix
                for (j of this.m2.mixs) {
                    if (equalSize(j.size, i)) {
                        n = x.mat.Type ? (j.mat.CategoryId === x.mat.CategoryId ?
                            (j.angle === x.angle ? 8 : 7) : (j.mat.CategoryId === dc.Frame ?
                                (j.angle === x.angle ? 6 : 5) : 4)) : (j.mat.CategoryId === dc.Frame ?
                            (j.angle === x.angle ? 3 : 2) : 1)
                        if (match < n) {
                            match = n
                            mix = j
                        }
                    }
                }
                if (mix) this.selectMix2(mix, triggerBom)
            },
            changeOption2() {
                this.$emit('select-options', 'none')
            },
            saveMaterial(c) {
                this.$emit('save-material', c)
            },
            getSize(m) {
                if (!m.mat) return
                let size
                if (m.mat.Type === mt.Mat) {
                    if (m.angle === Angles.Up || m.angle === Angles.Down) {
                        size = m.mat.Properties.Size
                    } else {
                        size = [m.mat.Properties.Size[1], m.mat.Properties.Size[0]]
                    }
                } else if (m.mat.Type === mt.Size) {
                    size = m.mat.Size
                }
                return size
            },
            // 切换尺寸
            selectIncome(m) {
                this.$emit('select-income', m)
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
.no-stack
  text-align center
  width 100%
  font-size 32px
  color #777
</style>
