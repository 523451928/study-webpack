<template>
  <div class="user-head">
    <a v-if="href" :href="href" class="pull-left back" :class="{'no-text': !hasReturnText}">
      <i class="wa wa-left"></i><span v-if="hasReturnText">返回</span>
    </a>
    <a v-else class="pull-left back"  @click="back">
      <i class="wa wa-left"></i><span v-if="hasReturnText">返回</span>
    </a>
    <h2 class="title">{{title}}</h2>
  </div>
</template>

<script>
  export default{
    data() {
      return {}
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      href: {
        type: String,
        default: ''
      },
      hasReturnText: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      back() {
        if (!this.href) {
          window.history.go(-1)
        }
      }
    }
  }
</script>
