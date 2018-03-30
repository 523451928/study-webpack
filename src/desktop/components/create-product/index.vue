<template>
	<div class="create-product">
		<!-- 整个上传区域 -->
		<div class="upload-image-wrap" :style="wrapStyle">
			<h5 class="upload-title title">发布新产品</h5>
			<div class="upload-image">
				<!-- 未上传 -->
				<div class="upload" v-show="!isUpload">
					<i class="wa wa-cloud-upload"></i>
					<h5>上传作品图</h5>
					<p>建议上传大于1200像素x1700像素的作品图</p>
					<p>作品图尺寸越大，制作效果越好</p>
					<input type="file" accept="image/jpeg,image/png" name="upload" @change='onUploadImg($event,0)'>
					<div class="progress-bar" v-show="isProgress">
							<svg width="150" height="150" style="position: absolute; left: 50%; top: 50%; margin-left: -75px; margin-top: -75px">
									<circle cx="75" cy="75" r="60" stroke-width="10" stroke="#D1D3D7" fill="none"></circle>
									<circle cx="365" cy="75" r="60" stroke-width="10" stroke="#00A5E0" fill="none" transform="matrix(0,-1,1,0,0,440)" :stroke-dasharray="rotate"></circle>
									<text x="55" y="80" fill="#aaaaaa" font-size="14px" textLength="40px">{{progress}}</text>
							</svg>
					</div>
				</div>
				<!-- 已经上传完成 -->
				<div class="upload-done" v-show="isUpload">
					<img :src="images" alt="img">
					<div class="hover">
						<div class="content">
							<i class="wa wa-cloud-update"></i>
							<h5>更换作品</h5>
						</div>
					</div>
					<!-- 进度条 -->
					<div class="progress-bar" v-show="isProgress">
						<svg width="150" height="150" style="position: absolute; left: 50%; top: 50%; margin-left: -75px; margin-top: -75px">
								<circle cx="75" cy="75" r="60" stroke-width="10" stroke="#D1D3D7" fill="none"></circle>
								<circle cx="365" cy="75" r="60" stroke-width="10" stroke="#00A5E0" fill="none" transform="matrix(0,-1,1,0,0,440)" :stroke-dasharray="rotate"></circle>
								<text x="55" y="80" fill="#aaaaaa" font-size="14px" textLength="40px">{{progress}}</text>
						</svg>
					</div>
					<input type="file" accept="image/jpeg,image/png" name="upload" @change='onUploadImg($event,1)'>
				</div>
				<a class="help" href="javascript:void(0)" @click.prevent="contact">需要上传帮助?</a>
			</div>
		</div>
		<!-- 编辑区域 -->
		<article class="work-wrapper" v-show="isEditInfo">
			<h5 class="work-title title">商品预览</h5>
			<div class="work-list">
				<custom v-for="(item, index) in customData" 
				:imageData="imgObj" 
				:categoryId="item.id" 
				:materials="item.material" 
				:propsPieces="item.pieces" 
				:isEdit="isEdit"
				:openIndex="openIndex"
				:myIndex="index"
				@toggle-edit="toggleEdit"
				@save-pieces="savePieces"
				></custom>
			</div>
		</article>
		<!-- 底部描述信息 -->
		<article class="work-describe" v-show="isEditInfo">
			<div class="describe-content">
				<h3 class="title">描述商品</h3>
				<div class="layout-inline-block describe-left item-wrap">
					<div class="item describe-title">
						<label for="describe_title">标题:</label>
						<input type="text" id="describe_title" placeholder="给您的大作起个名吧" v-model="work.Title" :class="inputErr[0] && 'input-err'">
					</div>
					<div class="item describe-introduce">
						<label for="describe_introduce">介绍:</label>
						<textarea type="text" id="describe_introduce" v-model="work.Description" :class="inputErr[1] && 'input-err'">
					</div>
				</div>
				<div class="layout-inline-block describe-right item-wrap">
					<div class="item tag-class">
						<label>选择分类:</label>
						<div class="select-wrap">
							<div class="select-item" v-for="(s, i) in classList" @click="onSelectTag(s)">
								<div class="m-radio" :class="isTagSelects(s.Id)&&'current'">
									<i class="radio"></i>
									<span class="text">{{s.Name}}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="item tag-describe">
						<label>常用标签(最多可选择5项):</label>
						<div class="select-wrap">
							<div class="select-item" v-for="(s,i) in describeList" @click="onSelectTag(s)">
								<div class="m-checkbox" :class="isTagSelects(s.Id)&&'current'">
									<i class="checkbox"></i>
									<span class="text">{{s.Name}}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="item tag-color">
						<label>颜色分类:</label>
						<div class="select-wrap">
							<div class="select-item" v-for="(s,i) in colorList" :class="isTagSelects(s.Id)&&'current'" @click="onSelectTag(s)">
								<div class="box" :style="{background: s.Color}">

								</div>
							</div>
						</div>
					</div>
					<div class="item tag-custom">
						<label for="tag_custom">自定义标签:</label>
						<div class="custom-list">
							<div class="custom-item" v-for="item in selectCustomList">
								<span>{{item}}</span>
								<i class="wa-close" @click="onRemoveTag(item)"></i>
							</div>
						</div>
						<input type="text" placeholder="输入自定义标签，按下回车键即可保存"  @keyup="onSaveCustomTag($event)" ref="keyupInput">
					</div>
				</div>
			</div>
			<div class="btn u-primary-btn submit-btn" @click="saveWork">提交产品</div>
		</article>
	</div>
