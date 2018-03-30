<template>
  <div class="ww-wrap bg-white" v-infinite="pullList"
       infinite-scroll-disabled="infinitDisable"
       infinite-scroll-distance="1"
       :style="wrapStyle"
       >
       <user-edit-nav>
         <p @click="toggleEdit" slot="edit">
            {{isEdit?'完成编辑':'编辑我的产品'}}
          </p>
       </user-edit-nav>
    <div class="product-list-con">
      <div class="product-sort-area clearfix" id="product-type-area">
        <div class="persional-tags-list tags-list clearfix category-list" id="category-list" v-show="sortId!=3">
          <label class="tags-cate-title">品类：</label>
          <ul class="tags-list-ul clearfix">
            <li v-for="cat in catList">
              <a class="filter-link" @click.stop="pullList(cat.Id,true)" :class="{active:cateId === cat.Id}">{{cat.Name}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="product-list-area clearfix" id="product-list-area">
        <div class="product-item" v-for="(item, index) in list">
          <product-item :item = "item" :index = "index" :isEdit="true"
          :url="`${baseUrl}/work/${item.Id}?CategoryId=${cateId}`"
          :class="item.Pause && 'soldout'"
          >
          </product-item>
          <div class="edit" v-if="isEdit">
            <div class="u-btn" v-text="item.Pause ? '上架' : '可出售'" @click="onPause(item)"></div>
            <div class="u-primary-btn">
              <a :href="!item.Pause ? `/product.html?WorkId=${item.Id}` : 'javascript:void(0)'">编辑商品</a>
            </div>
          </div>
          <p class="delete" @click="delWork(item, index)" v-if="isEdit">删除商品</p>
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
/* eslint-disable */
  import { getParameter } from 'js/getParameter.js'
  import { DecorativeCategories as dc } from 'scripts/utils/custom/consts'
  import { getEntries } from 'components/custom/display/entry'
  import { InterfaceMap as interf } from 'scripts/interfaceConst'
  import { initListEntryObj } from 'components/custom/display/display-util.js'
  import Loading from 'components/public/loading.vue'
  import ProductItem from 'components/public/proItem/product-item.vue'
  import UserEditNav from 'components/user/user-edit-nav.vue'
  import { UrlUtils } from 'scripts/utils/url-utils.js'
  import { formCategoryList } from 'scripts/utils/category.js'
  let urlutils = new UrlUtils()
  export default{
    data() {
      return {
        list: [],
        sortId: 1,
        cateId: 8,
        page: 1,
        showLoading: true,
        baseUrl: interf.baseUrl,
        noPro: false,
        has: false,
        noMore: false,
        loading: true,
        infinitDisable: false,
        dcObj: dc,
        catList: [],
        isEdit: false,
        wrapStyle: {
          minHeight: '0px'
        }
      }
    },
    components: {
      ProductItem,
      Loading,
      UserEditNav
    },
    created() {
      let isCustom = getParameter('custom')
      let cateId = urlutils.getParams('CateId')
      if (isCustom) {
        this.sortId = 3
      }
      if (cateId) {
        this.cateId = Number(cateId)
      }
    },
    mounted() {
      this._setContentHeight()
      request({url: interf.getCatList}).then(res => {
        let data = res.data.Data
        this.catList = formCategoryList(data)
        // this.catList = data.filter(v => {
          
        //   if (v.Id !== dc.Poster && v.Id !== dc.MultiHole && v.Id !== dc.PhotoWall) {
        //     return v
        //   }
        // })
      }, res => {
        this.hide()
        layer.toast(res.take('Error'))
      })
    },
    computed: {
      discount() {
        return this.catList.filter(v => v.Id === this.cateId)[0].Discount / 100
      }
    },
    methods: {
      pullList(cateId, init) {
        this.loading = true
        this.infinitDisable = true
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
        } else if (cateId === 'custom') {
          this.sortId = 3
        }

        if (typeof cateId === 'number') {
          this.cateId = cateId || 1
        }
        if (this.sortId === 3) {
          this.renderCustom()
        } else {
          this.renderItem()
        }
      },
      renderCustom() {
        if (this.noMore) {
          return
        }
        let self = this
        let params = {
          Page: this.page
        }
        request({url: 'item/list', params}).then(res => {
          let arr = []
          let data = _.pickBy(res.take('Data'), function(v) {
            return !v.Disable
          })
          if (!_.isEmpty(data)) {
            self.has = true
            _.each(data, function(v) {
              arr.push(v['Entries'][0])
            })
            getEntries(arr).then(entriesDetail => {
              _.each(data, function(v, index) {
                let finalObj = {}
                finalObj.Title = entriesDetail[index]['Name']
                finalObj.Id = v['Id']
                finalObj.Money = v['Money'] / 100
                finalObj.Pictures = v['Pictures'][0]
                let x = _.find(entriesDetail, (d) => {
                  return d.Id === v['Entries'][0]
                })
                x = initListEntryObj(x)
                self.list.push(_.merge(finalObj, x))
              })
              if (this.timer) {
                clearTimeout(this.timer)
              }
              this.timer = setTimeout(() => {
                this.page++
                this.infinitDisable = false
              }, 1000)
              self.loading = false
              self.showLoading = false
            })
          } else if (self.list.length) {
            self.noMore = true
            self.infinitDisable = true
          } else {
            self.noMore = true
            self.infinitDisable = true
            self.noPro = true
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      renderItem() {
        let self = this
        let params = {
          CategoryId: this.cateId,
          Page: this.page,
          Online: this.sortId === 2 ? false : ''
        }
        request({url: 'work/manage/list', params}).then(res => {
          let arr = []
          let data = _.pickBy(res.take('Data'), function(v) {
            return self.sortId === 1 ? !v.Offline : v.Offline
          })
          if (!_.isEmpty(data)) {
            self.has = true
            // 获得entryId
            _.each(data, function(v) {
              if (v['Pieces'].length > 0) {
                arr.push(v['Pieces'][0]['Incomes'][0]['Entries'][0])
              }
            })
            getEntries(arr).then(entriesDetail => {
              let promise_arr = []
              _.each(data, function(v) {
                if (v['Pieces'].length > 0) {
                  let finalObj = {}
                  finalObj.Title = v['Title'] // woekTitle
                  finalObj.Id = v['Id'] // workId
                  finalObj.Pictures = v['Pieces'][0]['Incomes'][0]['Pictures'][0] //workPictures
                  finalObj.Pause = v['Pieces'][0]['Pause'] // workPause
                  finalObj.CategoryId = v['Pieces'][0]['CategoryId'] // woekCategoryId
                  finalObj.Incomes = v['Pieces'][0]['Incomes'][0]
                  finalObj.Bonus = v['Pieces'][0]['Incomes'][0]['Bonus'] / 100
                  let x = _.find(entriesDetail, (d) => {
                    return d.Id === v['Pieces'][0]['Incomes'][0]['Entries'][0]
                  })
                  finalObj.Price =Math.floor(x.Price * self.discount * (1 + finalObj.Bonus) / 100) * 100
                  x = initListEntryObj(x)
                  // if (self.cateId === dc.Rimless) {
                  // } else {
                  //   x = initListEntryObj(x)
                  // }
                  // promise_arr.push(self.buildItem(_.merge(finalObj, x)))
                  // console.log(_.merge(finalObj, x))
                  self.list.push(_.merge(finalObj, x))
                }
              })
              setTimeout(() => {
                this.page++
                this.infinitDisable = false
              }, 1500)
              self.loading = false
              self.showLoading = false
              // Promise.all(promise_arr).then(res => {
              //   self.list = res
              //   // console.log(res)
              //   setTimeout(() => {
              //     this.page++
              //     this.infinitDisable = false
              //   }, 1500)
              //   self.loading = false
              //   self.showLoading = false
              // })
            })
          } else if (self.list.length) {
            self.noMore = true
            this.infinitDisable = true
          } else {
            self.noMore = true
            this.infinitDisable = true
            self.noPro = true
          }
        })
      },
      toggleEdit() {
        this.isEdit = !this.isEdit
      },
      delWork(item, index) {
        let self = this
        layer.open({
          content: '确认删除这个作品吗',
          btn: ['确认', '取消'],
          yes: function() {
            request.remove(`work/manage`, item.Id).then(res => {
              if (res.take('Data')) {
                self.list.forEach((k, i, a) => {
                  if (k.Id === item.Id) {
                    a.splice(i, 1)
                  }
                })
                layer.toast('作品删除成功')
              }
            }).catch(err => {
              err.hide()
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
              } else {
                layer.closeAll()
              }
            }, res => {
              res.hide()
              layer.toast(`${str}架失败`)
            })
          }
        })
      },
      buildItem(obj) {
        let params = {
          EntryId: obj.entry.Id,
          WorkId: obj.Id,
          Action: 4,
          CategoryId: obj.CategoryId,
          Packets: obj.Incomes.Packets
        }
        return new Promise((resolve, reject) => {
          this.$request.do('GET', 'item/build', {
            params
          }).then(res => {
            let data = res.body
            let discount = this.catList.filter(v => v.Id === obj.CategoryId)[0].Discount
            params['Price'] = Math.floor(( res.body.Price / 100 ) * discount)
            resolve(Object.assign(params, obj))
          })
        })
      },
      /**
       * 上下架商品
       */
      onPause(item) {
        const self = this
        const id = item.Id
        const catId = item.CategoryId
        this.$request.submit(`work/manage/pause/${id}`, {
          CategoryId: catId,
          Pause: !item.Pause
        }).then(res => {
          for (let i of self.list) {
            if (i.Id === id) {
              i.Pause = !i.Pause
              break
            }
          }
        })
      },
      _setContentHeight() {
        const self = this
        self.$nextTick(() => {
          const WINDOW_HEIGHT = window.innerHeight
          self.wrapStyle.minHeight = `${WINDOW_HEIGHT - 121 - 64 - 200}px`
        })
      }
    }
  }
</script>
<style lang="sass" scoped>
  @import '~styles/scss/public/variable.scss';
  #product-list-area .display-canvas:hover .display-fore{
    z-index: 6;
  }
  .bg-white {
    > .user-nav {
      margin-bottom: 10px;
      > .user-nav-ul {
        border-bottom: 1px solid $c-line-1;
        margin: 0 auto;
        padding: 0;
        width: 980px;
        font-size: 0;
        > li {
          display: inline-block;
          padding: 0 20px 10px 20px;
          font-size: 14px;
          text-align: center;
          &.active {
            border-bottom: 2px solid $c-jxc-1;
            a {
              color: $c-jxc-1;
            }
          }
          a {
            color: $c-fc-1;
            &:hover {
              color: $c-jxc-1;
              text-decoration-style: none;
            }
          }
        }
      }
    }
  }
  .product-item {
    float: left;
    margin-right: 20px;
    width: 230px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    >.pro-list {
      float: none;
      &.soldout {
        opacity: .4;
      }
    }
    >.edit {
      margin-bottom: 20px;
      font-size: 0px;
      >div {
        display: inline-block;
        vertical-align: top;
        margin-right: 10px;
        width: 110px;
        height: 34px;
        line-height: 34px;
        &:last-child{
          margin-right: 0;
        }
      }
      a {
        color: $c-nc-1;
        &:hover, &:focus {
          text-decoration: none;
        }
      }
    }
    >.delete {
      color: $c-fc-3;
      cursor: pointer;
      &:hover {
        color: $c-jxc-1;
      }
    }
  }
</style>
