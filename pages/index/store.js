const App = getApp();
let keys = 'TSTBZ-X4TWX-3Q54N-72YIV-GSJVF-E6F2Z';
Page({

  data: {
    // 页面参数
    options: {},
    // 页面元素
    items: {},
    scrollTop: 0,
    district:'',
    status:0,
    storeInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.setData({
      options
    });
    // 加载页面数据
    this.getPageData();
    this.getCity();
    this.getStoreUser();
    this.getStoreInfo();
  },
  // 获取地址
  // 
  getCity() {
    let   _this = this;
    wx.getLocation({
      // altitude: 'altitude',
      type: 'wgs84',
      success(res) {
        _this.getDistrict(res.latitude, res.longitude)
      }
    })
  },
  getDistrict(latitude, longitude) {
  let  _page = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.result)
         
        // // 省
        // let province = res.data.result.address_component.province;
        // // 市
        // let city = res.data.result.address_component.city;
        // // 区
        // let district = res.data.result.address_component.district;
     
        _page.setData({
          district: res.data.result.address_component.district,
        //   region: [province,city,district]
        })
      }
    })
  },
  /**
   * 加载页面数据
   */
  getPageData: function (callback) {
    let _this = this;
    App._get('page/index', {
      store_id: _this.data.options.store_id ,
    }, function (result) {
      // 设置顶部导航栏栏
      _this.setPageBar(result.data.page);
      _this.setData(result.data);
      // 回调函数
      typeof callback === 'function' && callback();
    });
  },
//  获取收藏店铺
getStoreUser(){
  let _this = this;
  App._post_form('user/getStoreUser', {
    store_id: _this.data.options.store_id,
  }, (result) => {
   this.setData({
    status: result.data.status
   })
  });

 },
 
 //  获取收藏店铺
 getStoreInfo(){
  let _this = this;
  App._post_form('store/getStoreInfo', {
    store_user_id: _this.data.options.store_id,
  }, (result) => {
   this.setData({
    storeInfo: result.data
   })
  });

 },
//  添加收藏店铺
addStore(){
  let _this = this;
  App._post_form('user/addStoreUser', {
    store_id: _this.data.options.store_id,
  }, (result) => {
    App.showSuccess(result.msg);
    this.setData({
      status: 1
     })
  });
 },

 //  添加收藏店铺
 deleteStoreUser(){
  let _this = this;
  App._post_form('user/deleteStoreUser', {
    store_id: _this.data.options.store_id,
  }, (result) => {
    this.setData({
      status:0
     })
  });
 },
 toBack(){
   wx.navigateBack({});
 },
 
  /**
   * 设置顶部导航栏
   */
  setPageBar: function (page) {
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: page.params.title
    });
    // 设置navbar标题、颜色
    wx.setNavigationBarColor({
      frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
      backgroundColor: page.style.titleBackgroundColor
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    return {
      title: _this.data.page.params.share_title,
      path: "/pages/index/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    // 获取首页数据
    this.getPageData(function () {
      wx.stopPullDownRefresh();
    });
  }

  // /**
  //  * 返回顶部
  //  */
  // goTop: function(t) {
  //   this.setData({
  //     scrollTop: 0
  //   });
  // },

  // scroll: function(t) {
  //   this.setData({
  //     indexSearch: t.detail.scrollTop
  //   }), t.detail.scrollTop > 300 ? this.setData({
  //     floorstatus: !0
  //   }) : this.setData({
  //     floorstatus: !1
  //   });
  // },

});