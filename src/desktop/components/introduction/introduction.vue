<template>
<div class="warp user-center-wrap">
  <div class="row user-des">
    <div class="col-md-6">
      <h2 class="user-des-title title-border">个人说明</h2>
      <div class="user-des-text">
        <pre class="user-des-con" v-show="!edit">{{intro || '暂无个人说明'}}</pre>
        <textarea @blur="pushIntro" @keyup.enter="pushIntro" v-show="edit" v-model="intro" cols="30" rows="3" class="form-control user-des-edit" placeholder="编辑个人说明"></textarea>
      </div>
      <div class="user-des-text-edit">
        <a href="javascript:void(0)" @click="toggleedit" class="use-des-edit-btn">
          <span class="wa wa-pencil"></span>编辑
        </a>
      </div>
      <div class="user-des-date">
        <span class="user-join-date" v-text="joindate"></span>加入墙蛙
      </div>
    </div>
    <div class="col-md-6 user-ads">
      <div class="user-ads-slider" id="user-ads-slider">
        <div class="flex-viewport">
          <ul class="list-unstyled slides user-ads-list clearfix" :style="slideStyle">
            <li v-for="(item, index) in imgArr">
              <a :href="item.link">
                <img :src="item.imgSrc" alt="photo"/>
              </a>
            </li>
          </ul>
          <ol class="flex-control-nav flex-control-paging">
            <li>
              <!--<a href="javascript:void(0)" class="flex-active">1</a>-->
              <a v-for="(item, index) in imgArr" @click="activeIndex=index" :class="{'flex-active': index===activeIndex}" href="javascript:void(0)">{{index}}</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 user-list  user-product-list user-des">
      <h2 class="user-des-title">我的定制<a href="/user/work.html?custom=1" class="view-more">查看更多</a></h2>
      <div class="product-list-area">
        <div class="carousel slide" v-if="costomArr.length">
          <!--轮播内容-->
          <div class="carousel-inner">
            <div class="item" :style="{width:costomArr.length*250+'px', transform: 'translate3d('+(-serial*1000)+'px, 0px, 0px)'}">
              <div class="pro-list diy-list" v-for="(item, index) in costomArr">
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
          <a href="javascript:void(0)" class="carousel-control right" :class="{disable:(serial+1)*4 >= costomArr.length}" @click="goRight"></a>
        </div>
        <div class="no-pro-msg text-center" v-if="noPro">
          <h2>╮(╯▽╰)╭ 这里空空如也，<a  class="underline-link" href="/custom"> 去定制作品吧 >> </a></h2>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import { getEntries } from 'components/custom/display/entry'
  import { initListEntryObj } from 'components/custom/display/display-util.js'
  import Loading from 'components/public/loading.vue'
  import displayComponents from 'components/custom/display/components.js'
  const mixinComponents = { Loading, ...displayComponents }
  export default {
    mixins: [{components: mixinComponents}],
    data() {
      return {
        edit: false,
        intro: '',
        joindate: '',
        costomArr: [],
        page: 1,
        has: true,
        serial: 0,
        loading: true,
        noPro: false,
        noMore: false,
        slideStyle: {
          'transform': 'translateX(-25%)',
          'transition-duration': '.3s'
        },
        imgArr: [
          {imgSrc: 'http://wallwa.com/uc/advise/image/0/2a6b3c90758167a059cc5d6e351485ee-480x300.jpeg', link: '/user/coupon.html'},
          {imgSrc: 'http://wallwa.com/uc/advise/image/0/349c561647008f5657ac48b127c6e6fa-480x300.jpeg', link: '/guide.html'}
        ],
        activeIndex: 0,
        eventObj: {}
      }
    },
    computed: {
      slideStyle() {
        return {
          'transform': `translateX(-${this.activeIndex * 25}%)`,
          'transition-duration': '.3s'
        }
      }
    },
    mounted() {
      this.getCustom().then((res) => {
//        this.pull(this.$user.UserId)
        this.$onBus('profileData', (data) => {
          this.intro = data['introduction']
          this.joindate = data['joinDate']
        })
      })
    },
    methods: {
      goRight() {
        this.page++
        this.getCustom()
        this.serial++
      },
      goLeft() {
        this.serial--
      },
      getCustom() {
        if (this.noMore) {
          return
        }
        let self = this
        let params = {
          Page: this.page
        }
        this.loading = true
        return request({url: 'item/list', params}).then(res => {
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
                self.costomArr.push(_.merge(finalObj, x))
              })
              self.loading = false
            })
          } else if (self.costomArr.length) {
            self.noMore = true
          } else {
            self.noMore = true
            self.noPro = true
          }
          return Promise.resolve(data)
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      toggleedit() {
        this.edit = !this.edit
      },
      pull(id) {
        let params = {
          UserId: id
        }
        request({url: 'profile/si', params}).then(res => {
          let data = res.take('Data')
          this.intro = data['Introduction']
          this.joindate = data['JoinDate']
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
            this.$notify({
              type: 'wa-success',
              text: '更新成功'
            })
            this.$bus.$emit('refreshProfile')
            this.edit = false
          }
        }, res => {
          res.hide()
          layer.toast(res.take('Error'))
        })
      },
      paraStr(num) {
        let str = String(num)
        return `${str.slice(0, -4)}.${str.slice(-4, -2)}.${str.slice(-2)}`
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
      height: 300px;
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
