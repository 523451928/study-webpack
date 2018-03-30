// Copyright 2016 CHEN Xianren. All rights reserved.

export default {
  data() {
    return { pager: undefined }
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
    changePage(n, delta = false) {
      const p = this.pager
      if (!p) return
      if (delta) n += p.Page
      if (p.Page === n || n < 1 || (!p.hasNext && n > p.Page)) return
      p.Page = n
      this.load()
    },
    changeCount(c) {
      const p = this.pager
      if (!p || p.Count === c || c < 1 ||
        (p.Counts && p.Counts.indexOf(c) === -1)) return
      p.Page = 1
      p.Count = c
      this.load()
    }
  }
}
