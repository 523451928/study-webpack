<template>
  <div>
    <div class="discountLife">
      <div class="discount-tips-wrap">
        <div class="discount-tips">
        </div>
        <h1>周一惠生活</h1>
        <p>限量200份20元优惠券。领券定制，体验半价T恤+手机壳，折上再减</p>
        <div class="group-modal-btn a-coupon" @click="receiveCoupon">
          抢限量优惠券
        </div>
      </div>
      <div class="container-fluid discount-lists">
        <div class="layer-md">
          <div class="discount-title-tips">
            <ul>
              <li>·&nbsp;&nbsp;周一惠生活栏目，平均每2周会精选3-5款产品（包括新品及热销产品），并附上限量优惠券，邀你一起打开定制的脑洞;</li>
              <li>·&nbsp;&nbsp;发货说明：定制产品将于付款后两个工作日内发货;全场商品免邮费;</li>
              <li>·&nbsp;&nbsp;促销期间，墙蛙保留变更商品及终止活动的权利。</li>
            </ul>
          </div>
          <a href="/custom/14" target="_blank">
            <div class="discount-list"><img src="~images/collections/discountLife/discountLife-04.jpg" alt=""></div>
          </a>
          <a href="/custom/15" target="_blank">
            <div class="discount-list"><img src="~images/collections/discountLife/discountLife-03.jpg" alt=""></div>
          </a>
          <a href="/custom/10" target="_blank">
            <div class="discount-list"><img src="~images/collections/discountLife/discountLife-01.jpg" alt=""></div>
          </a>
          <a href="/custom/16" target="_blank">
            <div class="discount-list"><img src="~images/collections/discountLife/discountLife-02.jpg" alt=""></div>
          </a>
          <div class="discount-more">
            ——&nbsp;&nbsp;更多定制好物敬请期待&nbsp;&nbsp;——
        </div>
        </div>
      </div>
    </div>
    <coupon></coupon>
  </div>
</template>

<script>
  /* eslint-disable */
  import coupon from '../walllife/coupon.vue'
  export default {
    data() {},
    components: {
      coupon
    },
    methods: {
      receiveCoupon() {
        this.$bus.$emit('showCoupon')
      }
    }
  }
</script>
