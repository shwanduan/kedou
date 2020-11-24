// pages/user/opinion/opinion.js

import siteinfo from './../../../siteinfo.js';
const App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectType: '1',
    inputValue: '',
    cursor: 0,
    contact: '',
    imgList: [],
    array: ['类型1', '类型2', '类型3', '类型4'],
    index:'',
    uploadList:[],
    opinionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getfeedtype();
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  typeSelect(e) {

    this.setData({
      selectType: e.currentTarget.dataset.index
    })
    if(e.currentTarget.dataset.index==2){
      this.getOpinionList();
    }
  },
  edits(event) {
    //  console.log(event);
     if(event.currentTarget.dataset.type =="msg"){
    this.setData({
      cursor : event.detail.cursor,
      inputValue:event.detail.value
    }); 
  }else{
    this.setData({
      contact:event.detail.value
    })
  }
    // this.inputValue = event.target.value
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res);
        if (this.data.imgList.length != 0) {
          var imglist = this.data.imgList;
          this.setData({
            imgList : imglist.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList : res.tempFilePaths
          })
        }
      }
    });
  },

  submitOpinion(){
    // console.log(this.data.uploadList);

    let values= new Array;
    values.mobile = this.data.contact;
    values.imgs =this.data.uploadList ;
    values.title = this.data.array[this.data.index].name;
    values.content = this.data.inputValue;
    values.type_id = this.data.array[this.data.index].name;
    App._post_form('feedback/add',
    values
  , result => {
   console.log(result);
   if(result.code==1){
    wx.showModal({
      title: '友情提示',
      content: result.msg,
      showCancel: false,
      success:(res)=> {
        this.setData({
          contact:"",
          uploadList:[],
          index:"",
          inputValue:'',
          cursor:0,
          imgList:[]
        })
      }
    });
   }
  });
  },
shangchuan(){
  let url = siteinfo.siteroot + 'index.php?s=/api/upload/image';
  let params = {
    wxapp_id: App.getWxappId(),
    token: wx.getStorageSync('token')
  };
  if( this.data.imgList.length>0){

    // console.log(this.data.imgList);
    wx.showLoading({
      title: '上传中',
    })
    let up =0;
    for(let i = 0;i< this.data.imgList.length;i++){
      wx.uploadFile({
        url: url, 
        filePath: this.data.imgList[i],
        // header: { "Content-Type": "multipart/form-data" },
        name: 'iFile',
        formData: params,
        success: (res)=> {
          up++;
          console.log("ww",i);
          let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
          console.log(res);
          console.log(result);
          let imgUrl = result.data.file_path;
          let  uploadList= this.data.uploadList;
          uploadList.push(imgUrl);
          this.setData({
            uploadList:uploadList
          })
          console.log(i);
          console.log((this.data.imgList.length)-1);
          if(i==(this.data.imgList.length)-1){
            wx.hideLoading();
            this.submitOpinion();
            }
        }
      })
    }
  
  }
  
},

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '你好',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          var imglist2 =this.data.imgList
          imglist2.splice(e.currentTarget.dataset.index, 1);
          // console.log(this.data.imgList);
          // console.log(imglist2);
          this.setData({
            imgList:imglist2
          })
        }
      }
    })
  },
  getfeedtype(){
    // feedback/getfeedtype
    let _this = this;
    App._get('feedback/getfeedtype', {
      
    }, (result) => {
      
      this.setData({
        array: result.data,
      });
      console.log(this.data.array);
      
    });
  },
  getOpinionList(){
    let _this = this;
    App._get('feedback/lists', {
      
    }, (result) => {
      console.log(result);
      
      _this.setData({
        opinionList: result.data,
       
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
    this.getOpinionList();
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