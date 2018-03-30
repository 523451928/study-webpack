<template>
  <transition name="scale">
    <div class="group-modal-wrap" v-show="modalShow" >
      <div class="group-modal">
        <div class="group-modal-title" @click="modalShow = false"><i class="wa wa-close pull-right"></i></div>
        <div class="group-modal-desc">
          <h1>{{title}}</h1>
          <span class="user-product-hr"></span>
          <p v-for="(item,index) in textArr" v-html="item"></p>
        </div>
        <div class="group-modal-btn contact-wechat no-contact" @click="contact">
          <a href="javascript:;" class="contact-close" @click="modalShow = false">
            <span class="wa wa-woman"></span>
            <span>联系客服</span>
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  /* eslint-disable */
  import { mixin as contactMixin} from '../contactMixin'
  export default {
    mixins: [ contactMixin ],
    props:{
      title: {
        type: String,
        default: ''
      },
      textArr: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        modalShow: false
      }
    },
    methods: {
      show() {
        this.modalShow = true
      }
    }
  }
</script>
