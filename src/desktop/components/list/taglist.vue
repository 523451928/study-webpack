<template>
  <div class="product-list-con">
    <div class="sort">
      <span class="tags-cate-title tags-title">排序：</span>
      <a href="/work?CategoryId=1&amp;Order=1">综合</a>
      <a href="/work?CategoryId=1&amp;Order=3">销量</a>
      <a href="/work?CategoryId=1&amp;Order=4">喜欢</a>
      <a class="asc" href="/work?CategoryId=1&amp;Order=2">
        价格<i class="sort-icon"></i>
      </a>
      <span class="search-query">已找到'水果'相关的产品</span>
      <span class="more-sort ">更多排序<span class="rotate wa-angle-down "></span></span>
    </div>
    <div class="product-sort-area product-sorts-list clearfix">
      <div class="tags tags-hide clearfix">
        <div class="kind-tags tags-list tags-lists clearfix">
          <span class="tags-cate-title tags-title">分类：</span>
          <ul class="tags-list-ul clearfix">
            <li>
              <a href="/work?CategoryId=1&amp;TagId=1" class="active">摄影</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=2">绘画</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=3">设计</a>
            </li>
          </ul>
        </div>
        <div class="label-tags tags-list tags-lists clearfix">
          <span class="tags-cate-title tags-title">标签：</span>
          <ul class="tags-list-ul clearfix">
            <li>
              <a href="/work?CategoryId=1&amp;TagId=6" class="active">
                动物<span class="wa wa-close tags-x"></span>
              </a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=7">
                风景<span class="wa wa-close tags-x"></span>
              </a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=8">黑白</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=9">人物</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=10">抽象</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=11">建筑</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=12">食物</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=13">数字</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=14">图形</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=15">中国风</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=16">游戏</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=17">动漫</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=18">电影</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=19">运动</a>
            </li>
            <li>
              <a href="/work?CategoryId=1&amp;TagId=20">植物</a>
            </li>
          </ul>
        </div>
        <div class="color-tags tags-list tags-lists clearfix">
          <span class="tags-cate-title tags-title">颜色：</span>
          <div class="tags-list tags-color-area clearfix">
            <span class="active">
              <a href="/work?<%call $.AllTagQuery $.ColorTags%>">全部</a>
            </span>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="红色" href="/work?CategoryId=1&amp;TagId=22"
                 style="background-color: #E41F25;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="橙黄色" href="/work?CategoryId=1&amp;TagId=23"
                 style="background-color: #EEA41F;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="浅黄色" href="/work?CategoryId=1&amp;TagId=24"
                 style="background-color: #FAE7BF;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="绿色" href="/work?CategoryId=1&amp;TagId=25"
                 style="background-color: #8AC63F;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="青色" href="/work?CategoryId=1&amp;TagId=26"
                 style="background-color: #83D0D6;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="蓝色" href="/work?CategoryId=1&amp;TagId=27"
                 style="background-color: #3A50A3;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="紫色" href="/work?CategoryId=1&amp;TagId=28"
                 style="background-color: #8C4E9F;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="白色" href="/work?CategoryId=1&amp;TagId=29"
                 style="background-color: #F5F5F5;">
              </a>
            </label>
            <label class="checkbox-inline">
              <a class="block-tag-block" title="黑色" href="/work?CategoryId=1&amp;TagId=30"
                 style="background-color: #000;">
              </a>
            </label>
          </div>
        </div>
      </div>
      <div class="product-list-area clearfix">
        <div class="pro-list grey-border">
          <a href="/work/1?CategoryId=1" class="displays-link">
            <display entryId="360" productId="0" categoryId="2" :pictures="pictures" :displays="displays"></display>
          </a>
          <!--<display class="displays" entry-id="87" category-id="2" product-id="0"-->
          <!--pictures="[{&quot;Index&quot;:0,&quot;Output&quot;:{&quot;Size&quot;:[700,700],&quot;Full&quot;:1},&quot;ImageId&quot;:15,&quot;ImageFile&quot;:&quot;b1eae81c17101b9cc574435891e8a4e3-3543x3543.jpg&quot;,&quot;TranslateX&quot;:0,&quot;TranslateY&quot;:0,&quot;Rotate&quot;:0,&quot;ScaleX&quot;:78,&quot;ScaleY&quot;:78}]"-->
          <!--displays="{&quot;Stack&quot;:0,&quot;Thick&quot;:40}"></display>-->
          <div class="pro-detail clearfix">
            <span class="pro-price pull-right">¥ 207.48</span>
            <div class="pull-left pro-title">
              <a href="/work/1?CategoryId=1" class="default-hover-link">teeeess </a>
            </div>
            <div class="clearfix"></div>
            <span class="pull-right">
                      <a work-id="11" class="default-link list-like-btn like-btn" href="javascript:void(0)">
                        <span class="wa wa-heart"></span>
                        <span class="like-count">0</span>
                      </a>
                    </span>
            <div class="author-name pull-left">
              <a class="default-hover-link" href="/artist/8">大奎</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-bar text-center">
      <ul class="pagination">
        <li class="page-item active"><a href="/work?CategoryId=8"><span class="page-link">1</span></a></li>
      </ul>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import display from './displayHover.vue'
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
