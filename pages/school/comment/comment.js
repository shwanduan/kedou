const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面参数
    options: null,

    // 待评价商品列表
    goodsList: [],

    // 表单数据
    formData: [],
    isVideo:false,
    uploadList:[],
    submitDisable: false,
    isLogin: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.setData({
      formData: this.initFormData(),
      isLogin: App.checkIsLogin()
    });
  },

  /**
   * 初始化form数据
   */
  initFormData: function() {
    let data = [];
      data.push({
        content: '',
        image_list: [],
        uploaded: []
      });
    return data;
  },


  /**
   * 输入评价内容
   */
  contentInput: function(e) {
   
    this.setData({
      ['formData[0].content']: e.detail.value
    });
  },

  /**
   * 选择图片
   */
  chooseImage: function(e) {
    let _this = this,
      imageList = _this.data.formData[0].image_list;
    // wx.chooseMedia({
    //   count: 6 - imageList.length,
    //   mediaType: ['image','video'],
    //   sourceType: ['album', 'camera'],
    //   maxDuration: 30,
    //   camera: 'back',
    //   success(res) {
    //     console.log(res);
    //     if(res.type=="video"){
    //       _this.setData({
    //         isVideo:true,
    //         ['formData[0].image_list']: res.tempFiles[0]
    //       })
    //     }
    //     // console.log(res.tempFiles.tempFilePath)
    //     // console.log(res.tempFiles.size)
    //     _this.setData({
    //      ['formData[0].image_list']: imageList.concat(res.tempFiles)
    //    });
    //   },
    //   fail(res){
    //     console.log(res);
    //   }
    // })
      // 选择图片
      wx.chooseImage({
        count: 6 - imageList.length,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log(res);
          _this.setData({
            ['formData[0].image_list']: imageList.concat(res.tempFilePaths)
          });
        }
      });
  },
  chooseVideo:function(e){

  },

  /**
   * 删除图片
   */
  deleteImage: function(e) {
    let dataset = e.currentTarget.dataset,
      image_list = this.data.formData[0].image_list;
    image_list.splice(dataset.imageIndex, 1);
    this.setData({
      ['formData[0].image_list']: image_list
    });
  },

  /**
   * 表单提交
   */
  submit: function() {
    console.log("上传")
    let _this = this,
      formData = _this.data.formData;
  

    wx.showLoading({
      title: '正在处理...',
      mask: true
    });

    // form提交执行函数
    // let fromPostCall = function(formData) {
      // console.log('fromPostCall');
      // console.log(formData);
      App._post_form('article.mchat/add', {
          // formData: JSON.stringify(formData)
          content:formData[0].content,
          imgs:_this.data.uploadList
        }, function(result) {
          if (result.code === 1) {
            App.showSuccess(result.msg, function() {
              wx.navigateBack();
            });
          } else {
            App.showError(result.msg);
          }
        },
        false,
        function() {
          wx.hideLoading();
          _this.setData({
            submitDisable : false
          }) 
        });
    // };

    // // 统计图片数量
    // let imagesLength = 0;
    // formData.forEach(function(item, formIndex) {
    //   item.content !== '' && (imagesLength += item.image_list.length);
    // });
    // console.log(imagesLength);
    // // 判断是否需要上传图片
    // imagesLength > 0 ? _this.uploadFile(imagesLength, formData, fromPostCall) : fromPostCall(formData);
  },

  shangchuan(){
    var _this =this;
     // 判断是否重复提交
     if (_this.data.submitDisable === true) {
      return false;
    }
    // 表单提交按钮设为禁用 (防止重复提交)
    _this.data.submitDisable = true;
    let url =App.api_root + 'upload/image';
    let params = {
      wxapp_id: App.getWxappId(),
      token: wx.getStorageSync('token')
    };
    if( this.data.formData[0].image_list.length>0){
  
      // console.log(this.data.imgList);
      wx.showLoading({
        title: '上传中',
      })
      let up =0;
      for(let i = 0;i< this.data.formData[0].image_list.length;i++){
        wx.uploadFile({
          url: url, 
          filePath: this.data.formData[0].image_list[i],
          // header: { "Content-Type": "multipart/form-data" },
          name: 'iFile',
          formData: params,
          success: (res)=> {
            up++;
            // console.log("ww",i);
            let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
            console.log(res);
            console.log(result);
            let imgUrl = result.data.file_path;
            let  uploadList= this.data.uploadList;
            uploadList.push(imgUrl);
            this.setData({
              uploadList:uploadList
            })
            // console.log(i);
            // console.log((this.data.formData[0].image_list.length)-1);
            if(i==(this.data.formData[0].image_list.length)-1){
              wx.hideLoading();
              this.submit();
              }
          }
        })
      }
    
    }
    
  },

  /**
   * 上传视频
   */
  // uploadFile: function(imagesLength, formData, callBack) {
  //   var _this =this;
  //   // POST 参数
  //   let params = {
  //     wxapp_id: App.getWxappId(),
  //     token: wx.getStorageSync('token')
  //   };
  //   // 文件上传
  //   let i = 0;
  //   formData.forEach(function(item, formIndex) {
  //     if (item.content !== '') {
  //       item.image_list.forEach(function(filePath, fileKey) {
  //         console.log(filePath.tempFilePath)
  //         // if(_this.data.isVideo){
  //         //   filePath=filePath.tempFilePath
  //         // }
  //         wx.uploadFile({
  //           url: App.api_root + 'upload/video',
  //           filePath: filePath.tempFilePath,
  //           name: 'file',
  //           formData: params,
  //           success: function(res) {
  //             console.log("成功",res)
  //             // let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
  //             let result =  res.data ;
  //             if (result.code === 1) {
  //               item.uploaded[fileKey] = result.data.file_id;
  //             }
  //           },
  //           fail(res){console.log("失败",res);},
  //           complete: function() {
  //             i++;
  //             if (imagesLength === i) {
  //               // 所有文件上传完成
  //               console.log('upload complete');
  //               // 执行回调函数
  //               callBack && callBack(formData);
  //             }
  //           }
  //         });
  //       });
  //     }
  //   });

  // },
   /**
   * 上传图片
   */
  // uploadFile: function(imagesLength, formData, callBack) {
  //   // POST 参数
  //   let params = {
  //     wxapp_id: App.getWxappId(),
  //     token: wx.getStorageSync('token')
  //   };
  //   // 文件上传
  //   let i = 0;
  //   formData.forEach(function(item, formIndex) {
  //     if (item.content !== '') {
  //       item.image_list.forEach(function(filePath, fileKey) {
  //         console.log(filePath);
  //         wx.uploadFile({
  //           url: App.api_root + 'upload/image',
  //           filePath: filePath,
  //           name: 'iFile',
  //           formData: params,
  //           success: function(res) {
  //             let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
  //             if (result.code === 1) {
  //               // item.uploaded[fileKey] = result.data.file_id;
              
  //             }
  //           },
  //           fail(res){console.log(res);},
  //           complete: function() {
  //             i++;
  //             if (imagesLength === i) {
  //               // 所有文件上传完成
  //               console.log('upload complete');
  //               // 执行回调函数
  //               callBack && callBack(formData);
  //             }
  //           }
  //         });
  //       });
  //     }
  //   });

  // },
 

})