<template>
  <div class="product-cont">
    <loading v-show="product.waiting"></loading>
    <div class="start-area">
      <div class="start-section">
        <h2 class="start-title">开始使用</h2>
        <div class="play-area">
          <input type="file" class="upload-input" name="uploader" @change="upload($event)">
          <div v-show="uploading" class="circle-progress">
            <div class="circle" ref="circle">
              <div class="mask"></div>
              <div class="half">
                <div class="item r-fill"></div>
                <div class="item cover"></div>
                <div class="item l-fill"></div>
              </div>
              <div class="inset">
                <div class="tips">
                  <div class="per">0%</div>
                  <div class="words">上传中</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="imageReady" class="preview" ref="preview">
            <img :src="icon(image)" :style="getStyle()">
            <div class="update-layout" :style="getStyle2()">
              <i class="wa wa-cloud-update"></i>
              <p class="link-text ">上传作品</p>
            </div>
          </div>
          <div v-else class="upload-btn">
            <i class="wa wa-cloud-upload"></i>
            <p class="link-text ">上传作品</p>
            <div class="upload-tips">
              <p>建议上传大于1200像素x1700像素的作品</p>
              <p>作品尺寸越大，制作效果越好</p>
            </div>
          </div>
        </div>
        <div>
          <a class="btn btn-default select-btn" @click = "setAlbum(true)">
            从作品集中选取
          </a>
        </div>
      </div>
      <select-image ref="selectImage" :showAlbum="showAlbum" @hideAlbum="setAlbum(false)" @selectImg="getImgData($event)"></select-image>
    </div>
    <div v-if="fireStatus" class="create-area clearfix">
      <div v-for="g in product.rowCount">
        <div class="product-row clearfix">
          <div class="pic-row" v-for="item in productData">
              <div class="slide-overlay">
                <div class="load-wrap">
                  <div class="knight-rider-loader animate">
                    <div class="knight-rider-bar"></div>
                    <div class="knight-rider-bar"></div>
                    <div class="knight-rider-bar"></div>
                  </div>
                </div>
                <div v-if="!item.active" class="disable-wrap"></div>
                <div class="preview-pic-wrap" @click="toggleEditArea(item)">
                  <component :keep-alive="false"
                             is="Display"
                             :pictures="fitRowPicture(item.pictures)"
                             :canvas="rowCanvas"
                             :entry="item.entry"
                             :displays="item.displays"></component>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <product-des-from v-if="fireStatus"
                        :initDes="product.Description"
                        :initTitle="product.Title"
                        :initSelectTags = "product.SelectTags"
                        :tags="product.Tags"
                        @submitDetail = "submitProduct($event)">
      </product-des-from>
    </transition>
    <div class="modal fade" v-show="showSetBom" :class="{in:showSetBom}" id="set-selects" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-backdrop fade" :class="{in:showSetBom}" @click="hideSetBom"></div>
      <div class="modal-dialog chs-img-box">
        <div class="modal-content">
          <div class="modal-body clearfix">
            <h2 class="set-bom-title">
              已选择<span id="bom-nam">{{curBomName}}</span> (<span id="active-num">{{curBomSelects.length}}</span> / <span id="max-active-num">{{proBomsCount}}</span>  ) </h2>
            <ul class="set-bom-list">
              <li v-for="s in curBomTotal" class="item bom-item icon" @click="setCurrentBom(s)"  :class = "{'active': s.selected}" >
                <list-item v-if="curBomName === '卡纸'" :id="s.Property.OptionId" :name="s.Property.Value" :icon="s.Property.Icon"></list-item>
                <list-item v-else :id="s.Id" :name="s.Name" :icon="s.Icon"></list-item>
              </li>
            </ul>
            <a href="javascript:void(0)" @click="saveSetBom" class="btn btn-primary pull-right">完成</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 产品暂时没有考虑做照片墙，有些地方处理了照片墙的逻辑但是没有使用
  import { newProduct } from './app/product.js'
  import { getEntries } from '../custom/display/entry'
  import { DecorativeCategories as dc, MaterialTypes as mt,
    proBomsCount as pbCount, Angles, Canvas } from 'scripts/utils/custom/consts.js'
  import { MinSize, MaxSize } from 'scripts/utils/const'
  import { getByProperty, setByProperty, addUnit } from 'scripts/utils/custom/utils.js'
  import { getTransform, getOrientation } from 'scripts/utils/custom/orientation.js'
  import { newPicture, changePicture, resetPicture } from 'components/custom/picture/picture.js'
  import { mixin as components } from './app/components.js'
  import { initSubmitData, updateIncomeMateria, invalidSize } from './app/utils.js'
  import { loadImage } from 'scripts/utils/image'
  import { data } from './app/product'

  const CircleProgress = require('js/circle_progress')

  export default {
    mixins: [{components: components}],
    beforeRouteEnter(to, from, next) {
      // 进入页面判断是否存在id,存在id则在编辑页面,不存在id则在上传页面
      const id = to.params.id
      const f = (that) => {
        that.product.initProData(id)
      }
      next(f)
    },
    data() {
      return {
        image: {}, // 主图
        uploading: false, // 上传状态
        showAlbum: false,
        circlePro: {},
        // 产品 *entries  物料组合   *materials 物料 *materialsPro 产品可选物料
        // *moneys 价格 *bonusMoneys 分成价格
        // *saleCounts 出售品类个数 *bonus 分成
        product: newProduct(),
        fireStatus: false, // 默认不显示编辑产品区域和产品详情表单区域
        editStatus: true, // box图片组件默认可编辑
        rowCanvas: 'ProRow',
        boxCanvas: 'ProBox',
        editCatId: 0,
        FrameId: dc.Frame,
        showSetBom: false,
        curBomName: '', // 当前物料，当前
        settingBomType: '',
        curBomTotal: [],
        curBomSelects: [],
        proBomsCount: pbCount,
        curBomCat: 0,
        boxTabStatus: 'edit', // *edit 编辑详情 *setBonus 选择售卖类型
        setTimer: null,
        productData: data
      }
    },
    created() {
      this.$onBus('set-image', (action, parm, categoryId) => {
        this.op(action, parm, categoryId)
      })
      this.$onBus('get-canvas-rate', (rate, categoryId) => {
        this.setRate(rate, categoryId)
      })
      console.log(this.productData)
      this.$onBus('init-data', (proData) => {
        //  页面初始化数据
        if (!proData.isEditPage) {
          this.product.waiting = false
        } else {
          let img = {
            File: proData.ImageFile,
            Id: proData.ImageId
          }
          img.Info = proData.ImageInfo
          this.image = img
          this.fireStatus = true
          this.product.initMaterials()
        }
      })
    },
    mounted() {
      let testArr = []
      for (var i = 1; i < 17; i++) {
        testArr.push(i)
      }
      getEntries(testArr).then((res) => {
//        console.log(res)
      })
      let $circle = $(this.$refs.circle)
      this.circlePro = new CircleProgress($circle)
    },
    beforeDestroy() {
      if (this._d) {
        this._d()
        this._d = null
      }
    },
    methods: {
      icon(i) {
        return request.thumb('image', i.Id, 480, i.File)
      },
      illIcon(i) {
        let src = 'static/images/product/update-ill-bg/' + i.categoryId + '.jpg'
        return src
      },
      getStyle() {
        let info = this.image.Info
        let style = {}
        if (info) {
          style['transform'] = [
            `rotate(${info.Rotate}deg)`,
            `scaleX(${info.ScaleX})`,
            `scaleY(${info.ScaleY})`
          ].join(' ')
        }
        return style
      },
      getStyle2() {
        let info = this.image.Info
        let previewDOM = this.$refs['preview']
        let style = {}
        if (previewDOM && info && info.Rotate !== 0) {
          let offsetPx = Math.abs((previewDOM.offsetHeight - previewDOM.offsetWidth) / 2)
          style['width'] = addUnit(previewDOM.offsetHeight)
          style['height'] = addUnit(previewDOM.offsetWidth)
          style['left'] = addUnit(offsetPx)
          style['top'] = addUnit(-offsetPx)
        }
        return style
      },
      op(action, parm, categoryId) {
        //  产品都是单孔，仅操作图片数组第一个
        let Pieces = this.product.Pieces
        let thisItem = _.find(Pieces, (item) => {
          return item.categoryId === categoryId
        })
        let p = thisItem.pictures[0]
        changePicture(p, action, parm)
        if (p.Output.Full === 2) {
          if (this.setTimer) {
            clearTimeout(this.setTimer)
          }
          this.setTimer = setTimeout(() => {
            resetPicture(p, 'overstep')
          }, 200)
        }
      },
      setRate(rate, categoryId) {
        // 产品都是单孔，仅操作图片数组第一个
        let Pieces = this.product.Pieces
        if (categoryId === dc.Matless) {
          categoryId = dc.Frame
        }
        let thisItem = Pieces.find((item) => {
          return item.categoryId === categoryId
        })
        let p = thisItem.pictures[0]
        p.rate = rate
        if (p.EditStatus) {
          p.TranslateX = Math.ceil(p.TranslateX * rate[0])
          p.TranslateY = Math.ceil(p.TranslateY * rate[1])
        }
      },
      refresh(next = true) {
        let s = this._s
        if (s) {
          let f = () => s.refresh()
          next ? this.$nextTick(f) : f()
        }
      },
      setAlbum(status) {
        if (status) {
          this.$refs.selectImage.initAlbum()
        }
        this.showAlbum = status
      },
      getImgData(img) {
        this.image = img
        this.fireImage()
      },
      groupPieces(i) {
        let Pieces = this.product.Pieces
        if (Pieces.length === 0) return
        let startIndex = (i - 1) * 3
        return Pieces.slice(startIndex, startIndex + 3)
      },
      fitRowPicture(pics) {
        let rowRate = Canvas['ProRow'] / Canvas['ProBox']
        let rowPics = []
        _.each(pics, p => {
          let np = _.extend({}, p)
          np.TranslateX = parseInt(np.TranslateX * rowRate)
          np.TranslateY = parseInt(np.TranslateY * rowRate)
          rowPics.push(np)
        })
        return rowPics
      },
      fireImage() {
        //  传图
        //  装饰画根据默认尺寸设置默认售卖品类以及分成
        //  初始化所有品类可使用的物料
        let that = this
        let image = that.image
        let Pieces = that.product.Pieces
        let product = that.product
        Pieces.forEach(item => {
          let entry = item.entry
          if (entry.CategoryId === dc.PhotoWall || entry.CategoryId === dc.MultiHole) {
            //  照片墙todo, 多孔画todo
          } else {
            let i = 0
            let invObj
            switch (entry.CategoryId) {
              //  根据图片判断有框画是否填满  添加能否制作的状态
              //  处理单孔画，布艺画，卷轴画, 磁贴画。
              //  有框画在之前的notHandledCatList已经被过滤了。
              case dc.Frame:
              case dc.Rimless:
              case dc.Magnet:
              case dc.Scroll:
                invObj = invalidSize(item, image)
                if (invObj.canFire) {
                  item['canFire'] = true
                  item['defaultSizes'] = invObj.defaultSizes
                  item['defaultSize'] = invObj.defaultSize
                }
                break
              default :
                item['canFire'] = true
            }
            if (item['canFire']) {
              let p = getByProperty(item.pictures, i, 'Index')
              //  图片渲染的时候 装饰画会更新选中SIze
              //  卡纸是根据size来选的
              //  so 编辑产品时 初始化选中物料在换图时作用
              that.initSelectBoms(item)
              //  初始化所有Item下 incomes 的 entry
              product.initIncomes(item, () => {
                entry = item.entry
                if (p) {
                  // 换图
                  if (p.Image.Id === image.Id && p.Image.File === image.File) return
                  p = newPicture(i, entry.Outputs[i], image, item.DPI)
                  _.each(item.Incomes, inc => {
                    let ent = inc.Entries[0]
                    let np = newPicture(i, ent.Outputs[i], image, item.DPI)
                    if (np) {
                      inc.Pictures = [[np]]
                    } else {
                      inc.status = false
                    }
                  })
                  if (p) {
                    setByProperty(item.pictures, p, 'Index')
                    return
                  }
                } else {
                  // 初始化对图片的处理
                  _.each(item.Incomes, inc => {
                    let ent = inc.Entries[0]
                    let np = newPicture(i, ent.Outputs[i], image, item.DPI)
                    if (np) {
                      inc.Pictures = [[np]]
                    } else {
                      inc.status = false
                    }
                  })
                  if (item.categoryId === dc.Frame) {
                    _.each(item.matlessItem.Incomes, mtlc => {
                      let ent = mtlc.Entries[0]
                      let np = newPicture(i, ent.Outputs[i], image, item.DPI)
                      if (np) {
                        mtlc.Pictures = [[np]]
                      } else {
                        mtlc.status = false
                      }
                    })
                  }
                  p = newPicture(i, entry.Outputs[i], image, item.DPI)
                  if (p) {
                    item.pictures.push(p)
                    return
                  }
                }
              })
            } else {
              item.pictures = []
            }
          }
        })
        //  新品了不限制图片大小，任何图片渲染完至少会渲染一件产品
        that.fireStatus = true
      },
      cantFire(item) {
        // 品类不能生产:cantFire
        return item.hasOwnProperty('canFire') && !item['canFire']
      },
      toggleEditArea(item) {
        if (this.editCatId === 0) {
          this.editCatId = item.categoryId
        } else {
          if (this.editCatId === item.categoryId) {
            this.editCatId = ''
          } else {
            this.editCatId = item.categoryId
          }
        }
        this.boxTabStatus = 'edit'
      },
      initSelectBoms(item) {
        //  传完图片后 初始化当前可用物料
        //  装饰画根据默认尺寸
        //  所有根据cont里设置的最大数量设置selects
        let entry = item.entry
        let cateId = entry.CategoryId
        let defSizes
        let defSize
        //  初始化产品时已经把total 放到 item.boms[x].total里
        let boms = item.boms
        let total
        if (item.type === 'Paints') {
          switch (cateId) {
            case dc.Frame:
              defSizes = item.defaultSizes
              defSize = item.defaultSize
              item.selectSizes = defSizes.length > pbCount ? defSizes.slice(0, pbCount) : defSizes
              item.soldCount = item.selectSizes.length
              _.each(boms, b => {
                let total = b.total
                switch (b.type) {
                  case mt['Mat'] :
                    let selectMatCat
                    // 为了展示其他物料数据一致
                    selectMatCat = _.find(total, (t) => {
                      let matSize = t.Properties.Size
                      return (matSize[0] === defSize[0] && matSize[1] === defSize[1]) || (matSize[0] === defSize[1] && matSize[1] === defSize[0])
                    })
                    //  *selectMat 当前选中的卡纸尺寸对象（对应选中尺寸，下面含各种颜色类型）
                    //  *optionsTotal 当前所有可用的卡纸颜色（对应尺寸下所有可用各种卡纸颜色）
                    //  *selects 当前设置的可选卡纸分组（对应设置的可用各种卡纸颜色）
                    //  *using 当前选中的卡纸option
                    b['selectMat'] = selectMatCat
                    b['optionsTotal'] = selectMatCat.Properties.Options
                    b['selects'] = b['optionsTotal'].length > pbCount ? b['optionsTotal'].slice(0, pbCount) : b['optionsTotal']
                    b['using'] = b['selects'][0]
                    b['angle'] = defSize[0] > defSize[1] ? Angles.Left : Angles.Up
                    break
                  default:
                    b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
                    b['using'] = b['selects'][0]
                }
              })
              break
            case dc.Rimless:
            case dc.Magnet:
              _.each(boms, b => {
                total = b.total
                switch (b.type) {
                  case mt['Size']:
                    total = item.defaultSizes
                    b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
                    b['using'] = item.defaultSize
                    item.soldCount = b['selects'].length
                    b.total = total
                    break
                  case mt['OuterLine']:
                  case mt['MagnetLine']:
                    b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
                    if (b['selects'][0]['Name'] !== '无框') {
                      b['selects'].unshift({
                        Id: 0,
                        Type: b.type,
                        Name: '无框'
                      })
                    }
                    b['using'] = b['selects'][0]
                    break
                  default:
                    b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
                    b['using'] = b['selects'][0]
                }
              })
              break
            case dc.Scroll:
              defSizes = item.defaultSizes
              defSize = item.defaultSize
              _.each(boms, b => {
                total = b.total
                if (b.type === mt['Template']) {
                  let invalidTpls = []
                  _.each(defSizes, s => {
                    let vt
                    vt = _.find(total, t => {
                      let ts = t.Properties.Hole
                      return ts === s
                    })
                    invalidTpls.push(vt)
                  })
                  b['invalidTpls'] = invalidTpls
                  b['selects'] = invalidTpls.length > pbCount ? invalidTpls.slice(0, pbCount) : invalidTpls
                  item.soldCount = b['selects'].length
                  b['using'] = _.find(b['selects'], b => {
                    let bs = b.Properties.Hole.slice(0, 2)
                    return bs[0] === defSize[0] && bs[1] === defSize[1]
                  })
                } else {
                  b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
                  b['using'] = b['selects'][0]
                }
              })
              break
          }
        } else {
          //  纯模板类型产品: item.type: Product
          _.each(boms, b => {
            let total = b.total
            if (b.type === 'product') {
              b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
              b['using'] = entry.selects[0].product
              item.soldCount = b['selects'].length
            } else {
              b['selects'] = total.length > pbCount ? total.slice(0, pbCount) : total
              b['using'] = b['selects'][0]
            }
          })
        }
      },
      selectMaterial(param) {
        //  选中物料
        let catId = param.catId
        let material = param.material
        let type = param.type
        let item = _.find(this.product.Pieces, p => {
          return p.categoryId === catId || p.categoryId === dc.Matless
        })
        this.product.selectMaterial(item, material, type)
      },
      setSelectBom(param) {
        //  触发显示设置物料的模态框
        //  初始化当前设置的物料的各项参数
        let self = this
        let pieces = self.product.Pieces
        let catId = param.catId
        let bomName = param.name
        let item
        let boms
        let curBom
        item = _.find(pieces, i => {
          return i.categoryId === catId
        })
        boms = item.boms
        curBom = _.find(boms, (b) => {
          return b.name === bomName
        })
        self.curBomCat = catId
        if (param.bomType === mt['Mat']) {
          self.curBomTotal = curBom.optionsTotal
        } else {
          self.curBomTotal = curBom.total
        }
        self.curBomSelects = curBom.selects
        self.curBomName = bomName
        self.settingBomType = param.bomType
        self.showSetBom = true
        _.each(self.curBomTotal, (c) => {
          let status = self.isSelectedBom(c)
          c.selected = status
        })
      },
      isSelectedBom(b) {
        //  模态框内物料是否被设为可用， 用来显示选中状态
        let status = false
        let sel = this.curBomSelects
        let sType = this.settingBomType
        switch (sType) {
          case mt['Mat']:
            _.each(sel, s => {
              if (s.Property.OptionId === b.Property.OptionId) {
                status = true
              }
            })
            break
          case 'productMat':
            _.each(sel, s => {
              if (s.OptionId === b.OptionId) {
                status = true
              }
            })
            break
          default :
            _.each(sel, s => {
              if (s.Id === b.Id) {
                status = true
              }
            })
        }
        return status
      },
      setCurrentBom(b) {
        //  设置当前品类可用物料，不保存
        let total = this.curBomTotal
        let status = b.selected
        let sel = this.curBomSelects
        let len = sel.length
        if (len === pbCount && !status) {
          layer.toast('最多选中' + pbCount + '个哦')
          return false
        }
        if (len === 1 && status) {
          layer.toast('最少要选中1个哦')
          return false
        }
        b.selected = !status
        sel = _.filter(total, t => {
          return t.selected
        })
        this.curBomSelects = sel
      },
      hideSetBom() {
        this.showSetBom = false
      },
      saveSetBom() {
        //  保存当前可用物料
        let self = this
        let pieces = self.product.Pieces
        let catId = self.curBomCat
        let curBomSelects = self.curBomSelects
        let item
        let bomName = self.curBomName
        let activeBom
        item = _.find(pieces, i => {
          return i.categoryId === catId
        })
        activeBom = _.find(item.boms, b => {
          return b.name === bomName
        })
        activeBom.selects = curBomSelects
        activeBom.using = curBomSelects[0]
        updateIncomeMateria(item)
        self.hideSetBom()
      },
      setBoxTab(status) {
        this.boxTabStatus = status
      },
      updateIncomes(e, item) {
        //  设置分成，设置可售卖种类
        item.Incomes = e
        let self = this
        let catId = item.categoryId
        let updateSizes = []
        let updateTpls = []
        switch (catId) {
          case dc.Frame:
            _.each(e, i => {
              if (i.status) {
                updateSizes.push(i.size)
                _.each(item.matlessItem.Incomes, inc => {
                  inc.status = false
                  if (inc.Packets[0] === i.size[0] && inc.Packets[1] === i.size[1]) {
                    inc.status = true
                    inc.Bonus = i.Bonus
                  }
                })
              }
            })
            item.selectSizes = updateSizes
            item.soldCount = updateSizes.length
            self.product.selectMaterial(item, updateSizes[0], 'frameSize')
            break
          case dc.Rimless:
          case dc.Magnet:
            _.each(e, i => {
              if (i.status) {
                updateSizes.push(i.Packets)
              }
            })
            _.find(item.boms, b => {
              return b.type === mt['Size']
            }).selects = updateSizes
            item.soldCount = updateSizes.length
            self.product.selectMaterial(item, updateSizes[0], 'size')
            break
          case dc.Scroll:
            //  卷轴画 画布直接从模板里取 且不可设置
//            _.each(e, i => {
//              if (i.status) {
//                updateTpls.push(i.tpl)
//              }
//            })
//            _.find(item.boms, b => {
//              return b.type === mt['Template']
//            }).selects = updateTpls
//            self.product.selectMaterial(item, updateTpls[0], 'material')
            break
          default:
            _.each(e, i => {
              if (i.status) {
                updateTpls.push(i.tpl)
              }
            })
            _.find(item.boms, b => {
              return b.type === 'product'
            }).selects = updateTpls
            item.soldCount = updateTpls.length
            item.defaultSizes = updateTpls
            self.product.selectMaterial(item, updateTpls[0], 'product')
        }
        this.boxTabStatus = 'edit'
      },
      updatePrice(e, item) {
        for (let str in e) {
          item[str] = e[str]
        }
      },
      // 此处实例化数组
      upload($event) {
        let a = $event.target.files
        if (a.length === 0) {
          layer.toast('没有选择文件哦')
          return
        }
        let b = []
        for (let i = 0; i < a.length; i++) {
          let f = a[i]
          if (!(/^image\//i.test(f.type))) {
            this.showMessage(`文件${f.name}不是图片哦`)
          } else if (f.size < MinSize) {
            this.showMessage(`图片${f.name}太小哦`)
          } else if (f.size > MaxSize) {
            this.showMessage(`图片${f.name}太大哦`)
          } else {
            b.push(f)
          }
        }
        if (b.length === 0) return
        let that = this
        // b为选中的图片,a一个迭代结果组成的Vue实例
        a = b.map(v => new Vue({
          data: {
            Info: {
              Rotate: 0,
              ScaleX: 1,
              ScaleY: 1
            },
            name: v.name,
            percent: 0,
            message: ''
          },
          beforeDestroy() {
            this._src = null
            this._promise = null
          },
          methods: {
            setInfo(f) {
              let self = this
              let r = new FileReader()
              r.onload = e => {
                self.Info = getTransform(getOrientation(e.target.result))
              }
              r.readAsArrayBuffer(f)
            }
          },
          created() {
            let self = this
            self._src = URL.createObjectURL(v)
            self.setInfo(v)
            let fd = new FormData()
            fd.append('Image', v)
            that.uploading = true
            self._promise = () => self.$http.post('image/upload', fd, {
              progress(e) {
                self.percent = Math.floor(e.loaded / e.total * 100)
                that.circlePro.circle(self.percent)
              }
            }).then(res => {
              let b = res.body
              layer.toast(self.name + (b.Duplicate ? '重复文件' : '上传成功'))
              loadImage(that.icon(b)).then(img => {
                that.circlePro.clear()
                that.image = b
                that.uploading = false
                that.fireImage()
                self.$destroy()
              })
            }, res => {
              res.hideAlert()
              self.message = res.errorMessage
            })
          }
        }))
        // 多个图片时候的方法 ， 这里限制只能传一个， 通用
        b = a.map(v => v._promise)
        console.log(b)
        this.product.initTags()
        let p = Promise.resolve(b.length)
        for (let i = 0; i < b.length; i++) {
          p = p.then(b[i])
          b[i] = p
        }
      },
      // 提交作品
      submitProduct(detail) {
        let submitData = initSubmitData(this.image, this.product.Pieces, detail)
        if (this.product.isEditPage) {
          submitData.Id = this.product.editId
        }
        request.save('work/manage', submitData).then(res => {
          layer.toast('产品制作成功')
          setTimeout(() => {
            window.location.href = '/user/work.html'
          }, 500)
        })
      }
    },
    computed: {
      imageReady() {
        return !_.isEmpty(this.image)
      },
      imageArr() {
        return [this.image]
      }
    }
}
</script>
