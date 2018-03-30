<template>
  <transition name="slide-down">
    <div class="category-mask" @click.stop="hide" @touchmove.stop v-show="cateShow">
      <div class="all-category" @click.stop>
        <div class="cate-head scale-1px">
          全部商品
          <span class="wa-angle-down2" @click="hide"></span>
        </div>
        <div class="category-content">
          <div class="cate-item" v-for="(item, index) in categoryList">
            <div class="line">
              {{item.parentText}}
          </div>
            <ul class="clearfix">
              <li v-for="child in item.childList">
                <a :href="formatHref(child.id)" target="_self">
                  <img :src='mapIcon(child.id)' >
                  <p :class="{'active': child.id == categoryId}">{{child.text}}</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable */
  export default {
    props: {
      categoryId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        cateShow: false,
        categoryList: [
          {
            parentText: '装饰画',
            childList: [
              {
                text: '有框画',
                id: 8
              },
              {
                text: '布艺画',
                id: 2
              },
              {
                text: '卷轴画',
                id: 4
              }
            ]
          },
          {
            parentText: 'T恤',
            childList: [
              {
                text: '男士T',
                id: 14
              },
              {
                text: '女士T',
                id: 15
              },
              {
                text: '儿童T',
                id: 16
              }
            ]
          },
          {
            parentText: '文教用品',
            childList: [
              {
                text: '笔记本',
                id: 19
              },
              {
                text: '拼图',
                id: 21
              },
              {
                text: '钥匙扣',
                id: 25
              },
              {
                text: '笔袋',
                id: 28
              }
            ]
          },
          {
            parentText: '电子产品',
            childList: [
              {
                text: 'IPAD壳',
                id: 18
              },
              {
                text: '手机壳',
                id: 10
              }
            ]
          },
          {
            parentText: '家居用品',
            childList: [
              {
                text: '抱枕',
                id: 11
              },
              {
                text: '挂钟',
                id: 20
              },
              {
                text: '地垫',
                id: 29
              },
              {
                text: '旅行杯',
                id: 12
              },
              {
                text: '帆布包',
                id: 17
              },
              {
                text: '丝巾',
                id: 26
              },
              {
                text: '团扇',
                id: 27
              }
            ]
          }
        ]
      }
    },
    methods: {
      mapIcon(id) {
        return require(`../../assets/images/header/active/icon-${id}.svg`)
      },
      show() {
        this.cateShow = true
        $('html').addClass('scroll-hidden')
      },
      hide() {
        this.cateShow = false
        $('html').removeClass('scroll-hidden')
      },
      formatHref(id) {
        return '/work?CategoryId=' + id
      }
    }
  }
</script>
