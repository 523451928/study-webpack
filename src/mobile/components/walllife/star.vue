<template>
  <!--明星产品，流式布局-->
  <div class="star-product text-center">
    <div class="visible-xs-block">
      <div class="gap"></div>
    </div>
    <div class="wall-goodsinfo">
      <div class="visible-xs-block">
        <div class="wall-goosinfo-wrap">
          <div class="goosinfo-wrap-left">
            <i class="wa wa-check-circle-o"></i>
            <span>付款后两个工作日内发货</span>
          </div>
          <div class="goosinfo-wrap-left rights">
            <i class="wa wa-check-circle-o"></i>
            <span>全场商品免邮费</span>
          </div>
        </div>
      </div>
    </div>
    <div class="wall-newproduct">
      <div class="visible-xs-block">
        <div class="wall-newproduct-wrap">
          <div class="wall-newproduct-list wall-newproduct-item">
            <a href="/static/discount-life.html">
              <img src="~images/wallLife/new-wallwa-pic/acti4.jpg" alt="">
              <div class="product-title">
                <h2>周一惠生活</h2>
                <p class="ip5-one">半价T恤+手机壳</p>
                <p class="ip6">半价T恤+手机壳 限量200份</p>
                <p class="ip5-two">限量200份</p>
              </div>
            </a>
          </div>
          <div class="wall-newproduct-right">
            <div class="wall-newproduct-rlist1 wall-newproduct-item">
              <a href="/user/active-coupon.html">
                <img src="~images/wallLife/new-wallwa-pic/acti2.jpg" alt="">
                <div class="product-title rights">
                  <h2>注册有礼</h2>
                  <p>立减10元</p>
                </div>
              </a>
            </div>
            <div class="wall-newproduct-rlist2 wall-newproduct-item">
              <a href="/static/atlas.html">
                <img src="~images/wallLife/new-wallwa-pic/acti3.jpg" alt="">
                <div class="product-title rights">
                  <h2>灵感案例</h2>
                  <p>打开你的脑洞</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--屏幕小于768px-->
    <div class="visible-xs-block">
      <h2 class="pt15">明星单品</h2>
      <div class="row">
        <div class="col-xs-12 col-pad0">
          <div class="star-product-top">
            <div class="star-product-wrap">
              <a href="http://m.wallwa.com/item/product-detail?itemId=2706&type=Rimless">
                <img src="~images/wallLife/new-wallwa-pic/singleProduct-1.jpg"  class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">动物CP原木框客厅卧室挂画</p>
              <p class="price pb10">￥119</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-left">
              <a href="http://m.wallwa.com/item/product-detail?itemId=4343&type=Rimless">
                <img src="~images/wallLife/new-wallwa-pic/luck-peacock.jpg" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">吉祥孔雀玄关走廊挂画</p>
              <p class="price pb10">￥179</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-right">
              <a href="http://m.wallwa.com/public/list?categoryType=Bolster&query=%E8%90%8C%E5%AE%A0" >
                <img src="~images/wallLife/new-wallwa-pic/singleProduct-6.jpg" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">笔芯动物超柔短毛抱枕</p>
              <p class="price pb10">￥86</p>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-pad0">
          <div class="star-product-top">
            <div class="star-product-wrap">
              <a href="http://m.wallwa.com/item/product-detail?itemId=4335&type=Frame">
                <img src="~images/wallLife/new-wallwa-pic/vango-star.jpg" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">梵高星空客厅卧室挂画</p>
              <p class="price pb10">￥100</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-left">
              <a href="http://m.wallwa.com/public/list?categoryType=Rimless&query=%E6%B0%B4%E6%9E%9C%E5%8D%95%E8%BD%A6">
                <!--<img :data-original="starImg.five" class="lazy img-responsive">-->
                <img :src="starImg.five" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">水果单车餐厅客厅挂画</p>
              <p class="price pb10 pb40">￥112</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-right">
              <a href="http://m.wallwa.com/public/list?categoryType=Bolster">
                <img :data-original="starImg.six" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">小黄人正版超柔短毛抱枕</p>
              <p class="price pb10 pb40">￥86</p>
            </div>
          </div>
        </div>

        <div class="col-xs-12 col-pad0">
          <div class="star-product-top">
            <div class="star-product-wrap">
              <a href="http://wallwa.com/public/list?categoryType=Rimless&query=%E5%A4%9A%E8%82%89">
                <img :data-original="plantImg.one" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">多肉浅木纹餐厅装饰画</p>
              <p class="price pb10">￥112</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-left">
              <a href="http://wallwa.com/public/list?categoryType=Rimless&query=ins%E9%A3%8E">
                <!--<img :data-original="plantImg.two" class="lazy img-responsive">-->
                <img :src="plantImg.two" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">龟背竹ins风简约装饰画</p>
              <p class="price pb10 pb40">￥112</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-right">
              <a href="http://wallwa.com/public/list?categoryType=Rimless&query=%E6%B0%B4%E5%BD%A9%E7%BB%BF%E6%A4%8D">
                <img :data-original="plantImg.three" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">清新绿植沙发背景装饰画</p>
              <p class="price pb10 pb40">￥69</p>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-pad0">
          <div class="star-product-top">
            <div class="star-product-wrap">
              <a href="http://wallwa.com/public/list?categoryType=Rimless&query=%E6%B8%85%E6%96%B0">
                <img :data-original="plantImg.four" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">北欧风薄荷绿家居装饰画</p>
              <p class="price pb10">￥119</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-left">
              <a href="http://wallwa.com/public/list?categoryType=Rimless&query=%E7%BB%BF%E6%A3%AE%E6%9E%97">
                <!--<img :data-original="plantImg.five" class="lazy img-responsive">-->
                <img :src="plantImg.five" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">北欧风绿森林创意装饰画</p>
              <p class="price pb10 pb40">￥119</p>
            </div>
          </div>
        </div>
        <div class="col-xs-6">
          <div class="star-product-child">
            <div class="star-product-right">
              <a href="http://wallwa.com/public/list?categoryType=Rimless&query=%E8%A1%8C%E4%BA%91%E6%B5%81%E6%B0%B4">
                <img :data-original="plantImg.six" class="lazy img-responsive">
              </a>
              <p class="draw-name mb5">行云流水简约玄关山水画</p>
              <p class="price pb10 pb40">￥158</p>
            </div>
          </div>
        </div>
        <div class="clearfix">
        </div>
        <a href="/work" class="btn-more">更多宝贝&nbsp;&gt;</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        starImg: {
          one: require('images/wallLife/new-wallwa-pic/singleProduct-1.jpg'),
          two: require('images/wallLife/new-wallwa-pic/luck-peacock.jpg'),
          three: require('images/wallLife/new-wallwa-pic/singleProduct-6.jpg'),
          four: require('images/wallLife/new-wallwa-pic/vango-star.jpg'),
          five: require('images/wallLife/new-wallwa-pic/fruit-bick.jpg'),
          six: require('images/wallLife/new-wallwa-pic/little-yellow.jpg')
        },
        plantImg: {
          one: require('images/wallLife/new-wallwa-pic/plants-01.jpg'),
          two: require('images/wallLife/new-wallwa-pic/plants-02.jpg'),
          three: require('images/wallLife/new-wallwa-pic/plants-03.jpg'),
          four: require('images/wallLife/new-wallwa-pic/plants-04.jpg'),
          five: require('images/wallLife/new-wallwa-pic/plants-05.jpg'),
          six: require('images/wallLife/new-wallwa-pic/plants-06.jpg')
        }
      }
    },
    filters: {
      currency(val) {
        return val.toFixed(2)
      }
    }
  }
</script>
<style scoped>
  .row{
    padding: 0 15px;
  }
</style>
