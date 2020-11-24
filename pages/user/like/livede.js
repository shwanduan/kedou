// pages/user/like/livede.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     id:'',
     list:[],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log('222'+JSON.stringify(options));
        
        this.getdata(options.grade_id);
        wx.setNavigationBarColor({
          backgroundColor: '#ff6c20',
          frontColor: '#ffffff',
        });
        wx.setNavigationBarTitle({
          title: '我的团队',
        })
       
  },
   getdata(id){
    App._post_form('user.dealer.Team/teamInfo',{grade_id:id},(res)=>{
      console.log(res)
      this.setData({
      
        list:res.data.user
      })
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