<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="indicator d-inline-block" v-if="xn > 1 || dn > 1">
  <button class="btn btn-secondary btn-sm btn-compact" v-if="po &amp;&amp; xi > 0"
    @click="add()">
    <i class="material-icons">clear</i>
  </button><button class="btn btn-secondary btn-sm btn-compact" v-if="xn > 1"
    @click="add('x', -1)" -disabled="xi === 0">
    <i class="material-icons">first_page</i>
  </button><button class="btn btn-secondary btn-sm btn-compact" v-if="dn > 1"
    @click="add('d', -1)" -disabled="di === 0">
    <i class="material-icons">chevron_left</i>
  </button>
  <span>{{text}}</span>
  <button class="btn btn-secondary btn-sm btn-compact" v-if="dn > 1"
    @click="add('d')" -disabled="di === dn - 1">
    <i class="material-icons">chevron_right</i>
  </button><button class="btn btn-secondary btn-sm btn-compact" v-if="xn > 1"
    @click="add('x')" -disabled="xi === xn - 1">
    <i class="material-icons">last_page</i>
  </button>
  <toast :show.sync="show" :message="message" :time="2"
    :icon="false" :mask="false" :cancel="true"></toast>
</div>
</template>

<script>
export default {
  props: {
    po: {type: Boolean, default: false},
    xn: {type: Number, defualt: 1},
    xi: {type: Number, default: 0},
    dn: {type: Number, default: 1},
    di: {type: Number, default: 0}
  },
  data() {
    return {show: false, message: ''}
  },
  computed: {
    text() {
      let {po, xn, xi, dn, di} = this
      let a = []
      if (xn > 1) a.push(po ? (xi > 0 ? xi : '&' + (xn - 1)) : xi + 1)
      if (dn > 1) a.push(di + 1)
      return a.join(' - ')
    }
  },
  methods: {
    add(k, v = 1) {
      if (k) {
        let n = k + 'n'
        let i = k + 'i'
        // this[i] = Math.min(Math.max(0, this[i] + v), this[n] - 1)
        this[i] += v
        if (this[i] >= this[n]) this[i] = 0
        if (this[i] < 0) this[i] = this[n] - 1
      } else {
        this.xi = 0
      }
      this.$EE.emit('change-indicator', this.xi, this.di)
      this.show = false
      this.$nextTick(() => {
        let {po, xn, xi, dn, di} = this
        if (po && xi === 0) return
        let a = []
        if (xn > 1) a.push(po ? '照片' + xi : '位置' + (xi + 1))
        if (dn > 1) a.push('视图' + (di + 1))
        this.message = a.join(' ')
        this.show = true
      })
    }
  }
}
</script>
