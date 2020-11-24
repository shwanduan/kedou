// components/footer/footer.js
let App =getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    pageid: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    is_switch:0
  },
  ready(){
    let _this = this;
    App._get('user/isup', {}, function (result) { 
      // console.log(result);
      _this.setData({
        is_switch: result.is_switch,
    
      });
   
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
