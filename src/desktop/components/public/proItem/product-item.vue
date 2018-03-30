<template>
  <div class="pro-list grey-border">
    <a :href="url" target="_blank" class="displays-link">
      <div class="pro-pic text-center displays">
              <display-hover
              :product-id = "item.Id" 
              :entry-id="item.entry.Id"
              :category-id="item.entry.CategoryId"
              :displays="item.displays"
              :pictures="item.Pictures"
              >
              </display-hover>
      </div>
    </a>
    <div class="pro-detail clearfix" >
        <div class="pull-left pro-title">
          <a v-text="item.Title" href="javascript:;" class="default-hover-link"></a>
        </div>
        <!-- <span class="pull-right">
            <a class="default-link list-like-btn like-btn" href="javascript:void(0)">
              <span class="wa wa-heart-fill"></span> <span class="like-count">0</span>
            </a>
        </span> -->
        <div class="clearfix"></div>
          <div class="pull-left">
            <span class="pro-price pull-right">￥ {{item.Price / 100}}</span>
          </div>
          <span class="pull-right"></span>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import displayComponents from 'components/custom/display/components.js'
import displayHover from 'components/list/displayHover'
import { InterfaceMap as interf } from 'scripts/interfaceConst'
export default {
  data() {
    return {
      baseUrl: interf.baseUrl,
    }
  },
  props: {
    url: {type: String}, // 如果是编辑状态跳转到编辑页
    item: {type: Object},
    index: {type: Number},
    isEdit: {type: Boolean, default: false}
  },
  components: {
    ...displayComponents,
    displayHover
  },
  mounted() {
  }
}
</script>

<style lang="sass" scoped>


.m-pdc-item{
  float: left;
  margin-right: 20px;
  width: 230px;
  height: 302px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  &:nth-child(4n+0) {
    margin-right: 0;
  }
  &.customlist{
    height: auto;
  }
  &:hover {
    .pro-control-menu{
      display: block;
    }
  }
  &.working{
    .working-start{
      display: block;
    }
    .working-end{
      display: none;
    }
    .working-end-error{
      display: none;
    }
  }
  &.working-error{
    .working-start{
      display: none;
    }
    .working-end{
      display: none;
    }
    .working-end-error{
      display: block;
    }
  }
  .working-start{
    display: none;
  }
  .working-end{
    display: block;
  }
  .working-end-error{
    display: none;
  }
  .working-text{
    padding-top: 25px;
    color: #82888a;
    text-align: left;
  }
  .pro-control-menu{
    position: absolute;
    height: 30px;
    width: 30px;
    right: 10px;
    top: 10px;
    padding: 10px;
    background:rgba(0,0,0,0.15)!important;
    border-radius: 2px;
    z-index: 7;
    display: none;
    .wa-menu{
      color: #ffffff;
      right: 6px;
      top: -3px;
    }
    .ww-dropdown-menu{
      z-index: 9;
      min-width: auto;
      left: -30px;
      top: 38px;
      display: none;
      &>li>a{
        color: #82888a;
      }
      &:before{
        left: 50%;
      }
      &:after{
        left: 50%;
      }
    }
    &:hover{
      background:rgba(0,0,0,0.3)!important;
      .ww-dropdown-menu{
        display: block;
      }
    }
  }
  .displays-link {
    display: block;
    position: absolute;
    z-index: 6;
    width: 230px;
    height: 230px;
    top:0;
    left:0;
  }
  .pro-pic{
    width: 230px;
    height: 230px;
    position: relative;
    z-index: 5;
    display: table-cell;
    vertical-align: middle;
    //border: 1px solid #dce0e0;
    background: #fff;
    .error-layout{
      width: 100%;
      height: 100%;
      padding: 80px 20px 0;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(255,255,255,0.6);
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }
    .error-text{
      text-align: justify;
    }
    .ht-img-link{
      display: inline-block;
      overflow: hidden;
      margin: 0 auto;
      position: relative;
    }
    .normal{
        max-width: 200px;
        max-height: 200px;
      -webkit-transition-property: opacity;
      transition-property: opacity;
      -webkit-transition-duration: 0.2s;
      transition-duration: 0.2s;
      -webkit-transition-timing-function: ease-out;
      transition-timing-function: ease-out;
    }
    .ht-img{
      position: absolute;
      -webkit-transition-property: opacity;
      transition-property: opacity;
      -webkit-transition-duration: 0.5s;
      transition-duration: 0.5s;
      -webkit-transition-timing-function: ease-out;
      transition-timing-function: ease-out;
    }
    .paint-link{
      opacity: 0;
      position: absolute;
      z-index: 9;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: inline-block;
      -webkit-transition-property: opacity;
      transition-property: opacity;
      -webkit-transition-duration: 0.2s;
      transition-duration: 0.2s;
      -webkit-transition-timing-function: ease-out;
      transition-timing-function: ease-out;
      background-position:center;
      background-size: cover;
    }
    &.show-big-img:hover{
      background: #fff;
      & .normal,& .ht-img{
        opacity: 0;
      }
      & .paint-link{
        opacity: 1;
      }
    }
  }
  .pro-detail{
    padding: 10px;
    min-height: 30px;
    background: #fff;
    line-height: 1.8;
    .list-like-btn{
      color: #c4c4c4;
      &:hover,&:focus,&:visited{
        color: #c4c4c4;
      }
      .wa{
        &.active{
          color: #da4453;
        }
        cursor: pointer;
      }
    }

    .pro-title{
      width: 130px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      a{
        color: #565a5c;
      }
    }
    .deleteWidth{
      width: auto;
    }
    .pro-price{
      color: #76a549;
    }
    .sold{
      color: #82888a;
    }
    .author-name{
      color: #82888a;
      a{
        color: #aaa;
      }
    }
  }

  &.last{
    margin-right: 0;
  }
}
.pro-list-hide{
  height: 275px;
}
.no-hidden{
  overflow: initial;
}
</style>


