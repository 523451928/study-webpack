<template>
  <div>
    <div v-show="pro">
      <slot name='prolist'></slot>
    </div>
    <introduction v-show="intro"></introduction>
    <like v-show="like" :authorId="id"></like>
    <follow v-show="follow"></follow>
  </div>
</template>
<script>
import { getParameter } from 'js/getParameter.js'
import intro from './introduction.vue'
import like from '../user/like/like.vue'
import follow from './follow.vue'
export default {
  data() {
    return {
      pro: true,
      intro: false,
      like: false,
      follow: false,
      id: ''
    }
  },
  created() {
    this.id = getParameter('userId')
  },
  mounted() {
    this.$onBus('isOpen', (str) => {
      this.init()
      this[str] = true
    })
  },
  components: {
    'introduction': intro,
    'like': like,
    'follow': follow
  },
  methods: {
    init() {
      this.intro = false
      this.like = false
      this.follow = false
      this.pro = false
    }
  }
}
</script>
