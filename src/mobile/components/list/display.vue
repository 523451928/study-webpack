<template>
  <div class="pro-pic text-center">
    <component :keep-alive="false" :is="displayer" :canvas="'MobileWorkRow'" :editstatus="false"
               :displays="display" :pictures="pic" :entry="entry" :isproduct="isproduct"></component>
  </div>
</template>

<script>
  import Loading from 'components/public/loading.vue'
  import displayComponents from 'components/custom/display/components.js'
  import { DecorativeCategories as dc } from 'scripts/utils/custom/consts.js'
  import { getDisplayer } from 'components/custom/display/display-util.js'

  let mixinComponents = {Loading, ...displayComponents}
  export default {
    mixins: [{components: mixinComponents}],
    created() {
    },
    props: ['displays', 'pictures', 'entryId', 'productId', 'categoryId', 'isproduct'],
    computed: {
      display() {
        let dis
        if (Number(this.categoryId) !== dc.Rimless) {
          dis = _.isArray(this.displays) ? this.displays[0][0] : JSON.parse(this.displays)[0][0]
        } else {
          dis = _.isString(this.displays) ? JSON.parse([this.displays]) : this.displays
        }
        return [dis]
      },
      pic() {
        let pic
        if (_.isArray(this.pictures)) {
          pic = this.pictures
        } else {
          pic = JSON.parse(this.pictures)
        }
        return pic
      },
      entry() {
        let res = {
          Id: Number(this.entryId),
          CategoryId: Number(this.categoryId)
        }
        if (this.productId) {
          res.ProductId = Number(this.productId)
        }
        if (Number(this.categoryId) === dc.Rimless) {
          let displays = this.display[0]
          res.Decorative = {}
          res.Decorative.Stack = Number(displays.Stack)
          res.Decorative.Thick = Number(displays.Thick)
          res.Decorative.Size = this.pic[0].Output.Size
        }
        return res
      },
      displayer() {
        if (Number(this.categoryId) === dc.Rimless) {
          return 'rimless'
        } else {
          return getDisplayer(this.entry)
        }
      }
    },
    mounted() {
    }
  }
</script>
