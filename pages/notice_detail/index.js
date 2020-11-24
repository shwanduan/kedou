// pages/notice_detail/index.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("公告详情的e"+JSON.stringify(options))
      this.setData(options)
     
      App._post_form("user.balancelog/annont",{article_id:this.data.article_id},(res)=>{
           console.log("公告详情的e"+JSON.stringify(res));
           res.data.data.article_content =  res.data.data.article_content.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1');
           
            this.setData(
              res.data.data
            )
      });
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff6c20',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      });
      wx.setNavigationBarTitle({
        title: '公告详情'
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