<template>
  <div :class="[defaultClass, adClass]" flex="dir:left cross:bottom">
    <i class="wa-heart-fill wa" :class="liked && 'liked'" @click="onLiked"></i>
    <span class="count">
      {{count}}
    </span>
  </div>
</template>

<script>
/*eslint-disable */
export default {
  data() {
    return {
      defaultClass: 'm-like'
    }
  },
  props: {
    // 添加的其他类名
    adClass: {
      type: String,
      default:''
    },
    // 商品id
    itemId: {
      type: Number,
      default: -1
    },
    // 当前是否喜欢
    liked: {
      type: Boolean,
      default: false
    },
    // 当前有多少人喜欢了这个产品
    count: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onLiked() {
      const id = this.itemId
      request.submit('like/item', {
        ItemId: id
      }).then(res => {
        let flag = res.take('Data')
        if (flag) {
          this.count++
        } else {
          this.count--
        }
        this.$emit('liked', {
          like: flag,
          count: this.count
        })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~styles/scss/core/variable.scss';

.m-like {
  color: $c-fc-3;
  .wa {
    position: relative;
    margin-right: .05rem;
    font-size: .15rem;
    &.liked {
      color: $c-jxc-2;
    }
  }
  .count {
    font-size: .12rem;
  }
}
</style>


