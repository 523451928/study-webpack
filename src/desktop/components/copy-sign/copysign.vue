<template>
  <div class="ww-wrap">
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
    <!--版权签约正文开始-->
    <div class="ww-wrap assist-wrap">
      <div class="assist-hd sign-hd">
        <div class="cont">
          <h1>与墙蛙一起，唤醒世界的墙！</h1>
          <p>即刻加入墙蛙艺术家计划，让更多人见到您的作品</p>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <div class="word-cont">
            <p class="big">
              墙蛙提供独有的艺术数字版权合作模式：艺术复制品分成销售。我们帮艺术家充分挖掘每一个作品的价值，让作品走进千家万户，为艺术衍生品增值。
            </p>
            <p>
              版权签约邮件：<a href="mailto:art@wallwa.com" target="_blank">art@wallwa.com</a>咨询电话:
              <span class="color-p1">0571-88194110-6007</span>
            </p>
          </div>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont">
          <div class="img-list clearfix">
            <img src="http://wallwa.com/images/assist/sign/list1.png" alt="墙蛙的环境"/>
            <img src="http://wallwa.com/images/assist/sign/list2.png" alt="墙蛙环境" class="top last"/>
            <img src="http://wallwa.com/images/assist/sign/list3.png" alt="墙蛙环境" class="last"/>
          </div>
        </div>
      </div>
      <div class="assist-item white bd">
        <div class="assist-cont">
          <ul class="icon-list list-unstyled row">
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i simple"></i>
              </div>
              <h3>简单</h3>
              <p class="text-left line-height0">
                您只需发送邮件至<a href="mailto:art@wallwa.com">art@wallwa.com</a>，包含您的作品小样、简单介绍、联系方式、微博ID，周一到周五工作时间，24小时内，就会有签约人员与您联系。
              </p>
            </li>
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i correct"></i>
              </div>
              <h3>准确</h3>
              <p class="text-left line-height0">
                签约后，商品在指定平台销售，您可以随时看到作品复制品准确的销售记录，每个季度，会有专人与您结算。
              </p>
            </li>
            <li class="col-md-4">
              <div class="icon-wrap">
                <i class="assist-i worth"></i>
              </div>
              <h3>可观</h3>
              <p class="text-left line-height0">
                迄今为止墙蛙已经帮助欧美249位，中国374位艺术家获得累计320万元的数字艺术版权收益。他们是画家、摄影师、插画师、平面设计师。我们的使命是和艺术家一起，唤醒世界的墙！
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="assist-item">
        <div class="assist-cont sign-artist-cont">
          <h2>签约艺术家</h2>
          <p class="sub">他们的作品已经在墙蛙安家</p>
          <ul class="sign-artist-list clearfix">
            <li class="al1">
              <span>何汶玦</span>
            </li>
            <li class="al2">
              <span>老树画画</span>
            </li>
            <li class="al3">
              <span>陈文利</span>
            </li>
            <li class="al4">
              <span>鸟先森</span>
            </li>
            <li class="al5">
              <span>昔酒</span>
            </li>
            <li class="al6">
              <span>戴泽宗</span>
            </li>
            <li class="al7">
              <span>曾杏绯</span>
            </li>
            <li class="al8 last">
              <span>宗剑</span>
            </li>
            <li class="al9">
              <span>阿梗</span>
            </li>
            <li class="al10">
              <span>孢子菌</span>
            </li>
            <li class="al11">
              <span>Erin Clark</span>
            </li>
            <li class="al12">
              <span>Tim Nyberg</span>
            </li>
            <li class="al13">
              <span>Karla Gerard</span>
            </li>
            <li class="al14">
              <span>Carla Martell</span>
            </li>
            <li class="al15">
              <span>Yuna</span>
            </li>
            <li class="al16 last">
              <span>Daniel Peacock</span>
            </li>
          </ul>
          <a href="http://wallwa.tmall.com/p/qy.htm?spm=a1z10.1-b.w9378884-9436674517.23.5CrSe1" target="_blank" class="btn btn-default btn-lg">查看更多艺术家</a>
          <hr/>
          <div class="pb65">
           如果您喜欢墙蛙，认可墙蛙，请与我们联络咨询：<a href="mailto:art@wallwa.com">art@wallwa.com</a>或拨打<span class="color-p1">0571-88194110-6007</span> 更多签约作者，请联系客服咨询。您如果喜欢某位艺术家的作品，也可以告诉我们，我们有专业的团队来与艺术家联系，为您带来符合您个性化需求的定制产品。
          </div>
        </div>
      </div>
    </div>
    <!--//版权签约正文结束-->
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
