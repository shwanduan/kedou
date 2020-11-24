// pages/school/school.js
let App = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      selectType: 1,
      lumpList: [],
      selectLump: 1,
      newsList: {},
      weiliaoList: {},
      signLists: {},
      isloading:false,
      recommendList:{},
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      this.getLumpList();
      this.getNewsList();
      this.getWeiLiaoList();
      this.getSignLists();
      this.getRecommendList();
   },
   selectType(e) {
      this.setData({
         selectType: e.currentTarget.dataset.type
      })
   },
   selectLump(e) {
      this.setData({
         selectLump: e.currentTarget.dataset.type
      })
   },
   getLumpList() {
      let _this = this;
      App._get('Article/index', {}, (result) => {
         console.log(result)
         _this.setData({
            lumpList: result.data.categoryList
         })
      });
   },
   getNewsList() {
      let _this = this;
      App._get('Article/lists', {

      }, (result) => {
         console.log(result)
         _this.setData({
            newsList: result.data.list
         })
      });
   },
   getWeiLiaoList() {
      let _this = this;
      App._get('article.mchat/lists', {}, (result) => {
         console.log(result)

         _this.setData({
            weiliaoList: result.data.list
         })
      });
   },
   getRecommendList(){
      let _this = this;
      App._get('article.mchat/lists', {
         is_top:1
      }, (result) => {
         console.log(result)

         _this.setData({
            recommendList: result.data.list
         })
      });
   },
   getSignLists() {
      let _this = this;
      App._get('Sign/lists', {}, (result) => {
         console.log(result)

         _this.setData({
            signLists: result.data.list
         })
      });
   },
   
   toDetails(e) {
      console.log(e);
      wx.navigateTo({
         url: './details/details?article_id=' + e.currentTarget.dataset.id+'&type='+ e.currentTarget.dataset.type,
      });
   },
   toChat(e){
      wx.navigateTo({
         url: './details/chat?article_id=' + e.currentTarget.dataset.id,
      });
   },
   // 关注
   
   followUser(e) {
      let _this = this;
      App._post_form('article.mchat/follow', {
         to_user_id: e.currentTarget.dataset.id
      }, (result) => {
         console.log(result)
         if(result.code==1){    
            let data = _this.data.weiliaoList.data
            data.forEach(element => {
               if( element.userInfo.user_id==e.currentTarget.dataset.id){
                  if(e.currentTarget.dataset.follow==0)
                  element.is_follow=1;
                  else
                  element.is_follow=0;
               }
          });
          console.log(data);
             _this.setData({
            'weiliaoList.data': data
         })
         }
      
      });
   },
   //点赞
   like(e) {
      if(this.data.isloading){
         wx.showToast({
           title: '点击过快',
           icon:'none'
         })
         return;
      }
      this.setData({
         isloading: true
      })
      let _this = this;
      App._post_form('article.mchat/like', {
         mchat_id: e.currentTarget.dataset.id
      }, (result) => {
         console.log(result)
         if(result.code==1){    
            let data = _this.data.weiliaoList.data
            data.forEach(element => {

               if( element.id==e.currentTarget.dataset.id){
                  console.log(e.currentTarget.dataset.like)
                  if(e.currentTarget.dataset.like==0){
                     element.is_like=1;
                     element.like_count++;
                  }
                  else{
                     element.is_like=0;
                     element.like_count--;
                  }
               }
          });
          console.log(data);
             _this.setData({
            'weiliaoList.data': data,
            isloading:false
         })
         }
      
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