const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isData: false,
    words: {},
    user: {},
    dealer: {},
    date: '2020-07',
    endDate:'2020-07',
    sum:0,
    isLoading: true,
    page: 1,
    no_more: false,
    // shouru:0,
    // zhichu:0,
    type:1,
    data:{},
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let myDate = new Date();
    let year= myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    let month= myDate.getMonth()+1 ;       //获取当前月份(0-11,0代表1月)
    month = month<10?'0'+month:month;
    this.setData({
      date: year+'-'+month,
      endDate: year+'-'+month
    });
    this.setSwiperHeight();
 
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取分销商中心数据
    _this.getDealerCenter();
    _this.getOrderList();
  },
  toback(){
    wx.navigateBack()
  },
  /**
   * 获取分销商中心数据
   */
  getDealerCenter() {
    let _this = this;
    App._get('user.dealer/center', {}, function(result) {
      let data = result.data;
      data.isData = true;
      // 设置当前页面标题
      wx.setNavigationBarTitle({
        title: data.words.index.title.value
      });
      _this.setData(data);
      console.log(data);
      if(data.dealer){

        _this.setData({
          
          sum: parseFloat(_this.data.dealer.money) + parseFloat(_this.data.dealer.freeze_money)
        })
      }
    });
  },

  /**
   * 跳转到提现页面
   */
  navigationToWithdraw() {
    wx.navigateTo({
      url: '../../dealer/withdraw/apply/apply',
    })
  },
/**
   * 获取订单列表
   */


  getFrozenList: function(isNextPage, page) {
    if(this.data.no_more)
    return;
    if(!isNextPage)
    this.setData({
      data:[]
    })
    this.setData({
      type:2
    })
  let _this = this;
  App._get('user.dealer.withdraw/getFrozenList', {
    // settled: _this.data.dataType,
    page: page || 1,
    time:_this.data.date
  }, function(result) {
   
    // 创建页面数据
    // _this.setData(_this.createData(result.data, isNextPage));
    let resList = result.data;
      let dataList = _this.data.list;
      console.log(result);

      if (isNextPage == true && (typeof dataList !== 'undefined')) {
        _this.setData({
          'list.data' : dataList.data.concat(resList.data)
        })
      }else{
        _this.setData({
        list:result.data,
        isLoading:false
        })
      }
  });
},
  getOrderList: function(isNextPage, page) {
    if(this.data.no_more)
    return;
   if(!isNextPage){
    this.setData({
      list:{}
    })
   }
    this.setData({
      type:1
    })
    let _this = this;
    App._get('user.dealer.withdraw/getOrderList', {
      // settled: _this.data.dataType,
      page: page || 1,
      time:_this.data.date
    }, function(result) {
  
      let resList = result.data;
      let dataList = _this.data.list;
      console.log(result);

      if (isNextPage == true && (typeof dataList !== 'undefined')) {
        _this.setData({
          'list.data' : dataList.data.concat(resList.data)
        })
      }else{
        _this.setData({
        list:result.data,
        isLoading:false
        })
      }

    });
  },
  
  /**
   * 创建页面数据
   */
  createData: function(data, isNextPage) {
    data['isLoading'] = false;
    // 列表数据
    let dataList = this.data.data;
    if (isNextPage == true && (typeof dataList !== 'undefined')) {
      data.list.data = dataList.data.concat(data.list.data)
    }
 
    return data;
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
   * 下拉到底加载数据
   */
  triggerDownLoad: function() {


    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    } else if(this.data.type==1){
      // 获取订单列表

      this.getOrderList(true, ++this.data.page);
    }else{
      this.getFrozenList(true, ++this.data.page);

    }

  },



  /**
   * 立即加入分销商
   */
  triggerApply(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../apply/apply',
    })
  },

})