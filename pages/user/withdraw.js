// pages/user/withdraw.js

const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:'',
     card:'',
     name:'',
     userinfo:'',
     bankinfo:'',
     show:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  App._post_form('user.Balancelog/blankCardList',{},(res)=>{
    console.log(res)
    this.setData({
       list:res.data.data
    })
    console.log('1111'+JSON.stringify(this.data.list))
    
    if(JSON.stringify(this.data.list) == "{}"){
        this.setData({
          show:false
        })
   }else {
        this.setData({
          show:true
        })
   }  
  });

   
wx.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#ff6c20',
  animation: {
    duration: 400,
    timingFunc: 'easeIn'
  }
});
wx.setNavigationBarTitle({
  title: '提现账号',
})
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

  },
  //  卡号
  cardfuck: function (e) {
    console.log(e)
    this.setData({
      card: e.detail.value
    })
  },
  // 银行名称
  namefuck: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  // 持卡人信息
  userfuck: function (e) {
    console.log(e)
    this.setData({
      userinfo: e.detail.value
    })
  },
  // 银行信息
  bankinfofuck: function (e) {
    console.log(e)
    this.setData({
      bankinfo: e.detail.value
    })
  },
  add(){
     if(this.data.card == '' || this.data.card.length == 0){
        console.log('银行卡号不能为空');
        return ;
     } else if(this.data.name == '' || this.data.name.length == 0){
         console.log('银行名称不能为空');
         return 
     }else if(this.data.userinfo == '' || this.data.userinfo.length ==0){
       console.log('持卡人信息蹦年为空');
       return 
     } else if(this.data.bankinfo == '' ||this.data.bankinfo.length == 0) {
        console.log('开户行信息不能为空，请重新检查')
        return 
     }
     var _this = this
     console.log(_this.data.card)
     App._post_form('user.Balancelog/blankCardAdd',{balance_code:this.data.card,balance_user:this.data.userinfo,balance_name:this.data.name,balance_detail:this.data.bankinfo},(res)=>{
       console.log(res)
       if(res.code == 1){
        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          success(){
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/user/index',
              })
            }, 20000);
          
          }
        })
       }
      
        
        
       
     })
  }
})