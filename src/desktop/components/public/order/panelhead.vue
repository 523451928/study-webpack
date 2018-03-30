<template>
  <div class="panel-nav">
    <table >
      <tr>
        <td colspan="3" width="50%" >
          <span class="whith-percent-6">商品</span>
          <span class="whith-percent-2">原价</span>
          <span class="whith-percent-2">数量</span>
        </td>
        <td rowspan="1" width="16%">
          <span>实付金额</span>
        </td>
        <td rowspan="1" width="16%">
          <span>交易状态</span>
        </td>
        <td rowspan="1" width="16%">
          <span>操作</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default{

  }
</script>
<style lang="sass">
  .panel-nav{
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
    background: #EDEFED;
    color: #565A5C;
    table{
        width: 100%;
        td{
          text-align: center;
          span{
            display: inline-block;
        }
        .whith-percent-6{
          width: 72%;
          text-indent: 8px;
          text-align: left;
        }
        .whith-percent-2{
          width: 11%;
          text-indent: 10px;
        }
      }
    }
  }
</style>
