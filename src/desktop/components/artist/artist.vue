<template>
  <div class="artist-wrap">
    <div class="artist-banner text-center">
      <h2 class="artist-bnr-tit">墙蛙品牌店</h2>
      <p class="artist-bnr-tips">让更多人见到你的作品，把它变成实实在在的收入。</p>
      <!--<a href="/shopGuide">开店引导</a>-->
      <a href="/guide.html" class="  btn-primary btn btn-lg artist-bnr">开店引导</a>
    </div>
    <div class="artist-tab-nav">
      <ul class="artist-tab-nav-list clearfix">
        <li v-for="(item, index) in tabArr" :class="{'active':item.filter === filterText}">
          <a @click="filterText = item.filter">{{item.text}}</a>
        </li>
      </ul>
    </div>
    <div class="artist-tab-wrap">
      <div class="container">
        <div class="row" id="artist-box">
          <!--<div class="col-md-4 artist-list design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=11409'>-->
                  <!--<img src="~images/activity/artist/paints/31.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=11409'>-->
                  <!--<img src="~images/activity/artist/artist-head/31.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail" >-->
                <!--<a class="artist-name" href='/persional?userId=11409'>-->
                  <!--MorningRocks-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--图形艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 3242   <span class="wa wa-heart-fill"></span> 80-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=13043'>-->
                  <!--<img src="~images/activity/artist/paints/33.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=13043'>-->
                  <!--<img src="~images/activity/artist/artist-head/33.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail" >-->
                <!--<a class="artist-name" href='/persional?userId=10413'>-->
                  <!--南初-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1987   <span class="wa wa-heart-fill"></span> 56-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10040'>-->
                  <!--<img src="~images/activity/artist/paints/2.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10040'>-->
                  <!--<img src="~images/activity/artist/artist-head/2.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10040'>-->
                  <!--鸟川芥-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1581   <span class="wa wa-heart-fill"></span> 41-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10036'>-->
                  <!--<img src="~images/activity/artist/paints/3.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10036'>-->
                  <!--<img src="~images/activity/artist/artist-head/3.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10036'>-->
                  <!--狐狸飞-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1211   <span class="wa wa-heart-fill"></span> 51-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10009'>-->
                  <!--<img src="~images/activity/artist/paints/4.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10009'>-->
                  <!--<img src="~images/activity/artist/artist-head/4.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10009'>-->
                  <!--元熙-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1889   <span class="wa wa-heart-fill"></span> 61-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10029'>-->
                  <!--<img src="~images/activity/artist/paints/5.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10029'>-->
                  <!--<img src="~images/activity/artist/artist-head/5.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10029'>-->
                  <!--阿布酱-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1571   <span class="wa wa-heart-fill"></span> 69-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10002'>-->
                  <!--<img src="~images/activity/artist/paints/7.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10002'>-->
                  <!--<img src="~images/activity/artist/artist-head/7.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10002'>-->
                  <!--雨中-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1566   <span class="wa wa-heart-fill"></span> 53-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10010'>-->
                  <!--<img src="~images/activity/artist/paints/8.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10010'>-->
                  <!--<img src="~images/activity/artist/artist-head/8.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10010'>-->
                  <!--蘑菇小姐-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--图形艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1222   <span class="wa wa-heart-fill"></span> 44-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10018'>-->
                  <!--<img src="~images/activity/artist/paints/9.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10018'>-->
                  <!--<img src="~images/activity/artist/artist-head/9.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10018'>-->
                  <!--010柒-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代绘画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1514   <span class="wa wa-heart-fill"></span> 41-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10028'>-->
                  <!--<img src="~images/activity/artist/paints/10.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10028'>-->
                  <!--<img src="~images/activity/artist/artist-head/10.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10028'>-->
                  <!--孢子菌-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1385   <span class="wa wa-heart-fill"></span> 31-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=366'>-->
                  <!--<img src="~images/activity/artist/paints/11.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=366'>-->
                  <!--<img src="~images/activity/artist/artist-head/11.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=366'>-->
                  <!--lulu-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1841   <span class="wa wa-heart-fill"></span> 26-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10001'>-->
                  <!--<img src="~images/activity/artist/paints/1.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10001'>-->
                  <!--<img src="~images/activity/artist/artist-head/1.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail" >-->
                <!--<a class="artist-name" href='/persional?userId=10001'>-->
                  <!--忘川山人-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--新中式绘画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1987   <span class="wa wa-heart-fill"></span> 26-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10031'>-->
                  <!--<img src="~images/activity/artist/paints/12.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10031'>-->
                  <!--<img src="~images/activity/artist/artist-head/12.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10031'>-->
                  <!--BSEN-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 745   <span class="wa wa-heart-fill"></span> 28-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10035'>-->
                  <!--<img src="~images/activity/artist/paints/13.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10035'>-->
                  <!--<img src="~images/activity/artist/artist-head/13.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10035'>-->
                  <!--刘怕怕-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 541   <span class="wa wa-heart-fill"></span> 29-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10037'>-->
                  <!--<img src="~images/activity/artist/paints/14.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10037'>-->
                  <!--<img src="~images/activity/artist/artist-head/14.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10037'>-->
                  <!--火火火-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 441   <span class="wa wa-heart-fill"></span> 29-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list  design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10032'>-->
                  <!--<img src="~images/activity/artist/paints/15.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10032'>-->
                  <!--<img src="~images/activity/artist/artist-head/15.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10032'>-->
                  <!--何子-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--图形艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 584   <span class="wa wa-heart-fill"></span> 22-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint ">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=823'>-->
                  <!--<img src="~images/activity/artist/paints/16.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=823'>-->
                  <!--<img src="~images/activity/artist/artist-head/16.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=823'>-->
                  <!--晚門-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 491   <span class="wa wa-heart-fill"></span> 32-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="col-md-4 artist-list paint ">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10008'>-->
                  <!--<img src="~images/activity/artist/paints/18.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10008'>-->
                  <!--<img src="~images/activity/artist/artist-head/18.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10008'>-->
                  <!--夏小鲟-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 354   <span class="wa wa-heart-fill"></span> 27-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="col-md-4 artist-list paint ">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10006'>-->
                  <!--<img src="~images/activity/artist/paints/19.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10006'>-->
                  <!--<img src="~images/activity/artist/artist-head/19.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10006'>-->
                  <!--冇小雨-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 689   <span class="wa wa-heart-fill"></span> 32-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10030'>-->
                  <!--<img src="~images/activity/artist/paints/20.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10030'>-->
                  <!--<img src="~images/activity/artist/artist-head/20.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10030'>-->
                  <!--李冰-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 324   <span class="wa wa-heart-fill"></span> 45-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10007'>-->
                  <!--<img src="~images/activity/artist/paints/21.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10007'>-->
                  <!--<img src="~images/activity/artist/artist-head/21.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10007'>-->
                  <!--慕白-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 644   <span class="wa wa-heart-fill"></span> 45-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10026'>-->
                  <!--<img src="~images/activity/artist/paints/22.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10026'>-->
                  <!--<img src="~images/activity/artist/artist-head/22.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name">-->
                  <!--彭元坤-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 879   <span class="wa wa-heart-fill"></span> 24-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint ">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=301'>-->
                  <!--<img src="~images/activity/artist/paints/23.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=301'>-->
                  <!--<img src="~images/activity/artist/artist-head/23.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=301'>-->
                  <!--韩白白-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 565   <span class="wa wa-heart-fill"></span> 34-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint ">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10019'>-->
                  <!--<img src="~images/activity/artist/paints/24.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10019'>-->
                  <!--<img src="~images/activity/artist/artist-head/24.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10019'>-->
                  <!--翠生生-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 541   <span class="wa wa-heart-fill"></span> 33-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list  design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10021'>-->
                  <!--<img src="~images/activity/artist/paints/25.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10021'>-->
                  <!--<img src="~images/activity/artist/artist-head/25.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10021'>-->
                  <!--北枫-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 745   <span class="wa wa-heart-fill"></span> 24-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint ">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10023'>-->
                  <!--<img src="~images/activity/artist/paints/26.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10023'>-->
                  <!--<img src="~images/activity/artist/artist-head/26.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10023'>-->
                  <!--松鸦-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 897   <span class="wa wa-heart-fill"></span> 41-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10024'>-->
                  <!--<img src="~images/activity/artist/paints/27.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10024'>-->
                  <!--<img src="~images/activity/artist/artist-head/27.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10024'>-->
                  <!--豆子-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 324   <span class="wa wa-heart-fill"></span> 42-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list  design">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10027'>-->
                  <!--<img src="~images/activity/artist/paints/28.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10027'>-->
                  <!--<img src="~images/activity/artist/artist-head/28.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10027'>-->
                  <!--zero-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 379   <span class="wa wa-heart-fill"></span> 32-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10033'>-->
                  <!--<img src="~images/activity/artist/paints/29.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10033'>-->
                  <!--<img src="~images/activity/artist/artist-head/29.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail">-->
                <!--<a class="artist-name" href='/persional?userId=10033'>-->
                  <!--赵磊-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 412   <span class="wa wa-heart-fill"></span> 36-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="col-md-4 artist-list paint">-->
            <!--<div class="artist-con">-->
              <!--<div class="artist-img">-->
                <!--<a class="artist-img-link" href='/persional?userId=10413'>-->
                  <!--<img src="~images/activity/artist/paints/32.jpg" class="img-responsive" />-->
                <!--</a>-->
                <!--<a class="artist-head" href='/persional?userId=10413'>-->
                  <!--<img src="~images/activity/artist/artist-head/32.jpg" />-->
                <!--</a>-->
              <!--</div>-->
              <!--<div class="artist-detail" >-->
                <!--<a class="artist-name" href='/persional?userId=10413'>-->
                  <!--shawn.chiu-->
                <!--</a>-->
                <!--<p class="artist-intro">-->
                  <!--现代插画艺术家-->
                <!--</p>-->
                <!--<p class="artist-social">-->
                  <!--<span class="wa wa-eye"></span> 1987   <span class="wa wa-heart-fill"></span> 56-->
                <!--</p>-->
              <!--</div>-->
              <!--&lt;!&ndash;因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮&ndash;&gt;-->
              <!--<a class="follow-btn hide">-->
                <!--<span class="followed-tips">取消关注</span>-->
                <!--<span class="follow-tips">点击关注</span>-->
              <!--</a>-->
            <!--</div>-->
          <!--</div>-->
          <transition-group name="list-complete" tag="div">
            <div class="col-md-4 artist-list paint list-complete-item" :key="item.artistName" v-for="(item, index) in filterArr">
              <div class="artist-con">
                <div class="artist-img">
                  <a class="artist-img-link" href='/persional?userId=10413'>
                    <img :src="item.bgImg" class="img-responsive lazy" />
                  </a>
                  <a class="artist-head" href='/persional?userId=10413'>
                    <img :src="item.headImg" class="lazy" />
                  </a>
                </div>
                <div class="artist-detail" >
                  <a class="artist-name" href='/persional?userId=10413'>
                    {{item.artistName}}
                </a>
                  <p class="artist-intro">
                    {{item.info}}
                </p>
                  <p class="artist-social">
                    <span class="wa wa-eye"></span> {{item.followCount}}   <span class="wa wa-heart-fill"></span> {{item.likeCount}}
                </p>
                </div>
                <!--因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮-->
                <a class="follow-btn hide">
                  <span class="followed-tips">取消关注</span>
                  <span class="follow-tips">点击关注</span>
                </a>
              </div>
            </div>
          </transition-group>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable*/
  export default{
    data() {
      return {
        artistList: [
          {
            info: '图形艺术家',
            artistName: 'MorningRocks',
            likeCount: 2343,
            followCount: 245,
            bgImg: require('images/activity/artist/paints/31.jpg'),
            headImg: require('images/activity/artist/artist-head/31.jpg'),
            catogery: 'draw',
            href: '/persional?userId=10413'
          },
          {
            info: '现代插画艺术家',
            artistName: '南初',
            likeCount: 2543,
            followCount: 445,
            bgImg: require('images/activity/artist/paints/33.jpg'),
            headImg: require('images/activity/artist/artist-head/33.jpg'),
            catogery: 'design',
            href: '/persional?userId=10413'
          },
          {
            info: '现代插画艺术家',
            artistName: '鸟川芥',
            likeCount: 2743,
            followCount: 242,
            bgImg: require('images/activity/artist/paints/2.jpg'),
            headImg: require('images/activity/artist/artist-head/2.jpg'),
            catogery: 'draw',
            href: '/persional?userId=10413'
          }
        ],
        filterText: 'all',
        tabArr: [
          {text: '全部', filter: 'all'},
          {text: '绘画', filter: 'draw'},
          {text: '设计', filter: 'design'}
        ]
      }
    },
    methods: {
    },
    computed: {
      filterArr() {
        if (this.filterText === 'all') {
          return this.artistList
        } else {
          return this.artistList.filter((item) => {
            return item.catogery === this.filterText
          })
        }
      }
    }
  }
</script>
