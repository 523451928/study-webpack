<template>
  <div class="box">
    <div class="bnr-1">
      <div class="bnr-content text-center">
        <h1>每一个艺术家 都有自己的品牌梦</h1>
        <h5>想要把你的作品变成衍生品？跑工厂/打样调整/备货发货…这些准备可能需要耗费你3个月的时间</h5>
        <h5>想要轻松点？不如试试来墙蛙网开店吧！</h5>
        <h6>
          <a href="/user/setting.html#/creatShop" target="_blank" class="btn  btn-open">去开店</a>
        </h6>
      </div>
      <div class="bnr-author">
        <h5>画面作品 《伏虎拓片》by 灵儿</h5>
      </div>
      <div class="btn-next">
        <img src="~images/shopGuide/btn-next.png" alt="" @click="toBottom" />
      </div>
    </div>
    <div class="bnr-2 text-center">
      <h1>行业第一的装饰画品牌 帮你圆梦</h1>
      <h5>墙蛙，从一颗钉子开始的艺术电商。2013年至今，稳居淘宝装饰画销量第一品牌</h5>
      <h5>每卖出一幅装饰画，我们都会给艺术家相应分成</h5>
      <h5>迄今为止，墙蛙已经帮助全球623位艺术家，获得累计525万元的数字艺术版权收益</h5>
      <h5>最厉害的装饰画品牌，现在要来帮你做艺术衍生品</h5>
      <div class="adapt">
        <img src="~images/shopGuide/img02.png" alt="" />
      </div>
      <a href="/persional?userId=11409" target="_blank">*展示作品来自 MorningRocks</a>
    </div>
    <div class="bnr-3 text-center">
      <h1>一键生成商品</h1>
      <h5>装饰画 / 抱枕 / T恤 / 手机壳 / 帆布包 / 旅行杯…</h5>
      <h5>多款商品，动动你的鼠标就能生成</h5>
      <div>
        <img src="~images/shopGuide/img03.jpg" alt="" />
      </div>
    </div>
    <div class="bnr-4 text-center">
      <h1>零成本开店 没有库存</h1>
      <h5>墙蛙网按订单需求生产，一件起卖。免去了传统开店需要库存备货的烦恼。</h5>
      <div class="layer-center" style="height: 185px">
        <div class="layerchild">
          <h2>0</h2>
          <h3>库存备货</h3>
        </div>
        <div class="layerchild">
          <h2>0</h2>
          <h3>商品积压</h3>
        </div>
        <div class="layerchild">
          <h2>0</h2>
          <h3>开店成本</h3>
        </div>
      </div>
    </div>
    <div class="bnr-5 text-center">
      <div class="bnr-content text-center">
        <h1>自由定价 专属版权</h1>
        <h5>售价多少，上架哪些产品，你说了算</h5>
        <h5>墙蛙默认设置每件商品20%分成，你可以按自己的意愿进行调整</h5>
        <h5>（例：售价120元=成本100元+分成20元）</h5>
        <div class="pricing">
          <div class="first row-h">
            <div class="special public size">可选型号</div>
            <div class="public size">收入</div>
            <div class="public size">售价</div>
            <div class="public size">比例</div>
          </div>
          <div class="second row-h">
            <div class="special public ">
              <div class="check-box"></div>70 * 50cm
            </div>
            <div class="public profit">￥20
            </div>
            <div class="public price">￥220
            </div>
            <div class="public proportion">20%
            </div>
          </div>
          <div class="second row-h">
            <div class="special public ">
              <div class="check-box"></div>60 * 60cm
            </div>
            <div class="public profit">￥20
            </div>
            <div class="public price1">￥170
            </div>
            <div class="public proportion">20%
            </div>
          </div>
          <div class="second row-h">
            <div class="special public ">
              <div class="check-box"></div>50 * 50cm
            </div>
            <div class="public profit">￥20
            </div>
            <div class="public price2">￥120
            </div>
            <div class="public proportion">20%
            </div>
          </div>
          <div class="third ">
            <div class="public">
              &nbsp收入比例&nbsp;&nbsp;0
            </div>
            <div class="public special-1" >
              <input type="range" value="4">
            </div>
            <div class="public proportion">
              20%
            </div>
          </div>
        </div>
      </div>
      <div class="bnr-copyright">
        <h5>*上传的作品版权，归艺术家所有</h5>
      </div>
    </div>
    <div class="bnr-6 text-center">
      <h1>48小时发货 严选品质</h1>
      <h5>墙蛙网的每一件产品，都经过精心挑选，从经理到员工亲身试用。下单后48小时内生产发货</h5>
      <div class="layer-center">
        <div class="layerchild">
          <div class="bnr-process design"></div>
          <h3>精细输出</h3>
        </div>
        <div class="layerchild">
          <div class="bnr-process quality"></div>
          <h3>品质把控</h3>
        </div>
        <div class="layerchild">
          <div class="bnr-process express"></div>
          <h3>中通包邮</h3>
        </div>
      </div>
    </div>
    <div class="bnr-8 text-center">
      <h1>品牌店案例</h1>
      <h5>你喜欢的艺术家们，都开始在墙蛙开创品牌店啦</h5>
      <div class="artist-tab-wrap">
        <div class="container">
          <div class="row" id="artist-box">
            <div class="col-md-4 artist-list design">
              <div class="artist-con">
                <div class="artist-img">
                  <a class="artist-img-link" href='/persional?userId=11409'>
                    <img src="~images/activity/artist/paints/31.jpg" class="img-responsive" />
                  </a>
                  <a class="artist-head" href='/persional?userId=11409'>
                    <img src="~images/activity/artist/artist-head/31.jpg" />
                  </a>
                </div>
                <div class="artist-detail" >
                  <a class="artist-name" href='/persional?userId=11409'>
                    MorningRocks
                  </a>
                  <p class="artist-intro">
                    图形艺术家
                  </p>
                  <p class="artist-social">
                    <span class="wa wa-eye"></span> 3242   <span class="wa wa-heart-fill"></span> 80
                  </p>
                </div>
                <!--因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮-->
                <a class="follow-btn hide">
                  <span class="followed-tips">取消关注</span>
                  <span class="follow-tips">点击关注</span>
                </a>
              </div>
            </div>
            <div class="col-md-4 artist-list paint">
              <div class="artist-con">
                <div class="artist-img">
                  <a class="artist-img-link" href='/persional?userId=10040'>
                    <img src="~images/activity/artist/paints/2.jpg" class="img-responsive" />
                  </a>
                  <a class="artist-head" href='/persional?userId=10040'>
                    <img src="~images/activity/artist/artist-head/2.jpg" />
                  </a>
                </div>
                <div class="artist-detail">
                  <a class="artist-name" href='/persional?userId=10040'>
                    鸟川芥
                  </a>
                  <p class="artist-intro">
                    现代插画艺术家
                  </p>
                  <p class="artist-social">
                    <span class="wa wa-eye"></span> 1581   <span class="wa wa-heart-fill"></span> 41
                  </p>
                </div>
                <!--因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮-->
                <a class="follow-btn hide">
                  <span class="followed-tips">取消关注</span>
                  <span class="follow-tips">点击关注</span>
                </a>
              </div>
            </div>
            <div class="col-md-4 artist-list design">
              <div class="artist-con">
                <div class="artist-img">
                  <a class="artist-img-link" href='/persional?userId=10036'>
                    <img src="~images/activity/artist/paints/3.jpg" class="img-responsive" />
                  </a>
                  <a class="artist-head" href='/persional?userId=10036'>
                    <img src="~images/activity/artist/artist-head/3.jpg" />
                  </a>
                </div>
                <div class="artist-detail">
                  <a class="artist-name" href='/persional?userId=10036'>
                    狐狸飞
                  </a>
                  <p class="artist-intro">
                    现代插画艺术家
                  </p>
                  <p class="artist-social">
                    <span class="wa wa-eye"></span> 1211   <span class="wa wa-heart-fill"></span> 51
                  </p>
                </div>
                <!--因为艺术家内容现阶段都是写死的，暂时不显示与账户关联的关注状态以及关注的按钮-->
                <a class="follow-btn hide">
                  <span class="followed-tips">取消关注</span>
                  <span class="follow-tips">点击关注</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bnr-9 text-center">
      <h1>把时间留给创作</h1>
      <h5>来墙蛙网把你的作品变成多种衍生品吧！开个属于你的品牌店，其实可以很简单</h5>
      <a href="/user/setting.html#/creatShop" target="_blank" class="btn  btn-open">去开店</a>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import {  slider } from 'components/gotop.js'
  export default{
    data() {
      return {

      }
    },
    mounted() {
      document.querySelector('.bnr-1').style.height = document.documentElement.clientHeight + 'px'
      slider()
    },
    methods: {
      toBottom() {
        let documentElm = document.documentElement
        let winHeight = documentElm.clientHeight
        let scrollTop = documentElm.scrollTop || 0
        this.interval = setInterval(() => {
          if (scrollTop <= winHeight) {
            scrollTop += 5
            documentElm.scrollTop = scrollTop
          } else {
            documentElm.scrollTop = winHeight
            clearInterval(this.interval)
          }
        }, 1)
      }
    }
  }
</script>
