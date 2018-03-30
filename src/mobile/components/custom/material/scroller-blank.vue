<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<table class="m-y-1 blank">
  <tr>
    <td>上</td><td>下</td><td>左</td><td>右</td>
    <td>
      <button type="button" class="btn btn-secondary btn-sm"
        @click="zero()">
        <i class="material-icons">exposure_zero</i>
      </button>
    </td>
  </tr>
  <tr>
    <td v-for="i of n">
      <button type="button" class="btn btn-secondary btn-sm"
        @click="add(i)"><i class="material-icons">arrow_drop_up</i>
      </button>
    </td>
  </tr>
  <tr>
    <td v-for="i of a">
      <input type="text" class="form-control"
        :value="blank[i]" @input="set(i, $event)">
    </td>
    <td>cm</td>
  </tr>
  <tr>
    <td v-for="i of n">
      <button type="button" class="btn btn-secondary btn-sm"
        @click="add(i, -1)"><i class="material-icons">arrow_drop_down</i>
      </button>
    </td>
  </tr>
</table>
</template>

<script>
const N = 4

function zero() {
  return new Array(N).fill(0)
}

function no(x) {
  return x.Type !== 'blank'
}

export default {
  props: {
    material: {type: Object, required: true}
  },
  data() {
    return {blank: zero()}
  },
  computed: {
    a() {
      return [0, 2, 3, 1]
    },
    n() {
      return N + 1
    }
  },
  watch: {
    material: {
      immediate: true,
      handler(x) {
        if (no(x)) return
        this.blank = x.Value.map(v => v / 10)
      }
    }
  },
  methods: {
    emit() {
      if (no(this.material)) return
      if (this._e) {
        clearTimeout(this._e)
        this._e = null
      }
      this._e = setTimeout(function() {
        this._e = null
        this.$bus.$emit('select-material', {
          Type: 'blank',
          Value: this.blank.map(v => Math.floor(v * 10))
        })
      }.bind(this), 250)
    },
    zero() {
      this.blank = zero()
      this.emit()
    },
    set(i, $event) {
      this.blank.$set(i, parseFloat($event.target.value) || 0)
      this.emit()
    },
    add(i, v = 1) {
      let a = this.blank
      if (i === a.length) {
        for (i = 0; i < a.length; i++) {
          a.$set(i, a[i] + v)
        }
      } else {
        i = this.a[i]
        a.$set(i, a[i] + v)
      }
      this.emit()
    }
  }
}
</script>

<style lang='stylus'>
.blank
  td
    width 20%
    text-align center
    padding 0.25rem
  tr:first-child td
    font-size 20px
  td input
    text-align center
    padding 0.25rem 0.5rem
  td button
    &, &:focus, &:active
      border 0
      padding 0
      background none
    & i
      font-size 24px
</style>
