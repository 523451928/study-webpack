<template>
  <div class="main-cont tab-content col-md-10">
    <div class="form-wrap">
      <div class="panel panel-default">
        <div class="panel-heading">我的蛙币</div>
        <div class="panel-body profile-panel-body coupon-panel wacoin-panel">
          <div class="top">
            <span class="desc">
              墙蛙网账户可用蛙币<strong class="color-red"> {{waObj.Available / 100}} </strong>元
            </span>
            <a href="/faq.html" target="_blank" class="link">常见问题</a>
          </div>
          <!--<div class="bottom">-->
            <!--<span class="desc">蛙币变更详情</span>-->
            <!--<table class="table table-bordered">-->
              <!--<thead>-->
                <!--<tr>-->
                  <!--<th>日期</th>-->
                  <!--<th>收入/使用</th>-->
                  <!--<th>类型</th>-->
                  <!--<th>状态</th>-->
                <!--</tr>-->
              <!--</thead>-->
              <!--<tbody>-->
                <!--<tr>-->
                  <!--<td>1</td>-->
                  <!--<td>2</td>-->
                  <!--<td>3</td>-->
                  <!--<td>4</td>-->
                <!--</tr>-->
                <!--<tr>-->
                  <!--<td colspan="4" class="text-align">暂无记录</td>-->
                <!--</tr>-->
              <!--</tbody>-->
            <!--</table>-->
          <!--</div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { InterfaceMap as interf } from 'scripts/interfaceConst'
  export default {
    data() {
      return {
        waObj: []
      }
    },
    mounted() {
      let self = this
      request({ url: interf.getBalance }).then(res => {
        self.waObj = res.take('Data')
      })
    }
  }
</script>
