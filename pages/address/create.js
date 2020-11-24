let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
    disabled: false,
    nav_select: false, // 快捷导航

    name: '',
    region: '',
    phone: '',
    detail: '',

    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fd7028',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

  },

  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
      values = e.detail.value
    values.region = this.data.region;

    // 记录formId
    App.saveFormId(e.detail.formId);

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 提交到后端
    App._post_form('address/add', values, function(result) {
      App.showSuccess(result.msg, function() {
        wx.navigateBack();
      });
    }, false, function() {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    // if (values.phone.length !== 11) {
    //   this.data.error = '手机号长度有误';
    //   return false;
    // }
    let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (!this.data.region) {
      this.data.error = '省市区不能空';
      return false;
    }
    if (values.detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 修改地区
   */
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 获取微信地址
   */
  chooseAddress: function() {
    let _this = this;
    // wx.getLocation({
    //   type: 'wgs84',
    //    success(res){
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //      console.log("地图"+JSON.stringify(res))
    //      wx.chooseLocation( {
    //       latitude:latitude,
    //       longitude:longitude,
    //       success: function(res) {
    //         console.log("微信地址"+JSON.stringify(res))
    //         _this.setData({
    //           name: res.userName,
    //           phone: res.telNumber,
    //           region: [res.provinceName, res.cityName, res.countyName],
    //           detail: res.detailInfo
    //         });
    //       }
    //     })
    //    }
    // })
    wx.chooseAddress({
      
      success: (result) => {
        console.log('一键获取微信地址'+JSON.stringify(result))
         this.setData({
             name:result.userName,
             phone:result.telNumber,
             detail:result.detailInfo,
             region: [result.provinceName, result.cityName, result.countyName],


         })
      },
    })
   
  }

})


// wx.getLocation({
      
//   type: 'wgs84',
//   success(res) {
//     const latitude = res.latitude
//     const longitude = res.longitude
//     const speed = res.speed
//     const accuracy = res.accuracy
//     console.log(res);
//     wx.chooseLocation({
//       latitude: latitude,
//       longitude: longitude,
//       success(ret){
//         _this.bindDetails(ret.address);
//       }
//     })
//   }
// });