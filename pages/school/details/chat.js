// pages/school/details/chat.js
let App = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      detail: {},
      commentlists:{},
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      this.getArticleDetail(options.article_id);
      this.getcommentlists(options.article_id)
   },
/**
   * 获取文章详情
   */
  getArticleDetail(article_id) {
   let _this = this;
   App._get('article.mchat/detail', {
     article_id
   }, function(result) {
      console.log(result)
     let detail = result.data.detail;
     // 富文本转码
   //   if (detail.article_content.length > 0) {
   //     wxParse.wxParse('content', 'html', detail.article_content, _this, 0);
   //   }
     _this.setData({
       detail
     });
    //  wx.setNavigationBarTitle({
    //    title: detail.category.name
    //  });
   });
 },


 bindFormSubmit(e) {
   let _this = this;
   App._post_form('article.mchat/comment', {
      p_id:this.data.detail.id,
      mchat_id:this.data.detail.id,
      content: e.detail.value.textarea
   }, (result) => {
      console.log(result)
      e.detail.value.textarea = ''
   });
},
getcommentlists(article_id) {
   let _this = this;
   App._get('article.mchat/commentlists', {
      mchat_id: article_id
   }, function(result) {
      console.log(result);
      _this.setData({
         commentlists:result.data.list
      })
    
   
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
            let data = _this.data.commentlists.data
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
            'commentlists.data': data,
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