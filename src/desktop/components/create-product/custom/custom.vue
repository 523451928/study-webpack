<template>
	<div class="product-item" ref="productItem">
		<div class="item-box true-box" v-if="isSuitable && isRender">
			<div class="box" ref="sell">
				<component class="product-box" :length="220" :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="false" :entry="custom.current.entry" :displays="custom.displays" :pictures="custom.current.pictures" :xi="custom.xi"
				  :di="custom.di" :isproduct="false">
				</component>
				<p class="product-name">{{custom.current.entry.Name}}</p>
				<p class="product-number">{{incomeLength}}件可售卖</p>
			</div>
			<div class="button-wrap">
				<div class="u-btn button" @click="onEdit">编辑</div>
				<div class="u-primary-btn button" @click="onSell" ref="sellbtn">{{isSell ?'不出售' : '可出售'}}</div>
			</div>
		</div>
		<div class="item-box false-box" v-if="!isSuitable && isRender">
			<div class="box">
				<i class="wa wa-cloud-upload"></i>
				<!-- <p>作品尺寸过小,无法生成{{categoryName}}</p> -->
				<p>请上传作品大于</p>
				<p>500*500</p>
				<p>尺寸越大,产品效果越好</p>
				<upload-img @open-progress="openProgress" @porssgress-info="porssgressInfo" @close-progress="closeProgress" @init-progress="initProgress"></upload-img>
				<div class="progress-bar" v-show="isProgress">
					<svg width="300" height="300">
							<circle cx="150" cy="150" r="60" stroke-width="10" stroke="#D1D3D7" fill="none"></circle>
							<circle cx="290" cy="150" r="60" stroke-width="10" stroke="#00A5E0" fill="none" transform="matrix(0,-1,1,0,0,440)" :stroke-dasharray="rotate"></circle>
							<text x="132" y="155" fill="#aaaaaa" font-size="14px" textLength="40px">{{progress}}</text>
					</svg>
				</div>
			</div>
		</div>
		<transition name="edit" mode="in-out">
			<div class="edit-wrapper" ref="edit" v-if="myIndex === openIndex" :style="{width: editCss.w, marginLeft: editCss.l}">
				<div class="content">
					<div class="content-left">
						<div class="box">
							<component class="product-box" :length="520" :keep-alive="false" :is="displayer" :canvas="customCanvas" :editstatus="true" :entry="custom.current.entry" :displays="custom.displays" :pictures="custom.current.pictures" :isproduct="true" :xi="custom.xi"
							  :di="custom.di" @reset-image="resetImage" @set-image="setImage"></component>
						</div>
						<div class="control">
							<scrollbar class="m-scroll-bar" :pic="tranPic" :init-scale="initScale" :cat-id="categoryId" @set-image="setImage" @reset-image="resetImage">
							</scrollbar>
							<div class="rotate" @click="op('set-image', 'rotate', 'right')">
								<i class="wa wa-rotate-right"></i> 旋转
							</div>
						</div>
					</div>
					<div class="content-right">
						<edit-custom 
						:custom="custom"
						:categoryId="categoryId"
						:materialList="materials"
						:userMaterials="userMaterials"
						:userOptions="userOptions"
						:matData="matData2"
						:props-incomes="pieces"
						@init-matData="initMatData2"
						@select-material="selectMaterial"
						@select-income="selectIncome"
						@save-materials="saveMaterials"
						@select-options="selectOptions"
						@select-image="selectImage"
						@saveModif="saveModif"
						v-if="!refresh"
						></edit-custom>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
/*eslint-disable*/
const MAX_SIZE = 6
import { newCustom } from "../../custom/core/custom"
import UploadImg from 'components/public/upload-img/upload-img.vue' // 上传图片组件
import { getDisplayer } from "../../custom/display/display-util"
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
		catNameIdMap,
		SuggestSize as ss
	} from "scripts/utils/custom/consts.js" // 一些常量
