// pages/live/anchor.js
let keys = 'TSTBZ-X4TWX-3Q54N-72YIV-GSJVF-E6F2Z';
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    room_id: "", //房间号
    inputValue: "", //房间名
    city: '',
    index: 0,
    index2: 0,
    category_id: '',
    titleList: [],
    modeList: [{
    id:'1',
    title: '标清',
    mode: 'SD',
    }, {
      id:'2',
      title: '高清',
      mode: 'HD',
    }, {
      id:'3',
      title: '超清',
      mode: 'FHD',
    }],
    is_switch: 0,
    room_name: '',
    mode:'SD',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getLiveStatusr();
    this.getCity();
    this.getroomcategory();
    App._get('user/isup', {}, (result) => {
      this.setData({
        is_switch: result.is_switch,
      });
    });
  },
  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value,
      category_id: this.data.titleList[e.detail.value].id
    })
  },
  bindPickerChange2: function (e) {

    this.setData({
      index2: e.detail.value,
      mode: this.data.modeList[e.detail.value].mode
    })
  },
  getroomcategory() {
    let _this = this;
    App._get('live.room/getroomcategory', {

    }, result => {
      // console.log(result.data);
      //  result.data.splice(0, 2);
      // console.log(resList);
      _this.setData({
        titleList: result.data,
        category_id: result.data[0].id
      })

    });
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    let url = `/pages/room/index?room_status=1&im_id=` + this.data.room_id;
    console.log(url);
    return {
      title: "12123132",
      path: url,
      imageUrl: ""
    };
  },
  // 获取地址
  // 
  getCity() {
    let _this = this;
    wx.getLocation({
      // altitude: 'altitude',
      type: 'wgs84',
      success(res) {
        console.log(res);
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
        console.log(res.data.result)

        // // 省
        // let province = res.data.result.address_component.province;
        // // 市
        // let city = res.data.result.address_component.city;
        // // 区
        // let district = res.data.result.address_component.district;

        _page.setData({
          city: res.data.result.address_component.city,
          //   region: [province,city,district]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 创见聊天室
  addavchatroom() {
    let _this = this;
    App._post_form('live.room/addavchatroom', {
      title: this.data.room_name,
      room_id: _this.data.room_id,
      city: _this.data.city,
      category_id: _this.data.category_id,

    }, function (result) {

      if (result.code == 1)
        wx.navigateTo({
          url: '../room/anchor?room_status=1&im_id=' + _this.data.room_id+ `&mode=`+_this.data.mode,
        })
      // App.showSuccess(result.msg);

    });
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getLiveStatusr() {
    var _this = this;
    App._get('live.room/getLiveStatus', {

    }, (result) => {
      console.log(result);
      _this.setData({
        room_id: result.data.room_id,
        room_name: result.data.room_name
      });
      if (result.data.live_status == "101" || result.data.live_status == "105") {
        wx.navigateTo({
          url: '../room/anchor?room_status=1&im_id=' + result.data.room_id,
        })
      }
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


})