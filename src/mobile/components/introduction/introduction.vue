<template>
<div class="warp user-center-wrap">
  <div class="row user-des">
    <div class="col-md-6">
      <h2 class="user-des-title title-border">个人说明</h2>
      <div class="user-des-text">
        <pre class="user-des-con" v-show="!edit">{{intro || '暂无个人说明'}}</pre>
        <textarea @blur="pushIntro" v-show="edit" v-model="intro" cols="30" rows="3" class="form-control user-des-edit" placeholder="编辑个人说明"></textarea>
      </div>
      <div class="user-des-text-edit">
        <a href="javascript:void(0)" @click="toggleedit" class="use-des-edit-btn">
          <span class="wa wa-pencil"></span>编辑
        </a>
      </div>
      <div class="user-des-date">
        <span class="user-join-date"></span>加入墙蛙
      </div>
    </div>
    <div class="col-md-6 user-ads">
      <div class="user-ads-slider" id="user-ads-slider">
        <div class="flex-viewport">
          <ul class="list-unstyled slides user-ads-list clearfix">
            <li>
              <a href="javascript:void(0)">
                <img src="http://wallwa.com/uc/advise/image/0/fa1af2938717777b5874aabc2150db79-480x300.jpeg" alt="photo"/>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <img src="http://wallwa.com/uc/advise/image/0/349c561647008f5657ac48b127c6e6fa-480x300.jpeg" alt="photo2"/>
              </a>
            </li>
          </ul>
          <ol class="flex-control-nav flex-control-paging">
            <li>
              <a href="javascript:void(0)" class="flex-active">1</a>
              <a href="javascript:void(0)">2</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 user-list  user-product-list user-des">
      <h2 class="user-des-title">我的定制<a href="/work.html" class="view-more">查看更多</a></h2>
      <div class="product-list-area">
        <div id='test' class="carousel slide">
          <!--轮播内容-->
          <div class="carousel-inner">
            <div class="item" :style="{width:obj.length*250+'px', transform: 'translate3d('+(-serial*1000)+'px, 0px, 0px)'}">
              <div class="pro-list diy-list" v-for="(item, index) in obj">
                <div class="pro-pic text-center">
                  <component :keep-alive="false" :is="item.displayer" :canvas="'WorkRow'" :editstatus="false" :entry="item.entry"
                             :displays="item.displays" :pictures="item.Pictures"></component>
                </div>
                <div class="pro-detail clearfix">
                <span class="pro-price pull-left">
                  ¥ {{item['Money']}}
                </span>
                </div>
              </div>
            </div>
          </div>
          <!--轮播导航-->
          <a href="javascript:void(0)" class="carousel-control left" :class="{disable:serial<1}" @click="goLeft"></a>
          <a href="javascript:void(0)" class="carousel-control right" :class="{disable:serial>100}"@click="goRight"></a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  // import { DecorativeCategories as dc } from 'scripts/utils/custom/consts'
  import { getEntries } from 'scripts/utils/entry'
  import { initListEntryObj } from 'components/public/display/app/display-util'
  import Loading from 'components/public/loading.vue'
  import { mixin as displayComponents } from 'components/public/display/app/components'
  let mixinComponents = _.assign({Loading}, displayComponents)
  export default {
    mixins: [{components: mixinComponents}],
    data() {
      return {
        edit: false,
        intro: '',
        obj: [],
        page: 1,
        has: true,
        serial: 0,
        loading: true,
        noPro: false,
        noMore: false
      }
    },
    created() {
      this.getId()
    },
    mounted() {
      this.getCustom()
    },
    methods: {
      goRight() {
        if (this.noMore) {
          return
        }
        if (this.serial) {
          this.page++
          this.getCustom()
        }
        this.serial++
      },
      goLeft() {
        this.serial--
      },
      getCustom() {
        let self = this
        let params = {
          Page: this.Page
        }
        this.loading = true
        request({url: 'item/list', params}).then(res => {
          let arr = []
          let data = _.pickBy(res.take('Data'), function(v) {
            return !v.Disable
          })
          if (!_.isEmpty(data)) {
            _.each(data, function(v) {
              arr.push(v['Entries'][0])
            })
            getEntries(arr).then(entriesDetail => {
              _.each(data, function(v) {
                let finalObj = {}
                finalObj.Id = v['Id']
                finalObj.Money = v['Money'] / 100
                finalObj.Pictures = v['Pictures'][0]
                let x = _.find(entriesDetail, (d) => {
                  return d.Id === v['Entries'][0]
                })
                x = initListEntryObj(x)
                self.obj.push(_.merge(finalObj, x))
              })
              self.loading = false
            })
          } else if (self.list.length) {
            self.noMore = true
          } else {
            self.noMore = true
            self.noPro = true
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      toggleedit() {
        this.edit = !this.edit
      },
      getId() {
        request({url: 'header'}).then(res => {
          let data = res.data
          this.pull(data['UserId'])
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pull(id) {
        let params = {
          ArtistId: id
        }
        request({url: 'profile/si', params}).then(res => {
          let data = res.take('Data')
          this.intro = data['Introduction']
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      pushIntro() {
        let params = {
          Introduction: this.intro
        }
        request.submit('profile/set', params).then(res => {
          let data = res.take('Data')
          if (data) {
            layer.toast('更新成功')
            this.edit = false
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      }
    }
  }
</script>
<style lang="sass">
  .product-list-area {
    .pro-list .pro-detail {
      padding: 10px;
      color: #82888a;
      min-height: 40px;
      background-color: #fff;
    }
    .diy-list .pro-detail .pro-price {
      color: #76a549;
    }
    .diy-list .pro-pic {
      padding: 30px 0 15px 0;
    }
    .carousel {
      .carousel-control.disable {
        display: none;
      }
    }
    .carousel-inner {
      width: 1000px;
      .item {
        -webkit-transition: all 0.6s;
        -moz-transition: all 0.6s;
        -ms-transition: all 0.6s;
        -o-transition: all 0.6s;
        transition: all 0.6s;
      }
    }
  }
</style>
