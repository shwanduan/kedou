// pages/apply/select.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    type:'0',
    liveMessage:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
   this.setData({
     type:options.type
   })
    console.log(this.data.type);
    console.log(this.data.options.type);
    var title;
    options.type == 1 ? title = "主播申请" : title = "商户申请";
    wx.setNavigationBarTitle({
      title: title
    });
    this.getLiveMessage(options.type);
  },

 getLiveMessage(type){
   let _this = this;
   var url;
   type == 1 ? url = 'live.room/getLiveMessage':url = 'merchant.merchant/getLiveMessage';
  
        // 获取商户须知
      App._get(url, {}, (result) => {
        _this.setData({
          liveMessage: result.data,
        });
      });
    


 },
  navToApply(e){
    // console.log(e);
    // console.log(e.currentTarget.dataset.type);
    // 1平台主播 2商户主播 3 个人商户 4企业商户
    wx.navigateTo({
      url: './apply?type=' + e.currentTarget.dataset.type,
    })
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