<template>
  <!--开始定制-->
  <div class="customize text-center container-fluid">
    <!--屏幕大于1002px-->
    <div class="visible-md-block visible-lg-block">
      <div class="layer-md">
        <div class="row">
          <h2>开始定制</h2>

          <p>您可以在这里一键定制自己想要的的用品，轻松方便易操作</p>

          <div class="col-md-4" @click="gotoUrl(1)">
            <div class="customize-content">
              <a class="pt20" href="/custom/1" target="_blank">
                <img src="~images/wallLife/customize-1.jpg" class="lazy">
              </a>
              <a class="customize-link" href="/custom/1" target="_blank">装饰画</a>
              <div class="line-1 line-right customize-line"></div>
              <div class="line-bottom"></div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="customize-content customize-content-center">
              <a class="pt20" href="/custom/1" target="_blank">
                <img src="~images/walllife/customize-2.jpg" class="lazy">
              </a>
              <a class="customize-link" href="/custom/1" target="_blank">T恤</a>

              <div class="line-bottom"></div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="customize-content">
              <a class="pt20" href="/custom/12" target="_blank">
                <img src="~images/walllife/customize-3.jpg" class="lazy">
              </a>
              <a class="customize-link" href="/custom/12" target="_blank">旅行杯</a>

              <div class="line-1 line-left customize-line"></div>
              <div class="line-bottom"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="customize-content  ">
              <a class="pt20" href="/custom/11" target="_blank">
                <img src="~images/walllife/customize-4.jpg" class="lazy">
              </a>
              <a class="customize-link" href="/custom/11" target="_blank">抱枕</a>

              <div class="line-2 line-right customize-line"></div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="customize-content customize-content-center">
              <a class="pt20" href="/custom/17" target="_blank">
                <img src="~images/walllife/customize-5.jpg" class="lazy">
              </a>
              <a class="customize-link" href="/custom/17" target="_blank">帆布包</a>
            </div>
          </div>
          <div class="col-md-4">
            <div class="customize-content ">
              <a class="pt20" href="/custom/10" target="_blank">
                <img src="~images/walllife/customize-6.jpg" class="lazy">
              </a>
              <a class="customize-link" href="/custom/10" target="_blank">手机壳</a>
              <div class="line-2 line-left customize-line"></div>
            </div>
          </div>
          <div class="clearfix"></div>
          <a href="/custom" target="_blank" class="more-btn"><span class="more-btn-child">更多定制</span>
            <span class=" wa wa-right more-icon"></span></a>
        </div>
      </div>
    </div>
  </div>
</template>
