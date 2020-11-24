// pages/user/oboutus/oboutus.js
import wxParse from '../../../wxParse/wxParse.js';

const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let _this = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff6c20',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    wx.setNavigationBarTitle({
      title: '关于我们',
    });
    App._post_form('user.Balancelog/aboutUser',{},(res)=>{
      // console.log("富文本"+JSON.stringify(res.data.data.article_content))
      this.setData(res.data.data)
      
      //  console.log(_this.contentFormat(res.data.data.article_content));
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

  },
 
})