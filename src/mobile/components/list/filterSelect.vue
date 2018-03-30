<template>
  <div>
    <div class="sort-wrapper clearfix">
      <ul class="order">
        <li>
          <a class="asc" href="javascript: void (0);">综合</a>
        </li>
        <li>
          <a href="javascript: void (0);">喜欢</a>
        </li>
        <li>
          <a href="javascript: void (0);">
            价格<i class="sort-icon"></i>
          </a>
        </li>
        <li id="wa-menu">
          筛选<span class="wa-menu"></span>
        </li>
      </ul>
    </div>
    <div class="tags-mask">
      <div class="tags-container">
        <div class="tags-header scale-1px">
          <!--选择筛选条件:-->
          <span class="cancel-btn fr">取消</span>
          <span class="reset-btn fr">重置选择</span>
        </div>
        <div class="tags">
          <div class="kind-tags tags-list clearfix"><span>分类</span>
            <ul>
              <li><a href="/work?CategoryId=8">全部</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=1">摄影</a></li>
              <li class="active"><a href="/work?CategoryId=8">绘画</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=3">设计</a></li>
            </ul>
          </div>
          <div class="label-tags tags-list clearfix"><span>标签</span>
            <ul>
              <li class="active"><a href="/work?CategoryId=8&amp;TagId=2">全部</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=6">动物</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=7">风景</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=8">黑白</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=9">人物</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=10">抽象</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=11">建筑</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=12">食物</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=13">数字</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=14">图形</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=15">中国风</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=16">游戏</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=17">动漫</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=18">电影</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=19">运动</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=20">植物</a></li>
            </ul>
          </div>
          <div class="color-tags clearfix"><span class="color-span">颜色</span>
            <ul>
              <li class="active"><a href="/work?CategoryId=8&amp;TagId=2">全部</a></li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=22"><span title="红色"
                                                                              style="background-color: #E41F25; display: inline-block;"></span></a>
              </li>
              <li class="active"><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=23"><span title="橙黄色"
                                                                              style="background-color: #EEA41F; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=24"><span title="浅黄色"
                                                                              style="background-color: #FAE7BF; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=25"><span title="绿色"
                                                                              style="background-color: #8AC63F; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=26"><span title="青色"
                                                                              style="background-color: #83D0D6; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=27"><span title="蓝色"
                                                                              style="background-color: #3A50A3; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=28"><span title="紫色"
                                                                              style="background-color: #8C4E9F; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=29"><span title="白色"
                                                                              style="background-color: #F5F5F5; display: inline-block;"></span></a>
              </li>
              <li><a href="/work?CategoryId=8&amp;TagId=2&amp;TagId=30"><span title="黑色"
                                                                              style="background-color: #000000; display: inline-block;"></span></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="product-list-area clearfix"><div class="pro-list grey-border"><a target="blank" href="/work/90?CategoryId=8" class="displays-link"><div class="pro-pic text-center displays"><div class="display-wrapper" style="width: 160px; height: 160px;"><div style="display: none;"><div class="wa-loading-wrap"><div class="wa-loading"></div></div></div> <div class="display-canvas"><div class="display-back" style="width: 102px; height: 102px; left: 28px; top: 28px; background-color: rgb(255, 255, 255);"><div class="paint" style="width: 102px; height: 102px;"><div style="display: none;"><loading></loading></div> <div class="image-wrap" style="width: 102px; height: 102px; left: 0px; top: 0px;"><img src="http://m.wallwa.xxx//thumbnail/image/93/240/9b84b484ff5d1c73d6cd42bf762ab14a-1920x1070.png" style="position: absolute; transition: all 0s; width: 185px; height: 103px; left: -41px; top: 0px; transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1);"></div></div></div> <div class="display-fore" style="width: 160px; height: 160px; left: 0px; top: 0px; background-image: url(&quot;http://m.wallwa.xxx//thumbnail/entry/559/240/f53d15175d9f47465e6170c3815dba45-1034x1034.png&quot;); background-size: cover;"></div> <div class="display-fake" style="width: 102px; height: 102px; left: 28px; top: 28px; background-color: rgb(255, 255, 255);"></div></div> </div></div></a> <div class="pro-detail clearfix"><span class="pro-price pull-right">¥ 67</span> <div class="pull-left pro-title"><a target="black" href="/work/90?CategoryId=8" class="default-hover-link">csdcsc</a></div> <div class="clearfix"></div> <span class="pull-right"><a target="blank" packets="[104903,0]" category-id="1" entry-id="559" work-id="90" href="javascript:void(0)" class="default-link list-like-btn like-btn"><span class="wa wa-heart-fill"></span> <span class="like-count">0</span></a></span> <div class="author-name pull-left"><a href="/artist/1" class="default-hover-link">闲人</a></div></div></div> <div class="pro-list grey-border"><a target="blank" href="/work/89?CategoryId=8" class="displays-link"><div class="pro-pic text-center displays"><div class="display-wrapper" style="width: 160px; height: 160px;"><div style="display: none;"><div class="wa-loading-wrap"><div class="wa-loading"></div></div></div> <div class="display-canvas"><div class="display-back" style="width: 102px; height: 102px; left: 28px; top: 28px; background-color: rgb(255, 255, 255);"><div class="paint" style="width: 102px; height: 102px;"><div style="display: none;"><loading></loading></div> <div class="image-wrap" style="width: 102px; height: 102px; left: 0px; top: 0px;"><img src="http://m.wallwa.xxx//thumbnail/image/94/240/5ca7dd3cf0feb36275a533e2510cfe46-1920x1070.png" style="position: absolute; transition: all 0s; width: 185px; height: 103px; left: -41px; top: 0px; transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1);"></div></div></div> <div class="display-fore" style="width: 160px; height: 160px; left: 0px; top: 0px; background-image: url(&quot;http://m.wallwa.xxx//thumbnail/entry/559/240/f53d15175d9f47465e6170c3815dba45-1034x1034.png&quot;); background-size: cover;"></div> <div class="display-fake" style="width: 102px; height: 102px; left: 28px; top: 28px; background-color: rgb(255, 255, 255);"></div></div> </div></div></a> <div class="pro-detail clearfix"><span class="pro-price pull-right">¥ 67</span> <div class="pull-left pro-title"><a target="black" href="/work/89?CategoryId=8" class="default-hover-link">21212</a></div> <div class="clearfix"></div> <span class="pull-right"><a target="blank" packets="[104903,0]" category-id="1" entry-id="559" work-id="89" href="javascript:void(0)" class="default-link list-like-btn like-btn"><span class="wa wa-heart-fill"></span> <span class="like-count">0</span></a></span> <div class="author-name pull-left"><a href="/artist/1" class="default-hover-link">闲人</a></div></div></div> <div class="pro-list grey-border"><a target="blank" href="/work/86?CategoryId=8" class="displays-link"><div class="pro-pic text-center displays"><div class="display-wrapper" style="width: 160px; height: 160px;"><div style="display: none;"><div class="wa-loading-wrap"><div class="wa-loading"></div></div></div> <div class="display-canvas"><div class="display-back" style="width: 130px; height: 38px; left: 14px; top: 60px; background-color: rgb(255, 255, 255);"><div class="paint" style="width: 130px; height: 38px;"><div style="display: none;"><loading></loading></div> <div class="image-wrap" style="width: 130px; height: 38px; left: 0px; top: 0px;"><img src="http://m.wallwa.xxx//thumbnail/image/1/240/2566b1474fff172e0754c466b0e6e1d8-3840x2160.jpg" style="position: absolute; transition: all 0s; width: 130px; height: 73px; left: 0px; top: -17px; transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1);"></div></div></div> <div class="display-fore" style="width: 160px; height: 63px; left: 0px; top: 48px; background-image: url(&quot;http://m.wallwa.xxx//thumbnail/entry/39/240/9b37d88a63c94d10e26b763966d2d484-1596x636.png&quot;); background-size: cover;"></div> <div class="display-fake" style="width: 130px; height: 38px; left: 14px; top: 60px; background-color: rgb(255, 255, 255);"></div></div> </div></div></a> <div class="pro-detail clearfix"><span class="pro-price pull-right">¥ 160</span> <div class="pull-left pro-title"><a target="black" href="/work/86?CategoryId=8" class="default-hover-link">2121</a></div> <div class="clearfix"></div> <span class="pull-right"><a target="blank" packets="[101210,0]" category-id="1" entry-id="39" work-id="86" href="javascript:void(0)" class="default-link list-like-btn like-btn"><span class="wa wa-heart-fill"></span> <span class="like-count">0</span></a></span> <div class="author-name pull-left"><a href="/artist/1" class="default-hover-link">闲人</a></div></div></div> <div class="pro-list grey-border"><a target="blank" href="/work/88?CategoryId=8" class="displays-link"><div class="pro-pic text-center displays"><div class="display-wrapper" style="width: 160px; height: 160px;"><div style="display: none;"><div class="wa-loading-wrap"><div class="wa-loading"></div></div></div> <div class="display-canvas"><div class="display-back" style="width: 130px; height: 38px; left: 14px; top: 60px; background-color: rgb(255, 255, 255);"><div class="paint" style="width: 130px; height: 38px;"><div style="display: none;"><loading></loading></div> <div class="image-wrap" style="width: 130px; height: 38px; left: 0px; top: 0px;"><img src="http://m.wallwa.xxx//thumbnail/image/17/240/fb5ea658337587f7ede0a7608bace6cc-3840x2160.jpg" style="position: absolute; transition: all 0s; width: 130px; height: 73px; left: 0px; top: -17px; transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1);"></div></div></div> <div class="display-fore" style="width: 160px; height: 63px; left: 0px; top: 48px; background-image: url(&quot;http://m.wallwa.xxx//thumbnail/entry/39/240/9b37d88a63c94d10e26b763966d2d484-1596x636.png&quot;); background-size: cover;"></div> <div class="display-fake" style="width: 130px; height: 38px; left: 14px; top: 60px; background-color: rgb(255, 255, 255);"></div></div> </div></div></a> <div class="pro-detail clearfix"><span class="pro-price pull-right">¥ 160</span> <div class="pull-left pro-title"><a target="black" href="/work/88?CategoryId=8" class="default-hover-link">2121</a></div> <div class="clearfix"></div> <span class="pull-right"><a target="blank" packets="[101210,0]" category-id="1" entry-id="39" work-id="88" href="javascript:void(0)" class="default-link list-like-btn like-btn"><span class="wa wa-heart-fill"></span> <span class="like-count">0</span></a></span> <div class="author-name pull-left"><a href="/artist/1" class="default-hover-link">闲人</a></div></div></div> <div class="pro-list grey-border"><a target="blank" href="/work/49?CategoryId=8" class="displays-link"><div class="pro-pic text-center displays"><div class="display-wrapper" style="width: 160px; height: 160px;"><div style="display: none;"><div class="wa-loading-wrap"><div class="wa-loading"></div></div></div> <div class="display-canvas"><div class="display-back" style="width: 109px; height: 109px; left: 25px; top: 25px; background-color: rgb(255, 255, 255);"><div class="paint" style="width: 109px; height: 109px;"><div style="display: none;"><loading></loading></div> <div class="image-wrap" style="width: 109px; height: 109px; left: 0px; top: 0px;"><img src="http://m.wallwa.xxx//thumbnail/image/75/240/e41004e6963c2a02830b3274c44f2f5c-3840x2160.jpg" style="position: absolute; transition: all 0s; width: 193px; height: 109px; left: -42px; top: 0px; transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1) scaleY(1);"></div></div></div> <div class="display-fore" style="width: 160px; height: 160px; left: 0px; top: 0px; background-image: url(&quot;http://m.wallwa.xxx//thumbnail/entry/30/240/082039f1f29eae9f0e9d93943d0b75dc-1496x1496.png&quot;); background-size: cover;"></div> <div class="display-fake" style="width: 109px; height: 109px; left: 25px; top: 25px; background-color: rgb(255, 255, 255);"></div></div> </div></div></a> <div class="pro-detail clearfix"><span class="pro-price pull-right">¥ 316</span> <div class="pull-left pro-title"><a target="black" href="/work/49?CategoryId=8" class="default-hover-link">1212</a></div> <div class="clearfix"></div> <span class="pull-right"><a target="blank" packets="[101209,0]" category-id="1" entry-id="30" work-id="49" href="javascript:void(0)" class="default-link list-like-btn like-btn"><span class="wa wa-heart-fill"></span> <span class="like-count">0</span></a></span> <div class="author-name pull-left"><a href="/artist/4" class="default-hover-link">4</a></div></div></div></div>
  </div>
</template>

<script>
  /* eslint-disable */
  import display from './display.vue'
  export default{
    data() {
      return {
        pictures: [{
          "Index": 0,
          "Output": {"Size": [300, 300], "Full": 2},
          "DPI": 70,
          "ImageId": 118,
          "ImageFile": "793735c5655f4812074c51336892833e-3840x2160.jpg",
          "TranslateX": 0,
          "TranslateY": 0,
          "Rotate": 0,
          "ScaleX": 64,
          "ScaleY": 64,
          "Image": {"Id": 118, "File": "793735c5655f4812074c51336892833e-3840x2160.jpg"}
        }],
        displays: {Stack: 0, Thick: 40}
      }
    },
    mounted() {

    },
    components: {
      display
    }
  }
</script>
