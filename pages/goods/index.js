const App = getApp();

// 富文本插件
const wxParse = require("../../wxParse/wxParse.js");

// 工具类
const util = require('../../utils/util.js');

// 记录规格的数组
let goodsSpecArr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格

    detail: {}, // 商品详情信息
    goods_price: 0, // 商品价格
    share_price:0,  //分享赚
    self_price:0, //自购省
    line_price: 0, // 划线价格
    stock_num: 0, // 库存数量

    goods_num: 1, // 商品数量
    goods_sku_id: 0, // 规格id
    cart_total_num: 0, // 购物车商品总数量
    goodsMultiSpec: {}, // 多规格信息
    room_id:'', //房间号
    // 分享按钮组件
    share: {
      show: false,
      cancelWithMask: true,
      cancelText: '关闭',
      actions: [{
        name: '生成商品海报',
        className: 'action-class',
        loading: false,
        // openType:"share"
      }, {
        name: '发送给朋友',
        openType: 'share'
      }],
      // 商品海报
      showPopup: false,
      referee_id:'',
      toggleType:'',
      isLogin:false,
      registerCode:''
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff6c20',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    }),
    // console.log(e.referee_id);
    console.log('我要找到的那个id'+JSON.stringify(e))
    let _this = this,
      scene = App.getSceneData(e);
    // 商品id
    // _this.data.goods_id = e.goods_id ? e.goods_id : scene.gid;
    // _this.data.room_id = e.room_id ? e.room_id : '';
    // _this.data.referee_id = e.referee_id ? e.referee_id : '';
    this.setData({
      goods_id : e.goods_id ? e.goods_id : scene.gid,
      room_id : e.room_id ? e.room_id : '',
      referee_id : e.referee_id ? e.referee_id : '',
    })
    // 获取商品信息
   
    console.log('是否登录',App.checkIsLogin());
    console.log('是否登录1',wx.getStorageSync('token'));
    console.log('是否登录2',wx.getStorageSync('user_id'));
   
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    if (_this.data.isLogin) {

      // 添加足迹
      _this.addFoot();
    }else{
      // App.doLogin();
    }
    console.log("传递数据",e);
    this.getRegisterCode();
    
const $getCurrentPageUrl = () => {
  let pages = getCurrentPages() // 获取加载的页面
  let currentPage = pages[pages.length - 1] // 获取当前页面的对象
  let url = currentPage.route // 当前页面url
  return url
}
console.log( $getCurrentPageUrl());
  },
  getRegisterCode(){
    App._get('user.index/detail', {}, (result) =>{
      this.setData({
        registerCode: result.data.userInfo.RegisterCode

      })
    });
  },
  
  onShow(){
    this.getGoodsDetail();
  },

  /**
   * 获取商品信息
   */
  getGoodsDetail() {
    let _this = this;
    App._get('goods/detail', {
      goods_id: _this.data.goods_id
    }, (result) => {
      console.log("这是详情页数据"+result)
      console.log("detail"+result.data.detail.content)
      // 初始化商品详情数据
      result.data.detail.content = result.data.detail.content.replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1');
      let data = _this._initGoodsDetailData(result.data);

      _this.setData(data);
       
    });
  },
  toIndex(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  /**
   * 初始化商品详情数据
   */
  _initGoodsDetailData(data) {
    let _this = this;
    // 商品详情
    let goodsDetail = data.detail;
    // 富文本转码
    if (goodsDetail.content.length > 0) {
      wxParse.wxParse('content', 'html', goodsDetail.content, _this, 0);
    }
    // 商品价格/划线价/库存
    data.goods_sku_id = goodsDetail.goods_sku.spec_sku_id;
    data.goods_price = goodsDetail.goods_sku.goods_price;
    data.share_price = goodsDetail.goods_sku.share_price;
    data.self_price = goodsDetail.goods_sku.self_price;
    data.line_price = goodsDetail.goods_sku.line_price;
    data.stock_num = goodsDetail.goods_sku.stock_num;
    // 商品封面图(确认弹窗)
    data.skuCoverImage = goodsDetail.goods_image;
    // 多规格商品封面图(确认弹窗)
    if (goodsDetail.spec_type == 20 && goodsDetail.goods_sku['image']) {
      data.skuCoverImage = goodsDetail.goods_sku['image']['file_path'];
    }
    // 初始化商品多规格
    if (goodsDetail.spec_type == 20) {
      data.goodsMultiSpec = _this._initManySpecData(goodsDetail.goods_multi_spec);
    }
    return data;
  },

  /**
   * 初始化商品多规格
   */
  _initManySpecData(data) {
    goodsSpecArr = [];
    for (let i in data.spec_attr) {
      for (let j in data.spec_attr[i].spec_items) {
        if (j < 1) {
          data.spec_attr[i].spec_items[0].checked = true;
          goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id;
        }
      }
    }
    return data;
  },

  /**
   * 点击切换不同规格
   */
  onSwitchSpec(e) {
    let _this = this,
      attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      goodsMultiSpec = _this.data.goodsMultiSpec;
    for (let i in goodsMultiSpec.spec_attr) {
      for (let j in goodsMultiSpec.spec_attr[i].spec_items) {
        if (attrIdx == i) {
          goodsMultiSpec.spec_attr[i].spec_items[j].checked = false;
          if (itemIdx == j) {
            goodsMultiSpec.spec_attr[i].spec_items[itemIdx].checked = true;
            goodsSpecArr[i] = goodsMultiSpec.spec_attr[i].spec_items[itemIdx].item_id;
          }
        }
      }
    }
    _this.setData({
      goodsMultiSpec
    });
    // 更新商品规格信息
    _this._updateSpecGoods();
  },

  /**
   * 更新商品规格信息
   */
  _updateSpecGoods() {
    let _this = this,
      specSkuId = goodsSpecArr.join('_');
    // 查找skuItem
    let spec_list = _this.data.goodsMultiSpec.spec_list,
      skuItem = spec_list.find((val) => {
        return val.spec_sku_id == specSkuId;
      });
    // 记录goods_sku_id
    // 更新商品价格、划线价、库存
    if (typeof skuItem === 'object') {
      _this.setData({
        goods_sku_id: skuItem.spec_sku_id,
        goods_price: skuItem.form.goods_price,
        self_price: skuItem.form.self_price,
        share_price: skuItem.form.share_price,
        line_price: skuItem.form.line_price,
        stock_num: skuItem.form.stock_num,
        skuCoverImage: skuItem.form.image_id > 0 ? skuItem.form.image_path : _this.data.detail.goods_image
      });
    }
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    let _this = this;
    _this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 返回顶部
   */
  onScrollTop(t) {
    let _this = this;
    _this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    let _this = this;
    _this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  onIncGoodsNumber(e) {
    let _this = this;
    App.saveFormId(e.detail.formId);
    _this.setData({
      goods_num: ++_this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  onDecGoodsNumber(e) {
    let _this = this;
    App.saveFormId(e.detail.formId);
    if (_this.data.goods_num > 1) {
      _this.setData({
        goods_num: --_this.data.goods_num
      });
    }
  },

  /**
   * 自定义输入商品数量
   */
  onInputGoodsNum(e) {
    let _this = this,
      iptValue = e.detail.value;
    if (!util.isPositiveInteger(iptValue) && iptValue !== '') {
      iptValue = 1;
    }
    _this.setData({
      goods_num: iptValue
    });
  },

  /**
   * 跳转购物车页面
   */
  onTriggerCart() {
    wx.navigateTo({
      url: "../flow/index"
    });
  },

  /**
   * 加入购物车and立即购买
   */
  onConfirmSubmit(e) {
    let _this = this,
      submitType = e.currentTarget.dataset.type;
    // 表单验证
    if (!_this._onVerify()) {
      return false;
    }
    if (submitType === 'buyNow') {
      console.log( "roomID",_this.data.room_id,
        "refereeID",_this.data.referee_id,)

      // 立即购买
      wx.navigateTo({
        url: '../flow/checkout?' + util.urlEncode({
          order_type: 'buyNow',
          goods_id: _this.data.goods_id,
          goods_num: _this.data.goods_num,
          goods_sku_id: _this.data.goods_sku_id,
          room_id:_this.data.room_id,
          referee_id:_this.data.referee_id,
        }),
        success() {
          // 关闭弹窗
          _this.onToggleTrade();
        }
      });
    } else if (submitType === 'addCart') {
      // 加入购物车
      App._post_form('cart/add', {
        goods_id: _this.data.goods_id,
        goods_num: _this.data.goods_num,
        goods_sku_id: _this.data.goods_sku_id,
        room_id:_this.data.room_id,
        referee_id:_this.data.referee_id,
      }, (result) => {
        App.showSuccess(result.msg);
        _this.setData(result.data);
        _this.onToggleTrade();
      });
    }
  },
  addLike(){
    let _this = this;
     App._post_form('user/addUserLikeGoods', {
       goods_id: _this.data.goods_id,
     }, (result) => {
      console.log(result);
      this.setData({
        'detail.like':this.data.detail.like+1,
        'detail.is_like':1
      })
     });
   },
   deleteLike(){
    let _this = this;
     App._post_form('user/deleteLike', {
       goods_id: _this.data.goods_id,
  
     }, (result) => {
      console.log(result);
      this.setData({
        'detail.like':this.data.detail.like-1,
        'detail.is_like':0
      })
     });
   },
 addFoot(){
  let _this = this;
   App._get('user/addfootprint', {
     goods_id: _this.data.goods_id,

   }, (result) => {
    console.log(result);
   });
 },
//  添加收藏店铺
 addStore(){
  let _this = this;
  App._post_form('user/addStoreUser', {
    store_id: _this.data.detail.admin_id,
  }, (result) => {
   console.log(result);
  });
 },

  /**
   * 表单验证
   */
  _onVerify() {
    let _this = this;
    if (_this.data.goods_num === '') {
      App.showError('请输入购买数量');
      return false;
    }
    // 将购买数量转为整型，防止出错
    _this.setData({
      goods_num: parseInt(_this.data.goods_num)
    });
    if (_this.data.goods_num <= 0) {
      App.showError('购买数量不能为0');
      return false;
    }
    return true;
  },

  /**
   * 浏览商品图片
   */
  onPreviewImages(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index,
      imageUrls = [];
    _this.data.detail.image.forEach(item => {
      imageUrls.push(item.file_path);
    });
    wx.previewImage({
      current: imageUrls[index],
      urls: imageUrls
    })
  },

  /**
   * 预览Sku规格图片
   */
  onPreviewSkuImage(e) {
    let _this = this;
    wx.previewImage({
      current: _this.data.skuCoverImage,
      urls: [_this.data.skuCoverImage]
    })
  },

  /**
   * 跳转到评论
   */
  onTargetToComment() {
    let _this = this;
    wx.navigateTo({
      url: './comment/comment?goods_id=' + _this.data.goods_id
    })
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    // let params = App.getShareUrlParams({
    //   'goods_id': _this.data.goods_id
    // });
    // wx.showModal({
    //   content:params,
    // });
    // path: "/pages/goods/index?" + params
     /**
   * 获取当前用户信息
   */
  let referee_id = App.getUserId();

  var url ="/pages/goods/index?goods_id="+_this.data.goods_id+"&referee_id="+referee_id+"&register_code=" +_this.data.registerCode;
  console.log(url);
    return {
      title:_this.data.detail.goods_name,
      path: url
    };
    // console.log( result.data.userInfo.register_code);
 
   
  },

  /**
   * 显示分享选项
   */
  onClickShare(e) {
    let _this = this;
    // 记录formId
    console.log(e);
    App.saveFormId(e.detail.formId);
    _this.setData({
      'share.show': true
    });
  },

  /**
   * 关闭分享选项
   */
  onCloseShare() {
    let _this = this;
    _this.setData({
      'share.show': false
    });
  },

  /**
   * 点击生成商品海报
   */
  onClickShareItem(e) {
    let _this = this;
    if (e.detail.index === 0) {
      // 显示商品海报
      _this._showPoster();
    }
    _this.onCloseShare();
  },

  /**
   * 切换商品海报
   */
  onTogglePopup() {
    let _this = this;
    _this.setData({
      'share.showPopup': !_this.data.share.showPopup
    });
  },

  /**
   * 显示商品海报图
   */
  _showPoster() {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    App._get('goods/poster', {
      goods_id: _this.data.goods_id
    }, (result) => {
      _this.setData(result.data, () => {
        _this.onTogglePopup();
      });
    }, null, () => {
      wx.hideLoading();
    });
  },

  /**
   * 保存海报图片
   */
  onSavePoster(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    wx.showLoading({
      title: '加载中',
    });
    // 下载海报图片
    wx.downloadFile({
      url: _this.data.qrcode,
      success(res) {
        wx.hideLoading();
        // 图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
            // 关闭商品海报
            _this.onTogglePopup();
          },
          fail(err) {
            console.log(err.errMsg);
            if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
              wx.showToast({
                title: "请允许访问相册后重试",
                icon: "none",
                duration: 1000
              });
              setTimeout(() => {
                wx.openSetting();
              }, 1000);
            }
          },
          complete(res) {
            console.log('complete');
            // wx.hideLoading();
          }
        })
      }
    })
  },

  
  /**
   * 确认购买弹窗
   */
  onToggleTrade(e) {
    
    let _this = this;
    if (typeof e === 'object') {
      console.log(e);
      // 记录formId
      e.detail.hasOwnProperty('formId') && App.saveFormId(e.detail.formId);

      this.setData({
        toggleType:e.currentTarget.dataset.type||'',
        // show:false
      })
    }
    
    _this.setData({
      showBottomPopup: !_this.data.showBottomPopup,
     
    });
  },

})