// pages/apply/merchant/index.js
let App = getApp();
// 富文本插件
const wxParse = require("../../wxParse/wxParse.js");

// 工具类
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    content: "",
    checked:false,
    article_content:"",
    is_switch:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) { 
    // 当前页面参数
    this.setData({
      options: options,
      isLogin: App.checkIsLogin()
    });
    App._get('user/isup', { 
    }, (result)=> { 
      this.setData({
        is_switch: result.is_switch,
      });
    });
    var title;
    options.type == 1 ? title = "主播申请" : title = "商户申请";
    wx.setNavigationBarTitle({
      title: title
    })
    if( options.type == 1){
      this. getXieYi(1);
      this. getXieYi(2);
    }else{
      this. getXieYi(4);
    }

  },
 
  getXieYi(type) {
    
    console.log();
    let _this = this;
    var url = 'wxapp.agreement/detail'

    // 获取商户须知
    App._get(url, {
      id: type
    }, (result) => {
      _this.setData({
        
        article_content: this.data.article_content+result.data.content
        // storeUser: result.data,
        // admin_id:result.data[0].store_user_id
      });
      // if ( result.data.content.length > 0) {
      // wxParse.wxParse('content', 'html', result.data.content, _this, 0);
      // }
    });

  },
 
  checkboxChange(e){
    this.setData({
      checked:!this.data.checked
    })
  },
  toApply: function () {
    if(!this.data.checked)
      wx.showModal({
        content: '请阅读并同意协议',
      })
    else
    wx.navigateTo({
      url: './select?type=' + this.options.type,
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