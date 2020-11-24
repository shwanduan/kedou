// pages/user/like/live.js
const App = getApp();
Page({
data:{
    list:[]
},
onLoad:function(options){
    App._get('user.dealer.Team/teamList',{},(res)=>{
      console.log(res)
      this.setData({
        list:res.data.team
      })
    });
    wx.setNavigationBarTitle({
      title: '我的团队'
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff6c20',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
},
goDetail(e){
  console.log('1111'+JSON.stringify(e))
  wx.navigateTo({
    url: './livede?grade_id='+e.currentTarget.dataset.id,
  })
},

  /**
   * 页面的初始数据
   */
  // data: {
  //   list:[],
  //   titleList:[{
  //     type:0,
  //     title:"全部"
  //   },{
  //     type:1,
  //     title:"正在直播"
  //   },{
  //     type:2,
  //     title:"最近关注"
  //   }
  //   ],
  //   selectType:0,
  //   is_switch:0,
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   this.likelist();
  //   App._get('user/isup', { 
  //   }, (result)=> { 
  //     this.setData({
  //       is_switch: result.is_switch,
  //     });
  //     if(result.is_switch==1){
  //       wx.setNavigationBarTitle({
  //         title: '我的团队'
  //       });
  //       wx.setNavigationBarColor({
  //         frontColor: '#ffffff',
  // backgroundColor: '#ff6c20',
  // animation: {
  //   duration: 400,
  //   timingFunc: 'easeIn'
  // }
  //       })
  //     }
  //   });
  // },
  // toLiveList(){
  //   wx.navigateTo({
  //     url: '../../live/list',
  //   })
  // },
  // likelist(){
  //   App._get('live.room/likelist', {

  //   }, result => {
  //    console.log(result);
  //    this.setData({
  //      list:result.data
  //    });
  //   });
  // },
 
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