// import { catNameIdMap, DecorativeCategories as dc, MaterialTypes as mt, Directions, Angles} from 'scripts/utils/custom/consts.js' // 一些常量
import DisplayComponents from "../../custom/display/components" // 展示组件
import {
	getByProperty,
	parseImageSize,
	isDecorate,
	equalOption,
	equalSize,
	copySize,
	swapSize,
	formatSize,
	sizeShape,
	parseSize
} from "scripts/utils/custom/utils.js"
import Scrollbar from "./scroll-bar.vue" // 缩放尺寸的样式
import { changePicture, resetPicture, fitSize, fitSize2, serializePicture3} from "../../custom/picture/picture.js"
import { freshProductOptions } from 'components/custom/core/entry.js'
import EditCustom from "./edit-custom"
export default {
	props: {
		// 主图数据
		imageData: {
			type: [Boolean, Object],
			default: false
		},
		// 品类id
		categoryId: {
			type: Number,
			default: 8
		},
		// 是否是编辑状态
		isEdit: {
			type: Boolean,
			default: false
		},
		// 外部传入的pieces
		propsPieces: {
			type: Object
		},
		// 当前品类的物料
		materials: {
			type: Array
		},
		// 当前展开的索引
		openIndex: {
			type: Number
		},
		// 当前custom组件所在的索引值
		myIndex: {
			type: Number
		}
	},
	data() {
		return {
			custom: newCustom(), // custom数据
			isSuitable: false, // 图片是否合适,
			isRender: false, // 是否渲染完成
			isProgress: false, // 图片不合适时进度条是否展开
			rotate: "0 377", // 旋转的角度
			progress: undefined, //进度
			pieces: undefined, // 当前项目的pieces
			isSell: true, // 商品是非上下架
			editCss: {
				w: window.innerWidth + "px",
				l: undefined
			},
			matData: undefined, // 序列化后的卡纸数据
			matData2: undefined,
			image: this.imageData 
		}
	},
	components: {
		UploadImg,
		Scrollbar,
		...DisplayComponents,
		EditCustom
	},
	created() {
		this.initPieces()
		this.initCustom()
		this.$nextTick(() => {
			this.initPosition()
		})
	},
	computed: {
		// 当前custom的展示样式
		displayer() {
			let c = this.custom;
			if (c.waiting) return;
			return getDisplayer(c.current.entry, c.di);
		},
		incomeLength() {
			return this.pieces[0].Incomes.length
		},
		// 用户选择的选项
		userOptions() {
			let r
			let catId = this.categoryId 
			let c = this.custom
			if (this.categoryId === dc.Frames) {
				let id = c.current.entry.CategoryId
				let incomes = this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
				let s = c.current.selects.filter(v => v.Type === mt.Size)[0]
				if (c.current.entry.CategoryId === dc.Frame) {
					for (let k of incomes) {
						let s2 = k.custom
						if (s2.current.entry.Id === c.current.entry.Id) {
							r = k.options
							break
						}
					}
				} else if (c.current.entry.CategoryId === dc.Matless) {
					let size = s.Size
					for (let k of incomes) {
						let select2 = k.custom.current.selects.filter(v => v.Type === 'mat')[0]
						let s2 = select2.mat.Properties.Size
						if (s2[0] !== s2[1]) {
							if (size[0] === s2[0] && size[1] === s2[1] && (select2.angle === Angles.Up || select2.angle === Angles.Down)) {
								r = k.options
								break
							} else if (size[0] === s2[1] && size[1] === s2[0] && (select2.angle === Angles.Left || select2.angle === Angles.Right)) {
								r = k.options
								break
							}
						} else {
							if (size[0] === s2[0] && size[1] === s2[1]) {
								r = k.options
								break
							}
						}
					}
				}
			} else if (catId !== dc.Frames && catId !== dc.Rimless && catId !== dc.Scroll && catId !== dc.Magnet) {
				
			}
			return r
		},
		// 用户选择的物料
		userMaterials() {
			const id = this.categoryId
			const materils = this.materils
			let c = this.custom
			let r = []
			let incomes
			switch(id) {
				case dc.Frames:
					incomes = this.pieces.filter (v => v.CategoryId === c.current.entry.CategoryId )[0].Incomes
					for (let i = 0; i < incomes.length; i++) {
						if (incomes[i].custom.current.entry.Id === c.current.entry.Id) {
							r = incomes[i].materials
						}
					}
					break
				case dc.Magnet:
				case dc.Scroll:
					incomes = this.pieces[0].Incomes
					for (let i of incomes) {
						if (i.custom.current.entry.Id === c.current.entry.Id) {
							r = i.materials
						}
					}
					break
				case dc.Rimless:
					incomes = this.pieces[0].Incomes
					for (let i of incomes) {
						if (i.custom.current.entry.Id === c.current.entry.Id) {
							r = i.materials
						}
					}
					break
			}
			return r
		},
		// 图片数据
		tranPic() {
			let c = this.custom
			let i = c.pictureIndex
			let p = getByProperty(c.current.pictures, i, 'Index')
			return p
		},
	},
	methods: {
		// 初始化图片数据
		initImage() {
			return new Promise(resolve => {
				let imgId = this.propsPieces[0].Incomes[0].Pictures[0][0].ImageId
				if (imgId === this.image.Id) {
					resolve()
				} else {
					// self.getImageData(imgId).then(res)
					this.$request.do('GET', `image/info/${imgId}`).then(res => {
						let data = res.take('Data')
						this.image = data
						resolve()
					})
				}
			})
		},
		// 展开进度条
		openProgress(v) {
			this.isProgress = v
		},
		// 进度条的进度信息
		porssgressInfo(v) {
			this.rotate = v.rotate
			this.progress = v.progress
		},
		// 结束进度条
		closeProgress(v) {
			this.isProgress = v.isProgress
			this.rotate = v.rotate
			this.progress = v.progress
			this.image = v.imageData
			this.isEdit = false
			// 看图片尺寸
			// this.pieces = undefined
			this.initPieces()
			this.initCustom()
			this.initPosition()
			// this.isSuitable = true
		},
		// 初始化进度条
		initProgress(v) {
			this.progress = v.progress
			this.rotate = v.rotate
		},
		// 初始化pieces
		initPieces() {
			const self = this
			// 对有框画进行特殊处理
			switch(self.categoryId) {
				case dc.Frames:
					self.pieces = [
						{
							CategoryId: dc.Frame,
							Incomes: [],
							isSell: self.isSell
						},
						{
							CategoryId: dc.Matless,
							Incomes: [],
							isSell: self.isSell
						}
					]
					break
				default:
					self.pieces = [
						{
							CategoryId: self.categoryId,
							Incomes: [],
							isSell: self.isSell
						}
					]
					break
			}
		},
		// 初始化custom,根据是否是编辑状态
		initCustom() {
			const self = this
			const catId = self.categoryId
			let c = self.custom
			let material
			let matData
			if (self.isEdit) {
				// let inc = self.pieces[0].Incomes[0]
				// 获取物料
				if (this.propsPieces.length === 0) {
					this.isRender = true
					return
				}
				self.initImage().then(() => {
					switch(catId) {
						case dc.Frames:
							let m2 = []
							let m3 = self.materials.filter(v => (v.Type === mt.Mat || v.Type === mt.Size) && v.CategoryId !== dc.MultiHole)
							matData = self.filterFramesSize()
							if (matData.sizes.length === 0) {
								self.isRender = true
								return false
							}
							self.matData = matData
							self.initIncome2().then(() => {
								self.savePieces(self.pieces)
								self.isRender = true
								self.custom = self.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes.filter(v => v.select)[0].custom
								self.isSuitable = true
								self.initMatData2()
								self.initPosition()
							})
							break
						case dc.Rimless:
						case dc.Magnet:
							matData = self.filterFramesSize2()
							self.matData = matData
							self.initIncome2().then(() => {
								self.custom = self.pieces[0].Incomes[0].custom
								self.savePieces(self.pieces)
								self.initMatData2()
								self.initPosition()
								self.isRender = true
								self.isSuitable = true
							})
							break
						case dc.Scroll:
							matData = self.materials.filter(v => v.Type === mt.Template)
							self.matData = matData
							self.initIncome2().then(() => {
								self.custom = self.pieces[0].Incomes[0].custom
								self.savePieces(self.pieces)
								self.initMatData2()
								self.initPosition()
								self.isRender = true
								self.isSuitable = true
							})
							break
						default:
							matData = self.materials.filter(v => !v.Type)
							self.matData = matData
							self.initIncome2().then(() => {
								self.custom = self.pieces[0].Incomes[0].custom
								self.savePieces(self.pieces)
								self.initMatData2()
								self.initPosition()
								self.isRender = true
								self.isSuitable = true
							})
							break
					}
				})
			} else {
				switch(catId) {
					case dc.Frames:
						// 关键; 匹配的物料数据
						let m2 = []
						let m3 = self.materials.filter(v => (v.Type === mt.Mat || v.Type === mt.Size) && v.CategoryId !== dc.MultiHole)
						matData = self.filterFramesSize()
						self.matData = matData
						//	初始化 获取当前的物料, 根据匹配到的合适尺寸,生成初始化的物料
						if (matData.sizes.length === 0) {
							self.isRender = true
							return false
						}
						self.matData.sizes.forEach(item => {
							for (let k of m3) {
								if (k.Type === mt.Size) {
									if ((item[0] === k.Size[0] && item[1] === k.Size[1]) || (item[1] === k.Size[0] && item[0] === k.Size[1])) {
										m2.push(k)
									}
								} else if (k.Type === mt.Mat) {
									// Properties
									if ((item[0] === k.Properties.Size[0] && item[1] === k.Properties.Size[1]) || (item[1] === k.Properties.Size[0] && item[0] === k.Properties.Size[1])) {
										m2.push(k)
									}
								}
							}
						})
						c.initialize(catId, [...self.materials.filter(v => (v.Type !== mt.Mat && v.Type !== mt.Size)), ...m2], undefined, undefined, () => {
							// 强制将当前尺寸匹配到第一项
							let firstSize = self.matData.sizes[0]
							let select = {
								Type: 'mat',
								mat: undefined,
								angle: 0,
								options: []
							}
							// 在物料中找到这个尺寸的物料数据
							self.materials.filter(v => v.Type === mt.Mat && v.CategoryId !== dc.MultiHole).forEach(item => {
								// 处理正方形
								if (firstSize[0] === firstSize[1]) {
									if (item.Properties.Size[0] === firstSize[0] && item.Properties.Size[1] === firstSize[1]) {
										select.mat = item
										select.options = [item.Properties.Options[0]]
									}
								} else {
									if (item.Properties.Size[0] === firstSize[0] && item.Properties.Size[1] === firstSize[1]) {
										select.mat = item
										select.options = [item.Properties.Options[0]]
									} else if (item.Properties.Size[1] === firstSize[0] && item.Properties.Size[0] === firstSize[1]) {
										select.angle = Angles.Left
										select.mat = item
										select.options = [item.Properties.Options[0]]
									}
								}
							})
							c.selectMaterial({
								Type: 'image',
								Value: self.image
							}, undefined, () => {
								this.isRender = true
								if (c.current.pictures.length > 0) {
									setTimeout(() => {
										c.selectMaterial(select, undefined, (t) => {
												// 初始化用户物料
											// 初始化颜色数据
											// this.initUserOptions()
											// 初始化incomes
											this.initIncome().then(() => {
												self.savePieces(self.pieces)
												self.isSuitable = true
											})
										})
									}, 20)
								}
							})
						})
						break
					case dc.Scroll:
						matData = self.materials.filter(v => v.Type === mt.Template)
						self.matData = matData
						c.initialize(catId, undefined, undefined, undefined, () => {
							c.selectMaterial({
								Type: 'image',
								Value: self.image
							}, undefined, () => {
								this.isRender = true
								if (c.current.pictures.length > 0) {
									setTimeout(function() {
										c.selectMaterial(matData[0], undefined, () => {
											self.initIncome().then(() => {
												self.savePieces(self.pieces)
												self.isSuitable = true
											})
										})
									}, 1)
								}
							})
						})
						break
					case dc.Rimless:
					case dc.Magnet:
						matData = self.filterFramesSize2()
						self.matData = matData
						c.initialize(catId, undefined, undefined, undefined, () => {
							c.selectMaterial({
								Type: 'image',
								Value: self.image
							}, undefined, (t) => {
								this.isRender = true
								if (c.current.pictures.length > 0) {
									// 初始化用户物料
									setTimeout(function() {
										c.selectMaterial({
											Type: mt.Size,
											Size: matData[0]
										}, undefined, () => {
											self.initIncome().then(() => {
												self.savePieces(self.pieces)
												self.isSuitable = true
											})
										})
									}, 1)
								}
							})
						})
						break
					default:
						matData = self.materials.filter(v => !v.Type)
						self.matData = matData
						c.initialize(catId, undefined, undefined, undefined, () => {
							c.selectMaterial({
								Type: 'image',
								Value: self.image
							}, undefined, (t) => {
								this.isRender = true
								if (c.current.pictures.length > 0) {
									// 初始化用户物料
									self.initIncome().then(() => {
										self.savePieces(self.pieces)
										self.isSuitable = true
									})
								}
							})
						})
						break
				}
			}
		},
		// 初始化生成income
		// 每个income对应有一个custom
		// 针对有框画做特殊的income处理
		// 拿到有框画的尺寸,然后进行过滤操作
		initIncome() {
			// 根据matData
			return new Promise(resolve => {
				const self = this
				const id = this.categoryId
				let promise = []
				let select = {}
				let m // 物料
				let incomeCustom // Array 每条income的custom组成的数组
				let incomes = []
				switch(id) {
					case dc.Frames:
						// 获取matData,根据里面的尺寸以及尺寸的方向,匹配到初始的数据
						// 1. 过滤出尺寸信息 2. 获取图片参数, 初始化custom
						let m2 = []
						let m3 = self.materials.filter(v => (v.Type === mt.Mat || v.Type === mt.Size) && v.CategoryId !== dc.MultiHole)
						self.matData.sizes.forEach(item => {
							for (let k of m3) {
								if (k.Type === mt.Size) {
									if ((item[0] === k.Size[0] && item[1] === k.Size[1]) || (item[1] === k.Size[0] && item[0] === k.Size[1])) {
										m2.push(k)
									}
								} else if (k.Type === mt.Mat) {
									// Properties
									if ((item[0] === k.Properties.Size[0] && item[1] === k.Properties.Size[1]) || (item[1] === k.Properties.Size[0] && item[0] === k.Properties.Size[1])) {
										m2.push(k)
									}
								}
							}
						})
						// 物料上的数据
						m = [...self.materials.filter(v => (v.Type !== mt.Mat && v.Type !== mt.Size)), ...m2]
						self.initIncomeCustom(m, self.image, self.matData).then(all => {
							// all 每个income对应的custom
							let matless = []
							let frame = []
							all.forEach(v => {
								let o = {
									select: true,
									bonus: 20,
									custom: v,
									materials: [...v.current.materials.filter(k => k.Type === mt.Paper || k.Type === mt.Glass), ... v.current.materials.filter(k => k.Type === mt.Line).slice(0, MAX_SIZE)],
									options: v.current.entry.CategoryId === dc.Frame ? v.current.selects.filter(k => k.Type === 'mat')[0].mat.Properties.Options.slice(0, MAX_SIZE) : [],
								}
								if (v.current.entry.CategoryId === dc.Matless) {
									matless.push(o)
								} else if (v.current.entry.CategoryId === dc.Frame) {
									frame.push(o)
								}
							})
							self.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes = matless
							self.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes = frame
							self.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes.forEach((item, index) => {
								if (index > MAX_SIZE - 1) {
									item.select = false
								}
							})
							self.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes.forEach((item, index) => {
								if (index > MAX_SIZE - 1) {
									item.select = false
								}
							})
							self.initMatData2()
							
						})
						break
					case dc.Rimless:
						self.initIncomeCustom(self.materials, self.image, self.matData).then(all => {
							all.forEach(v => {
								let o = {
									select: true,
									bonus: 20,
									custom: v,
									materials: [...v.current.materials.filter(k => k.Type === mt.Canvas), ...v.current.materials.filter(k => k.Type === mt.InnerLine).slice(0, MAX_SIZE), ...v.current.materials.filter(k => k.Type === mt.OuterLine).slice(0, MAX_SIZE)],
									options: [],
								}
								incomes.push(o)
							})
							incomes.forEach((item, index) => {
								if (index > MAX_SIZE - 1) {
									item.select = false
								}
							})
							self.pieces[0].Incomes = incomes
							self.initMatData2()
							
						})
						break
					case dc.Magnet:
						self.initIncomeCustom(self.materials, self.image, self.matData).then(all => {
							all.forEach(v => {
								let o = {
									select: true,
									bonus: 20,
									custom: v,
									materials: [...v.current.materials.filter(k => k.Type === mt.Canvas), {Type: mt.MagnetLine, Name:'无画框'}, ...v.current.materials.filter(k => k.Type === mt.MagnetLine).slice(0, MAX_SIZE)],
									options: [],
								}
								incomes.push(o)
							})
							incomes.forEach((item, index) => {
								if (index > MAX_SIZE - 1) {
									item.select = false
								}
							})
							self.pieces[0].Incomes = incomes
							self.initMatData2()
						})
						break
					case dc.Scroll:
						self.initIncomeCustom(self.materials, self.image, self.matData).then(all => {
							for (let v of all) {
								let o = {
									select: true,
									bonus: 20,
									custom: v,
									materials: [...self.materials.filter(v => v.Type === mt.Template)],
									options: []
								}
								incomes.push(o)
							}
							incomes.forEach((item, index) => {
								if (index > MAX_SIZE - 1) {
									item.select = false
								}
							})
							self.pieces[0].Incomes = incomes
							self.initMatData2()
							
						})
						break
					default:
						self.initIncomeCustom(self.materials, self.image, self.matData).then(all => {
							all.forEach(v => {
								let o = {
									select: true,
									bonus: 20,
									custom: v,
									materials: [],
									options: v.current.materials.filter(k => k.Id === v.current.entry.ProductId)[0].Properties,
								}
								incomes.push(o)
							})
							incomes.forEach((item, index) => {
								if (index > MAX_SIZE - 1) {
									item.select = false
								}
							})
							self.pieces[0].Incomes = incomes
							self.initMatData2()
						})
						break
				}
				resolve()
			})
		},
		// 生成编辑产品的income
		initIncome2(matData = this.matData) {
			let self = this
			const catId = self.categoryId
			let s1 = [] // 已经生成的商品, 装饰画放尺寸进去
			let s2 = [] // 没有生成但是可以做的商品
			return new Promise(resolve => {
				// 当前所有尺寸
				let m = matData
				let p = self.propsPieces
				let promises = []
				switch(catId) {
					case dc.Frames:
						let frame = []
						let matless = []
						let frame_incomes = p.filter(v => v.CategoryId === dc.Frame)[0].Incomes
						let matless_incomes = p.filter( v => v.CategoryId === dc.Matless)[0].Incomes
						if (!m.mixs && m.mixs.constructor !== Array) return false
						let len1
						let len2
						m.mixs.forEach(v => {
							if (!v.mat) return false
							if (v.mat.Type === mt.Mat) {
								frame.push(v)
							} else if (v.mat.Type === mt.Size) {
								matless.push(v)
							}
						})
						len1 = frame.length
						len2 = matless.length
						// 做一次去重操作
						for (let i = 0; i < len1; i++) {
							for (let j = i + 1;j < len1; j++) {
								if (frame[i].size[0] === frame[j].size[0] && frame[i].size[1] === frame[j].size[1]) {
									frame.splice(j, 1)
									len1--
									j--
								}
							}
						}
						for (let i = 0; i < len2; i++) {
							for (let j = i + 1;j < len2; j++) {
								if (matless[i].size[0] === matless[j].size[0] && matless[i].size[1] === matless[j].size[1]) {
									matless.splice(j, 1)
									len2--
									j--
								}
							}
						}
						matless.forEach(item => {
							let s1 =  item.size
							for ( let k of matless_incomes) {
								let s2 = k.Packets
								if (s1[0] === s2[0] && s1[1] === s2[1]) {
									item['entryId'] = k.Entries
									item['pictures'] = k.Pictures
									item['bonus'] = k.Bonus
									item['materials'] = k.Materials && k.Materials
									item['options'] = k.Options && k.Options
								}
							}
						})
						frame.forEach(item => {
							let id1 = item.id
							let angle1 = item.angle
							for (let k of frame_incomes) {
								let id2 = k.Packets[0]
								let angle2 = k.Packets[1]
								if (id1 === id2) {
									if ((angle1 === Angles.Up || angle1 === Angles.Down) && (angle2 === Angles.Up || angle2 === Angles.Down)) {
										item['entryId'] = k.Entries
										item['pictures'] = k.Pictures
										item['bonus'] = k.Bonus
										item['materials'] = k.Materials && k.Materials
										item['options'] = k.Options && k.Options
										break
									} else if ((angle1 === Angles.Left || angle1 === Angles.Right) && (angle2 === Angles.Left || angle2 === Angles.Right)) {
										item['entryId'] = k.Entries
										item['pictures'] = k.Pictures
										item['bonus'] = k.Bonus
										item['materials'] = k.Materials && k.Materials
										item['options'] = k.Options && k.Options
									}
								}
							}
						})
						Promise.all([...matless, ...frame].map(v => {
							return new Promise((resolve) => {
								let c = newCustom()
								let pictures
								let o = {
									bonus: 20,
									options: [],
									materials: [],
									custom: undefined,
									select: false
								}
								if (v.entryId) {
									o.select = true
									o.bonus = v.bonus
									this.$request.get('entry', v.entryId).then(res => {
										let entry = res.take('Data')
										let options
										let materials = []
										c.initialize(catId, undefined, entry[0], entry, () => {
											// 序列化图片数据
											let pictures = serializePicture3.call(this, v.pictures[0])
											c.entries[0].pictures = [pictures]
											o.custom = c
											c.current.materials.filter(j => {
												for (let k of v.materials) {
													if (j.Id === k && j.Type !== mt.Size) {
														o.materials.push(j)
													}
												}
											})
											if (c.current.entry.CategoryId === dc.Frame) {
												let opts = c.current.materials.filter(k => k.Type === mt.Mat).filter(k => k.Id === c.current.selects.filter(j => j.Type === 'mat')[0].mat.Id)[0].Properties.Options
												v.options.forEach(item => {
													for (let k of opts) {
														if (item === k.Property.OptionId) {
															o.options.push(k)
														}
													}
												})
											}
											if (o.custom.current.entry.CategoryId === dc.Matless) {
												o.custom.current.selects.push({
													Type: 'mat',
													mat: {
														Type: mt.Size,
														Size: o.custom.current.selects.filter(c => c.Type === mt.Size)[0].Size
													},
													angle: 0,
													options: []
												})
											}
											resolve(o)
										})
									})
								} else {
									c.initialize(catId, undefined, undefined, undefined, () => {
										c.selectMaterial({
											Type: 'image',
											Value: self.image
										}, undefined, () => {
											setTimeout(function() {
												let select = {
													Type: 'mat',
													mat: v.mat,
													angle: v.angle,
													options: undefined
												}
												switch(v.mat.Type) {
													case mt.Mat:
														select.options = v.mat.Properties.Options.slice(0, 1)
														break
													case mt.Size:
														select.options = []
														break
												}
												c.selectMaterial(select, undefined, () => {
													o.custom = c
													o.materials = [...c.current.materials.filter(v => v.Type === mt.Line).slice(0, MAX_SIZE), ...c.current.materials.filter(v => v.Type !== mt.Line && v.Type !== mt.Mat && v.Type !== mt.Size)]
													if (c.current.entry.CategoryId === dc.Frame) {
														let opts = c.current.materials.filter(k => k.Type === mt.Mat).filter(k => k.Id === c.current.selects.filter(j => j.Type === 'mat')[0].mat.Id)[0].Properties.Options
														o.options = opts.slice(0, MAX_SIZE)
													}
													resolve(o)
												})
											}, 1)
										})
									})
								}
							})
						})).then(all => {
							let matless = []
							let frame = []
							all.forEach(item => {
								if (item.custom.current.entry.CategoryId === dc.Matless) {
									matless.push(item)
								} else if (item.custom.current.entry.CategoryId === dc.Frame) {
									frame.push(item)
								}
							})
							self.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes = matless
							self.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes = frame
							resolve()
						})
						break
					case dc.Rimless:
					case dc.Magnet:
						// 已经做的尺寸
						// 没做的尺寸
						let sizes = p[0].Incomes
						let sizes1 = [...m]
						sizes1.forEach(item => {
							for (let k of sizes){
								let s = k.Packets
								if (item[0] === s[0] && item[1] === s[1]) {
									item['entryId'] = k.Entries
									item['pictures'] = k.Pictures
									item['bonus'] = k.Bonus
									item['materials'] = k.Materials && k.Materials
								}
							}
						})
						return Promise.all(sizes1.map(v => {
							return new Promise(resolve => {
								let c = newCustom()
								let pictures
								let o = {
									bonus: 20,
									options: [],
									materials: [],
									custom: undefined,
									select: false
								}
								if (v.entryId) {
									o.select = true
									o.bonus = v.bonus
									self.$request.get('entry', v.entryId).then(res => {
										let entry = res.take('Data')
										c.initialize(catId, undefined, entry[0], entry, () => {
											let pictures = serializePicture3.call(this, v.pictures[0])
											c.entries[0].pictures = [pictures]
											o.custom = c
											v.materials.forEach(item => {
												c.current.materials.forEach(k => {
													if (k.Id === item) {
														o.materials.push(k)
													}
												})
											})
											resolve(o)
										})
									})
								} else {
									c.initialize(catId, undefined, undefined, undefined, () => {
										c.selectMaterial({
											Type: 'image',
											Value: self.image
										}, undefined, () => {
											setTimeout(function() {
												c.selectMaterial({
													Type: mt.Size,
													Size: v
												}, undefined, () => {
													o.custom = c
													if (c.current.entry.CategoryId === dc.Rimless) {
														o.materials = [...c.current.materials.filter(k => k.Type === mt.InnerLine).slice(0, MAX_SIZE), ...c.current.materials.filter(k => k.Type === mt.OuterLine).slice(0, MAX_SIZE), ...c.current.materials.filter(k => k.Type === mt.Canvas)]
													} else if (c.current.entry.CategoryId === dc.Magnet) {
														o.materials = [...c.current.materials.filter(k => k.Type === mt.Canvas), ...c.current.materials.filter(k => k.Type === mt.MagnetLine)]
													}
													resolve(o)
												})
											}, 1)
										})
									})
								}
							})
						})).then(all => {
							self.pieces[0].Incomes = all
							resolve()
						})
						break
					case dc.Scroll:
						let scroll = p[0].Incomes
						m.forEach(item => {
							for (let k of scroll) {
								let id = k.Packets[0]
								if (id === item.Id) {
									item['entryId'] = k.Entries
									item['pictures'] = k.Pictures
									item['bonus'] = k.Bonus
								}
							}
						})
						Promise.all(m.map(v => {
							return new Promise(resolve => {
								let c = newCustom()
								let o = {
									bonus: 20,
									options: [],
									materials: [],
									custom: undefined,
									select: false
								}
								if (v.entryId) {
										o.select = true
										o.bonus = v.bonus
										self.$request.get('entry', v.entryId).then(res => {
											let entry = res.take('Data')
											c.initialize(catId, undefined, entry[0], entry, () => {
												let pictures = serializePicture3.call(this, v.pictures[0])
												c.entries[0].pictures = [pictures]
												o.custom = c
												resolve(o)
											})
										})
								} else {
									c.initialize(catId, undefined, entry[0], entry, () => {
											c.selectMaterial({
												Type: 'image',
												Value: self.image
											}, undefined, () => {
												setTimeout(function() {
													c.selectMaterial(v, undefined, () => {
														o.custom = c
														resolve(o)
													})
												}, 1)
											})
									})
								}
							})
						})).then(all => {
							self.pieces[0].Incomes = all
							resolve()
						})
						break
					default:
						let newProduct = p[0].Incomes
						m.forEach(item => {
							for (let k of newProduct) {
								if (item.Id === k.Packets[1]) {
									item['entryId'] = k.Entries
									item['pictures'] = k.Pictures
									item['bonus'] = k.Bonus
									item['options'] = k.Options
								}
							}
						})
						Promise.all(m.map(v => {
							return new Promise(resolve => {
								let o = {
									bonus: 20,
									options: [],
									materials: [],
									custom: undefined,
									select: false
								}
								let c = newCustom()
								if (v.entryId) {
									o.select = true
									o.bonus = v.bonus
									self.$request.get('entry', v.entryId).then(res => {
										let entry = res.take('Data')
										c.initialize(catId, undefined, entry[0], entry, () => {
											let pictures = serializePicture3.call(this, v.pictures[0])
											c.entries[0].pictures = [pictures]
											o.custom = c
											c.current.materials.filter(v => v.Id === c.current.entry.ProductId)[0].Properties.forEach(item => {
												for (let k of v.options) {
													if (item.OptionId === k) {
														o.options.push(item)
													}
												}
											})
											resolve(o)
										})
									})
								} else {
									// 没有选中的初始化
									c.initialize(catId, m, undefined, undefined, () => {
										c.selectMaterial({
											Type: 'image',
											Value: self.image
										}, undefined, () => {
											setTimeout(function() {
												c.selectMaterial({
													Type: 'product',
													product: v,
													options: freshProductOptions(v.Properties.map(k => k.OptionId), v)
												}, undefined, () => {
													o.custom = c
													c.current.materials.filter(k => k.Id === c.current.entry.ProductId)[0].Properties.forEach(item => {
														o.options.push(item)
													})
													return resolve(o)
												})
											}, 1)
										}) 
									})
								}
							})
						})).then(all => {
							self.pieces[0].Incomes = all
							resolve()
						})
						break
				}
				
			})
		},
		/**
		 * 初始化每个pieces的incomes
		 * @param {Array} materials 初始化所需要的物料
		 * @param {Object} image 初始化时的图片数据
		 * @param {Array} matData 每条income所需要对应的数据
		 */
		initIncomeCustom(materials, image, matData) {
			// 判断是否是编辑状态
			const self = this
			const id = self.categoryId
			let m = materials
			if (this.isEdit) {
				
			} else {
				switch(id) {
					case dc.Frames:
						let frame = []
						let matless = []
						if (!matData.mixs && matData.mixs.constructor !== Array) return false
						let len1
						let len2
						matData.mixs.forEach(v => {
							if (!v.mat) return false
							if (v.mat.Type === mt.Mat) {
								frame.push(v)
							} else if (v.mat.Type === mt.Size) {
								matless.push(v)
							}
						})
						len1 = frame.length
						len2 = matless.length
						// 做一次去重操作
						for (let i = 0; i < len1; i++) {
							for (let j = i + 1;j < len1; j++) {
								if (frame[i].size[0] === frame[j].size[0] && frame[i].size[1] === frame[j].size[1]) {
									frame.splice(j, 1)
									len1--
									j--
								}
							}
						}
						for (let i = 0; i < len2; i++) {
							for (let j = i + 1;j < len2; j++) {
								if (matless[i].size[0] === matless[j].size[0] && matless[i].size[1] === matless[j].size[1]) {
									matless.splice(j, 1)
									len2--
									j--
								}
							}
						}
						return Promise.all([...frame, ...matless].map(v => {
							return new Promise(resolve => {
								let c = newCustom()
								c.initialize(id, m, undefined, undefined, () => {
									c.selectMaterial({
										Type: 'image',
										Value: image
									}, undefined, (t) => {
										setTimeout(function() {
											let select = {
												Type: 'mat',
												mat: v.mat,
												angle: v.angle,
												options: undefined
											}
											switch(v.mat.Type) {
												case mt.Mat:
													select.options = v.mat.Properties.Options.slice(0, 1)
													break
												case mt.Size:
													select.options = []
													break
											}
											c.selectMaterial(select, undefined, () => {
												return resolve(c)
											})
										}, 1000)
									})
								})
							})
						}))
						break
					case dc.Rimless:
					case dc.Magnet:
						return Promise.all(matData.map(v => {
							return new Promise(resolve => {
								let c = newCustom()
								c.initialize(id, m, undefined, undefined, () => {
									c.selectMaterial({
										Type: 'image',
										Value: image
									}, undefined, () => {
										setTimeout(function() {
											c.selectMaterial({
												Type: mt.Size,
												Size: v
											}, undefined, () => {
												return resolve(c)
											})
										}, 1)
									})
								})
							})
						}))
						break
					case dc.Scroll:
						return Promise.all(matData.map(v => {
							return new Promise((resolve) => {
								let c = newCustom()
								c.initialize(id, m, undefined, undefined, () => {
									c.selectMaterial({
										Type: 'image',
										Value: image
									}, undefined, () => {
										setTimeout(function() {
											c.selectMaterial(v, undefined, () => {
												return resolve(c)
											})
										}, 1)
									})
								})
							})
						}))
						break
					default:
						return Promise.all(matData.map(v => {
							return new Promise((resolve) => {
								let c = newCustom()
								c.initialize(id, m, undefined, undefined, () => {
									c.selectMaterial({
										Type: 'image',
										Value: image
									}, undefined, () => {
										setTimeout(function() {
											c.selectMaterial({
												Type: 'product',
												product: v,
												options: freshProductOptions(v.Properties.map(k => k.OptionId), v)
											}, undefined, () => {
												return resolve(c)
											})
										}, 1)
									}) 
								})
							})
						}))
						break
				}
			}
			// 根据每一个车品类下的尺寸, 做一个重新初始化的操作
		},
		// 过滤有框画尺寸
		filterFramesSize() {
			const self = this
			const id = self.categoryId // 品类id
			let imgSize // 图片尺寸
			let fix = undefined // 备注为false
			let sizes = [] // 尺寸数据
			let mixs = [] // 序列化后需要的数据
			let frame = [] // 有卡纸
			let matless = [] // 无卡纸
			let frame2 = [] // 能做的有卡纸数据
			let matless2 = [] // 能做的无卡纸数据
			let mixs2 = [] // 最终过滤出的数据
			let sizes2 = [] // 最终过滤出的尺寸
			let holes = new Array(3).fill(0)
			if (self.image) {
				imgSize = parseSize(this.image.File)
				if (self.image.Info.Rotate / 90 % 2 === 1) {
					imgSize = swapSize(imgSize)
				}
			}
			let push = s => {
				for (let i of sizes) {
					if (equalSize(i, s)) return
				}
				sizes.push(s)
			}
			let f = s => ! fix || equalSize(fix, s)
			self.materials.filter(v => v.CategoryId !== dc.MultiHole).forEach(v => {
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
			// 首先找到sizes,用这里面的尺寸过滤出有卡纸和无卡纸的数据
			
			sizes.forEach(item => {
				for (let k of mixs) {
					if (k.mat) {
						let s = k.size
						if (k.mat.Type === mt.Size) {
							if (item[0] === s[0] && item[1] === s[1]) {
								matless.push(k)
							}
						} else if (k.mat.Type === mt.Mat) {
							if (item[0] === s[0] && item[1] === s[1]) {
								// 做一次过滤判断
								frame.push(k)
							}
						}
					}
				}
			})
			// 对有卡画进行去重操作
			let len = frame.length
			for (let i = 0; i < len; i++) {
				for (let j = i + 1; j < len; j++) {
					if (frame[i].size[0] === frame[j].size[0] && frame[i].size[1] === frame[j].size[1]) {
						frame.splice(j, 1)
						len--
						j--
					}
				}
			}
			// 将捕获到的尺寸数据进行过滤操作
			frame.forEach(item => {
				frame2.push(fitSize2({Size:item.size, Full: Fulls.Always, Item: item}, imgSize, window.$categories.get(dc.Frame).DPI))
			})
			matless.forEach(item => {
				matless2.push(fitSize2({Size:item.size, Full: Fulls.Always, Item: item}, imgSize, window.$categories.get(dc.Matless).DPI))
			})
			frame2 = frame2.filter(v => v)
			matless2 = matless2.filter(v => v)
			// 匹配成一样的元素,传入
			frame2.forEach(item => {
				let s = item.Size
				sizes2.push(s)
				for (let k of mixs) {
					if (k.mat.Type === mt.Mat) {
						if (s[0] === k.size[0] && s[1] === k.size[1]) {
							mixs2.push(k)
						}
					}
				}
			})
			matless2.forEach(item => {
				let s = item.Size
				let state = mixs2.some(v => {
					if (v.size[0] === s[0] && v.size[1] === s[1]) {
						return true
					}
				})
				if (!state) {
					sizes2.push(s)
				}
				for (let k of mixs) {
					if (k.mat.Type === mt.Size) {
						if (s[0] === k.size[0] && s[1] === k.size[1]) {
							mixs2.push(k)
						}
					}
				}
			})
			// 截取6条尺寸, 单必须保证当前选中的尺寸在其中
			// sizes2 = sizes2.slice(0, MAX_SIZE)
			mixs2 = mixs2.filter(v => {
				for (let k of sizes2) {
					if (k[0] === v.size[0] && k[1] === v.size[1]) {
						return v
					}
				}
			})
			return {
				holes: n,
				sizes: sizes2,
				mixs: mixs2
			}
		},
		// 过滤纸其他的尺寸数据, 磁贴画,布艺画
		filterFramesSize2() {
			const self = this
			let a = {h: [], v: [], s: []}
			let b = []
			let imageSize
			if (this.image) {
				imageSize = parseImageSize(this.image)
			}
      let filterStatus = (size, hole) => {
        if (!size) return false
        let filterStatusByImage = true
        if (this.image) {
          filterStatusByImage = fitSize({Full: Fulls.Always, Size: hole || size}, imageSize, window.$categories.get(this.categoryId).DPI)
        }
        return !!filterStatusByImage
      }
      let classify = arr => {
        let type = sizeShape(arr)
        for (let v of a[type]) {
          if (equalSize(v, arr)) return
        }
        a[type].push(arr)
      }
      this.materials.filter(v => {
        return v.Type === mt.Size
      }).forEach(v => {
        filterStatus(copySize(v.Size)) && classify(copySize(v.Size))
        filterStatus(swapSize(v.Size)) && classify(swapSize(v.Size))
      })
      for (var t in a) {
        a[t].sort((i, j) => {
          let x = sizeShape(j).localeCompare(sizeShape(i))
          if (x === 0) return i[0] - j[0] || i[1] - j[1]
          return x
        })
			}
			for (let i in a) {
				for (let k of a[i]) {
					b.push(k)
				}
			}
      return b
		},
		// 是否出售商品
		onSell() {
			let sell = this.$refs.sell
			let sellbtn = this.$refs.sellbtn
			this.isSell = !this.isSell
			!this.isSell ? sell.classList.add('masking') : sell.classList.remove('masking')
			!this.isSell ? $(sellbtn).text("可出售") : $(sellbtn).text("不出售")
			this.pieces.forEach(item => {
				item.isSell = this.isSell
			})
		},
		// 展开编辑组件
		onEdit() {
			this.myIndex === this.openIndex ? this.$emit('toggle-edit', -1) : this.$emit('toggle-edit', this.myIndex)
		},
		saveModif() {
			this.$emit('toggle-edit', -1)
		},
		// 初始化编辑组件的位置
		initPosition() {
			let product = this.$refs.productItem
			let left = product.getBoundingClientRect().left
			this.editCss.l = `-${left}px`
		},
		setImage(action, param, id) {
			this.op('set-image', action, param)
		},
		onRotate(mode, a, r) {
			let c = this.custom;
			if (c.waiting) return;
			const warnMsg = msg => layer.toast(`请先选择${msg}哦o_o`);
			let i = c.pictureIndex;
			// 要对所有的income数据进行此操作
			let p = getByProperty(c.current.pictures, i, "Index");
			if (a === "rotate" && isDecorate(c.current.entry.CategoryId)) {
				let s = parseImageSize(p.Image);
				let material = c.changeSize(s, true);
				if (material) {
					p.Output.Size = swapSize(p.Output.Size);
					c.selectMaterial(material);
				}
			}
			changePicture(p, a, r, this.n);
		},
		op(mode, a, b) {
			let c = this.custom
			if (c.waiting) return
			const warnMsg = msg => layer.toast(`请先选择${msg}哦o_o`)
			let i = c.pictureIndex
			switch (i) {
				case -2:
					warnMsg('照片')
					return
				case -1:
					warnMsg('孔')
					return
			}
			let p = getByProperty(c.current.pictures, i, 'Index')
			if (!p) {
				// 因为在触发mouseleave事件时，会检查overstep，
				// 所以在没选择图片时，触发mouseleave事件不提示warnMsg('图片')
				a !== 'overstep' && warnMsg('图片')
				return
			}
			// if (a === 'rotate' && isDecorate(c.current.entry.CategoryId)) {
			// 	let s = parseImageSize(p.Image)
			// 	let material = c.changeSize(s, true)
			// 	if (material) {
			// 		p.Output.Size = swapSize(p.Output.Size)
			// 		c.selectMaterial(material)
			// 	}
			// }
			switch (mode) {
				case 'set-image':
					changePicture(p, a, b, 1)
					break
				case 'reset-image':
					resetPicture(p, a)
					break
			}
			this.saveIncomes()
		},
		// 当我们操作物料后,控制custom的切换
		saveIncomes() {
			const self = this
			const id = self.custom.current.entry.CategoryId
			let entryId = self.custom.current.entry.Id
			let incomes
			if (id === dc.Frame) {
				incomes = this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
			} else if (id === dc.Matless) {
				incomes = this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes
			} else {
				incomes = this.pieces[0].Incomes
			}
			for (let i = 0; i < incomes.length; i++) {
				if (entryId === incomes[i].custom.current.entry.Id) {
					incomes[i].custom = self.custom
				}
			}
		},
		resetImage(type) {
			this.op("reset-image", type)
		},
		// 初始化用户选择的物料
		initUserMatrial() {
			// 如果是编辑状态
			let m = this.custom.current.materials
			let state = m.some(v => v.Default || v.default)
			// 如果是编辑状态,直接获取后台获取到的物料数据
			if (this.isEdit) {

			} else {
				if (!state) {
					switch(this.categoryId) {
						case dc.Frames:
							this.userMaterials = m.filter(v => v.Type === mt.Line).slice(0, MAX_SIZE)
							break
						case dc.Magnet:
							this.userMaterials = [{Type: mt.MagnetLine, Name:'无画框'}, ...m.filter(v => v.Type === mt.MagnetLine)]
							break
						case dc.Scroll:
							this.userMaterials = m.filter(v => v.Type === mt.Template)
							break
						case dc.Rimless:
							this.userMaterials = [...m.filter(v => v.Type === mt.OuterLine).slice(0, MAX_SIZE), ...m.filter(v => v.Type === mt.InnerLine).slice(0, MAX_SIZE), ...m.filter(v => v.Type === mt.Canvas)]
							break
					}
				}
			}
		},
		// 选择物料
		selectMaterial(y, triggerBom) {
			// 需要对每个income都进行物料选择操作
			const self = this
			let c = self.custom
			let cnt = c.current
			const catId = self.categoryId
			let incomes
			if (y.Type === 'mat' && cnt.entry.CategoryId === dc.Matless && y.options.length > 0) {
				let size = y.mat.Size
				incomes = this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
				let cus2 = incomes.filter(v => {
					let select = v.custom.current.selects.filter(k => k.Type === 'mat')[0]
					let s2 = select.mat.Properties.Size
					if (size[0] === s2[0] && size[1] === s2[1]) {
						if (select.angle === Angles.Up || select.angle === Angles.Down) {
							return v
						}
					} else if (size[1] === s2[0] && size[0] === s2[1]) {
						if (select.angle === Angles.Left || select.angle === Angles.Right) {
							return v
						}
					}
				})[0].custom
				this.custom = cus2
				c = this.custom
				y.angle = cus2.current.selects.filter(v => v.Type === 'mat')[0].angle
				y.mat = cus2.current.selects.filter(v => v.Type === 'mat')[0].mat
			}
			c.selectMaterial(y, triggerBom, () => {
				switch(catId) {
					case dc.Frames:
						if (c.current.entry.CategoryId === dc.Frame) {
							incomes = self.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
							for (let i = 0; i < incomes.length; i++) {
								if (incomes[i].custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Id === cnt.selects.filter(v => v.Type === 'mat')[0].mat.Id) {
									incomes[i].custom = c
									break
								}
							}
						} else if (c.current.entry.CategoryId === dc.Matless) {
							incomes = self.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes
							for (let i = 0; i < incomes.length; i++) {
								let s1 = incomes[i].custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Size
								let s2 = cnt.selects.filter(v => v.Type === 'mat')[0].mat.Size
								if (s1[0] === s2[0] && s1[1] === s2[1]) {
									incomes[i].custom = c
									break
								}
							}
						}
						break
					case dc.Rimless:
					case dc.Magnet:
						incomes = self.pieces[0].Incomes
						for (let i = 0; i < incomes.length; i++) {
							let s1 = incomes[i].custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
							let s2 = cnt.selects.filter(v => v.Type === mt.Size)[0].Size
							if (s1[0] === s2[0] && s1[1] === s2[1]) {
								incomes[i].custom = c
								break
							}
						}
						break
					case dc.Scroll:
						break
					default:
						incomes = self.pieces[0].Incomes
						for (let i = 0; i< incomes.length; i++) {
							if (incomes[i].custom.current.entry.ProductId === cnt.entry.ProductId) {
								incomes[i].custom = c
							}
						}
						break
				}
			})
		},
		// 针对每个income切换的物料操作
		selectIncome(y, triggerBom) {
			const id = this.categoryId
			let c = this.custom
			let s
			let incomes
			switch (id) {
				case dc.Frames:
					if (y.Type === 'mat') {
						// 有卡画
						// s = c.current.selects.filter(v => v.Type === 'mat')[0]
						let mat = c.current.selects.filter(v => v.Type === 'mat')[0]
						if (mat.mat.Type === mt.Size) {
							if (mat.mat.Size[0] === y.mat.Size[0] && mat.mat.Size[1] === y.mat.Size[1]) return false
						} else if (mat.mat.Type === mt.Mat) {
							if (y.mat.Id === mat.mat.Id && y.angle === mat.angle) return false
						}
						// 如果是有卡画
						if (this.custom.current.entry.CategoryId == dc.Frame) {
							incomes = this.pieces.filter( v => v.CategoryId === dc.Frame)[0].Incomes
							if (y.mat.Properties.Size[0] === y.mat.Properties.Size[1]) {
								this.custom = incomes.filter(v => {
									let s = v.custom.current.selects.filter(v => v.Type === 'mat')[0]
									if (s.mat.Id === y.mat.Id) {
										return v
									}
								})[0].custom
							} else {
								this.custom = incomes.filter(v => {
									let s = v.custom.current.selects.filter(v => v.Type === 'mat')[0]
									return s.angle === y.angle && s.mat.Id === y.mat.Id
								})[0].custom
							}
						} else if (this.custom.current.entry.CategoryId === dc.Matless) {
							// 处理无卡画
							incomes = this.pieces.filter( v => v.CategoryId === dc.Matless)[0].Incomes
							s = y.mat.Size
							this.custom = incomes.filter(v => {
								let s2 = v.custom.current.selects.filter( k => k.Type === 'mat')[0]
								return s2.mat.Size[0] === s[0] && s2.mat.Size[1] === s[1]
							})[0].custom
						}
					}
					break
				case dc.Rimless:
				case dc.Magnet:
					if (!y.Size) return false
					this.custom = this.pieces[0].Incomes.filter(v => {
						let s1 = v.custom.current.selects.filter(k => k.Type === mt.Size)[0].Size
						return y.Size[0] === s1[0] && y.Size[1] === s1[1]
					})[0].custom
					break
				case dc.Scroll:
					break
				default:
					this.custom = this.pieces[0].Incomes.filter( v=> {
						let id1 = v.custom.current.entry.ProductId
						return y.product.Id === id1
					})[0].custom
					break
			}
		},
		// 切换到无卡纸
		selectOptions(o) {
			let c = this.custom
			if (c.current.entry.CategoryId === dc.Matless) return
			let incomes = this.pieces.filter(v => v.CategoryId === dc.Matless)[0].Incomes
			let s = c.current.selects.filter(v => v.Type === 'mat')[0]
			let size = s.mat.Properties.Size
			let angle = s.angle
			let a  = incomes.filter(v => {
				let s2 = v.custom.current.selects.filter(k => k.Type === mt.Size)[0].Size
				// if (v.custom.current.selects.filter(k => k.Type === 'mat')[0].mat.Type === mt.Size) {
				// 	s2 = v.custom.current.selects.filter(k => k.Type === mt.Size)[0].Size
				// } else if (v.custom.current.selects.filter(k => k.Type === 'mat')[0].mat.Type === mt.Mat) {
				// 	s2 = v.custom.current.selects.filter(k => k.Type === 'mat')[0].mat.Properties.Size
				// }
				if (angle == Angles.Up || angle === Angles.Down) {
					return size[0] === s2[0] && size[1] === s2[1]
				} else if (angle === Angles.Left || angle === Angles.Right) {
					return size[1] === s2[0] && size[0] === s2[1]
				}
			})[0]
			this.custom = a.custom
		},
		// 保存物料
		saveMaterials(c) {
			if (c.constructor !== Array) return false
			let state
			let colors = [] // 颜色数组,需要判断其他品类下是否有这些颜色
			let custom = this.custom
			let incomes
			let size
			let select
			if (c.every(v => v.Type === mt.Line)) {
				state = 'line'
			} else if (c.every(v => v.Type === 0)) {
				state = 'color'
			}
			switch (state) {
				case 'line':
					incomes = this.pieces.filter(v => v.CategoryId === custom.current.entry.CategoryId)[0].Incomes
					for (let i = 0; i < incomes.length; i++) {
						if (incomes[i].custom.current.entry.Id === custom.current.entry.Id) {
							incomes[i].materials = incomes[i].materials.filter(j => j.Type !== mt.Line)
							// this.materials.filter(v => v.Type === mt.Line).forEach(item => {
							// 	for (let j = 0; j < incomes[i].materials; j++) {
							// 		if (item.Id === incomes[i].materials[j].Id) {
							// 			incomes[i].materials.splice(j, 1)
							// 		}
							// 	}
							// })
							incomes[i].materials = [...incomes[i].materials, ...c]
							// incomes[i].materials = c
						}
					}
					break
				case 'color':
					incomes = this.pieces.filter(v => v.CategoryId === dc.Frame)[0].Incomes
					select = custom.current.selects.filter( v => v.Type === 'mat')[0]
					if (custom.current.entry.CategoryId=== dc.Frame) {
						for (let i = 0; i < incomes.length; i++) {
							let custom2 = incomes[i].custom
							if (custom2.current.entry.Id === custom.current.entry.Id) {
								incomes[i].options = c
								break
							}
						}
					} else if (custom.current.entry.CategoryId === dc.Matless) {
						size = select.mat.Size
						for (let i = 0; i < incomes.length; i++) {
							let custom2 = incomes[i].custom
							let select2 = custom2.current.selects.filter(v => v.mat)[0]
							let size2 = select2.mat.Properties.Size
							if (size2[0] !== size2[1]) {
								if (size2[0] === size[0] && size2[1] === size[1] && (select2.angle === Angles.Up || select2.angle === Angles.Down)) {
									incomes[i].options = c
									break
								} else if (size2[0] === size[1] && size2[1] === size[0] && (select2.angle === Angles.Left || select2.angle === Angles.Right)) {
									incomes[i].options = c
									break
								}
							} else {
								if (size2[0] === size[0] && size2[1] === size[1]) {
									incomes[i].options = c
									break
								}
							}
						}
					}
					// 这里判断当前是否是无卡纸
					// let s = this.custom.current.selects.filter(v => v.Type === 'mat')[0]
					// let opts
					// if (s.mat.Type === mt.Mat) {
					// 	opts = s.mat.Properties.Options
					// } else if (s.mat.Type === mt.Size) {
					// 	let matSize = s.mat.Size
					// 	opts = this.custom.current.materials.filter(v => v.Type === mt.Mat).filter(v => {
					// 		let s2 = v.Properties.Size
					// 		return (matSize[0] === s2[0] && matSize[1] === s2[1]) || (matSize[0] === s2[1] && matSize[1] === s2[0])
					// 	})[0].Properties.Options
					// }
					// c.forEach(v => {
					// 	let id1 = v.Property.OptionId
					// 	for (let k of opts) {
					// 		let id2 = k.Property.OptionId
					// 		if (id1 === id2) {
					// 			colors.push(v)
					// 		}
					// 	}
					// })
					// this.userOptions = colors
					break
			}
		},
		savePieces(pieces = this.pieces) {
			// 保存物料
			this.$emit('save-pieces', pieces)
		},
		selectImage(imgData) {
			// 重新初始化图片
			this.isEdit = false
			this.image = imgData
			this.initPieces()
			this.initCustom()
		},
		initMatData2() {
			let matData = JSON.parse(JSON.stringify(this.matData))
			let incomes
			const id = this.categoryId
			let current
			let sizes = []
			// 过滤选中的尺寸 然后根据选中的尺寸, 重新过滤出我们需要的尺寸
			switch(id) {
				case dc.Frames:
					let mixs = []
					// 找到当前无卡画的尺寸
					incomes = this.pieces.filter( v => v.CategoryId === dc.Matless )[0].Incomes
					// 遍历出已经选择的属性
					current = incomes.filter( v => v.select )
					current.forEach(item => {
						let s = item.custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
						sizes.push(s)
					})
					let s2 = matData.sizes.filter( v => {
						for (let k of sizes) {
							if (v[0] === k[0] && v[1] === k[1]) {
								return v
							}
						}
					})
					matData.sizes = s2
					break
				case dc.Rimless:
				case dc.Magnet:
					incomes = this.pieces[0].Incomes
					current = incomes.filter( v => v.select )
					current.forEach(item => {
						let s = item.custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
						sizes.push(s)
					})
					matData = sizes
					break
				case dc.Scroll:
					incomes = this.pieces[0].Incomes
					current = incomes.filter( v => v.select )
					current.forEach(item => {
						let s = item.custom.current.selects.filter(v => v.Type === mt.Template)[0].Id
						sizes.push(s)
					})
					matData = this.materials.filter(j => j.Type === mt.Template).filter(v => {
						for (let k of sizes) {
							if (v.Id === k) {
								return v
							}
						}
					})
					break
				default:
					incomes = this.pieces[0].Incomes
					current = incomes.filter( v => v.select )
					current.forEach(item => {
						let s = item.custom.current.entry.ProductId
						sizes.push(s)
					})
					matData = this.materials.filter(v => {
						for (let k of sizes) {
							if (v.Id === k) {
								return v
							}
						}
					})
					break
			}
			this.matData2 = matData
		}
	}
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/public/variable.scss';

</style> 


