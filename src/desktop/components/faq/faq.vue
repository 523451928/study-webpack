<template>
  <div>
    <!--问题联系及二维码开始-->
    <div class="contact-wechat">
      <div class="contact-box">
        <a href="javascript:void(0)" class="contact-close" v-show="seen" @click="close">
          <img src="http://wallwa.com/images/contact/contact-kf.png"/>
        </a>
        <div class="wechat-erwm">
          <img src="http://wallwa.com/images/contact/contact-weixin.png"/>
        </div>
      </div>
    </div>
    <!--//问题联系及二维码结束-->
    <div class="layer">
      <div class="container">
        <div class="row">
          <div class="col-md-3 left-menu">
            <div class="nav" :class="{borderleft:active==1}">
              <div class="nav-tit" :class="{active:active==1}" @click="tabli(1)">优惠码/蛙币/优惠卷 &nbsp;&nbsp;<span class="wa wa-angle-down" :class="{waRight:active!=1}"></span></div>
              <div class="link-warp" :class="{active:active==1}">
                <a href="#coupon-share" :class="{active:detail==1}" @click="detailTab(1)">优惠码分享</a>
                <a href="#wa-bin" :class="{active:detail==2}" @click="detailTab(2)">蛙币详情</a>
                <a href="#coupon-detail" :class="{active:detail==3}" @click="detailTab(3)">优惠券详情</a>
              </div>
            </div>
            <div class="nav" :class="{borderleft:active==2}">
              <div class="nav-tit" :class="{active:active==2}" @click="tabli(2)">发票/支付问题 &nbsp;&nbsp;<span class="wa wa-right" :class="{waAangleDdown:active!=1}"></span></div>
              <div class="link-warp" :class="{active:active==2}">
                <a href="#bill" :class="{active:detail==4}" @click="detailTab(4)">发票相关问题回答</a>
                <a href="#pay" :class="{active:detail==5}" @click="detailTab(5)">支付常见问题</a>
                <a href="#withdraw" :class="{active:detail==6}" @click="detailTab(6)">提现说明</a>
              </div>
            </div>
          </div>
          <div class="col-md-9">
            <div class="tab-content">
              <div class="tab-pane" :class="{active:detail==1}" name="coupon-share">
                <div class="code-top mb30 pt5 pl20">
                  <h3 class="pb10">规则说明:</h3>
                  <ol>
                    <li>
                      注册墙蛙网即可获得墙蛙认证个人专属分享优惠码！价值￥5元（订单30元起用）
                    </li>
                    <li>
                      优惠码可无限量分享给小伙伴，小伙伴可点击分享链接领取优惠券或在定制结算时输入优惠码，立减20（订单满30元可用）。交易
                      完成即自动返现￥10元到您的个人优惠账户。
                    </li>
                    <li>
                      墙蛙优惠蛙币可累加使用，尽情分享，分分钟享受免费定制！
                    </li>
                    <li>
                      专属优惠码仅限分享，自己使用无效！（其实可以找小伙伴分享给自己，一样享受！嘘……）
                    </li>
                  </ol>
                </div>
                <div class="issue-list-wrap">
                  <h3>常见问题:</h3>
                  <ol class="issue-list">
                    <li>
                      <p class="question">
                        1、我的专属优惠码我自己不能用吗？我也想使用怎么办？
                      </p>
                      <p class="answer">
                        答：很抱歉，是的！此优惠码仅限分享哦，您如果第一次也想享受畅快的￥20元优惠，简单！找小伙伴分享给您呀！互帮互助嘛！
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        2、小伙伴使用我的优惠码已经定制付款了，我怎么还没收到返现呢？
                      </p>
                      <p class="answer">
                        答：不着急~小伙伴定制付款以后，墙蛙才开始为你们服务。耐心待交易成功以后，返现即可到账啦！如还是迟迟不到账，可以立刻联系墙蛙为您主持公道！
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        3、返现的钱可不可以提现或者买其他东西呢？
                      </p>
                      <p class="answer">
                        答：不可以！绝对不可以！墙蛙网的蛙币，当然只能在墙蛙网消费啦~！很霸气是不是！
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        4、接受分享的小伙伴，20元的券可不可以分批次使用，或者叠加使用呢？会不会过期啊？
                      </p>
                      <p class="answer">
                        答：还是不可以~小伙伴使用的20元，和返现的10元不同，这个相当于一个优惠券，不找零，不兑现，也不叠加，一次性的。而且是有有效期的！具体有效期请见优惠券提示！
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        5、我的专属分享优惠码，永远都可以分享吗？
                      </p>
                      <p class="answer">
                        答：非也！目前分享优惠码是墙蛙网为庆祝上线特别开放，为期1个月！有后续消息，欢迎随时关注墙蛙网哦！
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        6、我辛辛苦苦存了好久的蛙币会不会突然过期，来不及使用？
                      </p>
                      <p class="answer">
                        答：不会！这么不厚道的事情墙蛙哪干得出来！诚信！诚信！诚信！重要的事说3遍！
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        7、我还有其他问题，在这里没有找到答案怎么办？
                      </p>
                      <p class="answer">
                        答：扫描关注墙蛙微信，可以联系万能的小编帮您解答哦！
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
              <div class="tab-pane" :class="{active:detail==2}" name="wa-bin">
                <div class="code-top mb30 pt5 pl20">
                  <h3>规则说明</h3>
                  <ol>
                    <li>
                      蛙币和人民币抵用比例是1:1，即1元蛙币相当于人民币1元。
                    </li>
                    <li>
                      优惠码可无限量分享给小伙伴，小伙伴可点击分享链接领取优惠券或在定制结算时输入优惠码，立减20。交易 完成即自动返现￥10元到您的个人优惠账户。
                    </li>
                    <li>
                      蛙币可累加使用，尽情分享，分分钟享受免费定制！
                    </li>
                    <li>
                      蛙币是墙蛙用户在墙蛙网（www.wallwa.com）购物、评价、晒单等相关活动情况给予的优惠，蛙币仅可在墙蛙网使用，如用户帐号暂停使用，则墙蛙将取消该用户帐号内蛙币相关使用权益。 （最终解释权归墙蛙wallwa所有）
                    </li>
                  </ol>
                </div>
              </div>
              <div class="tab-pane" :class="{active:detail==3}" name="coupon-detail">
                <div class="code-top mb30 pt5 pl20">
                  <h3>规则说明</h3>
                  <ol>
                    <li>
                      墙蛙优惠券是墙蛙通过购买、赠送、活动、积分兑换等形式发放给墙蛙网用户的用于减免支付的措施。
                    </li>
                    <li>
                      墙蛙优惠蛙币可累加使用，尽情分享，分分钟享受免费定制！
                    </li>
                    <li>
                      优惠券有不同金额、不同使用门槛以及有效期限等，使用前请务必仔细阅读优惠券内说明文字。
                    </li>
                    <li>
                      部分优惠码在使用当下会转化成优惠券形式，可仔细核实确认。
                    </li>
                    <li>
                      优惠券减免部分，不开具发票。（最终解释权归墙蛙wallwa所有）
                    </li>
                  </ol>
                </div>
              </div>
              <div class="tab-pane" :class="{active:detail==4}" name="bill">
                <div class="code-top mb30 pt5 pl20 issue-list-wrap">
                  <h3>常见问题:</h3>
                  <ol class="issue-list">
                    <!--1-->
                    <li>
                      <p class="question">
                        1、如何申请发票
                      </p>
                      <p class="answer">
                        答：下单时，左下角会提示是否需要开票，选择开票类型，备注发票抬头即可。无申请默认不开。如到货后需要补开，微信扫码联系万能小编，提供订单编号补登，3个工作日内发出。
                      </p>
                    </li>
                    <!--2-->
                    <li>
                      <p class="question">
                        2、何时可收到发票
                      </p>
                      <p class="answer">
                        答：大部分情况下，发票随货发出，拆箱请注意。特殊情况，会在发货后的3个工作日内单独寄送。
                      </p>
                    </li>
                    <!--3-->
                    <li>
                      <p class="question">
                        3、发票内容，发票金额怎么写？
                      </p>
                      <p class="answer">
                        答：发票内容根据购买品类（装饰画、家居饰品等）而定；金额为实际支付金额（优惠券、优惠码、折扣、满减、积分等任何形式的优惠减免部分均不开票），多个订单可能合并开票。
                      </p>
                    </li>
                    <!--4-->
                    <li>
                      <p class="question">
                        4、发票类型
                      </p>
                      <p class="answer">
                        答：墙蛙可提供普通发票和增值税发票两种，默认为普通发票。增值税开票需提供以下信息：公司　　名称；税号；公司地址，电话；开户银行名称及账号；一般纳税人证明。未提供以上信息的，默认都开普通发票。
                      </p>
                    </li>
                    <!--5-->
                    <li>
                      <p class="question">
                        5、如果发票不小心遗失了，可以补开吗？
                      </p>
                      <p class="answer">
                        答：抱歉，发票遗失无法补开哦~
                      </p>
                    </li>
                    <!--6-->
                    <li>
                      <p class="question">
                        6、如果收到发票发现抬头或者金额开错了，怎么办？
                      </p>
                      <p class="answer">
                        答：如果是墙蛙失误导致发票抬头开错，可以退回重新补开，我们负责来回运费。如果是个人原因提供错误抬头信息，当月退回墙蛙可以重开，跨月不重开。
                      </p>
                    </li>
                    <!--7-->
                    <li>
                      <p class="question">
                        7、如何验证发票真伪？
                      </p>
                      <p class="answer">
                        答：墙蛙开票即时生效，收到后根据发票号可以在税务局查看验证真伪。
                      </p>
                    </li>
                    <li>
                      <p class="question">
                        8、如需退货，发票如何处理？
                      </p>
                      <p class="answer">
                        答：如退货，请务必将发票随货退回；未退回会根据本类目税点17%扣对应货款。以上如果还无法解答您的问题，请微信扫码墙蛙，找万能的墙蛙小编为您解答！
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
              <div class="tab-pane" :class="{active:detail==5}" name="pay">
                <div class="code-top mb30 pt5 pl20">
                  <h3 class="pb10">支付常见问题疑答</h3>
                  <ol>
                    <li>
                      一、支付方式问题
                    </li>
                    <li>
                      墙蛙网目前只支持微信支付和支付宝支付，选择支付方式后页面跳转，打开对应app扫二维码支付（手机端会直接跳转提示支付）
                    </li>
                    <li>
                      二、应付金额和实付金额不一致<br>建议退出查看订单详情确认是否有特殊优惠或者未使用优惠的情况<br>三、支付失败？先排除以下原因：
                    </li>
                    <li>
                      1、支付超限、余额不足<br>

                      支付失败提示超出支付限额或余额不足，一般是您对应的支付宝、微信余额少于需支付金额；或者两者绑定的银行卡额度超限，请先充值或者调整额度再进行支付。<br>

                      2、页面无法跳转到支付环节<br>

                      先查看是否浏览器存在问题，建议删除缓存（浏览器工具栏—internet选项—常规—删除临时文件和删除cookies，再重新打开浏览器）或者更换浏览器操作。<br>

                      3、网络问题<br>

                      网络问题导致付款超时，建议重新连接网络或者稍候再试。<br>

                      最后，如果以上解答都没能解决您的问题，请打开微信扫二维码，联系墙蛙万能小编为您解决！<br>
                    </li>
                  </ol>
                </div>
              </div>
              <div class="tab-pane" :class="{active:detail==6}" name="withdraw">
                <div class="code-top mb30 pt5 pl20 pb10">
                  <h3 class="pb10">提现具体说明</h3>
                  <ol>
                    <li>
                      1、墙蛙网提现无需手续费。<br>
                      2、每月限定提现1次，每次最小提现金额为50元。<br>
                      3、提现金额无上限限制（超过800元，需按照国家规定予以缴纳20%个人所得税）。<br>
                      4、当月20日之前申请的提现，会由墙蛙专员在当月月底进行审核确认，20日之后申请的提现顺延至下月处理。<br>
                      5、通过审核后即提现至您绑定的账户，具体到账时间以各银行为准。<br>
                      6、收入分成说明：您的收入=产品的基础价X分成比例，分成比例由您在创建产品时决定。最终收入会随网站折扣等活动进行折算。（例如，一件男士圆领T恤，成本价100元，收入分成20%即20元，那么详情页显示售价为120元。网站七折优惠，售价变为120x0.7=84元。收入变为20x0.7=14元）
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: 1,
        detail: 1,
        seen: true
      }
    },
    mounted() {
      this.dealUrl()
    },
    methods: {
      dealUrl() {
        const hash = window.location.hash
        switch (hash) {
          case '#coupon-share':
            this.detail = 1
            this.active = 1
            break
          case '#wa-bin':
            this.detail = 2
            this.active = 1
            break
          case '#coupon-detail':
            this.detail = 3
            this.active = 1
            break
          case '#bill':
            this.detail = 4
            this.active = 2
            break
          case '#pay':
            this.detail = 5
            this.active = 3
            break
          case '#withdraw':
            this.detail = 6
            this.active = 2
        }
      },
      tabli(num) {
        this.active = num
      },
      detailTab(num) {
        this.detail = num
      },
      close() {
        this.seen = false
      }
    }
  }
</script>
