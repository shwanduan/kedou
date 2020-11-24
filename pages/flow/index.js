const App = getApp();

// 工具类
import Util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    isLogin: false,

    // 商品列表
    goods_list: [],

    goods_list2: [],

    // 当前动作
    action: 'complete',

    // 选择的商品
    checkedData: [],

    // 是否全选
    checkedAll: false,

    // 商品总价格
    cartTotalPrice: '0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
wx.setNavigationBarColor({
  frontColor: '#ffffff',
  backgroundColor: '#ff6c20',
  animation: {
    duration: 400,
    timingFunc: 'easeIn'
  }
})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
    let _this = this;
    
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    if (_this.data.isLogin) {
     
      // 获取购物车列表
      _this.getCartList();
    }else{
      App.doLogin();
    }
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    App._get('cart/lists', {}, result => {
      _this._initGoodsChecked(result.data); 
    });
  },

  /**
   * 初始化商品选中状态
   */
  _initGoodsChecked(data) {
    let _this = this;
    let checkedData = _this.getCheckedData();
    console.log(_this.getCheckedData());
    // 将商品设置选中
    // data.goods_list.forEach(item => {
    //   item.checked = Util.inArray(`${item.goods_id}_${item.goods_sku_id}`, checkedData);
    // });
   
    var map = {},
    goodsList = data.goods_list,
    dest = [];
    if(data.goods_list != null){
       for(var i = 0; i < goodsList.length; i++) {
        var ai = goodsList[i];
      if(!map[ai.admin_id]){ //依赖分组字段可自行更改！
        dest.push({
           store_name: ai.store_name, //依赖分组字段可自行更改！
           store_img: ai.store_img, //依赖分组字段可自行更改！
           admin_id: ai.admin_id, //依赖分组字段可自行更改！
           data: [ai]
        });
        map[ai.admin_id] = ai; //依赖分组字段可自行更改！
      } else{
      
        for(var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if(dj.admin_id == ai.admin_id) { //依赖分组字段可自行更改！
           dj.data.push(ai);
           break;
         }
      }
    }
  }
}
    let length=0;
    for(let k in dest ){
      length+=dest[k].data.length;
      dest[k].data.forEach(item => {
        item.checked = Util.inArray(`${item.goods_id}_${item.goods_sku_id}`, checkedData);
        });
    }
  
   
    _this.setData({
      // goods_list: data.goods_list,
      goods_list2:dest,
      order_total_price: data.order_total_price,
      action: 'complete',
      checkedAll: checkedData.length ==length,
    });
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
  },

  /**
   * 选择框选中
   */
  onChecked(e) {
    console.log('check'+JSON.stringify(e));
    let _this = this,
      index = e.currentTarget.dataset.index,
      aindex = e.currentTarget.dataset.aindex,
      goods = _this.data.goods_list2[aindex].data[index],
      checked = !goods.checked;

    // 选中状态
    _this.setData({
      // ['goods_list[' + index + '].checked']: checked
      ['goods_list2['+aindex+'].data['+index+'].checked']:checked
    });
    // 更新选中记录
    _this.onUpdateChecked();
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
    let length=0;
    for(let k in _this.data.goods_list2){
      length+=_this.data.goods_list2[k].data.length;
    }

    // 更新全选状态
    _this.setData({
      checkedAll: _this.getCheckedData().length == length
    });
  },

  /**
   * 获取选中的商品
   */
  getCheckedData() {
    let checkedData = wx.getStorageSync('checkedData');
    return checkedData ? checkedData : [];
  },

  /**
   * 选择框全选
   */
  onCheckedAll(e) {
    // 更新商品选中记录
    let _this = this,
      goodsList2 = _this.data.goods_list2;
    for(let k in _this.data.goods_list2 ){
      _this.data.goods_list2[k].data.forEach(item => {
        item.checked = !_this.data.checkedAll;
      });
    }
    _this.setData({
      goods_list2: goodsList2,
      checkedAll: !_this.data.checkedAll
    });
    // 更新购物车已选商品总价格
    _this.updateTotalPrice();
    // 更新选中记录
    _this.onUpdateChecked();
  },

  /**
   * 更新商品选中记录
   */
  onUpdateChecked() {
    let _this = this,
      checkedData = [];

    // _this.data.goods_list.forEach(item => {
    //   if (item.checked == true) {
    //     checkedData.push(`${item.goods_id}_${item.goods_sku_id}`);
    //   }
    // });
    for(let k in _this.data.goods_list2 ){
      _this.data.goods_list2[k].data.forEach(item => {
          if (item.checked == true) {
            checkedData.push(`${item.goods_id}_${item.goods_sku_id}`);
          }
        });
    }
    wx.setStorageSync('checkedData', checkedData);
  }, 

  /**
   * 切换编辑/完成
   */
  switchAction(e) {
    let _this = this;
    _this.setData({
      action: e.currentTarget.dataset.action
    });
  },

  /**
   * 删除商品
   */
  onDelete() {
    let _this = this,
      cartIds = _this.getCheckedIds();
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    }
    console.log(cartIds);
    wx.showModal({
      title: "提示",
      content: "您确定要移除选择的商品吗?",
      success(e) {
        e.confirm && App._post_form('cart/delete', {
          goods_sku_id: cartIds
        }, result => {
          console.log("删除后的数据"+JSON.stringify(result))

          // 删除选中的商品
          _this.onDeleteEvent(cartIds);
          // 获取购物车列表
          _this.getCartList();
        });
      }
    });
  },

  /**
   * 商品删除事件
   */
  onDeleteEvent(cartIds) {
    let _this = this;
    cartIds.forEach((cartIndex) => {
      // _this.data.goods_list.forEach((item, goodsIndex) => {
      //   if (cartIndex == `${item.goods_id}_${item.goods_sku_id}`) {
      //     _this.data.goods_list.splice(goodsIndex, 1);
      //   }
      // });
      for(let k in _this.data.goods_list2 ){
        _this.data.goods_list2[k].data.forEach((item, goodsIndex)=> {
          if (cartIndex == `${item.goods_id}_${item.goods_sku_id}`) {
            _this.data.goods_list2[k].data.splice(goodsIndex, 1);
              }
        });
      }
    });
    // 更新选中记录
    _this.onUpdateChecked();
    return true;
  },

  /**
   * 获取已选中的商品
   */
  getCheckedIds() {
    let _this = this;
    let arrIds = [];
    // _this.data.goods_list.forEach(item => {
    //   if (item.checked === true) {
    //     arrIds.push(`${item.goods_id}_${item.goods_sku_id}`);
    //   }
    // });
    for(let k in _this.data.goods_list2 ){
      _this.data.goods_list2[k].data.forEach(item => {
        if (item.checked === true) {
              arrIds.push(`${item.goods_id}_${item.goods_sku_id}`);
            }
      });
    }
    return arrIds;
  },

  /**
   * 更新购物车已选商品总价格
   */
  updateTotalPrice() {
    let _this = this;
    let cartTotalPrice = 0;
    // _this.data.goods_list.forEach(item => {
    //   if (item.checked === true) {
    //     cartTotalPrice = _this.mathadd(cartTotalPrice, item.total_price);
    //   }
    // });
    for(let k in _this.data.goods_list2 ){
      _this.data.goods_list2[k].data.forEach(item => {
          if (item.checked === true) {
        cartTotalPrice = _this.mathadd(cartTotalPrice, item.total_price);
      }
      });
    }
    _this.setData({
      cartTotalPrice: Number(cartTotalPrice).toFixed(2)
    });
  },

  /**
   * 递增指定的商品数量
   */
  onAddCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      aindex = e.currentTarget.dataset.aindex,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods =_this.data.goods_list2[aindex].data[index];
    // order_total_price = _this.data.order_total_price;
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    App._post_form('cart/add', {
      goods_id: goods.goods_id,
      goods_num: 1,
      goods_sku_id: goodsSkuId
    }, () => {
      // 获取购物车列表
      _this.getCartList();
    }, null, () => {
      wx.hideLoading();
    });
  },

  /**
   * 递减指定的商品数量
   */
  onSubCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      aindex = e.currentTarget.dataset.aindex,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list2[aindex].data[index];
    if (goods.total_num > 1) {
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form('cart/sub', {
        goods_id: goods.goods_id,
        goods_sku_id: goodsSkuId
      }, () => {
        // 获取购物车列表
        _this.getCartList();
      }, null, () => {
        wx.hideLoading();
      });
    }
  },

  /**
   * 购物车结算
   */
  submit() {
    let _this = this,
      cartIds = _this.getCheckedIds();
    if (!cartIds.length) {
      App.showError('您还没有选择商品');
      return false;
    }
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart&cart_ids=' + cartIds
    });
  },

  /**
   * 加法
   */
  mathadd(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping() {
    wx.navigateTo({
      url: '../index/index',
    });
  },
   /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
     // 获取购物车列表
     this.getCartList();
   wx.stopPullDownRefresh();
}

})