const App = getApp();

// 富文本插件
import wxParse from '../../../wxParse/wxParse.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 文章详情
    detail: {},
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取文章详情
   
    this.setData({
      type:options.type
    })
    if(options.type=='sign'){

      this.getSignDetail(options.article_id);
    }else{
      this.getArticleDetail(options.article_id);
    }
  },
 
  getSignDetail(article_id) {
    let _this = this;
    App._get('Sign/detail', {
      article_id
    }, function(result) {
      console.log("富文本"+result)
      let detail = result.data.detail;
      // 富文本转码
      if (detail.article_content.length > 0) {
        wxParse.wxParse('content', 'html', detail.article_content, _this, 0);
      }
      _this.setData({
        detail
      });
      wx.setNavigationBarTitle({
        title: result.data.detail.category.name
      });
    });
  },
  /**
   * 获取文章详情
   */
  getArticleDetail(article_id) {
    let _this = this;
    App._get('Article/detail', {
      article_id
    }, function(result) {
      let detail = result.data.detail;
      // 富文本转码
      if (detail.article_content.length > 0) {
        wxParse.wxParse('content', 'html', detail.article_content, _this, 0);
      }
      _this.setData({
        detail
      });
      wx.setNavigationBarTitle({
        title: result.data.detail.category.name
      });
    });
  },
pay(){
  let _this = this;
  App._post_form('sign/pay', {
    article_id: this.data.detail.article_id
  }, (result) => {
     console.log(result)
     App.wxPayment({
      payment: result.data.payment,
      success(res) {
        
        App.showError(result.msg.success);
        // _this.getOrderDetail(orderId);
      },
      fail() {
        App.showError(result.msg.error);
      },
    });
  });
},

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    // 构建页面参数
    let params = App.getShareUrlParams({
      'article_id': this.data.detail.article_id
    });
    return {
      // title: this.data.detail.article_title,
      // path: "/pages/article/detail/index?" + params
    };
  },

})