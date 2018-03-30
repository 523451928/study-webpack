<template>
  <div>
    <!--周一惠生活-->
    <div class="discount-life container-fluid">
      <div class="layer-md">
        <div class="discount-life-wrap">
          <a href="/discount-life.html" target="_blank">
            <div class="discount-life-item item-left item-animate">
              <img :data-original="lifeImg.one" class="lazy">
              <div class="item-p">
                <p>周一惠生活</p>
                <p>半价T恤+手机壳 限量200份</p>
              </div>
            </div>
          </a>
          <a href="/user/coupon.html#/activeCoupon" target="_blank"><div class="discount-life-item item-center item-animate">
            <img :data-original="lifeImg.two" class="lazy">
            <div class="item-p">
              <p>注册有礼</p>
              <p>立减10元</p>
            </div>
          </div>
          </a>
          <a href="/cases.html#/inspiration" target="_blank">
            <div class="discount-life-item item-right item-animate">
              <img :data-original="lifeImg.three" class="lazy">
              <div class="item-p">
                <p>灵感案例</p>
                <p>打开你脑洞</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <!--绿植合集-->
    <div class="green-plant container-fluid">
      <div class="layer-md">
        <h2>经典合集</h2>
        <div class="green-plant-left fl">
          <a href="http://wallwa.com/item/product-detail?itemId=3443&type=pen-bag" target="_blank"><div class="item-top item-animate"><img :data-original="classicImg.one" class="lazy img-responsive"></div></a>
          <a href="http://wallwa.com/item/product-detail?itemId=3491&type=Scarf" target="_blank"><div class="item-bot item-animate"><img :data-original="classicImg.two" class="lazy img-responsive"></div></a>
        </div>
        <a href="http://wallwa.com/item/product-detail?itemId=1669&type=Frame" target="_blank"><div class="green-plant-center fl item-animate"><img :data-original="classicImg.three" class="lazy img-responsive"></div></a>
        <div class="green-plant-right fl">
          <a href="http://wallwa.com/item/product-detail?itemId=1435&type=Case&style=iPhone%206/6s%20Plus" target="_blank"><div class="item-top item-animate"><img :data-original="classicImg.four" class="lazy img-responsive"></div></a>
          <a href="http://wallwa.com/item/product-detail?itemId=2268&type=Clock" target="_blank"><div class="item-bot item-animate"><img :data-original="classicImg.five" class="lazy img-responsive"></div></a>
        </div>
      </div>
    </div>

    <!--环球合作-->
    <div class="green-plant world-cooperation container-fluid">
      <div class="layer-md">
        <h2>环球合作款</h2>
        <div class="green-plant-left fl">
          <a href="http://wallwa.com/persional?userId=17483" target="_blank"><div class="item-top item-animate"><img :data-original="partnerImg.one" class="lazy img-responsive"></div></a>
          <a href="http://wallwa.com/item/product-detail?itemId=2698&type=Case" target="_blank"><div class="item-bot item-animate"><img :data-original="partnerImg.two" class="lazy img-responsive"></div></a>
        </div>
        <a href="http://wallwa.com/public/list?&categoryType=Bolster&query=环球" target="_blank"><div class="green-plant-center fl item-animate"><img :data-original="partnerImg.three" class="lazy img-responsive"></div></a>
        <div class="green-plant-right fl">
          <a href="http://wallwa.com/item/product-detail?itemId=2819&type=Rimless" target="_blank"><div class="item-top item-animate"><img :data-original="partnerImg.four" class="lazy img-responsive"></div></a>
          <a href="http://wallwa.com/item/product-detail?itemId=2707&type=Frame&userId=17483" target="_blank"><div class="item-bot item-animate"><img :data-original="partnerImg.five" class="lazy img-responsive"></div></a>
        </div>
      </div>
    </div>
    <!--为你可以做什么-->
    <div class="do-for-you container-fluid">
      <div class="layer-md">
        <h2 class="special-h2">为你，我们可以做什么</h2>
        <div class="dfyou-lists">
          <div class="dfyou-two-wrap">
            <div class="dfyou-img dfyou-list">
              <a href="/custom" target="_blank">
                <img :data-original="foryouImg.one" class="lazy img-responsive">
              </a>
            </div>

            <div class="dfyou-title dfyou-list">
              <a href="/custom" target="_blank" class="dfyou-title-mask">
                <h2>个人定制</h2>
                <p>20种个性产品1件起订</p>
                <p>墙蛙助你实现创意</p>
                <p>唤醒你的生活</p>
              </a>
              <a href="/custom" target="_blank" class="button-mask">查看详情<span class="wa wa-right much-icon"></span></a>
            </div>

          </div>
          <div class="dfyou-two-wrap"  @click="showModal('group')">
            <div class="dfyou-img dfyou-list">
              <a href="javascript:void(0)" class="group-btn-trigger" data-trigger="0">
                <img :data-original="foryouImg.two" class="lazy img-responsive">
              </a>
            </div>
            <div class="dfyou-title dfyou-list">
              <a href="javascript:void(0)" class="dfyou-title-mask group-btn-trigger" data-trigger="0">
                <h2>团体定制</h2>
                <p>高效率的批量个性化定制</p>
                <p>物美价优</p>
                <p>2个工作日极速发货</p>
              </a>
              <a href="javascript:void(0)" class="button-mask group-btn-trigger" target="_blank">查看详情<span class="wa wa-right much-icon"></span></a>
            </div>

          </div>
        </div>
        <div class="dfyou-lists">
          <div class="dfyou-two-wrap">

            <div class="dfyou-title dfyou-list">
              <a href="/guide.html" class="dfyou-title-mask" target="_blank">
                <h2>艺术家店铺</h2>
                <p>墙蛙帮你实现个人品牌梦</p>
                <p>多种高品质个性衍生品</p>
                <p>一键生成，发货无忧</p>
              </a>
              <a href="/guide.html" class="button-mask" target="_blank">查看详情<span class="wa wa-right much-icon"></span></a>
            </div>

            <div class="dfyou-img dfyou-list">
              <a href="/guide.html" target="_blank">
                <img :data-original="foryouImg.three" class="lazy img-responsive">
              </a>
            </div>
          </div>
          <div class="dfyou-two-wrap"  @click="showModal('paint')">
            <div class="dfyou-title dfyou-list">
              <a href="javascript:void(0)" class="dfyou-title-mask group-btn-trigger" data-trigger="1">
                <h2>绘画机构合作</h2>
                <p>把小朋友的画定制成</p>
                <p>最特别的礼物</p>
                <p>打造你的机构品牌</p>
              </a>
              <a href="javascript:void(0)" class="button-mask group-btn-trigger" data-trigger="1">查看详情<span class="wa wa-right much-icon"></span></a>
            </div>
            <div class="dfyou-img dfyou-list">
              <a href="javascript:void(0)" class="group-btn-trigger" data-trigger="1">
                <img :data-original="foryouImg.four" class="lazy img-responsive">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--线下案例-->
    <div class="green-plant offline-case container-fluid">
      <div class="layer-md">
        <h2>线下案例</h2>
        <div class="green-plant-left fl">
          <a href="/cases.html#/line" target="_blank"><div class="item-top item-animate"><img src="~images/wallLife/case-01.jpg" class="lazy img-responsive"></div></a>
          <a href="/cases.html#/line" target="_blank"><div class="item-bot item-animate"><img src="~images/wallLife/case-02.jpg" class="lazy img-responsive"></div></a>
        </div>
        <a href="/cases.html#/line" target="_blank"><div class="green-plant-center item-animate fl"><img src="~images/wallLife/case-03.jpg" class="lazy img-responsive"></div></a>
        <div class="green-plant-right fl">
          <a href="/cases.html#/line" target="_blank"><div class="item-top item-animate"><img src="~images/wallLife/case-04.jpg" class="lazy img-responsive"></div></a>
          <a href="/cases.html#/line" target="_blank"><div class="item-bot item-animate"><img src="~images/wallLife/case-05.jpg" class="lazy img-responsive"></div></a>
        </div>
      </div>
    </div>
    <modal :title="modalTitle" :textArr="textArr" ref="modal"></modal>
  </div>
