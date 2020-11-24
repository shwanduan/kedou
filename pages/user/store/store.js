// pages/user/store/store.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    orderCount2:{
      all:0,
      cancel:0,
      complete:0,
      delivery:0,
      pay:0,
    }, //订单数量
    order_total_price:{}, //销售额
    list:[],
    order_total_price:{}, //销售额
    status:10 , //10上架 20下架
    checkList:[],
    checkAll:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoreOrder();
    this.getOderList();
    this.getList();
  },


  selectType(e){
    // console.log();
    this.setData({
      status:e.currentTarget.dataset.status,
    });
    if(e.currentTarget.dataset.status==40){
      this.errorGoods();
    }else{
      this.getOderList();
    }

  },
  // 获取售完列表
  errorGoods(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    App._post_form('order/errorGoods', {
      // status:_this.data.status
    }, function(result) {
      wx.hideLoading({
        
      })
      // console.log(result);
      // App.showSuccess(result.msg);
      let list =result.data.list.data;
      for(var i = 0; i<list.length;i++){
        let sumSale  = 0;
       
        list[i].sku.forEach(item => {
          sumSale+= item.stock_num;
        });
        // console.log(sumSale);
        list[i].stock_num=sumSale;
        list[i].check = false;

      }
      _this.setData({
       list: list,
       checkList:[],
       checkAll:false
      });
    });
  },
  // 全选
  CheckAllItem(){
    var list = this.data.list;
    var checkList = [];
    if(this.data.checkAll == false){
      console.log("2222");
      for(var i in list){
        list[i].check = true;
        checkList.push(list[i].goods_id);
      }
    
    }else{
      console.log("33333");
      for(var i in list){
        list[i].check = false;
        checkList=[];

      }
    }

    this.setData({
      list:list,
      checkList:checkList,
      checkAll:!this.data.checkAll,
      
    })
  },
  selectItem(e){
    console.log(e);
    let checkList = this.data.checkList,
    list= this.data.list;
    if(e.currentTarget.dataset.check==false){
      checkList.push(e.currentTarget.dataset.id);
      console.log(list[e.currentTarget.dataset.index]);
      list[e.currentTarget.dataset.index].check=true;
      
    }else{
      for(let k in checkList){
        if(checkList[k] ==e.currentTarget.dataset.id ){
          checkList.splice(e.currentTarget.dataset.index,1);
        }
      }
      list[e.currentTarget.dataset.index].check=false;
      
    }
    this.setData({
      list:list,
      checkList:checkList,
      checkAll:list.length==checkList.length
    })
      
    // console.log();
    // this.setData({
    // })
  },
  //10 上家  20 xia
  storeState(e){
  
    var _this = this;
    App._post_form('order/state', {
      state:  e.currentTarget.dataset.state,
      goods_id:this.data.checkList
    }, function(result) {
      if(result.code==1){

        App.showSuccess(result.data);
        _this.getOderList();
      }
    });
 
  },
  storeDelt(){
    var _this = this;
    App._post_form('order/delete', {
    
      goods_id:this.data.checkList
    }, function(result) {
      if(result.code==1){

        App.showSuccess(result.data);
        _this.getOderList();
      }
    });
  },
  getList(){
    var _this = this;
    App._post_form('order/getList', {
    
      dataType:'all'
    }, function(result) {
      if(result.code==1){

        // App.showSuccess(result.data);
        // _this.getOderList();
      }
    });
  },
   /**
   * 获取当前商店销量
   */
  getStoreOrder() {
    let _this = this;
    App._get('Order/getStoreOrder', {}, function(result) {
      console.log(result.data.widget_outline);
      
      _this.setData({
        order_total_price:result.data.widget_outline,
        'orderCount2.all':result.data.all,
        'orderCount2.cancel':result.data.cancel,
        'orderCount2.complete':result.data.complete,
        'orderCount2.delivery':result.data.delivery,
        'orderCount2.pay':result.data.pay,
      })
    });
  },
  // 获取上品列表
  getOderList(){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    App._post_form('order/index', {
      status:_this.data.status
    }, function(result) {
      wx.hideLoading({
        
      })
      // console.log(result);
      // App.showSuccess(result.msg);
      let list =result.data.list.data;
      for(var i = 0; i<list.length;i++){
        let sumSale  = 0;
       
        list[i].sku.forEach(item => {
          sumSale+= item.stock_num;
        });
        // console.log(sumSale);
        list[i].stock_num=sumSale;
        list[i].check = false;

      }
      _this.setData({
       list: list,
       checkList:[],
       checkAll:false
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
 // 获取当前用户信息
 this.getUserDetail();
  },
 /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, (result) =>{
      _this.setData(result.data);
      console.log(result);
   
    });
  },
  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    let _this = this;
    
    // 转跳指定的页面
    wx.navigateTo({
      url: "../../order/store?type="+e.currentTarget.dataset.type
    })
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