// pages/apply/apply.js
import siteinfo from './../../siteinfo.js';
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    cardZheng:'',//正面
    cardFan:'',  //反面
    cardYing:'', //营业执照
    storeUser: [ 
//       { store_user_id: 10002, user_name: "山东汇乐美旗舰店" },
//  { store_user_id: 10003, user_name: "gxd" },
// { store_user_id: 10004, user_name: "wxq" },
// { store_user_id: 10012, user_name: "gxd123" }
], //商户选择
    storeSelcet:'',
    index:0,
    name:"",
    nick_name:'',
    card:"",
    credit_code:'',
    admin_id:'',
    disabled: false,
    is_switch:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
    this.setData({
      type: options.type
    })
    console.log(options.type);
    var title;
    // 1平台主播 2商户主播 3 个人商户 4企业商户
    switch (options.type) {
      case "1":
      
        title = "平台主播";
        break;
      case "2":
        
        title = "商户主播";
        break;
      case "3":
   
        title = "个人商户";
        break;
      case "4":
      
        title = "企业商户";
        break;
    } 
    console.log(options.type);
    wx.setNavigationBarTitle({
      title: title
    });
    // this.getLiveMessage(options.type);
    this.getStoreUser(options.type);
    App._get('user/isup', { 
    }, (result)=> { 
      this.setData({
        is_switch: result.is_switch,
      });
    });
  },
 cardNumInput(e){ 
  var reg = /^[a-zA-Z0-9]*$/g; 
  // reg.test(e)
  console.log(e.currentTarget.dataset.name);
  if(!reg.test(e.detail.value)){
    wx.showModal({
      content:'请输入正确格式',
      showCancel:false,
      success :(res)=> {
        if (res.confirm) { 
          if(e.currentTarget.dataset.name=='card'){
            this.setData({
              card: e.detail.value.replace(/[^\w\/]/ig,'')
            })
          }else{
            this.setData({
              credit_code: e.detail.value.replace(/[^\w\/]/ig,'')
            })

          }
        // console.log('用户点击确定')
        } else if (res.cancel) {
        // console.log('用户点击取消')
        }
      }
    })
  }
 },
  bindPickerChange: function (e) {
  
    this.setData({
      index: e.detail.value,
      admin_id: this.data.storeUser[e.detail.value].store_user_id
    })
  },
  getStoreUser(type) {
    let _this = this;
    var url = 'live.room/getStoreUser'

    // 获取商户须知
    App._get(url, {}, (result) => {
      _this.setData({
        storeUser: result.data,
        admin_id:result.data[0].store_user_id
      });
    });
  },
  // 绑定
  // bindKeyInput: function (e) {
  //   console.log(e);
  //   this.setData({
  //     inputValue: e.detail.value
  //   })
  // },
  /**
   *提交
   */
  zhiBoToApply:function(e){
    let _this = this,
      values = e.detail.value
      console.log(values);
    values.type = this.data.type;
    values.admin_id = this.data.admin_id;
    values.positive = this.data.cardZheng;
    values.side = this.data.cardFan;
    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    App._post_form('live.room/addlive',
      values
    , result => {
     console.log(result);
     if(result.code==1){
      wx.showModal({
        title: '友情提示',
        content: result.msg,
        showCancel: false,
        success(res) {
      wx.navigateTo({
        url: '../user/index',
      })
        }
      });
     }
    });
  },
  shangHuToApply:function(e){
    let _this = this,
      values = e.detail.value
      console.log(values);
    values.type = Number(this.data.type)-2;
    values.card_z = this.data.cardZheng;
    values.card_f = this.data.cardFan;
    values.business_license = this.data.cardYing;
    // 表单验证
    if (!_this.storeValidation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    App._post_form('merchant.merchant/add',
      values
    , result => {
     console.log(result);
     
     if(result.code==1){
      wx.showModal({
        title: '友情提示',
        content: result.msg,
        showCancel: false,
        success(res) {
      wx.navigateTo({
        url: '../user/index',
      })
        }
      });
     }
    });
  },

  /**
    * 主播表单验证
    */
  validation: function (values) {
    if (values.name === '') {
      this.data.error = '直播昵称不能为空';
      return false;
    }
    if (values.nick_name === '') {
      this.data.error = '姓名不能为空';
      return false;
    }
    if (values.card === '') {
      this.data.error = '证件不能为空';
      return false;
    }
    if (values.positive === '') {
      this.data.error = '请提交正面照';
      return false;
    }
    if (values.side === '') {
      this.data.error = '请提交反面照';
      return false;
    }
    if (this.data.type==2 && values.admin_id === '') {
      this.data.error = '请选择关联店铺';
      return false;
    }
    
    return true;
  },
  /**
    * 商户表单验证
    */
  storeValidation: function (values) {
    if (values.shop_name === '') {
      this.data.error = '直播昵称不能为空';
      return false;
    }
    if (values.credit_code === '') {
      this.data.error = '姓名不能为空';
      return false;
    }
    if (values.person === '') {
      this.data.error = '证件不能为空';
      return false;
    }
    if (values.company_address === '') {
      this.data.error = '地址不能为空';
      return false;
    }
    if (values.card_z === '') {
      this.data.error = '请提交正面照';
      return false;
    }
    if (values.card_f === '') {
      this.data.error = '请提交反面照';
      return false;
    }
    if (this.data.type == 4 && values.company_name === '') {
      this.data.error = '请提交企业名称';
      return false;
    }
    if (this.data.type == 4 && values.legal_person === '') {
      this.data.error = '请提交法人';
      return false;
    }
    if (this.data.type == 4 && values.business_license === '') {
      this.data.error = '请提交营业执照';
      return false;
    }

    return true;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  uploadImage:function(e){
    let that =this;
    let cardType = e.currentTarget.dataset.type;
    var url = siteinfo.siteroot + 'index.php?s=/api/upload/image';
    console.log(url);
    let params = {
      wxapp_id: App.getWxappId(),
      token: wx.getStorageSync('token')
    };
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths[0]);
        wx.showLoading({
          title: '上传中',
        });
        wx.uploadFile({
          url: url, 
          filePath: tempFilePaths[0],
          // header: { "Content-Type": "multipart/form-data" },
          name: 'iFile',
          formData: params,
          success(res) {
            wx.hideLoading({});
            console.log(res);
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
            let imgUrl = result.data.file_path;
            if(cardType==1){
              that.setData({
                cardZheng:imgUrl
              })
              
            } else if (cardType==2){
              that.setData({
                cardFan: imgUrl
              })
            }else{
              that.setData({
                cardYing: imgUrl
              })
            }
            //do something
          }
        })
      }
    })
 
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