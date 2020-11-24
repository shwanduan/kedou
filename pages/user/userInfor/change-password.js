// pages/user/userInfor/changepassword.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newPass: '',
    conPass: '',
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
  inputChange(e) {

    if (e.currentTarget.dataset.name == "newPass") {
      this.setData({
        newPass: e.detail.value
      })
    } else if (e.currentTarget.dataset.name == "conPass") {
      this.setData({
        conPass: e.detail.value
      })
    }

  },
  toSubmit() {
    var _this = this;
    // 
    if (this.data.newPass !== this.data.conPass) {
      wx.showModal({
        content: '两次密码输入不一致，请重新填写',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            // wx.navigateBack({
            //   delta: 0,
            // })
            _this.setData({
              newPass: '',
              conPass: '',
            })
          }
        }
      })
    } else {
      App._post_form('order/editPayPassword', {
        pay_password: this.data.newPass
      }, result => {
        wx.showModal({
          content: '设置成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateBack({
                delta: 0,
              })
            }
          }
        })

      }, result => {}, () => {

      });
    }
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