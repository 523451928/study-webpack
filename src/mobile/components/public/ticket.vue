<template>
  <div class="ticket-content">
    <ul>
      <li v-for="(item,index) in ticketArr">
        <div class="ticket-item">
          <div class="ticket-info">
            <p class="ticket-remark">{{item.remark}}</p>
            <h3>{{item.name}}</h3>
            <p class="deadline">
              有效期至:<span>{{item.deadline | formatDate}}</span>
            </p>
          </div>
          <div class="ticket-money" @click="receiveCoupon(item)">
            <i v-if="item.money">￥</i>{{item.money ? item.money / 100 : item.discount}}
            <span class="recei-btn" v-if="hasBtn">点击领取</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { padLeftZero } from '../../scripts/tools/padLeftZero'
  export default{
    props: {
      ticketArr: {
        type: Array,
        default() {
          return []
        }
      },
      hasBtn: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      receiveCoupon(item) {
        this.$emit('receiveCoupon', item)
        console.log('receive')
      }
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return '长期有效'
        }
        let date = new Date(time)
        return date.getFullYear() + '-' +
          padLeftZero(date.getMonth() + 1) + '-' +
          padLeftZero(date.getDate())
      }
    }
  }
</script>

<style lang="sass">
  li{
    list-style: none;
  }
  .ticket-content{
    padding: .8rem .2rem;
    .ticket-item{
      width: 100%;
      position: relative;
      height: 1.2rem;
      background: url('~images/coupon-bg.png') no-repeat;
      background-size: contain;
      margin-bottom: .2rem;
      padding: .12rem;
      .ticket-info{
        color: #fff;
        width: 59%;
        float: left;
        border: 2px solid #fff;
        text-align: center;
        .ticket-remark{
          margin-top: .05rem;
        }
        p{
          margin:0;
        }
        h3{
          font-size: .28rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0 0 0.12rem 0;
        }
        .deadline{
          border-top: 2px solid #fff;
        }
      }
      .ticket-money{
        width: 34%;
        position: absolute;
        color: #f05950;
        font-size: .6rem;
        right: 7px;
        top:10px;
        i{
          font-size: .3rem;
          font-style: normal;
        }
        .recei-btn{
          display: inline-block;
          background: #f05950;
          width: .8rem;
          height: .22rem;
          border-radius: .12rem;
          line-height: .2rem;
          text-align: center;
          color: #fff;
          font-size: .12rem;
          position: absolute;
          bottom: -15px;
          left: .2rem;
        }
      }
    }
  }
</style>
