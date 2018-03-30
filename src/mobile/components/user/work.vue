<template>
  <div class="work-wrapper">
    <div class="work-head border-bottom" ref="workHead">
      <img :src="$user['Avatar']">
      {{$user.Nickname}}的品牌店
      <a class="home-link" href="/">
        <span class="wa-home"></span> 首页
      </a>
    </div>
    <div class="catogery-wrapper border-bottom" ref="category">
      <ul>
        <li @click="changeCategory(item, index)" v-for="(item, index) in categoryList" :class="{'active': index==activeIndex}">{{item.Name}}</li>
      </ul>
    </div>
    <div v-if="infiniteScroll" class="work-lsit" v-infinite="getWorkList" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <ul>
        <li v-for="(item, index) in workList">
          <div class="work-detail">
            <component :keep-alive="false" :is="item.displayer" canvas="MobileWorkRow" :editstatus="false" :entry="item.entry"
                       :displays="item.displays" :pictures="item.Pictures"></component>
            <p class="work-title">{{item.Title}}</p>
            <p class="work-price">￥{{item.Price}}</p>
          </div>
        </li>
      </ul>
    </div>
    <loadmore v-else :top-method="loadTop" :is-auto-loadmore="true" :bottom-method="getWorkList" :all-bottom-loaded="allLoaded"
              ref="loadmore">
      <div class="work-lsit" >
        <div class="loadmore-content">
          <ul>
              <li v-for="(item, index) in workList">
                <a :href="`/work/${item.Id}?CategoryId=${categoryId}`">
                  <div class="work-detail">
                    <component :keep-alive="false" :is="item.displayer" canvas="MobileWorkRow" :editstatus="false" :entry="item.entry"
                              :displays="item.displays" :pictures="item.Pictures"></component>
                    <p class="work-title">{{item.Title}}</p>
                    <p class="work-price">{{item.Price}}</p>
                  </div>
                </a>
              </li>
            </ul>
        </div>
      </div>
    </loadmore>
  </div>
</template>

<script>
  /* eslint-disable */
  import { DecorativeCategories as dc } from 'scripts/utils/custom/consts'
  import { getEntries } from 'scripts/utils/entry'
  import Loadmore from 'scripts/tools/loadmore.js'
  import { initListEntryObj } from 'components/custom/display/display-util'
  import Loading from 'components/public/loading.vue'
  import displayComponents from 'components/custom/display/components'
  import loadmore from 'components/public/loadmore'
  let mixinComponents = _.assign({Loading}, displayComponents)
  export default{
    mixins: [{components: mixinComponents}],
    mounted() {
      let self = this
      let loadmoreInstance = new Loadmore({
        el: document.querySelector('.loadmore-content'),
        sideSlipDisabled: true,
        scrollLoad: true,
        topMethod() {
          setTimeout(() => {
            loadmoreInstance.onTopLoaded()
          }, 1000)
        },
        bottomMethod: function() {
            self.getWorkList()
        }
      })
      this.horizontalInstance = new Loadmore({
        el: '.catogery-wrapper ul',
        scrollDirection: 'horizontal',
        elasticRolling: true
      })
      this.loadmoreInstance = loadmoreInstance
      loadmoreInstance.on('translate', (distance) => {
        // console.log(distance)
      })
      // this.getWorkList()
      this.getCatogery()
      // window.addEventListener('scroll',() => {
      //   let docScrollTop = document.documentElement.scrollTop
      //   if (docScrollTop < 51) {
      //     if (this.$refs.workHead) {
      //       this.$refs.workHead.style.top = -docScrollTop + 'px'
      //       this.$refs.category.style.top = 51 -docScrollTop + 'px'
      //     }
      //   }
      // })
    },
    data() {
      return {
        categoryList: [],
        activeIndex: 0,
        page: 1,
        categoryId: 1,
        workList: [],
        loading: true,
        allLoaded: false,
        infiniteScroll: false
      }
    },
    methods: {
      loadTop(){
        setTimeout(() =>{
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      },
      getCatogery() {
        request({'url':'category/list'}).then((res) => {
          this.categoryList = res.body.Data
          this.categoryId = res.body.Data[0].Id
          if (this.infiniteScroll) {
            this.getWorkList()
          }
        })
      },
      changeCategory(item, index) {
        if (this.activeIndex === index) {
          return
        }
        let scrollLeft
        if (index >= 2 && index < this.categoryList.length -2) {
          scrollLeft = (index - 2) * 80
        } else if(index >= this.categoryList.length - 2) {
          scrollLeft = (this.categoryList.length -2) * 80
        }
        this.horizontalInstance.scrollTo(scrollLeft)
        this.page = 1
        this.activeIndex = index
        this.categoryId = item.Id
        this.allLoaded = false
        this.workList= []
        this.loadmoreInstance.refresh()
        this.getWorkList()
      },
      getWorkList() {
        let params = {
          CategoryId: this.categoryId,
          Page: this.page
        }
        this.$loading('加载中...')
        this.loadmoreInstance.trigger('changeBottomStatus', 'loading')
        return request({url: 'work/manage/list', params}).then(res => {
          let data = res.take ('Data')
          this.$loading.close()
          if (data && data.length >= res.take('Pager').Count) {
            this.loading = false
            this.page++
          } else {
            this.allLoaded = true
            this.loadmoreInstance.destroy()
          }
          this.loading = true
          if (!_.isEmpty (data)) {
            let arr = []
            _.each (data, function (v) {
              arr.push (v['Pieces'][0]['Incomes'][0]['Entries'][0])
            })
            getEntries (arr).then (entriesDetail => {
              _.each (data,  (v) => {
                let finalObj = {}
                finalObj.Title = v['Title']
                finalObj.Id = v['Id']
                finalObj.Pictures = v['Pieces'][0]['Incomes'][0]['Pictures'][0]
                finalObj.Bonus = v['Pieces'][0]['Incomes'][0]['Bonus'] / 100
                let x = _.find (entriesDetail, (d) => {
                  return d.Id === v['Pieces'][0]['Incomes'][0]['Entries'][0]
                })
                finalObj.Price =Math.floor(x.Price * this.discount * (1 + finalObj.Bonus) / 100)
                if (this.categoryId === dc.Rimless) {
                    let back = x.Decorative
                    x = initListEntryObj(x)
                    x['displays'] = {
                      Stack: back.Stack,
                      Thick: back.Thick
                    }
                    x['displayer'] = 'rimless'
                  } else {
                    x = initListEntryObj(x)
                  }
                this.workList.push (_.merge (finalObj, x))
              })
              this.loadmoreInstance.trigger('changeBottomStatus', 'pull')
              this.loadmoreInstance.onBottomLoaded()
            })
          }
          if (this.$refs.loadmore) {
            // this.$refs.loadmore.onBottomLoaded()
            return this.workList
          }
        })
      }
    },
    computed: {
      discount() {
        let currentDiscont = this.categoryList.filter((item) => {
          return item.Id == this.categoryId
        })
        return currentDiscont[0]['Discount'] / 100
      }
    }
  }
</script>
<style>
.work-lsit{
  overflow: hidden;
}
.wa-loadmore-top {
  margin-top: -50px;
  line-height: 50px;
  text-align: center;
}
.wa-loadmore-bottom {
  margin-bottom: -50px;
  line-height: 50px;
  text-align: center;
}
.wa-nomore-text{
  line-height: 50px;
  text-align: center;
}
</style>
