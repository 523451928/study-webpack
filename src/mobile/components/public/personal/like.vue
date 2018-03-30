<template lang="html">
  <div class="like-btn"  @click="toggleLike()">
    <span class="wa wa-heart-fill" :class="likeStauts && 'like'"></span>
    <span class="like-count">{{ likeCount }}</span>
  </div>
</template>

<script>
/* eslint-disable */
import {
  InterfaceMap as Interf
} from 'scripts/interfaceConst'
export default {
  props: {
    workId: { // 喜欢的itemid
      type: Number,
      requrie: true
    },
    liked: { // 喜欢状态
      type: Boolean,
      requrie: true
    },
    likeCount: { // item喜欢的次数
      type: Number,
      require: true
    },
    entryId: {
      type: Number
    },
    packets: {
      type: Array
    },
    categoryId: {
      type: Number
    }
  },
  data() {
    return {
      likeStauts: this.liked,
      itemId: undefined
    }
  },
  methods: {
    /**
     * 关注商品
     */
    toggleLike() {
      if (!this.itemId) {
        this.buildItem().then((res) => {
          this._toggleLike()
        })
      } else {
         this._toggleLike()
      }
      
    },
    _toggleLike() {
      this.$request.submit('like/item', {
        ItemId: Number(this.itemId)
      })
      .then(res => {
        let data = res.take('Data')
        if (data) {
          this.likeCount = Number(this.likeCount) + 1
          this.likeStauts = true
        } else {
          this.likeCount = Number(this.likeCount) - 1
          this.likeStauts = false
        }
      })
    },
    /**
     * 生成商品
     */
    buildItem() {
      let params = {
        Action: 4,
        CategoryId: Number(this.categoryId),
        WorkId: Number(this.workId),
        Packets: this.packets,
        EntryId: Number(this.entryId)
      }
      return this.$request.do('GET', 'item/build', {
        params: params
      }).then(res => {
        let data = res.body
        this.itemId = data.Id
      })
    }
  },
  mounted() {
    
  },
  computed: {
    getPackets() {
      let p = this.packets
      if (typeof p !== 'string') return p
      p = p.replace(/\s{1}/g, ",")
      return JSON.parse(p)
    }
  }
} 
</script>

<style lang="sass">
  .wa-heart-fill {
    font-size: 15px;
    position: relative;
    top: 2px;
    cursor: pointer;
    color: rgb(196, 196, 196);
    &.like {
      color: red;
    }
  }
</style>
