const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {}, // 用户信息
    orderCount: {}, // 订单数量
    is_switch:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options:'+ JSON.stringify(options))
    var _this=this;
    App._get('user/isup', { 
    }, function (result) { 
      _this.setData({
        is_switch: result.is_switch,
      });
    });
  },
  showMessage(){
    wx.showModal({
      content:"申请中"
    })
  },
  toZhiBo(){
      var _this = this;
      App._get('live.room/getLiveStatus', {
      }, (result) => {
          if(result.data.live_status=="101"||result.data.live_status=="105"){
            wx.navigateTo({
              url: '../room/anchor?room_status=1&im_id='+result.data.room_id,
            })
          }else{
            wx.navigateTo({
              url: '../live/anchor',
            })
          }
      });
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    // 获取当前用户信息
    _this.getUserDetail();
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, (result) =>{
      _this.setData(result.data);
      // console.log('userinfo'+JSON.stringify(this.userInfo));
    _this.getIndexDetail();
    });
  },
  getIndexDetail(){
    let _this = this;
    App._get('user/getIndexDetail', {}, (result) =>{
      _this.setData(result.data);
      console.log(result);
    });
  
  },
  
  toUserInfor(){
    wx.navigateTo({
      url: "/pages/user/userInfor/userInfor",
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrderone(){
    wx.navigateTo({
      url: './Stockorder/Stockorder',
    })
  },
  onTargetOrder(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formid
    App.saveFormId(e.detail.formId);
    let urls = {
      all: '/pages/user/Stockorder/index?type=all',
      payment: '/pages/user/Stockorder/index?type=payment',
      received: '/pages/user/Stockorder/index?type=received',
      comment: '/pages/user/Stockorder/index?type=comment',
      refund: '/pages/user/Stockorder/refund/index',
    };
    // 转跳指定的页面
    wx.navigateTo({
      // url: urls[e.currentTarget.dataset.type]
      url:'../order/index'
    })
  },

  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },

  /**
   * 跳转我的钱包页面
   */
  onTargetWallet(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: './wallet/index'
    })
  },

  /**
   * 跳转积分明细页
   */
  onTargetPoints(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      // url: '../points/log/index'
      url:'../dealer/index/index'
    });
  },

  /**
   * 跳转到登录页
   */
  onLogin() {
    // wx.navigateTo({
    //   url: '../login/login',
    // });
    App.doLogin();
  },

  /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },
   /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    // 获取当前用户信息
    this.getUserDetail();
  wx.stopPullDownRefresh();
}

})