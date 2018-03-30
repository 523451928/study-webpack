<template>
  <div class="container-fluid custom-body">
    <div class="row">
      <div class="custom-banner">
        <a href="/static/custom-tutorial.html">
          <img class="custom-banner-img img-responsive" src="~images/custom/custom-help.jpg" />
        </a>
      </div>
    </div>
    <div class="row">
      <a href="/custom.html#/category/8" class="chink">装饰画</a>
      <a href="" class="img-warp">
        <img src="~images/custom/new-cate-icon/frame.jpg" alt="frame"/>
      </a>
      <a href="/custom.html#/category/8" class="chink2 active">有框画</a>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/2" class="cate-link">
          <img src="~images/custom/new-cate-icon/rimless.jpg" alt="rimless"/>
          <span class="chink2">布艺画</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/4" class="cate-link">
          <img src="~images/custom/new-cate-icon/scroll.jpg" alt="scroll"/>
          <span class="chink2">卷轴画</span>
        </a>
      </div>
      <div class="chink col-sm-12">家居用品</div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/11" class="cate-link">
          <img src="~images/custom/new-cate-icon/boslter.jpg" alt="bolster"/>
          <span class="chink2">抱枕</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/21" class="cate-link">
          <img src="~images/custom/new-cate-icon/clock.jpg" alt="bolster"/>
          <span class="chink2">挂钟</span>
        </a>
      </div>
      <div class="chink col-sm-12">T恤</div>
      <div class="col-sm-12">
        <a href="/custom.html#/category/16" class="cate-link">
          <img src="~images/custom/new-cate-icon/T-child.jpg" alt="t_child"/>
          <span class="chink2 active">儿童T恤</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/14" class="cate-link">
          <img src="~images/custom/new-cate-icon/T-man.jpg" alt="T-man"/>
          <span class="chink2">男士T恤</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/15" class="cate-link">
          <img src="~images/custom/new-cate-icon/T-woman.jpg" alt="T-man"/>
          <span class="chink2">女士T恤</span>
        </a>
      </div>
      <div class="chink col-sm-12">数码产品</div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/10" class="cate-link">
          <img src="~images/custom/new-cate-icon/phone.jpg" alt="phone"/>
          <span class="chink2">手机壳</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/18" class="cate-link">
          <img src="~images/custom/new-cate-icon/pad.jpg" alt="pad"/>
          <span class="chink2">iPad壳</span>
        </a>
      </div>
      <div class="chink col-sm-12">文创用品</div>
      <div class="col-sm-12">
        <a href="/custom.html#/category/20" class="cate-link">
          <img src="~images/custom/new-cate-icon/puzzle.jpg" alt="puzzle"/>
          <span class="chink2 active">拼图</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/19" class="cate-link">
          <img src="~images/custom/new-cate-icon/mac.jpg" alt="mac"/>
          <span class="chink2">笔记本</span>
        </a>
      </div>
      <div class="col-xs-6 col-sm-4">
        <a href="/custom.html#/category/12" class="cate-link">
          <img src="~images/custom/new-cate-icon/cup.jpg" alt="cup"/>
          <span class="chink2">旅行杯</span>
        </a>
      </div>
      <div class="chink col-sm-12">帆布包</div>
      <div class="col-sm-12">
        <a href="/custom.html#/category/17" class="cate-link">
          <img src="~images/custom/new-cate-icon/bag.jpg" alt="bag"/>
        </a>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
  .custom-body {
    margin-bottom: 50px;
    .custom-banner {
      img {
        width: 100%;
      }
    }
  }
  .cate-link {
    display: inline-block;
    position: relative;
    color: #565a5c;
    margin: 0 -15px;
    text-align: center;
    background: #fff;
    img {
      display: block;
      width: 100%;
      margin: 0 auto;
    }
  }
  .chink {
    display: inline-block;
    color: #565a5c;
    text-align: center;
    width: 100%;
    text-decoration: none;
    font-size: 20px;
    padding: 40px 0 15px;
  }
  .chink2 {
    display: inline-block;
    color: #565a5c;
    text-align: center;
    width: 100%;
    text-decoration: none;
    padding: 10px 0 0;
    font-size: 12px;
    &.active {
    padding: 10px 0 25px;
     }
  }
  .img-warp {
    display: inline-block;
    img {
      width: 100%;
    }
  }
</style>
