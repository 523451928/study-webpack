<!-- Copyright 2016 . All rights reserved. -->
<template>
  <div class="product-detail-area active">
    <h2>作品描述</h2>
    <form class="form form-horizontal" id="product-detail-from">
      <div class="product-detail-container clearfix">
        <div class="product-detail-text col-md-6">
          <div class="form-group">
            <label><span class="icon-nes">* </span>标题：</label>
            <div class="form-cont">
              <input type="text" class="form-control" v-model="title" placeholder="给您的大作起个名字吧">
            </div>
          </div>
          <div class="form-group">
            <label for="intro">介绍：</label>
            <div class="form-cont">
              <textarea class="form-control" rows="12" v-model="description" placeholder="清晰易懂的介绍能让您的作品更受欢迎"></textarea>
            </div>
          </div>
        </div>
        <div class="product-detail-tags col-md-6" id="product-detail-tags">
          <div class="sort-tags" id="sort-tags">
            <label class="tag-title mt0 mb3"><span class="icon-nes">*</span> 作品类型</label>
            <div class="tags-list tags-hover-area">
              <label class="radio-inline pl0" v-for="typeTag in typeTags">
                <input class="sort-radio validate[required] special-checkbox" name="typeTag" type="radio" :checked="typeTag.selected" @change="updateTagStatus(typeTag,'type')">
                <s class="special-checkboxS"></s> {{typeTag.Name}}
              </label>
            </div>
          </div>
          <div class="pop-tags" id="pop-tags">
            <label class="tag-title mb3 mt30">
              <span class="qus-icon">
                  <div class="qus-tips"><span class="product-edit-arrow-out"></span><span class="product-edit-arrow-inner"></span>选择合适的标签，您的作品才能更好地被发现哦~</div>
              </span>
              常用标签
            </label>
            <!--<p class="cus-tag-tips">-->
            <!--选择合适的标签，您的作品才能更好地被发现哦~-->
            <!--</p>-->
            <div class="tags-list tags-hover-area">
              <label class="checkbox-inline pl0" v-for="tagTag in tagTags" :class="{'disableCursor': tagMaxStatus, 'checked': tagTag.selected}">
                <input class="pop-checkbox special-checkbox" :disabled="tagMaxStatus && !tagTag.selected" type="checkbox"  :checked="tagTag.selected" @click="updateTagStatus(tagTag,'tag')">
                <s class="special-checkboxS"></s>
                {{tagTag.Name}}
              </label>
            </div>
          </div>
          <div class="color-tags" id="color-tags">
            <label class="tag-title mb3">颜色分类</label>
            <div class="tags-list tags-color-area">
              <label class="checkbox-inline pl0 mr5" v-for="cTag in colorTags" :class="{'disableCursor': colorMaxStatus, 'checked': cTag.selected}">
                <input type="checkbox" :disabled="colorMaxStatus && !cTag.selected"  class="color-checkbox validate[maxCheckbox[3]]" :checked="cTag.selected"  @change="updateTagStatus(cTag,'color')">
                <div :title="cTag.Name" class="block-tag-block" :style="{background: cTag.Color}"></div>
              </label>
            </div>
          </div>
          <div class="custom-tags" id="custom-tags">
            <label class="tag-title">
              <span class="qus-icon">
                  <div class="qus-tips"><span class="product-edit-arrow-out"></span><span class="product-edit-arrow-inner"></span>想让您的作品更个性的话，可以填写自定义标签。自定义标签请用“，”隔开。例如"书法，草书，兰亭集序，王羲之“</div>
              </span>
              自定义标签
            </label>
            <div class="tags-box">
              <div class="tag-list" v-for="(customTag,index) in customTags">
                <span class="tag-value">{{customTag.Name}}</span>
                <span class="tag-del" @click="delCustomTag(index)"><i class="wa wa-close"></i></span>
              </div>
            </div>
            <input type="text" class="form-control tags-input" @keyup.enter="saveCustomTag()" @blur="saveCustomTag()" v-model="customTagVal" placeholder="输入自定义标签，按下回车键即可保存。">
          </div>
        </div>
        <div class="col-md-12 text-center">
          <a class="btn btn-default btn-lg product-submit-btn btn-primary" @click="submitDetail">提交作品</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
