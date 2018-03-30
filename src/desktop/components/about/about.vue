<template>
  <div class="ww-wrap" id="about-static">
    <!--问题联系浮动二维码开始-->
    <div class="contact-wechat" v-show="seen">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)" @click="hide">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--//问题结束-->
    <!--关于我们正文开始-->
    <div class="ww-wrap assist-wrap">
      <div class="assist-hd about-hd">
        <div class="cont">
          <h1>墙蛙，一颗钉子开始的艺术电商</h1>
          <p>定格美好事物，将艺术之美传递给更多人</p>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <p class="big">
            一天天成长，手里做着平平常常的事，心里的远方在接近……
          </p>
          <p>
            至2016年，墙蛙与AL，WAG以及全球600多名独立艺术家签约合作，通过互联网电商平台，为3000w用户提供<br>艺术衍生品服务，销售出90万件艺术装饰画，唤醒了72万面墙，成为艺术电商第一品牌。
          </p>

          <p>
            2015年6月，墙蛙成为迪士尼全球合作伙伴，共同开发迪士尼、皮克斯、漫威、星球大战系列的衍生品<br>用新的思路挖掘IP衍生品商业价值。
          </p>

          <p>
            “把创意实现，让创作变现”，墙蛙的使命不断召唤我们需要做得更多更好。2016年<br>墙蛙网（WALLWA.com）发布，从原来的装饰画品类拓展到多品类定制，<br>构建起C2B模式的个性定制+柔性生产+签约销售平台。
          </p>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <h2>把创意实现，让创作变现</h2>
          <img src="~images/assist/about/map.png" alt="唤醒世界的强"/>
        </div>
      </div>
      <div class="assist-item white bd">
        <div class="assist-cont">
          <h2>领先</h2>
          <p class="sub">来源于墙蛙从蝌蚪开始进化的4个进化基因：</p>
          <ul class="icon-list  list-unstyled row">
            <li class="col-md-3">
              <div class="icon-wrap"><i class="assist-i design"></i></div>
              <h3>设计</h3>
              <p>每一件产品要有自己的气质，我们发现她，忠于她。</p>
            </li>
            <li class="col-md-3">
              <div class="icon-wrap"><i class="assist-i quality"></i></div>
              <h3>品质</h3>
              <p>品位和质地，可以换来我们最稀缺的信任。</p>
            </li>
            <li class="col-md-3">
              <div class="icon-wrap"><i class="assist-i tech"></i></div>
              <h3>技术</h3>
              <p>推动我们更专业，更专注。</p>
            </li>
            <li class="col-md-3">
              <div class="icon-wrap"><i class="assist-i service"></i></div>
              <h3>服务</h3>
              <p>每一点服务，都是下一次服务的开始。</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <h2>墙蛙主张</h2>
          <p class="sub">与自己合作，给生活不同  从唤醒你的墙，到唤醒你的生活</p>
          <div class="img-list clearfix">
            <img src="~images/assist/about/craft1.jpg" alt="墙蛙主张" class="top"/>
            <img src="~images/assist/about/craft2.jpg" alt="墙蛙主张" class="top last"/>
            <img src="~images/assist/about/craft3.jpg" alt="墙蛙主张"/>
            <img src="~images/assist/about/craft4.jpg" alt="墙蛙主张"/>
            <img src="~images/assist/about/craft5.jpg" alt="墙蛙主张" class="last"/>
          </div>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <h2>墙蛙模式</h2>
          <p class="sub">艺术品签约销售分成+C2B模式的纯互联网品牌</p>
          <div class="word-cont">
            <p class="middle">
              墙蛙提供独有的艺术数字版权合作模式：艺术复制品分成销售。我们帮艺术家充分挖掘每一个作品的价值，让作品走进千家万户，为艺术衍生品增值。迄今为止已经帮助AL、WAG，以及全球600多名独立艺术家获得累计320万元的数字艺术版权收益，通过互联网电商平台，为3000万用户提供艺术衍生品服务，销售出90万件艺术装饰画，唤醒了80万面墙，成为艺术电商第一品牌。
            </p>
          </div>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <h2>墙蛙公益</h2>
          <p class="sub">墙蛙与青海玉树学堂联合创办·高原荷塘·画室</p>
          <div class="img-list clearfix">
            <img src="~images/assist/about/benefit1.png" alt="墙蛙公益" class="top last"/>
            <img src="~images/assist/about/benefit2.jpg" alt="墙蛙公益"/>
            <img src="~images/assist/about/benefit3.jpg" alt="墙蛙公益"/>
            <img src="~images/assist/about/benefit4.jpg" alt="墙蛙公益" class="last"/>
          </div>
        </div>
      </div>
      <div class="assist-item white bd">
        <div class="assist-cont">
          <h2>墙蛙的路</h2>
          <p class="sub">墙蛙一路走来，在淘宝、天猫等渠道披荆斩棘，成为中国领先的装饰画品牌。2016，墙蛙网将开始全新的个性印品之路。</p>
          <ul class="list-unstyled shop-list">
            <li class="tb" title="墙蛙淘宝店">
              <a href="https://wallwa.jiyoujia.com/shop/view_shop.htm" target="_blank" class="text-hide">墙蛙淘宝店</a>
            </li>
            <li class="tmall" title="墙蛙天猫店">
              <a href="http://wallwa.tmall.com/ " target="_blank" class="text-hide">墙蛙天猫店</a>
            </li>
            <li class="jd">
              <a href="http://wallwa.jd.com/" target="_blank" class="text-hide">墙蛙京东店</a>
            </li>
            <li class="dd">
              <a href="http://shop.dangdang.com/13601" target="_blank" class="text-hide">墙蛙京东店</a>
            </li>
            <li class="vip">
              <a href="http://brand.vip.com/qiangwa/" target="_blank" class="text-hide">墙蛙唯品会店</a>
            </li>
            <li class="yhd">
              <a href="http://shop.yhd.com/m-133718.html" target="_blank" class="text-hide">墙蛙1号店</a>
            </li>
            <li class="amazon">
              <a href="http://www.amazon.cn/s/ref=bl_dp_s_web_0?ie=UTF8&search-alias=aps&field-keywords=wallwa%E5%A2%99%E8%9B%99" target="_blank" class="text-hide">墙蛙亚马逊</a>
            </li>
            <li class="lightinthebox">
              <a href="javascript:void(0)" target="_blank" class="text-hide">墙蛙lightinthebox</a>
            </li>
            <li class="disney">
              <a href="https://wallwa.tmall.com/p/rd899552.htm?spm=a1z10.1-b.w11238076-11305452875.2.SJrRhl" target="_blank" class="text-hide">迪斯尼</a>
            </li>
            <li class="marvel">
              <a href="https://wallwa.tmall.com/category-1139417869.htm?spm=a1z10.5-b.w5842-11312105379.43.BDTarT&search=y&parentCatId=1070550651&parentCatName=%B5%CF%CA%BF%C4%E1%CF%B5%C1%D0&catName=%C2%FE%CD%FE%CF%B5%C0%E0#bd" target="_blank" class="text-hide">漫威</a>
            </li>
            <li class="pixar">
              <a href="https://wallwa.tmall.com/category-1139417871.htm?spm=a1z10.5-b.w5842-11312105379.42.2FyHYw&search=y&parentCatId=1070550651&parentCatName=%B5%CF%CA%BF%C4%E1%CF%B5%C1%D0&catName=Pixar%CF%B5%C1%D0#bd " target="_blank" class="text-hide">皮克斯</a>
            </li>
            <li class="starwars">
              <a href="https://wallwa.tmall.com/p/rd595313.htm?spm=a1z10.1-b.w11238078-11305452876.40.SJrRhl" target="_blank" class="text-hide">星战</a>
            </li>
          </ul>
          <ol class="list-unstyled time-line">
            <li>
              <span class="time">2011年05月</span>
              <span class="info">墙蛙成立</span>
            </li>
            <li>
              <span class="time">2011年05月</span>
              <span class="info">墙蛙淘宝店上线</span>
            </li>
            <li>
              <span class="time">2012年02月</span>
              <span class="info">天猫墙蛙旗舰店上线</span>
            </li>
            <li>
              <span class="time">2012年11月</span>
              <span class="info">墙蛙旗舰店摘取双11类目销售冠军</span>
            </li>
            <li>
              <span class="time">2012年12月</span>
              <span class="info">墙蛙淘宝店摘取双12类目销量冠军</span>
            </li>
            <li>
              <span class="time">2013年02月</span>
              <span class="info">墙蛙入驻兰亭集势</span>
            </li>
            <li>
              <span class="time">2013年06月</span>
              <span class="info">北京数十位艺术家作品进驻墙蛙</span>
            </li>
            <li>
              <span class="time">2013年09月</span>
              <span class="info">与美国艺术中心签约，9000名全球艺术家作品进驻墙蛙</span>
            </li>
            <li>
              <span class="time">2014年11月</span>
              <span class="info">墙蛙旗舰店再次斩获双11类目销量冠军</span>
            </li>
            <li>
              <span class="time">2014年12月</span>
              <span class="info">墙蛙淘宝店再次斩获双12类目销量冠军</span>
            </li>
            <li>
              <span class="time">2015年06月 </span>
              <span class="info">墙蛙与迪士尼签约，成为全球合作伙伴</span>
            </li>
            <li>
              <span class="time">2016年03月 </span>
              <span class="info">墙蛙网3.0（wallwa.com）发布</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="assist-item pb65">
        <div class="assist-cont">
          <h2>墙蛙团队</h2>
          <p class="sub">一群不忘初心的人，一起走来，一路成长！</p>
          <div class="img-list clearfix">
            <img src="~images/assist/about/team1.jpg" alt="墙蛙团队"/>
            <img src="~images/assist/about/team2.jpg" alt="墙蛙团队"/>
            <img src="~images/assist/about/team3.jpg" alt="墙蛙团队" class="last"/>
          </div>
        </div>
      </div>
    </div>
    <!--//关于我们正文结束-->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        seen: true
      }
    },
    methods: {
      hide() {
        this.seen = false
      }
    }
  }
</script>
<style>
  img{
    width: auto;
  }
</style>
