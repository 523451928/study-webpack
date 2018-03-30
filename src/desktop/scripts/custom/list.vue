<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template lang='pug'>
include ../../pages/_page.pug
.custom-list
  +page_header('定制', '为生活量身设计')
  .weui_grids
    a.weui_grid(v-for='c of categories' v-link='{name: "category", params: {id: c.Id}}')
      .weui_grid_icon
        i.material-icons(v-bind:class='{missing: !c.Icon}') {{c.Icon || 'clear'}}
      p.weui_grid_label {{c.Name}}
    a.weui_grid.blank(v-for='i of n' href='javascript:')
      .weui_grid_icon
      p.weui_grid_label &nbsp;
</template>

<script>
export default {
  data() {
    return {categories: [], n: 9}
  },
  created() {
    for (let c of window.$categories.values()) {
      this.categories.push(c)
    }
    this.n = (3 - this.categories.length % 3) % 3
  }
}
</script>
