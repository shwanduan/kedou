// pages/search/result.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlists:[],
    roomlists:[],
    GoodsList:[],
    recommendList:[],
    userlistsCount:0,
    roomlistsCount:0,
    GoodsListCount:0,
    search:'',
    is_switch:0,
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    App._get('user/isup', { 
    }, (result)=> { 
      this.setData({
        is_switch: result.is_switch,
      });
    });
  
    this.setData({
      search:options.search
    })
    this.getuserlists();
    this.getroomlists();
    this.getGoodsList();
    this.getrecommend();
  },
  cleanList(){
    this.setData({
      userlists:[],
      roomlists:[],
      GoodsList:[],
      userlistsCount:0,
      roomlistsCount:0,
      GoodsListCount:0,
    })
  },
  selectType(e){ 
   let type =  e.currentTarget.dataset.type;
   this.cleanList();
    if(type==3){
      wx.navigateTo({
       url:'../category/list?search=' +this.data.search
      });
    }else if(type==2){
      this.getroomlists();
    }else if(type==1){
      this.getuserlists();
    }else if(type==0){
      this.getuserlists();
      this.getroomlists();
      this.getGoodsList();
    }
    this.setData({
      type:type
    })
  },
  toBack(){
    wx.navigateBack({
      delta: 0,
    })
  },
  getrecommend(){
    let _this = this;
    App._get('goods/getrecommend', {
      
    }, (result) => {
      // 初始化商品详情数据
      // let data = _this._initGoodsDetailData(result.data);
      // _this.setData(data);
      _this.setData({
        recommendList: result.data.data
      })
    });
  },
  // 
  getroomlists(){
    let _this = this;
    App._get('goods/getroomlists', {
      page:1,
      search:_this.data.search,
   }, function (result) {
    let resList = result.data.list;
    _this.setData({
      roomlists: resList,
      roomlistsCount:result.data.count,
    });
     console.log("直播间",result.data.list);
      // _this.setData(result.data);
   
   });
  },
  getuserlists(){
    let _this = this;
    App._get('goods/getuserlists', {
      page:1,
      search:_this.data.search,
   }, function (result) {
    console.log("主播",result);
    let resList = result.data.list;
    _this.setData({
      userlists: resList,
      userlistsCount: result.data.count,
    });
      // _this.setData(result.data);
   
   });
  },

   /**
   * 获取商品列表
   * @param {bool} isPage 是否分页
   * @param {number} page 指定的页码
   */
  getGoodsList(isPage, page) {
    let _this = this;
    App._get('goods/lists', {
      page:  1,
     
      search:_this.data.search,
    }, result => {
      let resList = result.data.list.data;
        _this.setData({
          GoodsList: resList,
          GoodsListCount:result.data.list.total
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

  }
})