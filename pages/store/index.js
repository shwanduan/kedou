// pages/store/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleList:[
      {title:  "精选"},
      {title:  "商品"},
      {title:  "活动"},
      {title:  "上新"},
      {title:  "动态"},
    ],
    curNav:0,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  select(e){
    console.log(e);
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