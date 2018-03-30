<template>
  <div>
    <div class="case container-fluid">
      <div class="layer-md">
        <div class="case-wrap">
          <h2>案例展示</h2>
          <div class="case-items clearfix">
            <div class="case-item fl mr20"><img data-type="/custom?initCatType=penBagPic" @click="showBigImg('bigImg1','/custom/17')" src="~images/collections/atlas/small/atlas-01.jpg" class="lazy" alt=""></div>
            <div class="fl">
              <div class="mb20 case-item">
                <img data-type="/custom?initCatType=scarfPic" class="lazy" @click="showBigImg('bigImg2','/custom/18')" src="~images/collections/atlas/small/atlas-02.jpg" alt="">
              </div>
              <div class="case-item">
                <img data-type="/custom?initCatType=penBagPic" class="lazy" @click="showBigImg('bigImg3','/custom/12')" src="~images/collections/atlas/small/atlas-03.jpg" alt="">
              </div>
            </div>
          </div>
          <div class="case-items clearfix">
            <div class="case-item fl mr20"><img data-type="/custom?initCatType=bolsterPic" class="lazy" @click="showBigImg('bigImg4','/custom/11')" src="~images/collections/atlas/small/atlas-04.jpg" alt=""></div>
            <div class="case-item fl mr20"><img data-type="/custom?initCatType=notebookPic" class="lazy"  @click="showBigImg('bigImg5','/custom/19')" src="~images/collections/atlas/small/atlas-05.jpg" alt=""></div>
            <div class="case-item fl"><img data-type="/custom?initCatType=keyChainPic" class="lazy" @click="showBigImg('bigImg6','/custom/11')" src="~images/collections/atlas/small/atlas-06.jpg" alt=""></div>
          </div>
          <div class="case-items mb20 clearfix">
            <div class="fl mr20">
              <div class="case-item mb20">
                <img data-type="/custom?initCatType=clockPic" class="lazy" @click="showBigImg('bigImg7','/custom/20')" src="~images/collections/atlas/small/atlas-07.jpg" alt="">
              </div>
            </div>
            <div class="fl case-item">
              <div class="case-item">
                <img data-type="/custom?initCatType=bolsterPic" class="lazy" @click="showBigImg('bigImg8','/custom/8')" src="~images/collections/atlas/small/atlas-08.jpg" alt="">
              </div>
            </div>
          </div>
          <div class="case-items clearfix">
            <div class="fl mr20 ">
              <div class="case-item mb20"><img data-type="/custom?initCatType=puzzlePic" class="lazy" @click="showBigImg('bigImg16','/custom/8')" src="~images/collections/atlas/small/atlas-09.jpg" alt=""></div>
              <div class="case-item">
                <img data-type="/custom?initCatType=groundMatPic" class="lazy" @click="showBigImg('bigImg17','/custom/10')" src="~images/collections/atlas/small/atlas-10.jpg" alt="">
              </div>
            </div>
            <div class="fl case-item">
              <img data-type="/custom?initCatType=framePic" class="lazy" @click="showBigImg('bigImg11','/custom/1')" src="~images/collections/atlas/small/atlas-11.jpg" alt="">
            </div>
          </div>
          <div class="case-items clearfix">
            <div class="fl mr20 case-item">
              <img data-type="/custom?initCatType=scarfPic" class="lazy" @click="showBigImg('bigImg12','/custom/19')" src="~images/collections/atlas/small/atlas-12.jpg" alt="">
            </div>
            <div class="case-item fl">
              <img data-type="/custom?initCatType=scarfPic" class="lazy" @click="showBigImg('bigImg13','/custom/15')" src="~images/collections/atlas/small/atlas-13.jpg" alt="">
            </div>
          </div>
          <div class="case-items clearfix">
            <div class="fl">
              <div class="mb20 clearfix">
                <div class="case-item fl mr20">
                  <img data-type="/custom?initCatType=clockPic" class="lazy" @click="showBigImg('bigImg14','/custom/16')" src="~images/collections/atlas/small/atlas-14.jpg" alt="">
                </div>
                <div class="case-item fl">
                  <img data-type="/custom?initCatType=notebookPic" class="lazy" @click="showBigImg('bigImg15','/custom/19')" src="~images/collections/atlas/small/atlas-15.jpg" alt="">
                </div>
              </div>
            </div>
            <div class="fl">
              <div class="fl mr20">
                <div class="case-item mb20"><img data-type="/custom?initCatType=puzzlePic" class="lazy" @click="showBigImg('bigImg16','/custom/8')" src="~images/collections/atlas/small/atlas-16.jpg" alt=""></div>
                <div class="case-item">
                  <img data-type="/custom?initCatType=groundMatPic" class="lazy" @click="showBigImg('bigImg17','/custom/10')" src="~images/collections/atlas/small/atlas-17.jpg" alt="">
                </div>
              </div>
              <div class="case-item fl">
                <img data-type="/custom?initCatType=notebookPic" class="lazy" @click="showBigImg('bigImg18','/custom/19')" src="~images/collections/atlas/small/atlas-18.jpg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="scale">
      <div class="case-modal-wrap" v-show="bigShow" @click="hideBigImg">
        <div class="case-modal" @click.stop>
          <div v-if="bigImgSrc" class="case-modal-img"><img :src="bigImgSrc" alt=""></div>
          <a class="change-img-btn" :href="btnHref" target="_blank">换上你的图片试试</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    data() {
      return {
        btnHref: '',
        bigShow: false,
        bigImgSrc: '',
        bigImg1: require('assets/images/collections/atlas/big/atlaslg-01.jpg'),
        bigImg2: require('assets/images/collections/atlas/big/atlaslg-02.jpg'),
        bigImg3: require('assets/images/collections/atlas/big/atlaslg-03.jpg'),
        bigImg4: require('assets/images/collections/atlas/big/atlaslg-04.jpg'),
        bigImg5: require('assets/images/collections/atlas/big/atlaslg-05.jpg'),
        bigImg6: require('assets/images/collections/atlas/big/atlaslg-06.jpg'),
        bigImg7: require('assets/images/collections/atlas/big/atlaslg-07.jpg'),
        bigImg8: require('assets/images/collections/atlas/big/atlaslg-08.jpg'),
        bigImg9: require('assets/images/collections/atlas/big/atlaslg-09.jpg'),
        bigImg10: require('assets/images/collections/atlas/big/atlaslg-10.jpg'),
        bigImg11: require('assets/images/collections/atlas/big/atlaslg-11.jpg'),
        bigImg12: require('assets/images/collections/atlas/big/atlaslg-12.jpg'),
        bigImg13: require('assets/images/collections/atlas/big/atlaslg-13.jpg'),
        bigImg14: require('assets/images/collections/atlas/big/atlaslg-14.jpg'),
        bigImg15: require('assets/images/collections/atlas/big/atlaslg-15.jpg'),
        bigImg16: require('assets/images/collections/atlas/big/atlaslg-16.jpg'),
        bigImg17: require('assets/images/collections/atlas/big/atlaslg-17.jpg'),
        bigImg18: require('assets/images/collections/atlas/big/atlaslg-18.jpg')
      }
    },
    methods: {
      showBigImg(str, href) {
        this.bigShow = true
        this.btnHref = href
        this.bigImgSrc = this[str]
      },
      hideBigImg() {
        this.bigShow = false
      }
    },
    mounted() {

    }
  }
</script>
