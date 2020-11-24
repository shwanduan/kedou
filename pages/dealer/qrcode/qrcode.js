const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRegisterCode();
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff6c20',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    console.log("这是options的数据"+JSON.stringify(options))
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取推广二维码
    this.getPoster();

  },
  getRegisterCode(){
    App._get('user.index/detail', {}, (result) =>{
      this.setData({
        registerCode: result.data.userInfo.RegisterCode
        
      })
    });
  },
   /**
   * 用户点击右上角分享
   */
 onShareAppMessage() {
    let _this = this;
     /**
   * 获取当前用户信息
   */
  let referee_id = App.getUserId();

  var url ="/pages/index/index?referee_id="+referee_id+"&register_code=" +_this.data.registerCode;
  // console.log(url);
    return {
      // title:_this.data.detail.goods_name,
      path: url
    };
  },
/**
   * 保存海报图片
   */
  onSavePoster() {
    let _this = this;
    // 记录formId
  
    wx.showLoading({
      title: '下载中',
    });
    // 下载海报图片
    wx.downloadFile({
      url: _this.data.qrcode,
      success(res) {
        wx.hideLoading();
        
        // 图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
            // 关闭商品海报
            
          },
          fail(err) {
            console.log(err.errMsg);
            if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
              wx.showToast({
                title: "请允许访问相册后重试",
                icon: "none",
                duration: 1000
              });
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/dealer/qrcode/getpower',
                })
                // wx.openSetting({
                //   success(res){
                //     console.log("1111"+JSON.stringify(res))
                //   },
                //   fail(res){
                //     console.log("失败"+JSON.stringify(res))
                //     if(res.errMsg === "openSetting:fail can only be invoked by user TAP gesture."){
                    
                //     }
                //   },
                //   complete(res){
                //     console.log("1111dont know"+JSON.stringify(res))
                //   }
                // });
              }, 1000);
            }
          },
          complete(res) {
            console.log('complete');
            // wx.hideLoading();
          }
        })
      }
    })
  },



  /**
   * 获取推广二维码
   */
  getPoster: function() {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    App._get('user.dealer.qrcode/poster', {}, function(result) {
      console.log('二维码'+JSON.stringify(result))
      // 设置当前页面标题
      wx.setNavigationBarTitle({
        title: result.data.words.qrcode.title.value
      })
      _this.setData(result.data);
    }, null, function() {
      wx.hideLoading();
    });
  },

  previewImage: function() {
    wx.previewImage({
      current: this.data.qrcode,
      urls: [this.data.qrcode]
    })
  },

})