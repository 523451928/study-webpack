<template>
  <div class="ww-wrap" id="join-static">
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
    <!--加入我们正文开始-->
    <div class="ww-wrap assist-wrap">
      <div class="assist-hd join-hd">
        <div class="cont">
          <h1>WE WANT YOU</h1>
          <p>在这里，让你的才华尽情释放</p>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <img src="~images/assist/join/join01.png" alt="加入墙蛙"/>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <h2>不想就这样活下去？</h2>
        </div>
      </div>
      <div class="assist-item white bd">
        <div class="assist-cont">
          <h2>与墙蛙一起</h2>
          <p class="sub">让我们做一点有趣的事情</p>
          <ul class="icon-list list-unstyled row">
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i create"></i>
              </div>
              <h3>创造</h3>
              <p>拒绝乏味，每一天都要精彩</p>
            </li>
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i study"></i>
              </div>
              <h3>学习</h3>
              <p>和牛人一起探讨交流</p>
            </li>
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i fun"></i>
              </div>
              <h3>娱乐</h3>
              <p>美好生活，乐在其中</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <h2>墙蛙的环境</h2>
          <p class="sub">就像是住进了艺术家的家</p>
          <div class="img-list clearfix">
            <img src="~images/assist/join/1.png" alt="墙蛙环境"/>
            <img src="~images/assist/join/2.png" alt="墙蛙环境" class="top last"/>
            <img src="~images/assist/join/3.png" alt="墙蛙环境" class="last"/>
          </div>
        </div>
      </div>
      <div class="assist-item pb65">
        <div class="assist-cont">
          <h2>墙蛙空缺职位</h2>
          <p class="sub">我们需要这样的你</p>
          <div class="job-item">
            <h4>设计师：</h4>
            <div class="job-cate">
              <h5>产品设计师</h5>
              <p>需要具备良好的美术功底与艺术洞察力，会使用PS, AI等相关设计软件；爱艺术，爱生活，爱设计，有家居设计经验，爱好摄影、绘画
                者优先，艺术类相关本科以上的学历。
              </p>
            </div>
            <div class="job-cate">
              <h5>视觉设计师</h5>
              <p>有创新意识，有加入创业团队的激情，适应电子商务唯快不破的理念和拥有充分的服务意识；艺术类相关本科以上的学历；具有优秀的
                设计习惯和严谨的工作态度，良好的沟通和团队协作精神，责任心强，能吃苦耐劳;不做单纯的美工，我们要成为全能的视觉设计师。
              </p>
            </div>
          </div>
          <div class="job-item">
            <h4>软件工程师：</h4>
            <div class="job-cate">
              <h5>前端开发师</h5>
              <p>熟练HTML/CSS/Javascript等前端技术，能写出符合W3C标准、兼容主流浏览器的代码；掌握至少一门非前端开发语言（如PHP/
                Python/Ruby/C#/Go等），并有一定的实战经验；精通至少一种JS框架(JQuery/Kissy/Angular等)或者对JS语言掌握较深；本科
                以上学历，计算机、数学等相关专业毕业（或者计算机基础非常扎实）。
              </p>
            </div>
            <div class="job-cate">
              <h5>Node.js 开发工程师</h5>
              <p>熟练Javascript，最少熟悉java，c#，python，c++等语言中的一种；熟悉最少一种nodejs前端模板引擎（ejs/jade等），熟练使
                用Git代码管理工具及其管理方法；拥有计算机相关专业学士或以上学位或具有同等学位和经验者。
              </p>
            </div>
            <div class="job-cate">
              <h5>Golang 开发工程师</h5>
              <p>有Web服务器端的开发经验，具备熟练阅读英文技术资料能力，习惯通过手册、google搜索、 stackoverflow、 serverfault等途径
                寻找问题答案；了解Linux的使用，熟练使用命令行界面，能使用Linux服务器；拥有计算机相关专业学士或以上学位或具有同等学位和
                经验者。
              </p>
            </div>
            <div class="job-cate">
              <h5>IOS开发工程师</h5>
              <p>熟悉IOS应用开发框架，能开发高性能的IOS应用；掌握Objective-C或者C/C++，熟练使用Xcode，具有良好的编码习惯，能够独
                立解决问题。有App Store上架作品或相关作品者优先。
              </p>
            </div>
            <div class="job-cate">
              <h5>算法工程师</h5>
              <p>硕士学历及以上，热爱数学，精通数学各种算法，在校期间得过数学竞赛奖项者优先；数学及相关专业毕业。</p>
            </div>
          </div>
          <div class="job-item">
            <h4>开拓师：</h4>
            <div class="job-cate">
              <h5>运营实习生</h5>
              <p>大专及以上学历，电子商务、广告、营销相关专业毕业，能运营线上渠道如淘宝、天猫、京东等，具备团队合作精神，良好的沟通协调
                能力，热爱电子商务，热爱家居，性格开朗，耐心、细心且责任心强，为人诚恳，有创新精神。
              </p>
            </div>
            <div class="job-cate">
              <h5>市场助理/新媒体运营</h5>
              <p>喜爱艺术，对互联网行业有浓厚兴趣,有一定创新精神，有实际操作，推进项目的能力；对新媒体有兴趣，文案功底强者优先（新媒体运
                营）
              </p>
            </div>
          </div>
          <h2 class="text-left">期待你的加入！</h2>
          <p class="sub text-left">
            请发邮件至：<a href="mailto:join@wallwa.com">join@wallwa.com</a> ,墙蛙会在第一时间回复您。
          </p>
        </div>
      </div>
    </div>
    <!--//加入我们正文结束-->
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
