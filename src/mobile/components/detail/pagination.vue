<template lang="html">
  <div class="page-bar text-center" v-if="all>1">
    <ul>
      <li :class="{pagidisable: cur==1}"><a v-on:click="pre">上一页</a></li>
      <li v-for="index in indexs"  v-bind:class="{ active: cur == index}">
        <a v-on:click="btnClick(index)">{{ index }}</a>
      </li>
      <li :class="{pagidisable: cur==all}"><a v-on:click="next">下一页</a></li>
      <li><a>共<i>{{all}}</i>页</a></li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['cur', 'all'],
    data() {
      return {}
    },
    computed: {
      indexs: function() {
        var left = 1
        var right = this.all
        var arr = []
        if (this.all >= 11) {
          if (this.cur > 5 && this.cur < this.all - 4) {
            left = this.cur - 5
            right = this.cur + 4
          } else {
            if (this.cur <= 5) {
              left = 1
              right = 10
            } else {
              right = this.all
              left = this.all - 9
            }
          }
        }
        while (left <= right) {
          arr.push(left)
          left++
        }
        return arr
      }
    },
    methods: {
      pre() {
        if (this.cur !== 1) {
          this.cur--
          this.$bus.$emit('pagi', this.cur)
        }
      },
      next() {
        if (this.cur !== this.all) {
          this.cur++
          this.$bus.$emit('pagi', this.cur)
        }
      },
      btnClick(data) {
        if (data !== this.cur) {
          this.cur = data
          this.$bus.$emit('pagi', data)
        }
      }
    }
  }
</script>

<style lang="sass">
  ul,li {
    margin: 0px;
    padding: 0px;
  }

  .page-bar li {
    list-style: none;
    display: inline-block;
  }

  .page-bar li:first-child>a {
    margin-left: 0px
  }

  .page-bar a {
    border: 1px solid #ddd;
    text-decoration: none;
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    cursor: pointer
  }

  .page-bar a:hover {
    background-color: #eee;
  }

  .page-bar .active a {
    color: #fff;
    cursor: default;
    background-color: #337ab7;
    border-color: #337ab7;
  }

  .page-bar i {
    font-style:normal;
    color: #d44950;
    margin: 0px 4px;
    font-size: 12px;
  }
  .pagidisable {
    a {
      color: #ccc;
      background-color: #eee;
      cursor: not-allowed;
    }
  }
</style>
