// pages/user/userInfor/change-phone.js
var App= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '',
    code:'',
    sended:false,
    sendNum:60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  inputChange(e){
    if(e.currentTarget.dataset.type=="phone"){
      this.setData({
        phoneNum:e.detail.value
      })
    }else if(e.currentTarget.dataset.type=="code"){
      this.setData({
        code:e.detail.value
      })
    }
  },
  sendCode(){
    var _this = this;
    App._get('Sms/getcode', {
      mobile:this.data.phoneNum,
     
    }, function (result) {
      let times = setInterval(function() {
        if (that.data.sendNum > 0) {
          _this.setData({
            sendNum: _this.data.sendNum-1
          })
          // that.btntxt = '重新获取('+ that.time +'s)'
        } else {
          clearInterval(times);
          _this.setData({
            sendNum:60,
            sended:false
          })
        }
      }, 1000);
   
    });
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