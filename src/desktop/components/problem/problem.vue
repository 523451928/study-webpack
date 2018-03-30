<template>
  <div class="pay-box">
    <!----问题联系浮动微信二维码开始----->
    <div class="contact-wechat">
      <div class="contact-box">
        <a class="contact-close" href="javascript:void(0)">
          <img src="~images/contact/contact-kf.png" />
        </a>
        <div class="wechat-erwm">
          <img src="~images/contact/contact-weixin.png" />
        </div>
      </div>
    </div>
    <!--问题联系及二维码浮动结束-->
    <!--购物车banner开始-->
    <div class="shop-hd-wrap">
      <ul class="step-wrap">
        <li class="step step-cart actived"><span>购物车</span></li>
        <li class="hr"></li>
        <li class="step step-order"><span>填写订单</span></li>
        <li class="hr"></li>
        <li class="step step-pay curr"><span>等待支付</span></li>
        <li class="hr"></li>
        <li class="step step-ok"><span>支付成功</span></li>
      </ul>
      <!--<loading v-show="showLoading"></loading>-->
    </div>
    <!--购物车banner结束-->
    <!--正文开始-->
    <div class="cont-wrap shop-cont-wrap container">
      <ol class="breadcrumb">
        <li><a href="/home" target="_blank"> 首页 </a></li>
        <li><a href="/cart" target="_blank"> 购物车 </a></li>
        <li>填写订单</li>
        <li>等待支付</li>
        <li class="active">支付问题</li>
      </ol>
      <div class="pay-pane-wrap">
        <div class="code-top">
          <h3 class="pb10">支付常见问题解答</h3>
          <ol>
            <li>
              一、支付方式问题
            </li>
            <li>
              墙蛙网目前只支持微信支付和支付宝支付，选择支付方式后页面跳转，打开对应app扫二维码支付（手机端会直接跳转提示支付）
            </li>
            <li>
              二、应付金额和实付金额不一致 <br />
              建议退出查看订单详情确认是否有特殊优惠或者未使用优惠的情况<br />
              三、支付失败？先排除以下原因：
            </li>
            <li>
              1、支付超限、余额不足<br />
              支付失败提示超出支付限额或余额不足，一般是您对应的支付宝、微信余额少于需支付金额；或者两者绑定的银行卡额度超限，请先充值或者调整额度再进行支付。<br/>
              2、页面无法跳转到支付环节<br />
              先查看是否浏览器存在问题，建议删除缓存（浏览器工具栏—internet选项—常规—删除临时文件和删除cookies，再重新打开浏览器）或者更换浏览器操作。<br/>
              3、网络问题<br/>
              网络问题导致付款超时，建议重新连接网络或者稍候再试。<br/>
              最后，如果以上解答都没能解决您的问题，请打开微信扫二维码，联系墙蛙万能小编为您解决！
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
ol {
  list-style: none;
  line-height: 2;
}
.pay-pane-wrap {
  background-color: #f5f5f5;
  border: 1px solid #dce0e0;
  padding: 40px 20px 40px 70px;
}
.code-top {
  padding-left: 20px;
  padding-top: 5px;
  margin-bottom: 30px;
}
.pb10 {
  padding-bottom: 10px;
}
</style>
