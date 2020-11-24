import {dateFormat} from '../../../utils/util'
const App = getApp();
const pageIndex = 'category/list::';

Page({
  data: {
    scrollHeight: null,

    showView: false, // 列表显示方式

    sortType: 'all', // 排序类型
    sortPrice: false, // 价格从低到高

    option: {}, // 当前页面参数
    list: {}, // 商品列表数据
    storeList:[],
    no_more: false, // 没有更多数据
    isLoading: true, // 是否正在加载中

    page: 1, // 当前页码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    
    let _this = this;
    // 设置商品列表高度
    _this.setListHeight();
    // 记录option
    _this.setData({
      option
    });
    // 设置列表显示方式
    _this.setShowView();
    // 获取商品列表
    _this.getGoodsList();
    
  },

  /**
   * 设置默认列表显示方式
   */
  setShowView() {
    let _this = this;
    _this.setData({
      showView: wx.getStorageSync(pageIndex + 'showView') || false
    });
  },

  /**
   * 获取商品列表
   * @param {bool} isPage 是否分页
   * @param {number} page 指定的页码
   */
  getGoodsList(isPage, page) {
    // console.log()
    let _this = this;
    App._post_form('user.Balancelog/balaceSellList',  {
 
      page: page || 1,
      // sortType: this.data.sortType,
      // sortPrice: this.data.sortPrice ? 1 : 0,
      // category_id: this.data.option.category_id || 0,
      // search: this.data.option.search || '',
    }, result => {
      let resList = result.data.data,
        dataList = _this.data.list;
       console.log(dataList);
        console.log(resList);
      if (isPage == true) {
        _this.setData({
          'list.data': dataList.data.concat(resList.data),
          
          isLoading: false,
        });
      } else {
        _this.setData({
          list: resList,
          isLoading: false,
        });
      }
    });
  },
  getStoreUserList(isPage, page) {
    let _this = this;
    // App._get('user/getLikeList', {
    App._get('user.Balancelog/withList', {
      page: page || 1,
      // sortType: this.data.sortType,
      // sortPrice: this.data.sortPrice ? 1 : 0,
      // category_id: this.data.option.category_id || 0,
      // search: this.data.option.search || '',
    }, result => {
      let resList = result.data.data.data,
        dataList = _this.data;
      if (isPage == true) {
        _this.setData({
          'storeList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          storeList: resList,
          isLoading: false,
        });
      }
    });
  },
  /**
   * 设置商品列表高度
   */
  setListHeight() {
    let _this = this;
    wx.getSystemInfo({
      success: res => {
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType(e) {
    let _this = this,
      newSortType = e.currentTarget.dataset.type;
      // newSortPrice = newSortType === 'price' ? !this.data.sortPrice : true;
    if(newSortType==this.data.sortType){
      return
    }else{
      if(newSortType=="all"){
        this.getGoodsList();
      }else{
        this.getStoreUserList();
      }
    }
    this.setData({
      list: {},
      // isLoading: true,
      // page: 1,
      sortType: newSortType,
      // sortPrice: newSortPrice
    }, () => {
      // 获取商品列表
     


    });
  },

  /**
   * 切换列表显示方式
   */
  onChangeShowState() {
    let _this = this,
      showView = !_this.data.showView;
    wx.setStorageSync(pageIndex + 'showView', showView);
    _this.setData({
      showView
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.getGoodsList(true, ++this.data.page);
  },
  bindDownLoad2() {
    // 已经是最后一页
    if (this.data.page >= this.data.storeList.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    // 加载下一页列表
    this.getGoodsList(true, ++this.data.page);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage() {
    // 构建分享参数
    return {
      title: "全部分类",
      path: "/pages/category/index?" + App.getShareUrlParams()
    };
  },

  /**
   * 商品搜索
   */
  triggerSearch() {
    let pages = getCurrentPages();
    // 判断来源页面
    if (pages.length > 1 &&
      pages[pages.length - 2].route === 'pages/search/index') {
      wx.navigateBack();
      return;
    }
    // 跳转到商品搜索
    wx.navigateTo({
      url: '../../search/index',
    })
  },

});