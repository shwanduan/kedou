
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    date: '2020-07',
    endDate: '2020-07',
    sum:0,
    isLoading: true,
    page: 1,
    no_more: false,
    shouru:0,
    zhichu:0,
    is_switch:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let myDate = new Date();
    let year= myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    let month= myDate.getMonth()+1 ;       //获取当前月份(0-11,0代表1月)
    month = month<10?'0'+month:month;
    let _this =this;
    this.setData({
      date: year+'-'+month,
      endDate: year+'-'+month
    });
    this.setSwiperHeight();
    App._get('user/isup', { 
    }, function (result) { 
      _this.setData({
        is_switch: result.is_switch,
      });
    });
  },
  
  /**
   * 设置swiper的高度
   */
  setSwiperHeight: function() {
    // 获取系统信息(拿到屏幕宽度)
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * 82), // tap高度
      swiperHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    this.setData({
      swiperHeight
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取我的钱包
    _this.getUserDetail();

    _this.getRechargeLog();
  },
  
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
/**
   * 获取账单详情列表
   */
  getRechargeLog(isPage, page) {
    let _this = this;
    App._get('balance.log/lists', {
      page: page || 1,
      time:_this.data.date
    }, function(result) {
      let resList = result.data.list.list,
        dataList = _this.data.list;
        _this.setData({
          shouru:result.data.list.shouru,
          zhichu:result.data.list.zhichu
        })
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    let _this = this;
    // 已经是最后一页
    if (_this.data.page >= _this.data.list.last_page) {
      _this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    _this.getRechargeLog(true, ++_this.data.page);
  },

  /**
   * 获取我的钱包
   */
  getUserDetail: function() {
    let _this = this;
    App._get('user.wallet/index', {}, function(result) {
      _this.setData(result.data);
    });
  },
   /**
   * 跳转到提现页面
   */
  navigationToWithdraw() {
    wx.navigateTo({
      url: '../../dealer/withdraw/apply/apply?type=1',
    })
  },
  toback(){
    wx.navigateBack()
  },
  /**
   * 跳转充值页面
   */
  onTargetRecharge(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../recharge/index'
    })
  },

  /**
   * 跳转充值记录页面
   */
  onTargetRechargeOrder(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../recharge/order/index'
    })
  },

  /**
   * 跳转账单详情页面
   */
  onTargetBalanceLog(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../wallet/balance/log'
    })
  },

})