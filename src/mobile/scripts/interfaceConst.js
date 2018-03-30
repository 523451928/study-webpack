/**
 * interface Map
 * 标准接口外的接口常量
 */
export const InterfaceMap = {
  // Tc
  base: 'http://m.wallwa.xxx/',
  getBalance: 'tc/income/profit/balance',
  // 本月是否可以提现
  getAvailable: 'tc/withdraw/profit/available',
  submitOrder: 'tc/trade/add',
  getCartList: 'cart/list',
  getOrderDetail: 'tc/trade/',
  wechatPay: 'tc/pay/weixin/',
  getOrderList: 'tc/trade/list',
  //  购买商品
  buyProduct: 'item/build',
  //  评论
  getCommentList: 'comment/list',
  addComment: 'comment/add',
  deleteCommentList: 'comment/',
  // 分享优惠券
  shareCoupon: 'share/coupon/',
  // 获取横幅列表:
  getBannerList: 'banner/list',
  // 设置默认横幅
  setBannerDefault: 'banner/default/',
  // 保存banner
  saveBanner: 'banner/save',
  shareProduct: 'share/item/',
  //  喜欢
  updateLikeStatus: 'like/item',
  getLikeList: 'like/list',
  // 获取默认横幅
  getDefaultBanner: 'banner/get',
  //  获取所有的品类列表
  getCatList: 'category/list',
  // 获取用户完善信息
  getUserList: 'user/improve',
  // 获取用户头像+名称等信息
  getUserHead: '_header',
  // “我的”页面接口整合
  getMe: '_me',
  // 修改密码
  changePassWord: 'user/change/password',
  // 获取收货地址
  getAddrList: 'tc/address/',
  // 新增收货地址
  addAddress: 'tc/address/add',
  // 设置默认地址
  setAddrDefault: 'tc/address/set/',
  // 删除收货地址
  removeAddress: 'tc/address/remove/',
  // 编辑收货地址
  editorAddress: 'tc/address/edit/',
  // 获取活动优惠券
  getActiveCoupon: 'tc/coupon/list',
  // 微信支付:
  payWeixin: 'tc/pay/weixin/',
  // 支付宝支付
  aliPay: 'tc/pay/alipaym/',
  // 微信健全
  weixinofficial: 'tc/pay/weixinmp/',
  // 支付成功查询
  payOk: 'tc/trade/paid/',
  // 通过优惠码领取优惠券
  getCodeGetCoupon: 'tc/coupon/take/code/',
  // 优惠券列表
  getCouponList: 'tc/coupon/list',
  // 当前用户优惠信息 + 无参数
  getUserCoupon: 'tc/coupon/user',
  // 分享码查询用户信息 + 参数code查询
  queryUserInfo: 'tc/coupon/user/',
  // 获取机构优惠详情 + 机构Id
  getAgencyInfo: 'tc/coupon/agency/',
  // 绑定机构
  bindAgency: 'tc/coupon/my/agency',
  // 获取活动
  getActivity: 'tc/activity/'
}
