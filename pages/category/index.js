const App = getApp();

Page({
  data: {
    // 搜索框样式
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    // 列表高度
    scrollHeight: 0,

    // 一级分类：指针
    curNav: true,
    curIndex: 0,
    leftNav: true,  //二级分类id
    leftIndex: true,  //当前 
    // 分类列表
    list: [],
    sortType: 'all', // 排序类型
    sortPrice: false, // 价格从低到高
    // show
    notcont: false,
   goodsList:[],
   page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let _this = this;
    // 设置分类列表高度
    _this.setListHeight();
    // 获取分类列表
    _this.getCategoryList();
  },

  /**
   * 设置分类列表高度
   */
  setListHeight() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList() {
    let _this = this;
    App._get('category/index', {}, result => {
      let data = result.data;
      let leftList =  data.list[0].child?data.list[0].child:true;
      _this.setData({
        list: data.list,
        templet: data.templet,
        curNav: data.list.length > 0 ? data.list[0].category_id : true,
        leftNav:leftList.length > 0 ? leftList[0].category_id : true,
        leftIndex:0,
        curIndex:0,
        notcont: !data.list.length
      });
  
        _this.getGoodsList();
        
     
    });
  },

  /**
   * 一级分类：选中分类
   */
  selectNav(e) {
    console.log(e);
    let _this = this;
    let curIndex =e.currentTarget.dataset.index;
    // console.log(curIndex);
    // console.log(this.data.list[curIndex]);
   let leftList = this.data.list[curIndex].child?this.data.list[curIndex].child:true;
  //  console.log(this.data.list[curIndex]);
    _this.setData({
      curNav: e.currentTarget.dataset.id,
      curIndex: parseInt(e.currentTarget.dataset.index),
      leftNav:leftList.length > 0 ? leftList[0].category_id : true,
      leftIndex:0,
      scrollTop: 0,
      isLoading: true,
      page: 1,
      goodsList: [],
      
      }, () => {
        // 获取商品列表
        _this.getGoodsList();
        
    });
    // console.log(this.data.leftNav);
      // _this.getGoodsList();
  },
   /**
   * 二级分类：选中分类
   */
  selectLeft(e) {
    let _this = this;
    console.log(e);
    _this.setData({
      leftNav: e.currentTarget.dataset.id,
      leftIndex: parseInt(e.currentTarget.dataset.index),
      scrollTop: 0,
      isLoading: true,
      page: 1,
      goodsList: [],
      
      }, () => {
        // 获取商品列表
        _this.getGoodsList();
        
    });
  
    // this.getGoodsList();
  },

  /**
   * 获取商品列表
   * @param {bool} isPage 是否分页
   * @param {number} page 指定的页码
   */
  getGoodsList(isPage, page) {
    let _this = this;
    App._get('goods/lists', {
      page: page || 1,
      sortType: this.data.sortType,
      sortPrice: this.data.sortPrice ? 1 : 0,
      category_id: this.data.leftNav ,  
      search: '',
    }, result => {
      let resList = result.data.list,
        dataList = _this.data.goodsList;
        // console.log(result);
        // console.log(resList.data);
        // _this.setData({
        //   goodsList:resList.data
        // })
      if (isPage == true) {
        _this.setData({
          goodsList: dataList.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          last_page: resList.last_page,
          goodsList: resList.data,
          isLoading: false,
        });
      }
    });
  },
  /**
   * 下拉到底加载数据
   */
  bindDownLoad() {
    // 已经是最后一页
    if (this.data.page >= this.data.last_page) {

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
    let _this = this;
    return {
      title: _this.data.templet.share_title,
      path: '/pages/category/index?' + App.getShareUrlParams()
    };
  },
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
       // 获取分类列表
       this.getCategoryList();
      wx.stopPullDownRefresh();
  }

});