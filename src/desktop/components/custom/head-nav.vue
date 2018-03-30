<template>
  <div class="custom-head" ref="custom-head" @mouseleave="detaileNavShow()" >
    <!-- nav-bar -->
    <div class="category-wrapper" @mouseleave="activeHide">
      <ul class="category-nav" @mouseover="detaileNavShow($event)">
        <li class="item" data-index="0" :class="(parentIndex===0||parentDetaile==='装饰画')&&'active'" @click="childHref(8)">
          <span data-index="0">装饰画</span>
        </li>
        <li class="item" data-index="1" :class="(parentIndex===1||parentDetaile=='家居用品')&&'active'" @click="childHref(11)">
          <span data-index="1">
            家居用品
          </span>
        </li>
        <li class="item" data-index="2" :class="(parentIndex===2||parentDetaile=='T恤')&&'active'" @click="childHref(14)">
          <span data-index="2">
            T恤
          </span>
        </li>
        <li class="item" data-index="3" :class="(parentIndex===3||parentDetaile=='电子产品')&&'active'" @click="childHref(10)">
          <span data-index="3">
            电子产品
          </span>
        </li>
        <li class="item" data-index="4" :class="(parentIndex===4||parentDetaile=='时尚配饰')&&'active'" @click="childHref(17)">
          <span data-index="4">
            时尚配饰
          </span>
        </li>
        <li class="item" data-index="5" :class="(parentIndex===5||parentDetaile=='文教用品')&&'active'" @click="childHref(19)">
          <span data-index="5">
            文教产品
          </span>
        </li>
      </ul>
      <!-- 有框画 -->
      <div class="detaile-wrapper item-0" :class="indexId === 0?'active':''">
        <ul class="detaile-nav">
          <li class="item" :class='childIndex === 8&&"active"' @click="childHref(8)" @mouseover="onMouseover(8)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===8" :src="mapIcon(1, 1)" alt="有框画">
              <img v-else :src="mapIcon(1, 0)" alt="有框画">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">有框画</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 2&&"active"' @click="childHref(2)" @mouseover="onMouseover(2)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===2" :src="mapIcon(2, 1)" alt="布艺画">
              <img v-else :src="mapIcon(2, 0)" alt="布艺画">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">布艺画</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 4&&"active"' @click="childHref(4)" @mouseover="onMouseover(4)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===4" :src="mapIcon(4, 1)" alt="卷轴画">
              <img v-else :src="mapIcon(4, 0)" alt="卷轴画">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">卷轴画</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 24&&"active"' @click="childHref(24)" @mouseover="onMouseover(24)" @mouseleave="onMouseleave">
              <a>
                <img v-if="childIndex===24" :src="mapIcon(24,1)" alt="磁贴画">
                <img v-else :src="mapIcon(24,0)" alt="磁贴画">
                <i class="icon-icon_iPad-case"></i>
                <p class="text">磁贴画</p>
              </a>
            </li>
        </ul>
      </div>
      <!-- 家居产品 -->
      <div class="detaile-wrapper item-1" :class="indexId === 1&&'active'">
        <ul class="detaile-nav">
          <li class="item" :class='childIndex === 11&&"active"' @click="childHref(11)" @mouseover="onMouseover(11)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===11" :src="mapIcon(11, 1)" alt="抱枕">
              <img v-else :src="mapIcon(11, 0)">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">抱枕</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 20&&"active"' @click="childHref(20)" @mouseover="onMouseover(20)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===20" :src="mapIcon(20, 1)" alt="挂钟">
              <img v-else :src="mapIcon(20, 0)" alt="挂钟">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">挂钟</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 12&&"active"' @click="childHref(12)" @mouseover="onMouseover(12)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===12" :src="mapIcon(12, 1)" alt="旅行杯">
              <img v-else :src="mapIcon(12, 0)" alt="旅行杯">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">旅行杯</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 25&&"active"' @click="childHref(25)" @mouseover="onMouseover(25)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===25" :src="mapIcon(25, 1)" alt="钥匙扣">
              <img v-else :src="mapIcon(25, 0)" alt="钥匙扣">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">钥匙扣</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 29&&"active"' @click="childHref(29)" @mouseover="onMouseover(29)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===29" :src="mapIcon(29, 1)" alt="地垫">
              <img v-else :src="mapIcon(29, 0)" alt="地垫">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">地垫</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- T恤 -->
      <div class="detaile-wrapper item-2" :class="indexId === 2&&'active'">
        <ul class="detaile-nav">
          <li class="item" :class='childIndex === 14&&"active"' @click="childHref(14)" @mouseover="onMouseover(14)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===14" :src="mapIcon(14, 1)" alt="男士T恤">
              <img v-else :src="mapIcon(14, 0)" alt="男士T恤">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">男士</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 15&&"active"' @click="childHref(15)" @mouseover="onMouseover(15)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===15" :src="mapIcon(15, 1)" alt="女士T恤">
              <img v-else :src="mapIcon(15, 0)" alt="女士T恤">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">女士</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 16&&"active"' @click="childHref(16)" @mouseover="onMouseover(16)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===16" :src="mapIcon(16, 1)" alt="儿童T恤">
              <img v-else :src="mapIcon(16, 0)" alt="儿童T恤">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">儿童</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 电子产品 -->
      <div class="detaile-wrapper item-3" :class="indexId === 3&&'active'">
        <ul class="detaile-nav">
          <li class="item" :class='childIndex === 10&&"active"' @click="childHref(10)" @mouseover="onMouseover(10)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===10" :src="mapIcon(10, 1)" alt="iphone壳">
              <img v-else :src="mapIcon(10, 0)" alt="iphone壳">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">Iphone壳</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 18&&"active"' @click="childHref(18)" @mouseover="onMouseover(18)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===18" :src="mapIcon(18, 1)" alt="Ipad壳">
              <img v-else :src="mapIcon(18, 0)" alt="Ipad壳">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">Ipad壳</p>
            </a>
          </li>
        </ul>
      </div>
       <!-- 时尚配饰 -->
      <div class="detaile-wrapper item-4" :class="indexId === 4&&'active'">
        <ul class="detaile-nav">
          <li class="item" :class='childIndex === 17&&"active"' @click="childHref(17)" @mouseover="onMouseover(17)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===17" :src="mapIcon(17, 1)">
              <img v-else :src="mapIcon(17, 0)" alt="帆布包">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">帆布包</p>
            </a>
          </li>
          <li class="item" :class='childIndex === 26&&"active"' @click="childHref(26)" @mouseover="onMouseover(26)" @mouseleave="onMouseleave">
            <a>
              <img v-if="childIndex===26" :src="mapIcon(26, 1)" alt="丝巾">
              <img v-else :src="mapIcon(26, 0)" alt="丝巾">
              <i class="icon-icon_iPad-case"></i>
              <p class="text">丝巾</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 文教用品 -->
      <div class="detaile-wrapper item-5" :class="indexId === 5&&'active'">
          <ul class="detaile-nav">
            <li class="item" :class='childIndex === 19&&"active"' @click="childHref(19)" @mouseover="onMouseover(19)" @mouseleave="onMouseleave">
              <a>
                <img v-if="childIndex===19" :src="mapIcon(19, 1)" alt="笔记本">
                <img v-else :src="mapIcon(19, 0)" alt="笔记本">
                <i class="icon-icon_iPad-case"></i>
                <p class="text">笔记本</p>
              </a>
            </li>
            <li class="item" :class='childIndex === 28&&"active"' @click="childHref(28)" @mouseover="onMouseover(28)" @mouseleave="onMouseleave">
              <a>
                <img v-if="childIndex===28" :src="mapIcon(28, 1)" alt="笔袋">
                <img v-else :src="mapIcon(28, 0)" alt="笔袋">
                <i class="icon-icon_iPad-case"></i>
                <p class="text">笔袋</p>
              </a>
            </li>
            <li class="item" :class='childIndex === 27&&"active"' @click="childHref(27)" @mouseover="onMouseover(27)" @mouseleave="onMouseleave">
              <a>
                <img v-if="childIndex===27" :src="mapIcon(27, 1)" alt="团扇">
                <img v-else :src="mapIcon(27, 0)" alt="团扇">
                <i class="icon-icon_iPad-case"></i>
                <p class="text">团扇</p>
              </a>
            </li>
            <li class="item" :class='childIndex === 21&&"active"' @click="childHref(21)" @mouseover="onMouseover(21)" @mouseleave="onMouseleave">
              <a>
                <img v-if="childIndex===21" :src="mapIcon(21, 1)" alt="拼图">
                <img v-else :src="mapIcon(21, 0)" alt="拼图">
                <i class="icon-icon_iPad-case"></i>
                <p class="text">拼图</p>
              </a>
            </li>
          </ul>
        </div>
      <div class="bg"></div>
    </div>
    <!-- nav-bar detail -->

  </div>
