<template>
    <div>
        <div class="work-head border-bottom" ref="workHead">
            <img :src="avartarUrl">
            {{nickname}}的品牌店
            <a class="home-link" href="/">
                <span class="wa-home"></span> 首页
            </a>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    props: {
        nickname: {
            type: String,
            default: ''
        },
        avatarid: {
            type: Number
        },
        avatar: {
            type: String
        }
    },
    computed: {
        avartarUrl() {
            if (this.avatar) {
                return `http://192.168.1.6:8000//thumbnail/avatar/${this.avatarid}/100/${this.avatar}`
            } else {
                return require('assets/images/user/default-profile.jpg')    
            }
        }
    }
}
</script>
<style>
.work-lsit{
  overflow: hidden;
}
.wa-loadmore-top {
  margin-top: -50px;
  line-height: 50px;
  text-align: center;
}
.wa-loadmore-bottom {
  margin-bottom: -50px;
  line-height: 50px;
  text-align: center;
}
.wa-nomore-text{
  line-height: 50px;
  text-align: center;
}
</style>