const App = getApp();

Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    dataList: Object
  },
  data: {
    selectType: 0,
    categoryList: [],
    id:0,
   

  },

  ready: function() {
  
    this.getList(this.properties.dataList[0].id);

   },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    getList(id){
      let _this = this;
      App._get('page/getIndexCategory', {
        id:id,
       
      }, function (result) {
        let resList = result.data.data;
        console.log(resList);
        _this.setData({
          categoryList: resList,
      
        });
     
      });
    },
    _onTargetTitle(e) {
    
      // this.data.selectType = e.detail.target.dataset.index;
      var index = e.detail.target.dataset.index;
        this.setData({
          selectType:index
        })
       
        this.getList(this.properties.dataList[index].id);
        console.log( this.properties.dataList[index].id);
    },
    /**
     * 跳转商品详情页
     */
    _onTargetGoods(e) {
      // 记录formid
      App.saveFormId(e.detail.formId);
      console.log(e);
      wx.navigateTo({
        url: '/pages/goods/index?goods_id=' + e.detail.target.dataset.id,
      });
    },
  }

})