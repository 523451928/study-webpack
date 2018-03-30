<template>
  <div class="ww-wrap bg-white">
    <div class="product-list-con">
      <div class="product-sort-area clearfix" id="product-type-area">
        <div class="tags-list clearfix" id="sort-list">
          <label class="tags-cate-title">分类：</label>
          <ul class="tags-list-ul clearfix product-sorts-list">
            <li>
              <a class="filter-link" @click.stop="pullList('online',true)" :class="{active:sortId==1}" data-type="1" data-status="2">出售中</a>
              <a class="filter-link" @click.stop="pullList('offline',true)" :class="{active:sortId==2}" data-type="2" data-status="1">已下架</a>
            </li>
          </ul>
        </div>
        <div class="tags-list clearfix category-list" id="category-list">
          <label class="tags-cate-title">品类：</label>
          <ul class="tags-list-ul clearfix">
            <li>
              <a class="filter-link" @click.stop="pullList(dcObj.Frame,true)" :class="{active:cateId==dcObj.Frame}" data-type="Frame">有框画</a>
              <a class="filter-link" @click.stop="pullList(dcObj.Rimless,true)" :class="{active:cateId==dcObj.Rimless}" data-type="Rimless">布艺画</a>
              <a class="filter-link" @click.stop="pullList(dcObj.Scroll,true)" :class="{active:cateId==dcObj.Scroll}" data-type="Scroll">卷轴画</a>
              <a class="filter-link" @click.stop="pullList(6,true)" :class="{active:cateId==6}" data-type="Cup">旅行杯</a>
              <a class="filter-link" @click.stop="pullList(7,true)" :class="{active:cateId==7}" data-type="Bolster">抱枕</a>
              <a class="filter-link" @click.stop="pullList(11,true)" :class="{active:cateId==11}" data-type="ShirtMan">男士T恤</a>
              <a class="filter-link" @click.stop="pullList(12,true)" :class="{active:cateId==12}" data-type="ShirtWoman">女士T恤</a>
              <a class="filter-link" @click.stop="pullList(13,true)" :class="{active:cateId==13}" data-type="ShirtChild">儿童T恤</a>
              <a class="filter-link" @click.stop="pullList(9,true)" :class="{active:cateId==9}" data-type="Bag">帆布包</a>
              <a class="filter-link" @click.stop="pullList(dcObj.Case,true)" :class="{active:cateId===dcObj.Case}" data-type="Case">手机壳</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="product-list-area clearfix" id="product-list-area">
        <!-- 列表-->
        <div class="pro-list grey-border list-item" :class="{last: (index+1)%4==0}" v-for="(item,index) in list">
          <div class="pro-pic text-center">
            <div class="pro-control-menu">
              <span class="wa wa-menu"></span>
              <ul class="ww-dropdown-menu" role="menu">
                <li>
                  <a target="_blank" :href="'/product.html#/edit/' + item.Id" >编辑</a>
                </li>
                <li>
                  <a @click.stop="delWork(item.Id, index)" href="javascript:void(0)">删除</a>
                </li>
                <li v-if="sortId==1">
                  <a @click.stop="needOff(item.Id, index)" href="javascript:void(0)">下架</a>
                </li>
                <li v-else>
                  <a @click.stop="needOff(item.Id, index)" href="javascript:void(0)">上架</a>
                </li>
              </ul>
            </div>
            <component :keep-alive="false" :is="item.displayer" :canvas="'WorkRow'" :editstatus="false" :entry="item.entry"
                       :displays="item.displays" :pictures="item.Pictures"></component>
          </div>
          <div class="pro-detail clearfix">
            <span class="pull-right">
                <a class="default-link list-like-btn like-btn" href="javascript:void(0)">
                  <span class="wa wa-heart-fill"></span> <span class="like-count">0</span>
                </a>
            </span>
            <div class="pull-left pro-title">
              <a v-text="item.Title" href="javascript:;" class="default-hover-link">
              </a>
            </div>
            <div class="clearfix"></div>
                <span class="pull-right">
                </span>
            <div class="pull-left">
                <span class="pro-price pull-right">
                    ¥ 190.68
                </span>
            </div>
          </div>
        </div>
        <div v-show="noPro" class="no-pro-msg text-center">
          <h2 class="text-center">暂无产品</h2>
        </div>
      </div>
      <div class="weui-loadmore" v-show="loading && !noMore">
        <div class="weui-loading"></div>
        <div class="weui-loadmore__tips">正在加载</div>
      </div>
      <p class="nomore text-center" v-show="noMore && has">没有更多了。。。</p>
    </div>
  </div>
