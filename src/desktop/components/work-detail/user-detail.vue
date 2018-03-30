<template>
  <div class="m-user-detail">
    <div class="layout-content">
      <div class="work-info">
        <h5 class="detail-title">作品介绍</h5>
        <p v-if="description!==''">{{description}}</p>
        <p v-else>这个艺术家很酷,什么都没说</p>
      </div>
      <div class="work-tags">
        <h5 class="detail-title">所属标签</h5>
        <ul class="tags-list" v-if="tags.length > 0">
          <li class="tag-item" v-for="(item, index) in tags">
            {{item.Name}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {

    }
  },
  props: {
    userId: {
      type: Number
    },
    tags: {
      type: Array
    },
    description: {
      type: String
    }
  },
  methods: {
    /**
     * 获取艺术家的信息
     * @param{id} Number 艺术家id
     */
    _getUserData(id) {
      return new Promise((resolve, reject) => {
        
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~../../styles/scss/public/variable.scss';
.m-user-detail {
  margin-bottom: 80px;
  .detail-title {
    margin-bottom: 15px;
  }
  .work-info {
    margin-bottom: 60px;
  }
  .tags-list {
    font-size: 0;
    >.tag-item {
      display: inline-block;
      margin: 0 10px 10px 0;
      vertical-align: top;
      font-size: 14px;
      padding: 0 15px;
      height: 25px;
      line-height: 25px;
      box-sizing: border-box;
      border: 1px solid $c-bc-1;
      border-radius: 2px;
      color: $c-fc-1;
    }
  }
}
</style>


