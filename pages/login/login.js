const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    getUser:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    _this.setData({
      options
    });
  },

  /**
   * 授权登录
   */
  getUserInfo(e) {
    let _this = this;
    console.log('1290'+JSON.stringify(e));
    wx.getUserInfo({
      complete: (res) => {
        console.log("1291"+JSON.stringify(res));
      },
    });
    this.setData({
      getUser:!this.data.getUser
    }) 
    App.getUserInfo2(e, () => {
      // 跳转回原页面
      _this.onNavigateBack(1);
    });
  },
  // // 获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log("phone"+JSON.stringify(e));
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success(res) {
          console.log('wx.login'+res)
          wx.setStorageSync('code', res.code);
          console.log(res);
          App._post_form('user/getDecryptData', {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            code: res.code,

          }, result => {
            // 记录token user_id
            var da = JSON.parse(result.data);
            console.log("获取用户信息1")
            let phone = da.phoneNumber;
            wx.getUserInfo({
              success: (ret) =>{
                console.log("获取用户信息2")
                console.log(ret);
                ret.mobile = phone;
                App.getUserInfo(ret, () => {
                  // 跳转回原页面
                  that.onNavigateBack(1);
                });
              },
              fail:(res)=>{
                console.log(res);
              }
              
            })
            // 执行回调函数
            // callback && callback();
          }, false, () => {
            wx.hideLoading();
          });
        }
      })
    }
  },

  // getPhoneNumber: function (e) {
  //   console.log("手机号iv");
  //   console.log(e.detail.iv)
  //   console.log("手机号encryptedData");
  //   console.log(e.detail.encryptedData)
  //   // var session_key = wx.getStorageSync('session_key');
  //   // console.log('session_key');
  //   // console.log(session_key);

  //   console.log("config appid");
  //   console.log(site.AppID);
  //   var that = this;

  //   wx.login({
  //     success: res => {
  //       console.log("手机号rescode");
  //       console.log(res.code);
  //       console.log(res);
  //       /**
  //        * 这里重新获取session_key 的请求放到后台去因为如果放在小程序中的话  还需要端口认证
  //        */
  //       // wx.request({
  //       //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxe1bd8e4045ad80ba&secret=9fbf669bb61ddfdd2d455eebe1d6fdf5&js_code='+res.code+'&grant_type=authorization_code',
  //       //   success:function(resc){
  //       //   console.log('哈哈哈哈')
  //       //   console.log(resc)

  //       wx.request({
  //         url: "http://broadcast.lcpxj.com/index.php?s=/api/user/getDecryptData",
  //         method: "POST",
  //         data: {
  //           data: e.detail.encryptedData,
  //           iv: e.detail.iv,
  //           code: res.code
  //         },
  //         success: function (res) {
  //           console.log("解密之后");
  //           console.log(res);
  //           console.log("返回手机号");
  //           console.log(res.data.data.data.phoneNumber);


  //           var timestamp = new Date().getTime()
  //           var data = {
  //             "timestamp": timestamp,
  //             "url": (checkphone + "").replace(config.baseUrl, ""),
  //             "user_id": userid,
  //             'phone': res.data.data.data.phoneNumber,
  //           }
  //           var sign = utils.makeSign(site.siteTokenKey, data)
  //           var phone = res.data.data.data.phoneNumber;
  //           if (res.data.data.flag == 1) {

  //             wx.request({
  //               url: "http://broadcast.lcpxj.com/index.php?s=/api/user/login",
  //               method: "POST",
  //               data: data,
  //               // header: {
  //               //   "Content-Type": "application/x-www-form-urlencoded",
  //               //   "sign": sign,
  //               //   'timestamp': timestamp
  //               // },
  //               success: function (res) {
  //                 console.log(res);
  //                 if (res.data.data.flag == 1) {
  //                   wx.navigateBack({
  //                     delta: 1
  //                   })
  //                 }
  //                 if (res.data.data.status == 0) {
  //                   wx.showToast({
  //                     title: '保存失败',
  //                     icon: 'none',
  //                     duration: 2000
  //                   })
  //                 }
  //               },
  //             })
  //           } else {
  //             wx.navigateBack({
  //               delta: 1
  //             })
  //           }
  //         }
  //       })

  //       // }
  //       // })



  //     }
  //   })

  // },

  /**
   * 暂不登录
   */
  onNotLogin() {
 
    let _this = this;
    // 跳转回原页面
    _this.onNavigateBack(_this.data.options.delta);
  },

  /**
   * 授权成功 跳转回原页面
   */
  onNavigateBack(delta) {
    wx.navigateBack({
      delta: Number(delta || 1)
    });
  },

})