</template>

<script type="text/javascript">
/*eslint-disable*/
let MAX_SIZE = 6
import Loading from 'components/public/loading.vue' // loading 组件
import { newCustom } from "components/custom/core/custom" // custom组件 核心
import { MinSize, MaxSize } from 'scripts/utils/const'// 一些常量 最小的图片大小和最大的图片大小
import { getEntries } from 'components/custom/display/entry' // 获得品类
import { categoryUtil } from 'scripts/utils/category' // 针对物料的一些过滤方法
import { matchImgSize } from 'scripts/utils/image' // 针对的图片的方法
import { getMaterials, allMaterials } from 'components/custom/core/material.js' // 获得物料的方法
import { mixin as components } from '../custom/components.js' // 物料数组
import { fitSize, serializePicture2 } from 'components/custom/picture/picture'
import Custom from './custom/custom' // custom组件
// import UploadImg from '../public/upload-img/upload-img' // 图片上传组件
import { initMatMap } from './custom/created.js'
import { UrlUtils } from 'scripts/utils/url-utils' // url上的工具方法
import { filterDefault } from './custom/created.js'
import {mixin} from 'components/contactMixin'
import { formCategoryList, copyMaterials, traversalMaterials } from 'scripts/core/utils.js'
import {
		DecorativeCategories as dc,
		MaterialTypes as mt,
	} from "scripts/utils/custom/consts.js" // 一些常量
import { InterfaceMap } from 'scripts/interfaceConst.js'
let urlUtils = new UrlUtils()
/*eslint-disable*/

