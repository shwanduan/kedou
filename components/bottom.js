"use strict";

var _core = _interopRequireDefault(require('./../vendor.js')(2));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  props: {
    header: {},
    isTimReady: false,
    showMore: false,
    isAnchor: false   //是不是主播
  },
  data: {},
  methods: {
    showgoods: function showgoods() {
      this.$emit('showgoods');
    },
    showGift: function showGift() {
      this.$emit('showGift');
    },
   
    sendMessage: function sendMessage(data) {
      this.$emit('send-message', data);
    },
    like: function like() {
      this.$emit('like');
    },
    more: function more() {

      this.$emit('more');
    },
    showSendRed: function more() {
    
      this.$emit('showSendRed');
    },
    closeMore: function closeMore() {

      this.$emit('closeMore');
    },
    editgoods:function editgoods(){
      // console.log("组件")
      this.$emit('editgoods');
    }
  },
  created: function created() {},
  mounted: function mounted() {}
}, {info: {"components":{"goods":{"path":"./goods"},"like":{"path":"./like"},"message":{"path":"./message"},"gift":{"path":"./gift"}},"on":{"12-0":["showgoods"],"12-1":["send-message"],"12-2":["showGift"],"12-3":["like"]}}, handlers: {'12-0': {"showgoods": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.showgoods($event);
      })();
    
  }},'12-1': {"send-message": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.sendMessage($event);
      })();
    
  }},'12-2': {"showGift": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.showGift($event);
      })();
    
  }},'12-3': {"like": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.like($event);
      })();
    
  }},'12-9': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.more($event);
      })();
    
  }},'12-8': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.closeMore($event);
      })();
    
  }},'12-7': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.showSendRed($event);
      })();
    
  }},'12-6': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.editgoods($event);
      })();
    
  }}}, models: {}, refs: undefined });