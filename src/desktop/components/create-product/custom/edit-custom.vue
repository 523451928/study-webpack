<template>
  <div class="edit-custom">
    <div class="edit-menu">
      <div class="edit-btn menu-btn" :class="selectIndex === 0 && 'active'" @click="onSelectEdit(0)">
        <i class="wa wa-pencil"></i>
        <span>编辑</span>
      </div>
      <div class="incomt-btn menu-btn" :class="selectIndex === 1 && 'active'" @click="onSelectEdit(1)">
        <i class="wa wa-discount-o"></i>
        <span>收入</span>
      </div>
    </div>
    <div class="edit-content" v-show="selectIndex === 0">
      <components v-for="bom in boms" v-if="custom" :is="tpl(bom.name)" :custom="custom" :fix="bom.fix" :key="bom.cat" :prokey="bom.prokey" :cat-id="categoryId" 
      :materials="custom.current.materials" 
      :material="custom.material(bom.name)" 
      :current="custom.current"
      :userMaterials="userMaterials"
      :userOptions="userOptions"
      :matData="matData"
      :pic="tranPic" 
      @select-material="selectMaterial"
      @save-materials="saveMaterials" 
      @select-income="selectIncome"
      @select-options="selectOptions"
      @select-image="selectImage">
      </components>
      <div class="submit u-primary-btn" @click="saveModif">保存修改</div>
      <a class="help" href="javascript:void(0)"  @click.prevent="contact" >发布遇到问题?</a>
    </div>
    <div class="edit-content" v-show="selectIndex === 1">
      <ul class="box">
        <li class="row header">
          <div class="column">
            可选品种
          </div>
          <div class="column">
            收入
          </div>
          <div class="column">
            比例
          </div>
        </li>
        <li class="row item" v-for="(item, index) in incomes" v-if="incomes.length>0">
          <div class="column size" ref="checkbox">
            <div class="m-checkbox" v-bind:class="incomes[index].select ? 'current':''" @click="toggle($event, index)">
              <i class="checkbox"></i>
            </div>
            <span class="name">{{incomeName(item)}}</span>
          </div>
          <div class="column income">
            ￥{{incomePrice(item)}}
          </div>
          <div class="column scale" v-if="item.select">
            <div class="input-wrap">
              <input type="text" @input="modifyPrice($event, item)" :value="getScale(index)">
            </div>
          </div>
          <div class="column scale" v-else>
            <div class="input-wrap">
              <input type="text" value="0" disabled="disabled">
            </div>
          </div>
        </li>
      </ul>
      <div class="control-wrap">
        <div class="slider-wrap">
          <slider-bar :scale="scale" @endScale="endScale"></slider-bar>
        </div>
        <div class="input-wrap">
          <input type="text" :value="scale" @blur = "endBlur">
        </div>
      </div>
      <div class="submit u-primary-btn" @click="saveModif">保存修改</div>
      <div class="help" @click.prevent="contact">发布遇到问题?</div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  const MAX_SIZE = 6
  import {
    newCustom
  } from "../../custom/core/custom"; // custom组件 核心
  import {
    getTypes,
    DecorativeCategories as dc,
    MaterialTypes as mt,
    DisplayTypes as dt,
    Directions,
    Angles,
  } from 'scripts/custom/consts' // 常量
  import materialComponents from './material/index.js'
  import {
    getByProperty,
    parseImageSize,
    swapSize,
    isDecorate,
    copySize,
    equalSize,
    sizeShape
  } from 'scripts/utils/custom/utils.js'
  import {
    filterTypeMat,
    filterCatIdMat
  } from 'scripts/utils/custom/material'
  import {
    buildEntry,
  } from "../../custom/core/entry"
  import {
    serializePicture
  } from 'components/custom/picture/picture.js'
  import { 
    isColorExist, 
    fitPictures, 
    saveMaterial,
		saveMatOptions,
    savePackets,
    saveIncomes
     } from './created.js'
  import { matchImgSize } from 'scripts/utils/image'
  import {mixin} from 'components/contactMixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        selectIndex: 0,
        scale: 0,
        pieces: this.propsIncomes
      };
    },
    props: {
      custom: {
        type: Object
      },
      categoryId: {
        type: Number
      },
      // 所有的物料数据
      materialList: {
        type: Array
      },
      // 序列化后的卡纸数据
      matData:{
        type: Object
      },
      // 用户选择的物料
      userMaterials: {
        type: Array,
        default: []
      },
      // 用户选择的卡纸颜色
      userOptions: {
        type: Array,
        default: []
      },
      propsIncomes: {
        type: [Array]
      }

    },
    methods: {
      onSelectEdit(type) {
        this.selectIndex = type;
        if (type === 0) {
          this.$emit('init-matData', true)
        }
      },
      selectOptions() {
        this.$emit('select-options', 'none')
      },
      toggle(e, i) {
        if (this.categoryId === dc.Frames) {
          let s
          let frame
          let matless
          let size
          let size2
          let mat
          frame = this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
          matless = this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes
          if (this.custom.current.entry.CategoryId === dc.Frame) {
            s = frame[i]
            if (!frame[i].select && frame.filter(v => v.select).length === MAX_SIZE) {
              this.$notify({
                type: 'wa-warning',
                text: `最多选择${MAX_SIZE}件`
              })
              return
            } else if ((frame[i].select && frame.filter(v => v.select).length === 1)) {
              this.$notify({
                type: 'wa-warning',
                text: `至少选择一件`
              })
              return
            } else {
              // frame[i].select === !frame[i].select
              this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes[i].select = !this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes[i].select
              mat = frame[i].custom.current.selects.filter(v => v.Type === 'mat')[0]
              if (mat.angle === Angles.Up || mat.angle === Angles.Down) {
                size = mat.mat.Properties.Size
              } else {
                size = [mat.mat.Properties.Size[1], mat.mat.Properties.Size[0]]
              }
              for(let j = 0; j < matless.length; j++) {
                size2 = matless[j].custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
                if (size2[0] === size[0] && size2[1] === size[1]) {
                  // matless[j].select = !matless[j].select
                  this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes[j].select = !this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes[j].select
                }
              }
            }
          } else if (this.custom.current.entry.CategoryId === dc.Matless) {
            s = matless[i]
            if (!matless[i].select && matless.filter(v => v.select).length === MAX_SIZE) {
              this.$notify({
                type: 'wa-warning',
                text: `最多选择${MAX_SIZE}件`
              })
              return
            } else if (matless[i].select && matless.filter(v => v.select).length === 1) {
              this.$notify({
                type: 'wa-warning',
                text: `至少选择一件`
              })
              return
            } else {
              // matless[i].select = !matless[i].select
              this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes[i].select = !this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes[i].select
              size = matless[i].custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
              for (let j = 0; j < frame.length; j++) {
                if (frame[j].custom.current.selects.filter(v => v.Type === 'mat')[0].angle === Angles.Up || frame[j].custom.current.selects.filter(v => v.Type === 'mat')[0].angle === Angles.Down) {
                  size2 = frame[j].custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Properties.Size
                } else {
                  size2 = [frame[j].custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Properties.Size[1], frame[j].custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Properties.Size[0]]
                }
                if (size[0] === size2[0] && size[1] === size2[1]) {
                  // frame[j].select = !frame[j].select
                  this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes[j].select = !this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes[j].select
                }
              }
            }
          }
        } else {
          if (this.pieces[0].Incomes.filter(v => v.select).length === MAX_SIZE && !this.pieces[0].Incomes[i].select) {
            this.$notify({
              type: 'wa-warning',
              text: `最多选择${MAX_SIZE}件`
            })
            return
          } else if (this.pieces[0].Incomes.filter(v => v.select).length === 1 && this.pieces[0].Incomes[i].select) {
            this.$notify({
              type: 'wa-warning',
              text: `至少选择一件`
            })
            return
          } else {
            this.pieces[0].Incomes[i].select = !this.pieces[0].Incomes[i].select 
          }
        }
      },
      // 保存选定的物料
      saveMaterials(c) {
        this.$emit('save-materials', c)
      },
      tpl(name) {
        let tplName = this.custom.initBomTplName(name)
        return tplName
      },
      // 向父组件传递数据
      selectMaterial(y, triggerBom) {
        this.$emit('select-material', y, triggerBom)
      },
      selectIncome(y, triggerBom) {
        this.$emit('select-income', y, triggerBom)
      },
      getIncomeSize(a) {
        return `${a[0]}×${a[1]}CM`
      },
      endScale(n) {
        // 传递到custom组件改变custom
        this.scale = n
        const id = this.categoryId
        for (let k of this.pieces) {
          let inc = k.Incomes
          for (let i of inc) {
            i.bonus = n
          }
        }
      },
      endBlur(e) {
        let _e = e.target.value
        if (_e.length === 0) {
          layer.toast('必须输入数字')
          return
        }
        if (!/^\d*$/g.test(_e)) {
          layer.toast('必须输入数字')
          e.target.value = _e.replace(/\D/g, '')
          return
        }
        let v = Number(_e.match(/\d*/g)[0])
        if (v === 0) {
          layer.toast('必须输入0-100之间的数值')
          return
        }
        if (v > 100) {
          layer.toast('最大为100')
          return
        }
        this.scale = parseInt(_e)
        this.incomes.forEach(item => {
          if (item.Select) item.Bonus = parseInt(_e)
        })
      },
      // 修改价格
      modifyPrice(e, item) {
        if (!item.custom) return false
        let _e = Number(e.target.value)
        let bonus
        let c = item.custom
        let id = this.categoryId
        let size
        let select
        if (isNaN(_e)) {
          layer.toast('必须输入数字')
          return false
        } else {
          if (_e > 100) {
            layer.toast('最大为100')
            bonus = 100
          } else if( _e < 0){
            bonus = 0
          } else {
            bonus = _e
          }
        }
        if (id === dc.Frames) {
          select = c.current.selects.filter(v => v.Type === 'mat')[0]
          if (c.current.entry.CategoryId === dc.Frame) {
            if (select.angle === Angles.Up || select.angle === Angles.Down) {
              size = select.mat.Properties.Size
            } else if (select.angle === Angles.Left || select.angle === Angles.Right) {
              size = [select.mat.Properties.Size[1], select.mat.Properties.Size[0]]
            }
            this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes.forEach(v => {
              let c1 = v.custom.current
              if (c.current.entry.Id === c1.entry.Id) {
                v.bonus = bonus
              }
            })
            this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes.forEach(v => {
              let c1 = v.custom.current.selects.filter(k => k.Type === 'mat')[0]
              let s1 = c1.mat.Size
              if (s1[0] === size[0] && s1[1] === size[1]) {
                v.bonus = bonus
              }
            })
          } else if (c.current.entry.CategoryId === dc.Matless) {
            size = select.mat.Size
            this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes.forEach(v => {
              let c1 = v.custom.current.selects.filter(k => k.Type === 'mat')[0]
              let s1
              if (c1.angle === Angles.Up || c1.angle === Angles.Down) {
                s1 = c1.mat.Properties.Size
              } else if (c1.angle === Angles.Left || c1.angle === Angles.Right) {
                s1 = [c1.mat.Properties.Size[1], c1.mat.Properties.Size[0]]
              }
              if (s1[0] === size[1] && s1[1] === size[1]) {
                v.bonus = bonus
              }
            })
            this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes.forEach(v => {
              let c1 = v.custom.current
              if (c.current.entry.Id === c1.entry.Id) {
                v.bonus = bonus
              }
            })
          }
        } else if (id === dc.Rimless || id === dc.Magnet || id === dc.Scroll) {
          this.pieces[0].Incomes.forEach(v => {
            let c1 = v.custom.current
            if (c.current.entry.Id === c1.entry.Id) {
              v.bonus = bonus
            }
          })
        } else {
          this.pieces[0].Incomes.forEach(v => {
            let c1 = v.custom.current
            if (c.current.entry.ProductId === c1.entry.ProductId) {
              v.bonus = bonus
            }
          })
        }
      },
      getScale(index) {
        return `${this.incomes[index].bonus}`
      },
      // 保存修改
      saveModif() {
        this.$emit('saveModif', -1)
      },
      // 保存物料数据
      initPieces(id = this.categoryId, mainCustom = this.custom, incomes = this.incomes) {
        let b = []
        return new Promise((resolve) => {
          incomes.forEach(item => {
            let income = saveIncomes(id, mainCustom, item.custom, item.Bonus, item.Select)
            b.push(income)
          })
          resolve(b)
        })
        // this.$emit('set-income', b)
        // this.$emit('saveModif', -1)
      },
      buildEntry(id, select, income) {
        return new Promise((resolve, reject) => {
          buildEntry(id, select).then(res => {
            income.entry = res
            income.selects = select
            resolve(income)
          })
        })
      },
      // 选择图片
      selectImage(imgData) {
        this.$emit('select-image', imgData)
      },
      // income-name
      incomeName(item) {
        if (!item.custom) return "错误"
        const id = this.categoryId
        let c = item.custom.current.selects
        let income
        let name
        switch(id) {
          case dc.Frames:
            if (this.custom.current.entry.CategoryId === dc.Frame) {
              income = c.filter(v => v.Type === 'mat')[0]
              if (income.angle === Angles.Up || income.angle === Angles.Down) {
                name = income.mat.Properties.Size
              } else if (income.angle === Angles.Left || income.angle === Angles.Right) {
                name = [income.mat.Properties.Size[1], income.mat.Properties.Size[0]]
              }
            } else if (this.custom.current.entry.CategoryId === dc.Matless) {
              income = c.filter(v => v.Type === mt.Size)[0]
              name = income.Size
            }
            break
          case dc.Rimless:
          case dc.Magnet:
            income = c.filter(v => v.Type === mt.Size)[0]
            name = income.Size && income.Size
            break
          case dc.Scroll:
            income = c.filter(v => v.Type === mt.Template)[0]
            name = income.Name
            break
          default:
            income = c.filter(v => v.Type === 'product')[0]
            name = income.product && income.product.Name
            break
        }
        if (name.constructor === Array) {
          return `${name[0]/10}x${name[1]/10}cm`
        } else {
          return name
        }
        
      },
      incomePrice(item) {
        if (!item.custom) return 0
        const id = this.categoryId
        let c = item.custom.current
        let originPrice
        let discount = window.$categories.get(id).Discount / 100
        switch(id) {
          case dc.Frames:
          case dc.Matless:
          case dc.Rimless:
          case dc.Magnet:
          case dc.Scroll:
            originPrice = c.entry.Price
            break
          default:
            let pictures = c.pictures
            originPrice = c.entry.Price
            if (Array.isArray(pictures)) {
              pictures.forEach(item => {
                originPrice += c.entry.Prices[item.Index]
              })
            }
            break
        }
        originPrice = originPrice * discount
        return Math.floor((originPrice * (item.bonus / 100)) / 100)
      }
    },
    computed: {
      boms() {
        return this.custom.getboms()
      },
      tranPic() {
        let c = this.custom
        let i = c.pictureIndex
        let p = getByProperty(c.current.pictures, i, 'Index')
        return p
      },
      incomes() {
        const id = this.categoryId
        if (id === dc.Frames) {
          if (this.custom.current.entry.CategoryId === dc.Frame) {
            return this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
          } else if (this.custom.current.entry.CategoryId === dc.Matless) {
            return this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes
          }
        } else {
          return this.propsIncomes[0].Incomes
        }
      },
    },
    components: {
      ...materialComponents
    },
    created() {
      
    }
  }
</script>

