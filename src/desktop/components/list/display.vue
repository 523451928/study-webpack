<template>
  <div class="pro-pic text-center">
    <component
    v-if="entry"
     :keep-alive="false" :is="displayer" :canvas="'WorkRow'" :editstatus="false"
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
          // dis = _.isArray(this.displays) ? this.displays[0][0] : JSON.parse(this.displays)[0][0]
          if (this.displays.constructor === Array) {
            if (this.displays[0].constructor === Array) {
              dis = this.displays[0]
            } else if (this.displays[0].constructor === Object) {
              dis = this.displays
            }
          } else {
            dis = [this.displays]
          }
        } else if (Number(this.categoryId) === dc.Rimless) {
          if (this.displays.constructor === Array && this.displays[0].constructor === Array) {
            dis = this.displays[0]
          } else if (this.displays.constructor === Array && this.displays[0].constructor === Object) {
            dis = this.displays
          } else if (this.displays.constructor === Object) {
            dis = [this.displays]
          }
          // dis = _.isString(this.displays) ? JSON.parse([this.displays]) : this.displays
        }
        return dis
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
      displayer() {
        return getDisplayer(this.entry)
      }
    },
    data() {
      return {
        entry: undefined
      }
    },
    methods: {
      getEntry() {
        let id = this.entryId
        this.$request.get('entry', [id]).then(res => {
          let entry = res.take('Data')[0]
          this.entry = entry
        })
      }
    },
    mounted() {
      this.getEntry()
    }
  }
</script>
