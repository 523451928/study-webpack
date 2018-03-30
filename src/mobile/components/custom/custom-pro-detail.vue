<template>
  <div class="bg-white">
    <div class="pro-detail-container pro-detail-area ">
      <div class="pro-detail-box" id="pro-detail-des">
        <div class="load-wrap"><div class="ww-loading"></div></div>
        <div class="bom-detail-slider">
          <img class="normal" :src="detailPicture">
        </div>
        <h2 class="des-title">物流与包装</h2>
        <div class="des-con">
          <p>墙蛙为您考虑到每一步，采用行业专用包装方案——用缓冲层抗挤压，抗摔落；专用气泡塑料包裹，抗潮湿，防止液体流入。确保在快递与转运过程中，多次周转无破损。 请您放心，如果您的商品不幸在物流中遭遇百斤挤压/重力撞击/野蛮踩踏/高空坠落，外伤与内伤并发，墙蛙会尽千分之千的努力，为您补发商品，直到您满意为止！</p>

          <p>1.墙蛙网合作物流为<span class="color-blue">中通包邮</span>；（注意：包邮区域不含港澳台）</p>

          <p>2.墙蛙网产品均为手工工艺品，制作需耗费时间，墙蛙承诺在您付款后两个工作日内发货（周日及法定节假日不发货），还请耐心等待。</p>

          <p>3.鉴于墙蛙网提供的个性化定制服务的特殊性，定制的产品发货后概不支持退货。如遇产品质量问题，可咨询在线客服。</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        catId: 8
      }
    },
    mounted() {
      this.catId = this.$router.currentRoute.params.id
    },
    computed: {
      detailPicture() {
        return require(`../../assets/images/custom/detail-${this.catId}.jpg`)
      }
    },
    watch: {
      '$route'(to, from) {
        this.catId = to.params.id
      }
    }
  }
</script>
<style lang="sass" scope>
  .bg-white {
    background-color: #FFFFFF;
    position: absolute;
    top: 100%;
    z-index: 1000;
    img{
      width: 100%;
    }
    .pro-detail-container {
      margin: 0 auto;
      .pro-detail-box {
        padding: 45px 0;
        padding-top: 0;
        background: #fff;
        .des-title {
          font-weight: normal;
          color: #565a5c;
          text-align: center;
          font-size: 17px;
      }
        .des-con {
          line-height: 26px;
          padding: 0 10px 10px 10px;
          p {
            margin-bottom: 16px;
            &:nth-child(0) {
              margin-top: 0;
          }
        }
      }
    }
  }
  }
    .load-wrap {
      display: none;
      text-align: center;
      font-size: 0;
      padding: 30px 0;
  }
</style>

