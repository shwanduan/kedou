const App = getApp();

// 工具类
import Util from '../../utils/util.js';

// 验证类
import Verify from '../../utils/verify.js';

// 枚举类：发货方式
import DeliveryTypeEnum from '../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType';

// 对话框插件
import Dialog from '../../components/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 当前页面参数
    options: {},

    // // 系统设置：配送方式
    // deliverySetting: [],

    // 系统设置
    setting: {
      delivery: [], // 支持的配送方式
    },

    // 配送方式
    isShowTab: false,
    DeliveryTypeEnum,
    curDelivery: null,

    // 支付方式
    PayTypeEnum,
    curPayType: PayTypeEnum.WECHAT.value,

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址

    selectedShopId: 0, // 选择的自提门店id
    linkman: '', // 自提联系人
    phone: '', // 自提联系电话

    // 商品信息
    goods: {},

    // 选择的优惠券
    selectCouponId: 0,
    storeCouponId: 0,
    // 是否使用积分抵扣
    isUsePoints: false,

    // 买家留言
    remark: '',

    // 禁用submit按钮
    disabled: false,

    has_error: false,
    error_msg: '',

    notRefresh: false, // 不允许刷新
    room_id: '',
    havePass: false,
    showPassword: false,
    pay_password:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 当前页面参数
    _this.setData({
      options
    });
    console.log("提交数据", options);
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff6c20',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },

  getUser() {
    var _this = this;
    App._get('user.index/detail', {}, (result) => {
      _this.setData(result.data);
       console.log('eg'+JSON.stringify(result.data))
      console.log(result.data.userInfo.pay_password);
      if (result.data.userInfo.pay_password) {
        _this.setData({
          havePass: true
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取当前订单信息
    !_this.data.notRefresh && _this.getOrderData();
    this.getUser();
  },


  /**
   * 获取当前订单信息
   */
  getOrderData() {
    let _this = this,
      options = _this.data.options;
    // 获取订单信息回调方法
    let callback = result => {
      let resData = result.data;
      // 请求错误
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (resData.has_error) {
        App.showError(resData.error_msg);
      }

      let data = {};
      // 当前选择的配送方式
      data.curDelivery = resData.delivery;
      // 如果只有一种配送方式则不显示选项卡
      data.isShowTab = resData.setting.delivery.length > 1;
      // 上门自提联系信息
      if (_this.data.linkman === '') {
        data.linkman = resData.last_extract.linkman;
      }
      if (_this.data.phone === '') {
        data.phone = resData.last_extract.phone;
      }

      // 设置页面数据
      _this.setData(Object.assign({}, resData, data));

      // 分店
      if (_this.options.order_type === 'cart') {
        console.log(resData);
        var map = {},
          goodsList = resData.goods_list,
          dest = [];
        for (var i = 0; i < goodsList.length; i++) {
          var ai = goodsList[i];
          if (!map[ai.admin_id]) { //依赖分组字段可自行更改！
            dest.push({
              store_name: ai.store_name, //依赖分组字段可自行更改！
              store_img: ai.store_img, //依赖分组字段可自行更改！
              admin_id: ai.admin_id, //依赖分组字段可自行更改！
              data: [ai]
            });
            map[ai.admin_id] = ai; //依赖分组字段可自行更改！
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.admin_id == ai.admin_id) { //依赖分组字段可自行更改！
                dj.data.push(ai);
                break;
              }
            }
          }
        }
        this.setData({
          goods_list: dest
        })
      }
      wx.hideLoading();
    };

    wx.showLoading({
      title: '加载中...',
    });

    // 请求的参数
    let params = {
      delivery: _this.data.curDelivery || 0,
      shop_id: _this.data.selectedShopId || 0,
      coupon_id: _this.data.selectCouponId || 0,
      is_use_points: _this.data.isUsePoints ? 1 : 0,
      store_coupon_id: _this.data.storeCouponId || 0, //平台优惠券
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('order/buyNow', Object.assign({}, params, {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        room_id: options.room_id,
      }), result => {
        callback(result);
      });
    }

    // 砍价活动结算
    else if (options.order_type === 'bargain') {
      App._get('bargain.order/checkout', Object.assign({}, params, {
        task_id: options.task_id,
        goods_sku_id: options.goods_sku_id,
      }), result => {
        callback(result);
      });
    }

    // 秒杀活动结算
    else if (options.order_type === 'sharp') {
      App._get('sharp.order/checkout', Object.assign({}, params, {
        active_time_id: options.active_time_id,
        sharp_goods_id: options.sharp_goods_id,
        goods_sku_id: options.goods_sku_id,
        goods_num: options.goods_num,
      }), result => {
        callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('order/cart', Object.assign({}, params, {
        cart_ids: options.cart_ids || 0,
      }), result => {
        callback(result);
      });
    }
  },

  /**
   * 切换配送方式
   */
  onSwichDelivery(e) {
    // 设置当前配送方式
    let _this = this;
    _this.setData({
      curDelivery: e.currentTarget.dataset.current
    });
    // 重新获取订单信息
    _this.getOrderData();
  },

  /**
   * 快递配送：选择收货地址
   */
  onSelectAddress() {
    let _this = this;
    // 允许刷新
    _this.setData({
      notRefresh: false
    });
    // 跳转到选择自提点
    wx.navigateTo({
      url: '../address/' + (_this.data.exist_address ? 'index?from=flow' : 'create')
    });
  },

  /**
   * 上门自提：选择自提点
   */
  onSelectExtractPoint() {
    let _this = this,
      selectedId = _this.data.selectedShopId;
    // 允许刷新
    _this.setData({
      notRefresh: false
    });
    // 跳转到选择自提点
    wx.navigateTo({
      url: '../_select/extract_point/index?selected_id=' + selectedId
    });
  },

  /**
   * 跳转到商品详情页
   */
  onTargetGoods(e) {
    wx.navigateTo({
      url: `../goods/index?goods_id=${e.currentTarget.dataset.id}`,
    })
  },
  onTogglePopupPass() {
    let _this = this;
  
      _this.setData({
        showPassword: !_this.data.showPassword
      });
   
  },
  // 
  onSubmitOrder(){
    if (this.data.curPayType == 20) {
      this.onSubmitOrder2();
    } else {
      if (!this.data.havePass) {
        wx.navigateTo({
          url: '../user/userInfor/change-password',
        })
      } else {
        this.setData({
          showPassword:true
        })
      }
    }
  },
  passChange(e){
    this.setData({
      pay_password: e.detail.value
    })
  },
  //验证支付密码
  checkPayPassword(){
    let _this = this;
    App._post_form('order/checkPayPassword', 
    {pay_password:this.data.pay_password}
    , result => {
      console.log(result.data.status);
      if(result.data.status==1){
        _this.onSubmitOrder2();
        _this.setData({
          showPassword:false
        });
      }else{
        // console.log(result.msg);
        wx.showModal({
          content: result.msg,
          showCancel: false,
          // success(res) {
          //   if (res.confirm) {
          //   }
          // }
        })
      }
    }, result => {}, () => {
      // 解除按钮禁用
      
    });
  },
  /**
   * 订单提交
   */
  onSubmitOrder2() {
    let _this = this,
      options = _this.data.options;
    if (_this.data.disabled) {
      return false;
    }

    // 表单验证
    if (!_this._onVerify()) {
      return false;
    }
    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;
    let url = '';

    // 表单提交的数据
    let postData = {
      delivery: _this.data.curDelivery,
      pay_type: _this.data.curPayType,
      shop_id: _this.data.selectedShopId || 0,
      linkman: _this.data.linkman,
      phone: _this.data.phone,
      coupon_id: _this.data.selectCouponId || 0,
      store_coupon_id: _this.data.storeCouponId || 0,
      is_use_points: _this.data.isUsePoints ? 1 : 0,
      remark: _this.data.remark || '',
      referee_id: _this.data.options.referee_id || "",
    };

    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      console.log("分享者", postData.referee_id);
      url = 'order/buyNow';
      postData = Object.assign(postData, {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
        room_id: options.room_id,
      });
    }

    // 创建订单-购物车结算
    if (options.order_type === 'cart') {
      url = 'order/cart';
      postData = Object.assign(postData, {
        cart_ids: options.cart_ids || 0,
      });
    }

    // 创建订单-砍价活动
    if (options.order_type === 'bargain') {
      url = 'bargain.order/checkout';
      postData = Object.assign(postData, {
        task_id: options.task_id,
        goods_sku_id: options.goods_sku_id,
      });
    }

    // 创建订单-秒杀商品
    if (options.order_type === 'sharp') {
      url = 'sharp.order/checkout';
      postData = Object.assign(postData, {
        active_time_id: options.active_time_id,
        sharp_goods_id: options.sharp_goods_id,
        goods_sku_id: options.goods_sku_id,
        goods_num: options.goods_num,
      });
    }

    // 提交到后端
    const onCommitCallback = () => {
      // 显示loading
      wx.showLoading({
        title: '正在处理...'
      });
      // 订单提交
      App._post_form(url, postData, result => {
        console.log('andbej'+JSON.stringify(result))
        _this._onSubmitCallback(result);
      }, result => {}, () => {
        wx.hideLoading();
        // 解除按钮禁用
        _this.data.disabled = false;
      });
      // 不允许刷新
      _this.setData({
        notRefresh: true
      });
    };

    // 请求用户订阅消息
    _this._onRequestSubscribeMessage(onCommitCallback);
  },

  /**
   * 请求用户订阅消息
   */
  _onRequestSubscribeMessage(onCommitCallback) {
    let _this = this,
      tmplIds = _this.data.setting.order_submsg;
      // console.log('测试走不走这里',111111111111111111111)
      console.log("这是tmplids",_this.data.setting.order_submsg)
    if (tmplIds.length == 0) {
      onCommitCallback();
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {},
      fail(res) {},
      complete(res) {
        onCommitCallback();
      },
    });
  },

  /**
   * 订单提交成功后回调
   */
  _onSubmitCallback(result) {
    console.log('订单提交成功后回调');
    let _this = this;
    // 订单创建成功后回调--微信支付
    if (result.code === -10) {
      App.showError(result.msg, () => {
        _this.redirectToOrderIndex();
      });
      return false;
    }
    // 发起微信支付
    if (result.data.pay_type == PayTypeEnum.WECHAT.value) {
      App.wxPayment({
        payment: result.data.payment,
        success: res => {
          // _this.redirectToOrderIndex();
          wx.navigateTo({
            url: '../order/result?order_id=' + result.data.order_id,
          })
        },
        fail: res => {
          App.showError(result.msg.error, () => {
            _this.redirectToOrderIndex();
          });
        },
      });
    }
    // 余额支付
    // console.log(PayTypeEnum.BALANCE.value);
    if (result.data.pay_type == PayTypeEnum.BALANCE.value) {
      App.showSuccess(result.msg.success, () => {
        _this.redirectToOrderIndex();
      });
    }
  },


  /**
   * 表单验证
   */
  _onVerify() {
    let _this = this;
    if (_this.data.has_error) {
      App.showError(_this.data.error_msg);
      return false;
    }
    // 验证自提填写的联系方式
    if (_this.data.curDelivery == DeliveryTypeEnum.EXTRACT.value) {
      _this.setData({
        linkman: _this.data.linkman.trim(),
        phone: _this.data.phone.trim(),
      });
      if (_this.data.selectedShopId <= 0) {
        App.showError('请选择自提的门店');
        return false;
      }
      if (Verify.isEmpty(_this.data.linkman)) {
        App.showError('请填写自提联系人');
        return false;
      }
      if (Verify.isEmpty(_this.data.phone)) {
        App.showError('请填写自提联系电话');
        return false;
      }
      if (!Verify.isPhone(_this.data.phone)) {
        App.showError('请输入正确的联系电话');
        return false;
      }
    }
    return true;
  },

  /**
   * 买家留言
   */
  bindRemark(e) {
    let _this = this;
    _this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 选择优惠券(弹出/隐藏)
   */
  onTogglePopupCoupon() {
    let _this = this;
    if (_this.data.coupon_list.length > 0) {
      _this.setData({
        showBottomPopup: !_this.data.showBottomPopup
      });
    }
  },

  /**
   * 选择优惠券
   */
  onSelectCoupon(e) {
    let _this = this;
    // 记录选中的优惠券id
    _this.setData({
      selectCouponId: e.currentTarget.dataset.id
    });
    // 重新获取订单信息
    _this.getOrderData();
    // 隐藏优惠券弹层
    _this.onTogglePopupCoupon();
  },
  selectStore(e) {
    console.log(e.currentTarget.dataset.id);

    let _this = this;
    // 记录选中的优惠券id
    _this.setData({
      storeCouponId: e.currentTarget.dataset.id
    });
    // 重新获取订单信息
    _this.getOrderData();
  },
  /**
   * 不使用优惠券
   */
  onNotUseCoupon() {
    let _this = this;
    _this.setData({
      selectCouponId: 0
    });
    // 重新获取订单信息
    _this.getOrderData();
    // 隐藏优惠券弹层
    _this.onTogglePopupCoupon();
  },

  /**
   * 选择支付方式
   */
  onSelectPayType(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 设置当前支付方式
    _this.setData({
      curPayType: e.currentTarget.dataset.value
    });
  },

  /**
   * 跳转到未付款订单
   */
  redirectToOrderIndex() {
    console.log("跳转到未付款订单")
    // wx.redirectTo({
    //   url: '../order/index',
    // });
  },

  /**
   * input绑定：联系人
   */
  onInputLinkman(e) {
    let _this = this;
    _this.setData({
      linkman: e.detail.value
    });
  },

  /**
   * input绑定：联系电话
   */
  onInputPhone(e) {
    let _this = this;
    _this.setData({
      phone: e.detail.value
    });
  },

  /**
   * 选择积分抵扣
   */
  onTriggerPoints({
    detail
  }) {
    let _this = this;
    _this.setData({
      isUsePoints: detail
    });
    // 重新获取订单信息
    _this.getOrderData();
  },

  /**
   * 显示积分说明
   */
  onShowPoints(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 显示dialog
    let setting = _this.data.setting;
    Dialog({
      title: `${setting.points_name}说明`,
      message: setting.points_describe,
      selector: '#zan-base-dialog',
      isScroll: true, // 滚动
      buttons: [{
        text: '关闭',
        color: 'red',
        type: 'cash'
      }]
    });
  },

});