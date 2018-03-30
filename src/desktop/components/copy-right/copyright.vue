<template>
  <div class="container" id="copyright-static" style="margin-top:65px;">
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
    <!--正文开始-->
    <div class="row">
      <h2 class="col-md-12 text-center pb20">墙蛙版权声明</h2>
      <div class="col-md-10 offset-xs-1">
        <p>杭州墙蛙科技有限公司（以下简称：“墙蛙网”）根据用户指令提供作品上传、定制以及销售等，我们重视网络版权及其他知识产权以及用户权益的保护。</p>
        <p>如果您认为墙蛙网用户通过墙蛙网提供的信息存储空间所上载、传播的图片内容侵犯了您的相关权益的，请您向墙蛙网发出权利通知，墙蛙网将根据相关法律规定采取措施删除相关内容，您可以向墙蛙网设立的专门接受版权投诉和侵权通知的邮箱发送通知书。</p>
        <h5>肖像、名誉等申诉</h5>
        <p>其中侵犯公民个人名誉权、肖像权的投诉资料请发至：<a href="mailto:quanli@wallwa.com" target="_blank">quanli@wallwa.com</a></p>
        <h5>版权申诉</h5>
        <p>侵犯个人或单位的著作权、商标权等知识产权的情况请将投诉资料发至：<a href="mailto:banquan@wallwa.com" target="_blank">banquan@wallwa.com</a></p>
        <p>相关版权资料邮寄至：<span>浙江西湖区三墩金蓬街358号 C座2层 杭州墙蛙科技 版权组收 邮编 310000</span></p>
        <h5>申诉需知</h5>
        <p>
          投诉方应当提供包含下列文件：<br>
          1、完整填写的申请书<br>

          2、权利人的姓名（名称）、联系方式、地址、身份证扫描件（自然人）、企业法人营业执照（单位）、法定代表人身份证明（单位）；<br>

          3、要求删除或者断开链接的侵权作品的准确名称和网络地址，以便墙蛙网能够发现并初步审核涉嫌侵权作品；<br>

          4、认为构成侵权的初步证明材料，包括但不限于对作品享有版权或依法享有信息网络传播权的权属证明，以及对涉嫌侵权作品侵权事实的举证。<br>

          5、通知书需由权利人或其合法授权人亲笔签名，若为单位则需加盖单位公章。<br>

          6、权利人应对通知书的真实性负责。若通知书的内容不真实，权利人将承担由此造成的全部法律责任。<br>
        </p>
        <p>一旦收到符合上述要求之通知，我们将在合理时间内删除涉嫌侵权的作品。如不符合上述条件，我们会请阁下提供相应信息，且暂不采取删除等相应措施。</p>
        <p>在墙蛙网上载作品的用户视为同意墙蛙网就前款情况所采用的相应措施。墙蛙网不因此而承担任何违约责任或其他任何法律责任。墙蛙网在收到上述通知后会发送电子邮件通知上载该等作品的用户。对于多次上载涉嫌侵权作品的用户，我们将取消其用户资格。</p>
        <h5>下载表单:</h5>
        <p><span>1、申请书（个人适用）</span> <a href="src/assets/download/copyright-person.doc" target="_blank" download="copyright-person.doc">下载链接</a></p>
        <p><span>2、申请书（法人单位适用）</span><a href="src/assets/download/copyright-company.doc" target="_blank">下载链接</a></p>
        <p style="margin-bottom: 125px;">备注：请按表格内容进行填写，带有 * 为必填项。在您发送邮件后，工作人员会尽快处理，由于涉及内容不同，所需周期也不同，请您耐心等待。 </p>
      </div>
    </div>
    <!--//正文结束-->
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