//  import { proBomsCount as pbCount } from 'scripts/utils/custom/consts'
  export default {
    data() {
      return {
        title: this.initTitle,
        description: this.initDes,
        typeTags: this.tags.get('type'),
        colorTags: this.tags.get('color'),
        tagTags: this.tags.get('tag'),
        customTags: [],
        customTagVal: '',
        tagMaxStatus: false,
        colorMaxStatus: false
      }
    },
    props: {
      initTitle: {
        type: String,
        required: true
      },
      initDes: {
        type: String,
        required: true
      },
      initSelectTags: {
        type: Array,
        required: true
      },
      tags: {
        required: true
      }
    },
    created() {
      this.initTagsStatus()
    },
    methods: {
      initTagsStatus() {
        let self = this
        let selTags = self.initSelectTags
        let typeTags = self.typeTags
        let colorTags = self.colorTags
        let tagTags = self.tagTags
        _.each(selTags, t => {
          let type = t.hasOwnProperty('Type') ? t.Type : 0
          let acTag
          switch (type) {
            case 1 :
              acTag = _.find(typeTags, tag => {
                return t.Id === tag.Id
              })
              if (acTag) {
                acTag['selected'] = true
              }
              break
            case 2 :
              acTag = _.find(tagTags, tag => {
                return t.Id === tag.Id
              })
              if (acTag) {
                acTag['selected'] = true
              }
              break
            case 3 :
              acTag = _.find(colorTags, tag => {
                return t.Id === tag.Id
              })
              if (acTag) {
                acTag['selected'] = true
              }
              break
            default:
              self.customTags.push(t)
          }
        })
      },
      updateTagStatus(tag, type) {
        let self = this
        let len
        let typeTags = self.typeTags
        let colorTags = self.colorTags
        let tagTags = self.tagTags
        switch (type) {
          case 'type':
            tag.selected = !tag.selected
            _.each(typeTags, t => {
              if (t.Id !== tag.Id) {
                t.selected = false
              }
            })
            break
          case 'tag':
            tag.selected = !tag.selected
            len = _.filter(tagTags, t => {
              return t.selected
            }).length
            if (len === 5) {
              self.tagMaxStatus = true
            } else {
              self.tagMaxStatus = false
            }
            break
          case 'color':
            if (self.colorMaxStatus && !tag.selected) {
              return false
            }
            tag.selected = !tag.selected
            len = _.filter(colorTags, t => {
              return t.selected
            }).length
            if (len === 3) {
              self.colorMaxStatus = true
            } else {
              self.colorMaxStatus = false
            }
            break
        }
      },
      saveCustomTag() {
        let customTagVal = this.customTagVal
        if (customTagVal) {
          this.customTags.push({
            Name: customTagVal
          })
          this.customTagVal = ''
        }
      },
      delCustomTag(index) {
        this.customTags.splice(index, 1)
      },
      submitDetail() {
        let self = this
        let typeTags = this.typeTags
        let colorTags = this.colorTags
        let tagTags = this.tagTags
        let customTags = this.customTags
        let len = _.filter(typeTags, t => {
          return t.selected
        }).length
        let allTags = []
        let param = {}
        if (self.title === '') {
          layer.toast('标题不能为空')
          return false
        }
        if (len === 0) {
          layer.toast('类型不能为空')
          return false
        }
        allTags = typeTags.concat(colorTags).concat(tagTags)
        param.title = self.title
        param.description = self.description
        param.tags = _.filter(allTags, a => {
          return a.selected
        }).concat(customTags)
        self.$emit('submitDetail', param)
      }
    },
    computed: {
//      typeTags() {
//        return this.customTags.get('type')
//      },
//      colorTags() {
//        return this.customTags.get('color')
//      },
//      tagTags() {
//        return this.customTags.get('tag')
//      }
    }
  }
</script>
