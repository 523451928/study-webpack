<!-- Copyright 2016 Chen Xianren. All rights reserved. -->

<template>
<div class="display-wrapper" :style="style.canvas">
  <div class="display-canvas">
    <div class="rimless-triangle" :style="style.triangle"></div>
    <div class="rimless-purfle" :style="style.purfle">
      <div class="rimless-mirror" :style="style.mirror">
        <paint :size="style.size.mirror" :picture="style.picture"></paint>
      </div>
      <div class="rimless-mask"></div>
    </div>
    <div >
    <div v-if="editstatus" class="rimless-incline" :style="style.incline" @mousedown.prevent.stop="evStart($event)" @mousemove.prevent.stop="evMove($event)"
         @mouseleave.prevent="evEnd($event)" @mouseup.prevent="evEnd($event)">
        <paint :size="style.size.incline" :picture="style.picture"></paint>
    </div>
    <div v-else class="rimless-incline" :style="style.incline">
      <paint :size="style.size.incline" :picture="style.picture"></paint>
    </div>
  </div>
</div>
</template>

<script>
import { nx, ny, fx, fy } from './app/near'
import { mixin } from './app/display-util'

const PD = 45
const PP = 450
const ID = 15
const IP = 750

export default {
  mixins: [mixin],
  mounted() {
    this.loading = false
  },
  computed: {
    style() {
      let u = this.addUnit
      let l = this.length
      let d = this.entry.Decorative
      let w = d.Size[0]
      let h = d.Size[1]
      let t = d.Thick
      let inw = nx(w / 2, ID, IP)
      let inh = ny(w / 2, h / 2, ID, IP)
      let ifw = fx(w / 2, ID, IP)
      // let ifh = fy(w / 2, h / 2, ID, IP)
      let pw = fx(t, PD, PP)
      let ph = inh - fy(t, inh, PD, PP)

      let tw = 3 * pw
      let th = 3 * ph

      let width = tw + pw + (inw + ifw)
      let height = inh * 2
      let r = l / (width < height ? height : width)

      w *= r
      h *= r
      t *= r

      inw = nx(w / 2, ID, IP)
      inh = ny(w / 2, h / 2, ID, IP)
      ifw = fx(w / 2, ID, IP)
      // ifh = fy(w / 2, h / 2, ID, IP)

      pw = fx(t, PD, PP)
      ph = inh - fy(t, inh, PD, PP)

      tw = 3 * pw
      th = 3 * ph

      width = tw + pw + (inw + ifw)
      height = inh * 2

      let x = (l - width) / 2
      let y = (l - height) / 2
      if (this.ch) x = 0
      if (this.cv) y = 0

      let f = a => a.map(v => Math.floor(v))
      let o = {}

      o.canvas = {
        width: u(x > 0 ? l : width),
        height: u(y > 0 ? l : height)
      }

      // o.triangle = {
      //   bottom: u(y + ph + 2),
      //   'border-bottom-width': u(th)
      // }

      // o.purfle = {
      //   top: u(y),
      //   width: u(t)
      // }

      // o.incline = {
      //   top: u(y + (inh - h / 2)),
      //   width: u(w),
      //   height: u(h)
      // }

      // width = w * height / h
      // o.mirror = {
      //   top: 0,
      //   width: u(width),
      //   height: u(height),
      //   transform: 'scaleX(-1)'
      // }

      // switch (this.di) {
      //   case 0:
      //     o.triangle.left = u(x)
      //     o.triangle['border-right-width'] = u(tw)
      //     o.triangle['border-right-color'] = 'rgba(0,0,0,0.5)'

      //     o.purfle.height = u(height)
      //     o.purfle.left = u(x + tw - (t - pw))
      //     o.purfle['transform-origin'] = '100% 50%'
      //     o.purfle.transform = `perspective(${u(PP)}) rotateY(${u(-PD, 'deg')})`

      //     o.incline.left = u(x + tw + pw + (inw - w / 2))
      //     o.incline.transform = `perspective(${u(IP)}) rotateY(${u(ID, 'deg')})`

      //     o.mirror.left = u(t - width)
      //     break
      //   case 2:
      //     o.triangle.right = u(x)
      //     o.triangle['border-left-width'] = u(tw)
      //     o.triangle['border-left-color'] = 'rgba(0,0,0,0.5)'

      //     o.purfle.height = u(height)
      //     o.purfle.right = u(x + tw - (t - pw))
      //     o.purfle['transform-origin'] = '0% 50%'
      //     o.purfle.transform = `perspective(${u(PP)}) rotateY(${u(PD, 'deg')})`

      //     o.incline.right = u(x + tw + pw + (inw - w / 2))
      //     o.incline.transform = `perspective(${u(IP)}) rotateY(${u(-ID, 'deg')})`

      //     o.mirror.left = 0
      //     break
      // }

      // o.size = {incline: f([w, h]), mirror: f([width, height])}
      // o.picture = this.getPicture(0)

      let hand = ['left', 'right']
      let i = this.di / 2
      let j = 1 - i
      let sign = i === 0 ? -1 : 1

      o.triangle = {
        bottom: u(y + ph + 2),
        'border-bottom-width': u(th)
      }
      o.triangle[hand[i]] = u(x)
      o.triangle[`border-${hand[j]}-width`] = u(tw)
      o.triangle[`border-${hand[j]}-color`] = 'rgba(0,0,0,0.5)'

      o.purfle = {
        top: u(y),
        width: u(t),
        height: u(height),
        'transform-origin': `${j * 100}% 50%`,
        transform: `perspective(${u(PP)}) rotateY(${u(sign * PD, 'deg')})`
      }
      o.purfle[hand[i]] = u(x + tw - (t - pw))

      o.incline = {
        top: u(y + (inh - h / 2)),
        width: u(w),
        height: u(h),
        transform: `perspective(${u(IP)}) rotateY(${u(sign * -ID, 'deg')})`
      }
      o.incline[hand[i]] = u(x + tw + pw + (inw - w / 2))

      width = w * height / h
      o.mirror = {
        left: u(j * (t - width)),
        width: u(width),
        height: u(height),
        transform: 'scaleX(-1)'
      }

      o.size = {incline: f([w, h]), mirror: f([width, height])}
      o.picture = this.getPicture(0)

      return o
    }
  }
}
</script>

<style lang='sass'>
.display-canvas{
  width: 100%;
  height: 100%;
  position: relative;
  .rimless-triangle{
    position: absolute;
    filter: url(./filter.svg#blur);
    filter: blur(2px);
    border: 0 solid transparent;
  }

  .rimless-purfle, .rimless-incline{
    position: absolute;
    overflow: hidden;
    background-color: #FFF;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
  }

  .rimless-mask{
    z-index:3;
    position: relative;
    left: 0;
    top: -100%;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.1);
  }

  .rimless-mirror{
    z-index:2;
    position: relative;
    top: 0;
  }
}


</style>
