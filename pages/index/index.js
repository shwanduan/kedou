const App = getApp();
let keys = 'TSTBZ-X4TWX-3Q54N-72YIV-GSJVF-E6F2Z';
Page({
  
  data: {
    // 页面参数
    options: {},
    // 页面元素
    items: {},
    scrollTop: 0,
    district: ''
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
    let socketOpen = false;
    let socketMsgQueue = ["welcome to 济南"];
    // wx.connectSocket({
    //   url: 'ws://120.221.189.188:9501'
    // })

    // wx.onSocketOpen(function (res) {
    //   socketOpen = true
    //   for (let i = 0; i < socketMsgQueue.length; i++) {
    //     sendSocketMessage(socketMsgQueue[i])
    //   }
    //   socketMsgQueue = [];
    // })
    // wx.onSocketMessage(function (res) {
    //   console.log('收到服务器内容：' + JSON.stringify(res))
    // })
    // function sendSocketMessage(msg) {
    //   if (socketOpen) {
    //     wx.sendSocketMessage({
    //       data: msg
    //     })
    //   } else {
    //     socketMsgQueue.push(msg)
    //   }
    // }

    // wx.connectSocket({
    //   url: 'ws://120.221.189.188:9501',
    //   // header:{
    //   //   'content-type': 'application/json'
    //   // },
    //   // protocols: ['protocol1']
    //   success:()=>{
    //     console.log("打开链接");

    
    //   },
    //   fail:(err)=>{
    //     console.log("失败",err);
    //   },
    //   complete:()=>{
    //     console.log();
    //   }

    // })
  },
  // 获取地址
  // 
  getCity() {
    let _this = this;
    wx.getLocation({
      // altitude: 'altitude',
      type: 'wgs84',
      success(res) {
        console.log("这是地址"+JSON.stringify(res))
        _this.getDistrict(res.latitude, res.longitude)
      },
      fail(res){
        console.log("失败的原因"+JSON.stringify(res))
      }
    })
  },
  getDistrict(latitude, longitude) {
    let _page = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${keys}`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("地址"+JSON.stringify(res.data.result))

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
      page_id: _this.data.options.page_id || 0
    }, function (result) {
      // 设置顶部导航栏栏
      console.log('111' + result)
      _this.setPageBar(result.data.page);
      _this.setData(result.data);
      // 回调函数
      typeof callback === 'function' && callback();
    });
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