export default {
	components: {
		Loading,
		Custom,
		// UploadImg
	},
	mixins: [mixin],
	data() {
		return {
			images: undefined, // 上传完成后的用户图片
			wrapStyle: { // 最小
				minHeight: undefined
			},
			work: { // 后台所需要的work格式
				ImageId: undefined, // 主图Id
				ImageFile: undefined, // 主图文件名
				Title: undefined, // 作品标题
				Description: undefined, // 作品描述
				Tags:[],
				Pieces: [
				], // 多个作品的数据存放
			},
			rotate: "0 377", // 旋转的角度
			progress: undefined, //进度
			categoryList: undefined, // 项目中所需要的品类Id的集合, Array
			isProgress: false, // 进度条是否显示
			isUpload: false, // 是否上传完成,如果上传完成,则显示上传完成后的图片,重新上传需要重新置为false
			isEditInfo: false, // 控制底描述信息是否显示
			classList: [], // 分类
			describeList: [], // 常用
			colorList: [],	// 颜色
			selectTag: [],	// 自定义
			customData: undefined, // 初始化custom需要的物料数组
			openIndex: -1, // 选择展开的编辑区域索引
			imgObj: undefined, // 主要的图片数据
			Pieces: new Array(),
			inputErr: [false, false], // 填写表单的错误信息
			isEdit: false, // 判断是创建新产品还是编辑产品
			workId: undefined, // 作品id
			selectCustomList: [], // 自定义标签
			userOptions: [], // 用户选择的数据
			userMaterials: [], // 用户选择的数据
		}
	},
	mounted() {
		const self = this
		self._setContentHeight()
		// 监听浏览器窗口发生改变.
		window.addEventListener('resize', function() {
			self._setContentHeight()
		}, false)
		self.getColorTag()
		self.getWork().then(() => {
			self.isEditInfo = true
		})
		
	},
	methods: {
		/**
			* 请求url上的workId的数据
			*/
		getWork() {
			const self = this
			return new Promise((resolve, reject) => {
				let workId = parseInt(urlUtils.getParams('WorkId'))
				if (!workId) return false
				this.$request.do('GET', `work/manage/get/${workId}`).then(res => {
					let workData = res.take('Data')
					if (!workData) return false
					self.isEdit = true
					self.workId = workData.Id
					self.work.ImageId = workData.ImageId
					self.work.ImageFile = workData.ImageFile
					self.work.Description = workData.Description
					self.selectTag = workData.Tags.filter(v => v.Type !== 0)
					self.selectCustomList = workData.Tags.filter(v => v.Type === 0).map(v => v.Name)
					self.work.Title = workData.Title
					// 根据图片id获取图片数据
					self.getImageData(workData.ImageId).then(images => {
						self.imgObj = images
						self.images = `${InterfaceMap.baseUrl}/thumbnail/image/${workData.ImageId}/960/${images.File}`
						self.isUpload = true
						// 获取当前所有的图片数据
						self._initCategoryList().then(() => {
							self.getAllMaterials(self.categoryList).then(customData => {
								for (let i = 0; i < customData.length; i++) {
									customData[i]['pieces'] = []
									for (let k = 0; k < workData.Pieces.length; k++) {
										if (customData[i].id !== dc.Frames && workData.Pieces[k].CategoryId === customData[i].id) {
											customData[i].pieces.push(workData.Pieces[k])
										} else if (customData[i].id === dc.Frames && (workData.Pieces[k].CategoryId === dc.Frame || workData.Pieces[k].CategoryId === dc.Matless)) {
											customData[i].pieces.push(workData.Pieces[k])
										}
									}
								}
								self.customData = customData
								resolve()
							})
						})
					})
				})
				// if(!workId) {
				// 	reject()
				// } else {
				// 	this.$request.do('GET', `work/manage/get/${workId}`).then(res => {
				// 		let data = res.take('Data')
				// 		if (!data) {
				// 			reject()
				// 		}else {
				// 			// 获得workId上的数据

				// 		}
				// 	}).catch(err => {
				// 		reject()
				// 	})
				// }
			})
		},
		/**
		 * 获得所有品类id,并且将品类1,6,7的数据合并为数据8
		 * 此处做一个初步处理,只是将物料1,6,7做一个合并
		 */
		_initCategoryList() {
			return new Promise((resolve, reject) => {
				let self = this
				self.$request.list('category').then(res => {
					let data = res.take('Data')
					let arr = [] // 品类数据
					let m = categoryUtil.allMap(data)
					m.set(1, m.get(8))
					window.$categories = m
					// 合并品类id
					for (let v of data) {
						if (!v.ParentId && v.Id !== dc.Decorate && v.Id !== 13) {
							arr.push(v.Id)
							continue
						}
						if (v.ParentId && v.ParentId !== dc.Frames && v.Id !== dc.Poster && v.Id !== dc.PhotoWall) {
							arr.push(v.Id)
							continue
						}
					}
					// 品类物料数据
					self.categoryList= formCategoryList(arr)
					resolve()
				})
			})
		},
		onSell(pieces) {
			for (let i of this.Pieces) {
				if (i.CategoryId === pieces.CategoryId) {
					i = pieces
					break
				}
			}

		},
		/**
		 * 获取描述的颜色标签信息
		 */
		getColorTag() {
			let self = this
			let classList = []
			let describeList = []
			let colorList = []
			self.$request.list('tag').then((res) => {
				let data = res.take('Data')
				if (Array.isArray(data) && data.length > 0) {
					data.forEach(item => {
						switch(item.Type) {
							case 1:
								classList.push(item)
								break
							case 2:
								describeList.push(item)
								break
							case 3:
								colorList.push(item)
								break
						}
					})
					self.classList = classList
					self.describeList = describeList
					self.colorList = colorList
					self.selectTag.push(classList[0])
				}
			})
		},
		/**
		 * {上传图片}
		 * @param      {Object} e  { Change事件对象 }
		 * @return     {none}
		 */
		onUploadImg(e, t) {
			let self = this
			self.isEdit = false // 是否是编辑状态
			self.customData = []
			self._initCategoryList()
			.then(() => {
				let file = e.target.files[0]
				if (file) {
					self.isUpload = false
					// 验证图片尺寸
					if (file.size < MinSize) {
						this.$notify({
							type: 'wa-warning',
							text: '图片尺寸太小,请重新选择'
						})
						return
					}
					if (file.size > MaxSize) {
						this.$notify({
							type: 'wa-warning',
							text: '图片尺寸太大,请重新选择'
						})
						return
					}
					let formData = new FormData()
					formData.append("action", "UploadVMKImagePath")
					formData.append('Image', file)
					self.progressBar = true
					// 提交表单
					self.$http.post('image/upload', formData, {
						// 控制进度,对外暴露进度条的进度
						progress(e){
							if (!self.isProgress) {
								self.isProgress = true;
							}
							let t = e.total; // 总长度
							let c = e.loaded; // 当前进度
							let p = Math.floor(c / t * 100); // 百分比
							self.rotate = `${p * 3.77} 377`;
							self.progress = `${p}%`;
						}
					}).then(res => {
						let data = res.body
						delete data.Duplicate
						self.isProgress = false // 进度条是否展示
						self.rotate = "0 377" // 进度条的旋转角度
						self.openIndex = -1
						self.$request.do('GET', `work/manage/get/image/${data.Id}`).then(res => {
							let imgData = res.take('Data')
							if (imgData) {
								self.$notify({
									type: 'wa-warning',
									text: '这张图片已经被创建成商品了'
								})
								return false
							} else {
								// 将file文件指向一个url
								this.images = URL.createObjectURL(file)
								this.isUpload = true
								this.imgObj = data // 上传获得的图片数据
								// 每次重新上传图片之前把income置为空
								this.Pieces = []
								this.work.ImageId = data.Id // 主图ID
								this.work.ImageFile = data.File // 主图文件名
								// 关键步骤, 获取物料数据
								this.getAllMaterials(this.categoryList).then(res => {
									this.customData = res
									if (!this.isEditInfo) {
										this.isEditInfo = true
										this.wrapStyle.minHeight = 'auto'
									}
								})
							}
						})
					})
				}
			})
		},
		/**
		 * 获取所有的物料
		 * @param {categorylist} 当前品类的合集
		 */
		getAllMaterials(categorylist = this.categoryList) {
			return new Promise(resolve => {
				allMaterials(categorylist).then(res => {
					let data = res
					let b = []
					data.forEach((item, index) => {
						let o = {
							id: categorylist[index],
							material: item,
							imgObj: this.imgObj
						}
						b.push(o)
					})
					resolve(b)
				})
			})
		},
		/**
		 * 保存自定义标签
		 */
		onSaveCustomTag(e) {
			if (e.keyCode === 13) {
				let v = e.target.value
				if (e.target.value === '') {
					this.$notify({
						type: 'wa-warning',
						text: '请输入内容'
					})
				} else {
					// 判断是否存在，通过，号分割
					if (v.includes(',')) {
						let a = v.split(',')
						a.forEach(item => {
							this.selectCustomList.push(item)
						})
					} else if (v.includes(',')){
						let a = v.split(',')
						a.forEach(item => {
							this.selectCustomList.push(item)
						})
					} else {
						this.selectCustomList.push(v)
					}
					e.target.value = ''
					// $(this.$refs.keyupInput).blur()
				}
			}
		},
		/**
		 * 删除标签
		 */
		onRemoveTag(item) {
			this.selectCustomList.forEach((k, i, a) => {
				if (item === k) {
					a.splice(i, 1)
				}
			})
		},
		toggleEdit(v) {
			this.openIndex = v
		},
		/**
		 * 保存custom中生成的pieces
		 * @param {Array}
		 */
		savePieces(p) {
			if (p.constructor !== Array) return false
			if (this.Pieces.length === 0) {
				p.forEach(item => {
					this.Pieces.push(item)
				})
			} else {
				p.forEach(item => {
					if (this.Pieces.some(v => v.CategoryId === item.CategoryId)) {
						for (let i = 0; i < this.Pieces.length; i++) {
							if (this.Pieces[i].CategoryId === item.CategoryId) {
								this.Pieces.splice(i, 1)
								this.Pieces.push(item)
								break
							}
						}
					} else {
						this.Pieces.push(item)
					}
				})
			}
		},
		// 保存按钮
		saveWork() {
			let b = []
			let params
			const selectTag = this.selectTag
			const w = this.work
			w.Pieces = []
			if (!w.Title) {
				b.push('请填写标题')
			}
			if (!w.Description) {
				b.push('请填写描述信息')
			}
			w.Tags = []
			selectTag.forEach(v => {
				w.Tags.push(v)
			})
			this.selectCustomList.forEach(item => {
				w.Tags.push({
					Name: item,
					Type: 0
				})
			})
			if (b.length > 0) {
				this.$notify({
					type: 'wa-warning',
					text: b[0]
				})
				if (b.length > 1) {
					this.inputErr = [true, true]
				} else if(b.length === 1){
					if (b[0] === '请填写标题') {
						this.inputErr = [true, false]
					} else if (b[0] === '请填写描述信息') {
						this.inputErr = [false, true]
					}
				} else {
					this.inputErr = [false, false]
				}
				return
			}
			// 先过滤一次是否上架
			let r = this.Pieces.filter(item => {
				return item.isSell
			})
			r.forEach(item => {
				let o = {
					CategoryId: item.CategoryId,
					Incomes: []
				}
				let inc = item.Incomes.filter(v => v.select)
				inc.forEach(v => {
					let o2 = {
						Packets: [],
						Entries: [],
						Pictures: [],
						Materials: [],
						Options: [],
						Bonus: 0
					}
					o2.Pictures = [[serializePicture2(v.custom.current.pictures[0])]]
					switch(item.CategoryId) {
						case dc.Frame:
							o2.Packets = [v.custom.current.selects.filter(v => v.Type === 'mat')[0].mat.Id, v.custom.current.selects.filter(v => v.Type === 'mat')[0].angle]
							o2.Entries = [v.custom.current.entry.Id]
							this.userMaterials.forEach(k => {
								o2.Materials.push(k.Id)
							})
							// this.userOptions.forEach(k => {
							// 	o2.Options.push(k.Property.OptionId)
							// })
							v.options.forEach(k => {
								o2.Options.push(k.Property.OptionId)
							})
							v.materials.forEach(k => {
								o2.Materials.push(k.Id)
							})
							// v.custom.current.materials.filter(k => k.Type === mt.Glass || k.Type === mt.Paper).forEach(j => {
							// 	o2.Materials.push(j.Id)
							// })
							o2.Bonus = v.bonus
							break
						case dc.Matless:
							o2.Packets = v.custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
							o2.Entries = [v.custom.current.entry.Id]
							// o2.Pictures = [[serializePicture2(v.custom.current.pictures[0])]]
							// this.userMaterials.forEach(k => {
							// 	o2.Materials.push(k.Id)
							// })
							// v.custom.current.materials.filter(k => k.Type === mt.Glass || k.Type === mt.Paper).forEach(j => {
							// 	o2.Materials.push(j.Id)
							// })
							v.materials.forEach(k => {
								o2.Materials.push(k.Id)
							})
							o2.Bonus = v.bonus
							break
						case dc.Magnet:
							o2.Packets = v.custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
							o2.Entries = [v.custom.current.entry.Id]
							// o2.Pictures = [[serializePicture2(v.custom.current.pictures[0])]]
							o2.Bonus = v.bonus
							// this.customData.filter(v => v.id === dc.Magnet)[0].material.filter(v => v.Type === mt.MagnetLine || v.Type === mt.Canvas ).filter(v => v.Id).forEach(item => {
							// 	o2.Materials.push(item.Id)
							// })
							v.materials.forEach(k => {
								if (k.Id) {
									o2.Materials.push(k.Id)
								}
							})
							break
						case dc.Rimless:
							o2.Packets = v.custom.current.selects.filter(v => v.Type === mt.Size)[0].Size
							o2.Entries = [v.custom.current.entry.Id]
							// o2.Pictures = [[serializePicture2(v.custom.current.pictures[0])]]
							// this.customData.filter(v => v.id === dc.Rimless)[0].material.filter(v => v.Type === mt.OuterLine || v.Type === mt.Canvas || v.Type === mt.InnerLine).filter(v => v.Id).forEach(item => {
							// 	o2.Materials.push(item.Id)
							// })
							v.materials.forEach(k => {
								o2.Materials.push(k.Id)
							})
							o2.Bonus = v.bonus
							break						
						case dc.Scroll:
							o2.Packets = [v.custom.current.selects.filter(v => v.Type === mt.Template)[0].Id, 0]
							o2.Entries = [v.custom.current.entry.Id]
							o2.Bonus = v.bonus
							break
						default:
						// Properties
							o2.Packets = [0, v.custom.current.entry.ProductId]
							o2.Entries = [v.custom.current.entry.Id]
							o2.Bonus = v.bonus
							v.options.forEach(k => {
								o2.Options.push(k.OptionId)
							})
							// v.custom.current.materials.forEach(k => {
							// 	if (k.Id === v.custom.current.entry.ProductId) {
							// 		k.Properties.forEach(j => {
							// 			o2.Options.push(j.OptionId)
							// 		})
							// 	}
							// })
							break
					}
					o.Incomes.push(o2)
				})
				this.work.Pieces.push(o)
				if (this.isEdit) {
					this.work['Id'] = this.workId
				}
			})
			this.$request.save('work/manage', this.work).then(res => {
				if (this.isEdit) {
					layer.toast('编辑成功')
				} else {
					layer.toast('创建成功')
				}
				window.is_confirm = false
				window.location.replace(`/user/work.html?CateId=8`)
			})
		},
		// 是否选中标签
		isTagSelects(id) {
			let c = this.selectTag
			return c.some(v => {
				return v.Id === id
			})
		},
		// 选中标签
		onSelectTag(s) {
			const t = s.Type
			const c = this.selectTag
			let index
			let length = 0
			switch(t) {
				case 1:
					c.forEach((v, k) => {
						if (v.Type === 1) {
							index = k
						}
					})
					if (c[index].Id === s.Id) return
					c.splice(index, 1, s)
					break
				case 2:
					c.forEach((v, k) => {
						if (v.Type === 2) {
							length++
							if (v.Id === s.Id) {
								index = k
							}
						}
					})
					if (index) {
						c.splice(index, 1)
						length--
					} else {
						if (length >= 3) {
							this.$notify({
								type: 'wa-warning',
								text: '最多选择三个标签'
							})
							return
						} else {
							c.push(s)
							return
						}
					}
					break
				case 3:
					c.forEach((v, k) => {
						if (v.Type === 3) {
							length++
							if (v.Id === s.Id) {
								index = k
							}
						}
					})
					if (index) {
						c.splice(index, 1)
						length--
					} else {
						if (length >= 3) {
							this.$notify({
								type: 'wa-warning',
								text: '最多选择三个标签'
							})
							return
						} else {
							c.push(s)
							return
						}
					}
					break
			}
		},
		_setContentHeight() {
			const self = this
			self.$nextTick(() => {
				const WINDOW_HEIGHT = window.innerHeight
				self.wrapStyle.minHeight = `${WINDOW_HEIGHT - 121 - 64}px`
			})
		},
		/**
		 * 编辑物料,需要根据后台传递过来的图片id获取到图片的主图数据
		 * @param {Number} imageId 图片id
		 */
		getImageData(imageId) {
			const id = imageId
			return new Promise(resolve => {
				this.$request.do('GET', `image/info/${id}`).then(res => {
					let data = res.take('Data')
					resolve(data)
				})
			})
		}
	},
	computed: {
		render() {
			
		}
	}
}
</script>
