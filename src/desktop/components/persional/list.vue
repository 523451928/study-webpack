<template>
<div>
  <div v-show="useheadTab === 'pro'">
    <slot name='prolist'></slot>
  </div>
  <!-- <introduction :artistId="artistId" v-show="useheadTab === 'intro'"></introduction>
  <like v-show="useheadTab === 'likeList'" :authorId="artistId"></like>
  <follow v-show="useheadTab === 'followList'"></follow> -->
</div>
</template>
<script>
import intro from './introduction.vue'
import like from '../user/like/like.vue'
import follow from './follow.vue'
export default {
  props: {
    artistId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      useheadTab: 'pro'
    }
  },
  mounted() {
    this.$onBus('toggle-personal-tab', (str) => {
      this.useheadTab = str
    })
  },
  components: {
    'introduction': intro,
    'like': like,
    'follow': follow
  }
}
</script>
