"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(2));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = getApp();

_core["default"].component({
  props: {
    userInfo: {},
    groupinfo: {},
    ownerInfo: {},
    liveconfig:{},
    redList: [],
    redNum: 0,
    showRed:false, 
    attentioned:false,
    isAnchor: false ,  //是不是主播
    // roomId: '',
    fans: 0,
    time:'',
    couponNum:0,
  },
  data: {
    attention: false,
   
    // fans: '0'

  },
  methods: {
    quitGroup: function quitGroup() {
      this.$emit('quitGroup');
    }, 
   
    coupon: function coupon() {
      this.$emit('coupon');
    },
    redpack: function redpack() {
      this.$emit('redpack');
    },

    _getVarsByKey: function _getVarsByKey(arr, key) {
      var res;

      for (var i = 0; i < arr.length; i++) {
        if (arr[i].key === key) {
          res = arr[i].value;
          break;
        }
      }

      return res;
    },
    attentionBtn: function attentionBtn() {
      if (!this.attention) {
        this.$emit('attention');

      }
    }
  },
  computed: {},
  watch: {
    // groupinfo: function groupinfo(nexto, pre) {
    //   // if (nexto.groupCustomField) {
    //     // this.fans = this._getVarsByKey(nexto.groupCustomField, 'attent') || '0';
    //   // }
    //   app._get("live.room/getroominfo", {
    //     room_id: this.roomId
    //   }, result => {
    //     this.fans =result.data.number;
    //     // console.log( );
    //   });
    // },
    redList : function redList (){
      // console.log(111);
      
    },
    userInfo: function userInfo(nexto, pre) {
      var at = false;
      if (nexto.userID) {
        var profileCustomField = nexto.profileCustomField;
        var profile = JSON.parse(this._getVarsByKey(profileCustomField, "Tag_Profile_Custom_avlist") || "[]");
        for (var i in profile) {
          if (profile[i].ownerid === this.ownerInfo.userID) {
            at = true;
            break;
          }
        }
      }
      this.attention = at;
    }
  },
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  created: function created() {// this.profileCustomField = this.userInfo.profileCustomField
  
  }
}, {info: {"components":{"back":{"path":"./back"}},"on":{"12-4":["quitGroup"]}}, handlers: {'11-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.attentionBtn($event);
      })();
    
  }},'12-4': {"quitGroup": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.quitGroup($event);
      })();
    
  }},'11-1': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.coupon($event);
      })();
    
  }},'11-2': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.redpack($event);
      })();
    
  }}}, models: {}, refs: undefined });