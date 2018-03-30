/**
 * interface Map
 * 标准接口外的接口常量
 */
export const InterfaceMap = {
  // Tc
  base: 'http://192.168.1.6:8000/',
  baseUrl: '//192.168.1.6:8000',
  getBalance: 'tc/income/profit/balance',
  // 本月是否可以提现
  getAvailable: 'tc/withdraw/profit/available',
  submitOrder: 'tc/trade/add',
  getCartList: 'cart/list',
  getOrderDetail: 'tc/trade/',
  wechatPay: 'tc/pay/weixin/',
  aliPay: 'tc/pay/alipay/',
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
  //  获取艺术家简介
  getProfileSi: 'profile/si',
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
  //  关注用户
  updateFollowUser: 'follow/user',
  //  关注列表
  getFollowList: 'follow/list',
  // 获取头部信息
  getUserHead: '_header',
  // 通过优惠码领取优惠券
  getCodeGetCoupon: 'tc/coupon/take/code/',
  // 优惠券列表
  getCouponList: 'tc/coupon/list',
 // 当前用户优惠信息
  getUserCoupon: 'tc/coupon/user',
  // 判断是否绑定了机构
  bindAgency: 'tc/coupon/my/agency',
  // 检查图片是否已被使用（生成产品）
  checkImgUsed: 'ic/item/check'
}
