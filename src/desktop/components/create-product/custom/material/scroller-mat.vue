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
            <overflow-box v-ref:overflower>
                <div class="scroller-header clearfix">
                    <span class="bom-type">
                    卡纸:
                    </span>
                    <div class="pull-right scroll-title more" @click="togglePop(true)">查看更多</div>
                </div>
                <div class="mat-box" v-show="matShow">
                    <ul class="scroll-list scroll-icon-list clearfix" ref="color">
                        <li @click="changeOption2()" :class="getOptionClass2()">无卡纸</li>
                        <li v-for="i of userOptions" :class="getOptionClass(i)" @click="changeOption('set', i)">
                            <list-item :id="i.Property.OptionId" :name="i.Property.Value" :icon="i.Property.Icon"></list-item>
                        </li>
                    </ul>
                    <!-- <p v-if="stack === 0" class="no-stack">无卡纸</p> -->
                </div>
            </overflow-box>
            <toast :show.sync="show" :message="message" :time="2" :icon="false" :mask="false" :cancel="true"></toast>
            <scroll-pop v-if="popShow" 
            :material="colorOptions" 
            :currents="currents" 
            @closePop="closePop" 
            @save-materials="saveMaterials"></scroll-pop>
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
            current: {
                type: Object
            },
            // 整理好后的物料数据
            matData: {
                type: Object
            },
            userOptions: {
                type: Array
            }
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
            // 卡纸的层数
            stack() {
                if (this.no) return
                return this.material.options.length
            },
            matType() {
                if (this.no) return
                return this.material.mat.Type
            },
            // max() {
            //     if (this.no) return
            //     return getMax(this.material.mat.CategoryId)
            // },
            size() {
                if (this.no) return
                let x = this.material
                let s
                if (x.mat.Type === mt.Size) {
                    s = x.mat.Size
                } else if (x.mat.Type === mt.Mat) {
                    s = x.mat.Properties.Size
                }
                let rs
                switch (x.mat.Type) {
                    case mt.Size:
                        s = x.mat.Size
                        rs = copySize(x.mat.Size)
                        break
                    case mt.Mat:
                        s = x.mat.Properties.Size
                        rs = x.angle === Angles.Left || x.angle === Angles.Right ?
                            swapSize(s) : copySize(s)
                }
                this.sizeShape = sizeShape(rs)
                return rs
            },
            // shapes() {
            //     if (this.no) return
            //     let a = this.m2.mixs
            //     let s = this.size
            //     let b
            //     if (a && s) b = a.filter(v => equalSize(s, v.size))
            //     return b.length >= 6 ? b.splice(0, 6) : b
            // },
            // options() {
            //     if (this.no) return
            //     let mat = this.material.mat
            //     if (mat.Type === mt.Mat) return mat.Properties.Options
            // },
            currents() {
                let s = this.userOptions
                let r = []
                if (s.constructor === Array && s.length > 0) {
                    s.forEach(item => {
                        r.push(item.Property.OptionId)
                    })
                }
                return r
            },
            m2() {
                return this.matData
            },
            // 卡纸颜色
            colorOptions() {
                let c = this.current
                let mat = c.selects.filter(v => v.Type === 'mat')[0]
                let size
                if (mat.mat.Type === mt.Size) {
                    size = mat.mat.Size
                } else if (mat.mat.Type === mt.Mat) {
                    size = mat.mat.Properties.Size
                }
                // 找到对应尺寸下的卡纸颜色
                let m = c.materials.filter(v => {
                    return v.Type === mt.Mat && ((v.Properties.Size[0] === size[0] && v.Properties.Size[1] === size[1]) || (v.Properties.Size[0] === size[1] && v.Properties.Size[1] === size[0]))
                })[0].Properties.Options
                return m
                // return c.selects.filter(v => v.Type === 'mat')[0].mat.Properties.Options
            }
        },
        mounted() {
            // switch (this.matType) {
            //     case mt.Mat:
            //         this.view = 'color'
            //         break
            //     case mt.Size:
            //         this.view = 'shape'
            //         break
            // }
            // this._d = _.mergeFuncs(
                // this.$onBus('scroll-to', (t, v) => {
                //     if (this.no) return
                //     switch (t) {
                //         case 'mat-view':
                //             if (v === 'color' && this.matType === mt.Size) {
                //                 this.show = true
                //                 this.message = '无可选颜色'
                //             } else {
                //                 this.view = v
                //             }
                //             break
                //         case 'size-shape':
                //             this.sizeShape = v
                //             break
                //         case 'mat-hole':
                //             //              if (this.view === 'shape')
                //             break
                //     }
                // }, this),
                // this.$onBus('change-mat-stack', (action, index, stack) => {
                //     //          if (!this._isAttached || this.no) return
                //     if (this.no) return
                //     if (this.view === 'color') {
                //         switch (action) {
                //             case 'touch':
                //                 break
                //             case 'add':
                //                 this.changeOption('add')
                //                 break
                //             case 'remove':
                //                 this.changeOption('remove')
                //                 break
                //             case 'setMatless':
                //                 this.changeOption('setMatless')
                //                 break
                //         }
                //         this.index = index
                //     }
                // }, this))
        },
        methods: {
            formatSize: formatSize,
            showMatDetail(m) {
                this.$bus.$emit('show-material-detail', m)
            },
            closePop(t) {
                this.popShow = t
            },
            togglePop(type) {
                this.popShow = type
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
            getOptionClass2() {
                if (this.no) return
                if (this.material.mat.Type === mt.Size) {
                    return 'active'
                }
            },
            changeOption(action, i) {
                if (this.no) return
                let x = this.material
                // if (this.current.entry.CategoryId === dc.Frame) {
                //     x = this.material
                // } else if (this.current.entry.CategoryId === dc.Matless) {
                //     x = {
                //         Type: 'mat',
                //         angle: 0,
                //         mat: undefined,
                //         options: []
                //     }
                //     let c = this.current.selects.filter(v => v.Type === 'mat')[0]
                //     for (let k  of this.current.materials.filter(v => v.Type == mt.Mat && v.CategoryId !== dc.MultiHole)) {
                //         if (k.Properties.Size[0] === c.mat.Size[0] && k.Properties.Size[1] === c.mat.Size[1]) {
                //             x.mat = k
                //             x.options = k.Properties.Options.slice(0, 1)
                //             break
                //         } else if (k.Properties.Size[0] === c.mat.Size[1] && k.Properties.Size[1] === c.mat.Size[0]) {
                //             x.angle = Angles.Left
                //             x.mat = k
                //             x.options = k.Properties.Options.slice(0, 1)
                //             break
                //         }
                //     }
                // }
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
            // 切换到无卡纸,特殊处理
            changeOption2() {
                this.$emit('select-options', 'none')
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
            saveMaterials(c) {
                this.$emit('save-materials', c)
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