</template>
<script>
  import { DecorativeCategories as dc } from 'scripts/utils/custom/consts'
  import { getEntries } from 'scripts/utils/entry'
  import { initListEntryObj } from 'components/public/display/app/display-util'
  import Loading from 'components/public/loading.vue'
  import { mixin as displayComponents } from 'components/public/display/app/components'
  let mixinComponents = _.assign({Loading}, displayComponents)
  export default{
    mixins: [{components: mixinComponents}],
    data() {
      return {
        list: [],
        sortId: 1,
        cateId: 1,
        page: 1,
        showLoading: true,
        noPro: false,
        has: false,
        noMore: false,
        loading: true,
        dcObj: dc
      }
    },
    mounted() {
      let self = this
      this.pullList()
      $('.user-income').addClass('active')
      window.onscroll = _.throttle(function() {
        if (self.noMore) return
        if (!self.loading && $(window).scrollTop() === $(document).height() - $(window).height()) {
          self.page++
          self.pullList()
        }
      }, 1000)
    },
    methods: {
      pullList(cateId, init) {
        let self = this
        let arr = []
        this.loading = true
        if (this.cateId === cateId) return
        if (init) {
          this.page = 1
          this.has = false
          this.noPro = false
          this.noMore = false
          this.list = []
        }
        if (cateId === 'online') {
          this.sortId = 1
        } else if (cateId === 'offline') {
          this.sortId = 2
        }
        if (typeof cateId === 'number') {
          this.cateId = cateId || 1
        }
        let params = {
          CategoryId: this.cateId,
          Page: this.page,
          Online: this.sortId === 2 ? false : ''
        }
        request({url: 'work/manage/list', params}).then(res => {
          let data = _.pickBy(res.take('Data'), function(v) {
            return self.sortId === 1 ? !v.Offline : v.Offline
          })
          if (!_.isEmpty(data)) {
            self.has = true
            _.each(data, function(v) {
              arr.push(v['Pieces'][0]['Incomes'][0]['Entries'][0])
            })
            getEntries(arr).then(entriesDetail => {
              _.each(data, function(v) {
                let finalObj = {}
                finalObj.Title = v['Title']
                finalObj.Id = v['Id']
                finalObj.Pictures = v['Pieces'][0]['Incomes'][0]['Pictures'][0]
                let x = _.find(entriesDetail, (d) => {
                  return d.Id === v['Pieces'][0]['Incomes'][0]['Entries'][0]
                })
                x = initListEntryObj(x)
                self.list.push(_.merge(finalObj, x))
              })
              self.loading = false
              self.showLoading = false
            })
          } else if (self.list.length) {
            self.noMore = true
          } else {
            self.noMore = true
            self.noPro = true
          }
        })
      },
      delWork(item, index) {
        let self = this
        layer.open({
          content: '确认删除这个作品吗',
          btn: ['确认', '取消'],
          yes: function() {
            request.remove('work/manage', item).then(res => {
              if (res.take('Data')) {
                self.list.splice(index, 1)
                layer.toast('作品删除成功')
              }
            }, res => {
              res.hide()
              layer.toast('删除失败')
            })
          }
        })
      },
      needOff(item, index) {
        let self = this
        let params = {
          Offline: self.sortId === 1
        }
        let str = self.sortId === 1 ? '下' : '上'
        layer.open({
          content: `确认${str}架这个作品吗`,
          btn: ['确认', '取消'],
          yes: function() {
            request.submit('work/manage/offline/' + item, params).then(res => {
              if (res.take('Data')) {
                self.list.splice(index, 1)
                layer.toast(`${str}架成功`)
              }
            }, res => {
              res.hide()
              layer.toast(`${str}架失败`)
            })
          }
        })
      }
    }
  }

</script>
<style>
  #product-list-area .display-canvas:hover .display-fore{
    z-index: 6;
  }
</style>
