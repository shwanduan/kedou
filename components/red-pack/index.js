"use strict";

var _core = _interopRequireDefault(require('./../../vendor.js')(2));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  props: {
    ownerInfo: {},
    redList: [],
    time:'',
    received:false,
    receivedMoney:'',
  },
  data: {
  
  },
  watch:{
    redList : function redList (){
    //   console.log(222);
    //   var getId = ()=>{
    //     for(var i= 0;i<this.redList.length;i++){
    //       if(this.redList[i].isok==0){
    //         console.log(i);
    //         return i;
    //       }
    //     }
    //   }
    //   // console.log(getId());
    //   let isOkId = getId();
    //  let distance = this.redList[isOkId].start_time - this.redList[isOkId].time;
    //  //  console.log(distance);

    //  var timer =setInterval(()=>{
    //  if(distance==1){
    //    this.time='抢'
    //    clearInterval(timer);
    //  }
    //   distance--;
    //    var minute = Math.floor(distance/60);
    //     var second = distance%60;
    //     minute= minute>10?minute:'0'+minute
    //     second= second>10?second:'0'+second
    //     this.time =minute+':'+second;
    //  },1000)
    },
  },
  methods: {
  
    close: function close() {
      
      this.$emit('hideredpack');
    },
    usecoupon: function usecoupon() {
      console.log("关闭1");
      // var _this = this;
      var getId = ()=>{
        for(var i= 0;i<this.redList.length;i++){
          if(this.redList[i].isok==0){
            console.log(i);
            return i;
          }
        }
      }
      // console.log(getId());
      let isOkId = getId();
      this.$emit('useredpack',this.redList[isOkId].id);
    }
  },
  computed: {},
  created: function created() {}
}, {info: {"components":{},"on":{}}, handlers: {'15-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.usecoupon($event);
      })();
    
  }},'15-1': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.close($event);
      })();
    
  }}}, models: {}, refs: undefined });