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
    App._get('Platform/help', {}, function (result) {
      _this.setData(result.data);
    });
   //  this.select
  },
  clickTitle(e){

     let id = e.currentTarget.dataset.select;
     wx.navigateTo({
       url: './detail?id='+id,
     });
    //  list = this.data.list;
    //  if(list[index].selected){

    //    list[index].selected = false;
    //  }else{

    //    list[index].selected = true;
    //  }
    //  this.setData({
    //    list:list
    //  })
  }
})