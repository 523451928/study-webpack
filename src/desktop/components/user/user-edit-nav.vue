<template>
  <div class="user-nav" flex="dir:left cross:center main:justify">
    <ul class="user-nav-ul clearfix" flex="dir:left cross:center mian:left">
      <li flex="dir:top main:center cross:center" v-for="(item, index) in navArr" :class="{'active': isIncludeUrl(item.url)}">
        <a :href="item.url" target="_blank">{{item.text}}</a>
      </li>
    </ul>
    <slot name="edit" v-show="isWork"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navArr: [
        {text: '我的店铺', url: '/user/work.html'},
        // {text: '我的收入', url: '/user/income.html'},
        {text: '喜欢', url: '/user/like.html'},
        {text: '关注', url: '/user/follow.html'},
        {text: '我的优惠', url: '/user/coupon.html'}
      ],
      isWork: false // 判断是否是在列表页
    }
  },
  methods: {
    isIncludeUrl(url) {
      let reg = window.location.pathname
      let _url
      if (url.indexOf('?') !== -1) {
        let index = url.indexOf('?')
        _url = url.slice(0, index)
      } else {
        _url = url
      }
      if (_url === '/user/work.html') {
        this.isWork = true
      }
      return reg.includes(_url)
    }
  }
}
</script>

<style lang="sass" scoped>
  @import '~styles/scss/public/variable.scss';
  .user-nav {
    position: relative;
    margin: 0 auto 10px;
    height: 45px;
    &::after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
      height: 1px;
      background-color: $c-line-1;
    }
    width: 980px;
    > .user-nav-ul {
      padding: 0;
      margin: 0;
      height: 100%;
      > li {
        font-size: 14px;
        text-align: center;
        padding: 0 20px;
        height: 100%;
        &.active {
          border-bottom: 2px solid $c-jxc-1;
          a {
            color: $c-jxc-1;
            text-decoration: none;
          }
        }
        &:hover {
          border-bottom: 2px solid $c-jxc-1;
          a {
            text-decoration: none;
            color: $c-jxc-1;
          }
        }
        a {
          color: $c-fc-1;
          &:visited {
            text-decoration: none;
          }
          &:hover {
            text-decoration: none;
          }
          &:active {
            text-decoration: none;
          }
        }
      }
    }
    >p {
      margin: 0;
      cursor: pointer;
      color: $c-jxc-1;
    }
  }
</style>