</template>
<style lang='sass'>
  @import '~styles/scss/wallwa/goodlife.scss'
</style>
<script>
  /* eslint-disable */
  import modal from './modal.vue'
  export default {
    components: {
      modal
    },
    methods: {
      showModal(str) {
        this.$refs.modal.show()
        if (str === 'paint') {
          this.modalTitle = '画室机构合作'
          this.textArr = [
            '如果您是绘画机构的老师或负责人，可申请成为墙蛙绘画机构合作伙伴！',
            '确认合作后，即可免费领取一套机构专属礼包+定期体验新品',
            '请点击下方按钮，留言您所在的<span class="span-td">机构名称，学生数量，授课所在地及联系方式</span>',
            '我们会在看到留言的第一时间与您联系'
          ]
        } else {
          this.modalTitle = '团体定制'
          this.textArr = [
            '欢迎来墙蛙进行团体定制！',
            '如果您需要批量定制10件及以上的产品，可联系客服获取相应的优惠价格',
            '请点击下方按钮，留言您要批量定制的<span class="span-td">产品，数量以及联系方式</span>',
            '我们会在看到留言的第一时间与您联系'
          ]
        }
      }
    },
    data() {
      return {
        modalTitle: '团体定制',
        textArr: [],
        lifeImg: {
          one: require('assets/images/wallLife/remind-01.jpg'),
          two: require('assets/images/wallLife/remind-02.jpg'),
          three: require('assets/images/wallLife/remind-03.png')
        },
        classicImg: {
          one: require('assets/images/wallLife/green-01.jpg'),
          two: require('assets/images/wallLife/green-02.jpg'),
          three: require('assets/images/wallLife/green-03.jpg'),
          four: require('assets/images/wallLife/green-04.jpg'),
          five: require('assets/images/wallLife/green-05.jpg')
        },
        partnerImg: {
          one: require('assets/images/wallLife/world-01.jpg'),
          two: require('assets/images/wallLife/world-02.jpg'),
          three: require('assets/images/wallLife/world-03.jpg'),
          four: require('assets/images/wallLife/world-04.jpg'),
          five: require('assets/images/wallLife/world-05.jpg')
        },
        foryouImg: {
          one: require('assets/images/wallLife/foryou-01.jpg'),
          two: require('assets/images/wallLife/foryou-02.jpg'),
          three: require('assets/images/wallLife/foryou-03.jpg'),
          four: require('assets/images/wallLife/foryou-04.jpg')
        }
      }
    }
  }
</script>
