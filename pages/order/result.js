// pages/order/result.js
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],
    pay_price:'',
    pay_type:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getrecommend();
    this.getOrderDetail(options.order_id);
  },
  
  getrecommend(){
    let _this = this;
    App._get('goods/getrecommend', {
      
    }, (result) => {
      // 初始化商品详情数据
      // let data = _this._initGoodsDetailData(result.data);
      // _this.setData(data);
      _this.setData({
        recommendList: result.data.data
      })
    });
  },
   /**
   * 获取订单详情
   */
  getOrderDetail(order_id) {
    let _this = this;
    App._get('user.order/detail', {
      order_id
    }, result => {
      _this.setData(result.data);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})