<template>
  <transition name="fade">
    <div class="custom-desc" v-show="customShow">
      <div class="custom-modal-top"></div>
      <div class="custom-modal-mid">
        <div class="custom-modal-wrap">
          <div class="cus-items">
            <div class="line_01"><span class="custom-items-title">装饰画</span></div>
            <div class="cus-tree cus-tree-special clearfix">
              <div class="cus-tree-item">
                <a href="/custom.html#/category/8" class="cates-box">
                  <span class="wa wa-youkuanghua"></span>
                </a>
                <p>有框画</p>
                <!-- <div class="icon-discount icon-activity">中秋&国庆礼</div> -->
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/2" class="cates-box">
                  <span class="wa wa-buyihua"></span>
                </a>
                <p>布艺画</p>
                <!-- <div class="icon-discount icon-activity">中秋&国庆礼</div> -->
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/4" class="cates-box">
                  <span class="wa wa-juanzhouhua"></span>
                </a>
                <p>卷轴画</p>
                <div class="icon-activity"></div>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/24" class="cates-box">
                  <span class="wa wa-Magnetic-stickers"></span>
                </a>
                <p>磁贴画芯</p>
              </div>
            </div>
          </div>
          <div class="cus-items">
            <div class="line_01 line-special"><span class="custom-items-title">T恤</span></div>
            <div class="cus-tree clearfix">
              <div class="cus-tree-item">
                <a href="/custom.html#/category/14" class="cates-box">
                  <span class="wa wa-T-Shirt"></span>
                </a>
                <p>男士T恤</p>
                <!--<div class="icon-sevenMoon icon-activity">七夕特惠</div>-->
                <!-- <div class="icon-discount icon-activity">惠生活</div> -->
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/15" class="cates-box">
                  <span class="wa wa-T-Shirt"></span>
                </a>
                <p>女士T恤</p>
                <!--<div class="icon-sevenMoon icon-activity">七夕特惠</div>-->
                <!-- <div class="icon-discount icon-activity">惠生活</div> -->
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/16" class="cates-box">
                  <span class="wa wa-T-Shirt"></span>
                </a>
                <p>儿童T恤</p>
                <!-- <div class="icon-discount icon-activity">惠生活</div> -->
              </div>
            </div>
          </div>
          <div class="cus-items">
            <div class="line_01 line_4"><span class="custom-items-title">文教用品</span></div>
            <div class="cus-tree cus-tree-special clearfix">
              <div class="cus-tree-item">
                <a href="/custom.html#/category/19" class="cates-box">
                  <span class="wa wa-notebook"></span>
                </a>
                <p>笔记本</p>
                <div class="icon-activity"></div>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/21" class="cates-box">
                  <span class="wa wa-puzzle"></span>
                </a>
                <p>拼图</p>
                <div class="icon-activity"></div>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/21" class="cates-box">
                  <span class="wa wa-Pen-bag"></span>
                </a>
                <p>笔袋</p>
                <div class="icon-activity"></div>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/25" class="cates-box">
                  <span class="wa wa-Key-chain"></span>
                </a>
                <p>钥匙扣</p>
                <div class="icon-activity"></div>
              </div>
            </div>
          </div>
          <div class="cus-items">
            <div class="line_01 line_4"><span class="custom-items-title">电子产品</span></div>
            <div class="cus-tree clearfix">
              <div class="cus-tree-item">
                <a href="/custom.html#/category/18" class="cates-box">
                  <span class="wa wa-iPad-case"></span>
                </a>
                <p>iPad壳</p>
                <div class="icon-activity"></div>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/10" class="cates-box">
                  <span class="wa wa-phone-case"></span>
                </a>
                <p>手机壳</p>
                <!-- <div class="icon-discount icon-activity">惠生活</div> -->
              </div>
            </div>
          </div>
          <div class="cus-items">
            <div class="line_01 line_4"><span class="custom-items-title">家居用品</span></div>
            <div class="cus-tree cus-tree-special clearfix">
              <div class="cus-tree-item">
                <a href="/custom.html#/category/11" class="cates-box">
                  <span class="wa wa-baozhen"></span>
                </a>
                <p>抱枕</p>
                <!-- <div class="icon-discount icon-activity" style="display:none">中秋&国庆礼</div> -->
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/20" class="cates-box">
                  <span class="wa wa-clock"></span>
                </a>
                <p>挂钟</p>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/29" class="cates-box">
                  <span class="wa wa-Mat"></span>
                </a>
                <p>地垫</p>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/12" class="cates-box">
                  <span class="wa wa-lvxingbei"></span>
                </a>
                <p>旅行杯</p>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/27" class="cates-box">
                  <span class="wa wa-Round-fan"></span>
                </a>
                <p>团扇</p>
              </div>
              <div class="cus-tree-item">
                <a href="/custom.html#/category/26" class="cates-box">
                  <span class="wa wa-Silk-scarves"></span>
                </a>
                <p>丝巾</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="custom-shadow"></div>
      <div class="custom-modal-bot">
        <div class="custom-modal-close" @click="hide">
          <i class="wa wa-close"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable */
  export default {
    data() {
      return {
        customShow: false
      }
    },
    methods: {
      show() {
        this.customShow = true
      },
      hide() {
        this.customShow = false
        $('.bd').removeClass('filter')
        $('html').removeClass('scroll-hidden')
      }
    },
    mounted() {
      let clientType = navigator.userAgent
      if (clientType.indexOf('Android') > -1 || clientType.indexOf('Linux') > -1) {
        document.querySelector('.custom-desc').style.background = 'rgba(255, 255, 255, 1)'
      }
    }
  }
</script>

<style lang="sass">
@import "../../styles/scss/wallwa/custom-nav.scss";
</style>
