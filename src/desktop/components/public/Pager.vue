<template>
  <div class="paging" v-if="pager">
    <ul class="pagination">
      <li class="page-item" >
        <a class="page-link" title='上一页' @click='changePage(-1, true)'>
          <i class="fa fa-angle-left fa-fw"></i>
        </a>
      </li>
      <li v-for="p in pages" class="page-item" :class='{"active" : p === pager.Page}'>
        <a class="page-link" v-if='p > 0' @click='changePage(p)'>
          {{p}}
        </a>
        <a class="page-link" v-else @click='changePage(-p)'>
          <!--{{p}}-->
          <i class="fa fa-angle-left fa-fw"></i>
        </a>
      </li>
      <li class="page-item" >
        <a class="page-link" title='下一页' @click='changePage(1, true, "next")'>
          <i class="fa fa-angle-right fa-fw"></i>
        </a>
      </li>
    </ul>
    <!--<div class="btn-group" v-if='showCounts'>-->
      <!--<button class="btn btn-secondary" type='button' v-for='c in pager.Counts'-->
              <!--v-on:click='changeCount(c)'-->
              <!--v-bind:class='{"active": pager.Count === c}'>-->
        <!--{{c}}-->
      <!--</button>-->
    <!--</div>-->
  </div>
</template>

<script>
  /* eslint-disable */
  export default{
    props:['pager','nextDisable'],
    data() {
      return {
      }
    },
    computed: {
      showCounts() {
        let p = this.pager
        return p && p.Counts && p.Counts.length > 0
      },
      pages() {
        const p = this.pager
        const a = []
        if (p) {
          const n = 5
          let l, r, i, j, m

          l = n
          if (p.hasTotal) {
            m = Math.ceil(p.Total / p.Count)
            i = Math.ceil(n / 2)
            j = n - i
            l = Math.min(p.Page, n)
            r = Math.min(m - p.Page, n)
            if (l > i && r > j) {
              l = i
              r = j
            } else if (l > i) {
              l = n - r
            } else if (r > j) {
              r = n - l
            }
          } else {
            l = n
            r = 0
          }

          for (i = 0; i < l; i++) {
            j = p.Page - i
            if (j >= 1) {
              a.push(j)
            } else {
              break
            }
          }
          if (a.length > 0) {
            i = a[a.length - 1]
            if (i > 2) a.push(-(i - 1))
            if (i > 1) a.push(1)
          } else {
            a.push(1)
          }
          a.reverse()

          if (p.hasTotal) {
            for (i = 1; i <= r; i++) {
              j = p.Page + i
              if (j <= m) {
                a.push(j)
              } else {
                break
              }
            }
            if (a.length > 0) {
              i = a[a.length - 1]
              if (i > 0) {
                if (i < m - 1) a.push(-(i + 1))
                if (i < m) a.push(m)
              }
            }
          } else if (p.hasNext) {
            a.push(-(p.Page + 1))
          }
        }
        return a
      }
    },
    methods: {
      changePage(n, delta = false, str) {
        const p = this.pager
        if (!p) return
        if (delta) n += p.Page
        if (str && this.nextDisable) {
          this.$notify({
            text: '已经是最后一页了'
          })
          return
        }
        if (n===0) {
          this.$notify({
            text: '已经是第一页了'
          })
          return
        }
        if (p.Page === n) {
          return
        }
        p.Page = n
        this.$emit('updatePage', n)
      },
      changeCount(c) {
        const p = this.pager
        if (!p || p.Count === c || c < 1 ||
          (p.Counts && p.Counts.indexOf(c) === -1)) return
        p.Page = 1
        p.Count = c
      }
    },
    watch: {
      nextDisable(val) {
      }
    }
  }
</script>
<style>
  .pagination .page-link{
    cursor: pointer;
  }
</style>
