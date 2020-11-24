// pages/user/rule/rule.js
let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取帮助列表
    this.getHelpList();
  },

  /**
   * 获取帮助列表
   */
  getHelpList: function () {
    let _this = this;
    App._get('Message/lists', {}, function (result) {
      _this.setData(result.data);
    });
   //  this.select
  },
  clickTitle(e){

     let index = e.currentTarget.dataset.select,
     list = this.data.list;
     if(list[index].selected){

       list[index].selected = false;
     }else{

       list[index].selected = true;
     }
     this.setData({
       list:list
     })
  }
})