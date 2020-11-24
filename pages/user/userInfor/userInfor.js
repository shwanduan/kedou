// pages/user/userInfo/userInfor.js
const App = getApp();
import siteinfo from '../../../siteinfo.js';
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
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff6c20',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  selectHead:function(){

  },
  selectHead:function(e){
    let that =this;
    // let cardType = e.currentTarget.dataset.type;
    var url = siteinfo.siteroot + 'index.php?s=/api/upload/image';
    console.log(url);
    let params = {
      wxapp_id: App.getWxappId(),
      token: wx.getStorageSync('token')
    };
    wx.chooseImage({
      success(res) {
        console.log('选择图片的路径'+JSON.stringify(res))
        const tempFilePaths = res.tempFilePaths;
        console.log("111"+tempFilePaths);
        wx.showLoading({
          title: '上传中',
        });
        
        wx.uploadFile({
          url: url, 
          filePath: tempFilePaths[0],
          // header: { "Content-Type": "multipart/form-data" },
          name: 'iFile',
          // name: 'file',
          formData: params,
          success(res) {
            wx.hideLoading();
            console.log(res);
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
            let imgUrl = result.data.file_path;
            console.log(imgUrl);
            //do something
    App._post_form('user/editUser',{
      avatarUrl:imgUrl
    }
  , result => {
   console.log(result);
  //  if(result.code==1){
    // wx.showModal({
    //   title: '友情提示',
    //   content: result.msg,
    //   showCancel: false,
    //   success(res) {
    //     that.getUserDetail(); 
    //   }
    // });
  //  }
  });
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  // 获取当前用户信息
  this.getUserDetail();
  },
 /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, (result) =>{
      _this.setData(result.data);
      console.log(result);
   
    });
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