</template>
<script>
/*eslint-disable*/
  import {headerMap} from '../../scripts/utils/custom/consts.js'
  export default {
    data() {
      return {
        isDetailShow: false,
        indexId: -1, // 控制菜单显示
        childIndex: 0, // 控制子菜单高亮
        parentIndex: -1, // 控制父菜单高亮
        navShow: false, // 是否显示
        parentDetaile: '', // 默认高亮
        childDetaile: '', // 子元素默认高亮
        catId: -1
      }
    },
    created() {
      this.categoryId = this.$route.params.id
      this.parentDetaile = headerMap.get(parseInt(this.categoryId))
    },
    methods: {
      // 控制展开详情的显示
      detaileNavShow(e) {
        if (e) {
          let index = e.target.getAttribute('data-index')
          this.indexId = parseInt(index)
          this.parentIndex = parseInt(index)
        } else {
          this.indexId = -1
        }
      },
      onMouseover(id) {
       this.childIndex = id
      },
      onMouseleave() {
       this.childIndex = -1
      },
      activeHide() {
        this.indexId = -1
        this.parentIndex = -1
      },
      // vue-router控制页面跳转
      childHref(id) {
        if (id === 1 || id === 2 || id === 4 || id === 8) {
          this.parentIndex = 0
        } else if (id === 11) {
          this.parentIndex = 1
        }
        this.childIndex = parseInt(id)
        this.$router.push({
          path: `/custom/${id}`
        })
        this.parentDetaile = headerMap.get(parseInt(id))
      },
      mapIcon(id, type) {
        if (type === 0) {
          return require(`../../assets/images/header/icon-${id}.svg`)
        } else if (type === 1) {
          return require(`../../assets/images/header/active/icon-${id}.svg`)
        }
      }
    }
  }
</script>

