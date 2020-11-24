// pages/live/list.js
const App = getApp();
let keys = 'TSTBZ-X4TWX-3Q54N-72YIV-GSJVF-E6F2Z';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNav: 1, //类型选择
    cardCur: 0, //轮播
    swiperList: [],
    list: [],
    isLoading: false,
    isLastPage: false,
    titleList: [],
    page: 0,
    isLogin: false,
    likeList: [],
    city: '',
    is_switch: 0,
    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("加载")
    this.getroomcategory();
    this.getCity();
    App._get('user/isup', {}, (result) => {
      this.setData({
        is_switch: result.is_switch,
      });
    });
  },
  cardSwiper(e) {
    console.log(e);
    this.setData({
      cardCur: e.detail.current
    })
  },
  // 获取地址
  // 
  getCity() {
    let _this = this;
    wx.getLocation({
      // altitude: 'altitude',
      type: 'wgs84',
      success(res) {
        _this.getDistrict(res.latitude, res.longitude)
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
        // console.log(res.data.result);
        _page.setData({
          city: res.data.result.address_component.city,
          //   region: [province,city,district]
        })
      }
    })
  },
  guanzhu() {

    this.setData({
      curNav: 0,
      list:[]
    })
    this.getLike();
  },
  jingxuan() {
  
    this.setData({
      curNav: 1,
      list:[]
    })
    App._get('live.room/getJingRoom', {}, result => {
     let  swiperList = result.data.jing;
     let resList = result.data.list;  
      this.setData({
        list: resList,
        swiperList: swiperList ? swiperList : []
      });
    });
  },
  tongcheng() {

    this.setData({
      curNav: 2,
      list:[] 
    })
    App._get('live.room/getCityRoom', {
      city:this.data.city
    }, result => {
      let resList = result.data;
      this.setData({
        list: resList,
      });
    });
  },
  // 获取关注列表
  getLike() {
    this.setData({
      list:[]
    });
    console.log("关注 ");
    App._get('live.room/likelist', {

    }, result => {
      this.setData({
        likeList: result.data
      });
    });
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
    this.setData({
      isLogin: App.checkIsLogin()
    });
    if (this.data.isLogin) {
      // console.log(11111111);  
      // 获取列表
      switch (this.data.curNav) {
        case "0":
          this.guanzhu();
          break;
        case "1":
          this.jingxuan();
          break;
        case "2":
          this.tongcheng();
          break;
        default:
          this.getLiveRoomList();
          break;
      }

    } else {
      App.doLogin();
    }
  },
  /**
   * 获取直播间列表
   */
  getLiveRoomList(isPage, page) {
    let _this = this;
    App._get('live.room/roomList', {
      page: page || 1
    }, result => {
      let resList = result.data.list,
        dataList = _this.data.list;
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
          isLastPage: false,
        });
      }
      // 刷新直播间状态 (体验不佳, 暂不使用)
      // _this.setLiveStatusText(resList);
    });
  },

  getroomcategory() {
    let _this = this;
    App._get('live.room/getroomcategory', {

    }, result => {
      let resList = result.data;
      this.setData({
        titleList: resList,
        page: 0,
      }, () => {
        // this.getroomcategorylist(0, this.data.titleList[0].id);
        this.jingxuan();
      })
      console.log("title", this.data.titleList[0].id);

      // console.log(result);
      // 刷新直播间状态 (体验不佳, 暂不使用)
      // _this.setLiveStatusText(resList);
    });
  },

  select(e) {
    console.log(e);
    this.setData({
      curNav: e.currentTarget.dataset.item.id
    })

    this.getroomcategorylist(0, e.currentTarget.dataset.item.id);

  },
  getroomcategorylist(page, id) {
    let _this = this;

    App._get('live.room/getroomcategorylist', {
      category_id: id,
      page: page,

    }, result => {
      let resList = result.data;
        
      this.setData({
        list: resList
       
      })
      // console.log(result);
      console.log(result.data);
      // 刷新直播间状态 (体验不佳, 暂不使用)
      // _this.setLiveStatusText(resList);
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

  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
     switch (this.data.curNav) {
        case "0":
          this.guanzhu();
          break;
        case "1":
          this.jingxuan();
          break;
        case "2":
          this.tongcheng();
          break;
        default:
          this.getLiveRoomList();
          break;
      }
    wx.stopPullDownRefresh();
  }
})