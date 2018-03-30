<template>
  <div>
    <!--绿植合集-->
    <div class="visible-xs-block">
      <div class="gap"></div>
    </div>
    <div class="wall-group">
      <div class="visible-xs-block">
        <div class="wall-group-wrap">
          <h2 class="pt15 ptnav">经典合集</h2>
          <a href="http://m.wallwa.com/item/product-detail?itemId=1669&type=Frame"><div class="wall-group-list tops"><img :data-original="classicImg.one" class="lazy img-responsive" alt=""></div></a>
          <div>
            <a href="http://m.wallwa.com/item/product-detail?itemId=1435&type=Case&style=iPhone%206/6s%20Plus"><div class="wall-group-list lefts"><img :data-original="classicImg.two" class="lazy img-responsive" alt=""></div></a>
            <a href="http://m.wallwa.com/item/product-detail?itemId=3491&type=Scarf"><div class="wall-group-list rights"><img :data-original="classicImg.three" class="lazy img-responsive" alt=""></div></a>
          </div>
        </div>
      </div>
    </div>
    <!--环球合作款-->
    <div class="wall-group">
      <div class="visible-xs-block">
        <div class="wall-group-wrap">
          <h2 class="pt15 mtnav">环球合作款</h2>
          <a href="http://m.wallwa.com/item/product-detail?itemId=2702&type=Bolster"><div class="wall-group-list tops"><img :data-original="worldImg.one" class="lazy img-responsive" alt=""></div></a>
          <div>
            <a href="http://m.wallwa.com/public/list?query=%E7%8E%AF%E7%90%83"><div class="wall-group-list lefts"><img :data-original="worldImg.two" class="lazy img-responsive" alt=""></div></a>
            <a href="http://m.wallwa.com/item/product-detail?itemId=2698&type=Case"><div class="wall-group-list rights"><img :data-original="worldImg.three" class="lazy img-responsive" alt=""></div></a>
          </div>
        </div>
      </div>
    </div>
    <div class="visible-xs-block">
      <div class="gap"></div>
    </div>
    <!--为你可以做什么-->
    <div class="wall-dfyou">
      <div class="visible-xs-block">
        <div class="wall-dfyou-wrap">
          <h2 class="pt15">为你，我们可以做什么</h2>
          <div class="dfyou-lists">
            <div data-index="0" class="dfyou-img dfyou-list col-xs-6">
              <a href="/static/custom-list.html"><img :data-original="doforyouImg.one" class="lazy img-responsive"></a>
            </div>
            <a href="/static/custom-list.html">
              <div data-index="1" class="dfyou-title dfyou-list col-xs-6">
                <h2>个人定制</h2>
                <p>20种个性产品1件起订</p>
                <p>墙蛙助你实现创意</p>
                <p>唤醒你的生活</p>
              </div>
            </a>
          </div>
          <div class="dfyou-lists">
            <a href="/static/group.html">
              <div data-index="2" class="dfyou-title dfyou-list col-xs-6">
                <h2>团体定制</h2>
                <p>高效率的批量个性化定制</p>
                <p>物美价优</p>
                <p>2个工作日极速发货</p>
              </div>
            </a>
            <div data-index="3" class="dfyou-img dfyou-list col-xs-6">
              <a href="/static/group.html"><img :data-original="doforyouImg.two" class="lazy img-responsive"></a>
            </div>
          </div>
          <div class="dfyou-lists">
            <div data-index="4" class="dfyou-img dfyou-list col-xs-6">
              <a href="/static/artist.html"><img :data-original="doforyouImg.three" class="lazy img-responsive"></a>
            </div>
            <a href="/static/artist.html">
              <div data-index="5" class="dfyou-title dfyou-list col-xs-6">
                <h2>艺术家店铺</h2>
                <p>墙蛙帮你实现个人品牌梦</p>
                <p>多种高品质个性衍生品</p>
                <p>一键生成，发货无忧</p>
              </div>
            </a>
          </div>
          <div class="dfyou-lists">
            <a href="/static/studio.html">
              <div data-index="6" class="dfyou-title dfyou-list col-xs-6">
                <h2>绘画机构合作</h2>
                <p>把小朋友的画定制成</p>
                <p>最特别的礼物</p>
                <p>打造你的机构品牌</p>
              </div>
            </a>
            <div data-index="7" class="dfyou-img dfyou-list col-xs-6">
              <a href="/static/studio.html"><img :data-original="doforyouImg.four" class="lazy img-responsive"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="visible-xs-block">
      <div class="gap"></div>
    </div>
    <!--案例展示-->
    <div class="wall-group">
      <div class="visible-xs-block">
        <div class="wall-group-wrap">
          <h2 class="pt15 ptnav">案例展示</h2>
          <a href="/static/case.html"><div class="wall-group-list tops"><img :data-original="caseImg.one" class="lazy img-responsive"  alt=""></div></a>
          <div>
            <a href="/static/case.html"><div class="wall-group-list lefts"><img :data-original="caseImg.two" class="lazy img-responsive" alt=""></div></a>
            <a href="/static/case.html"><div class="wall-group-list rights"><img :data-original="caseImg.three" class="lazy img-responsive" alt=""></div></a>
          </div>
        </div>
      </div>
    </div>
    <div class="visible-xs-block">
      <div class="gap"></div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    data() {
      return {
        classicImg: {
          one: require('images/wallLife/new-wallwa-pic/plants_01.jpg'),
          two: require('images/wallLife/new-wallwa-pic/plants_02.jpg'),
          three: require('images/wallLife/new-wallwa-pic/plants_03.jpg')
        },
        worldImg: {
          one: require('images/wallLife/new-wallwa-pic/world_01.jpg'),
          two: require('images/wallLife/new-wallwa-pic/world_02.jpg'),
          three: require('images/wallLife/new-wallwa-pic/world_03.jpg')
        },
        doforyouImg: {
          one: require('images/wallLife/new-wallwa-pic/custom-person.jpg'),
          two: require('images/wallLife/new-wallwa-pic/custom-business.jpg'),
          three: require('images/wallLife/new-wallwa-pic/custom-designer.jpg'),
          four: require('images/wallLife/new-wallwa-pic/custom-mechanism.jpg')
        },
        caseImg: {
          one: require('images/wallLife/new-wallwa-pic/below_line_01.jpg'),
          two: require('images/wallLife/new-wallwa-pic/below_line_02.jpg'),
          three: require('images/wallLife/new-wallwa-pic/below_line_03.jpg')
        }
      }
    }
  }
</script>

<style lang="sass">
@import "../../styles/scss/wallwa/activity"
</style>
