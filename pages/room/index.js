"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('./../../vendor.js')(0));

var _core = _interopRequireDefault(require('./../../vendor.js')(2));

var _timWxSdk = _interopRequireDefault(require('./../../vendor.js')(3));

var _tlsMin = _interopRequireDefault(require('./../../common/tls.min.js'));

var _const = _interopRequireDefault(require('./../../common/const.js'));

var timer;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

var SDKAppID = _const["default"].IMSDKAPPID;
var app = getApp();

_core["default"].page({
  data: {
    userSig: '',
    roomId: '',
    SDKAppID: SDKAppID,
    roomCover: '',
    liveComponent: null,
    message: [],
    isTimReady: false,
    userInfo: {},
    groupInfo: {},
    ownerInfo: {},
    animation: null,
    animation2: null,
    hasgift: false,
    giftAvatar: '',
    giftNick: '',
    hascoupon: false,
    giftStack: [],
    couponStack: [],
    goods: [],
    noticeText: '',
    roomStatus: '0',
    play_url: '',
    live_status:'101',//直播间状态
    liveconfig: '', //直播间信息
    userInfo2: "",
    attentioned: false, //是否关注
    isAnchor: false, //是不是主播
    list: [],
    fans: '0',
    showRed: false,
    redList: [],
    couponList: [],
    couponNum: 0,
    redNum: 0,
    hasredpack: false,
    time:'',
    receivedMoney:'',
    received:false
  },
  mixins: [],
  computed: {
    messageQueen: function messageQueen() {
      var queenLen = 100; //内存里面放100条消息，以免观看直播太久撑爆内存

      if (this.message.length > queenLen) {
        var vl = this.message.length - queenLen;

        for (var i = 0; i < vl; i++) {
          this.message.shift();
        }
      }

      return this.message;
    }
  },
  watch: {},
  methods: {
    // // 获取商品列表
    // getGoodList :function getGoodList (isPage, page) {
    //   let _this = this;
    //   app._get('goods/lists', {
    //     page: 1,
    //     sortType: "all",
    //     sortPrice:  0,
    //     category_id: 0,  
    //     search: '',
    //     room_id:_this.roomId,
    //     is_user:1 
    //   }, result => {
    //     console.log(result.data.list.data);
    //     let resList = result.data.list.data;
    //       _this.list=resList;
    //         _this.isLoading= false;

    //     // }
    //   });
    // },

    getLike() {
      var that = this;
      // console.log("this",this);
      app._get("live.room/getLike", {
        room_id: this.roomId
      }, result => {
        that.attentioned = result.data.status == 0 ? false : true;
        console.log("++++++++++", that.attentioned);
      });
    },
    getroominfo() {
      app._get("live.room/getroominfo", {
        room_id: this.roomId
      }, result => {
        this.live_status=result.data.live_status
        this.fans = result.data.number;
      });
    },
    // 拉流地址
    getPlayUrl() {
      let _this = this;
      app._get("live.webapi/getPlayUrl", {
        streamName: this.roomId
      }, result => {
        // console.log(result);
        _this.play_url = result.data.rtmp;

        // console.log(_this.play_ur);
        // 刷新直播间状态 (体验不佳, 暂不使用)
        // _this.setLiveStatusText(resList);
      });
    },
    // 获取iM配置信息
    getliveconfig() {
      let _this = this;
      app._post_form("live.room/getliveconfig", {
        room_id: this.roomId
      }, result => {
        _this.liveconfig = result.data;
        console.log('用户信息', result);
        // 刷新直播间状态 (体验不佳, 暂不使用)
        // _this.setLiveStatusText(resList);
        // _this.getUserSig();
        _this.adduser();
      });
    },
    adduser() {
      let _this = this;
      app._get("live.room/adduser", {

      }, result => {

        console.log(result.data.Nick);
        // _this.play_url= result.data;
        _this.initTimLiveSell();
        // console.log(_this.data.result);
        // 刷新直播间状态 (体验不佳, 暂不使用)
        // _this.setLiveStatusText(resList);
      });
    },
    // 跳转详情
    seeGoods: function seeGoods(data) {
      wx.navigateTo({
        url: './../goods/index?goods_id=' + data.id + '&room_id=' + this.roomId,
      })
    },
    statechange: function statechange() {},
    initTimLiveSell: function initTimLiveSell() {
      var _this = this;

      this.tls = new _tlsMin["default"]({
        // SDKAppID: this.SDKAppID,
        // // roomID: this.roomId,
        // userSig: this.userSig,
        // userName: app.userData.id,
        // TIM: _timWxSdk["default"]
        SDKAppID: this.liveconfig.SDKAppID,
        roomID: this.liveconfig.roomID,
        userSig: this.liveconfig.userSig,
        userName: this.liveconfig.user_id,
        TIM: _timWxSdk["default"]
      });
      this.tls.on(_tlsMin["default"].EVENT.SDK_READY, /*#__PURE__*/ _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee() {
        var _yield$_this$tls$join, groupInfo, userInfo, goods, msg;

        return _regeneratorRuntime2["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('SDK 已经初始化好了', Math.random());
                console.log('SDK 已经初始化好了', _context);
                _this.isTimReady = true; //sdk可用了

                _context.next = 4;
                return _this.tls.joinRoom({
                  roomID: _this.liveconfig.roomID,
                  getOwnerInfo: true
                });

              case 4:
                _yield$_this$tls$join = _context.sent;
                groupInfo = _yield$_this$tls$join.groupInfo;
                userInfo = _yield$_this$tls$join.userInfo;
                _this.userInfo = userInfo;
                _this.groupInfo = groupInfo;
                _this.ownerInfo = groupInfo.ownerInfo;
                _this.noticeText = groupInfo.notification;

                // try {
                //   // goods = JSON.parse(_this._getVarsByKey(groupInfo.groupCustomField, 'addgoods'));
                //   goods = _this.list;
                //   console.log("商品",goods);
                // } catch (err) {
                //   goods = [];
                // }

                // _this.goods = goods;

                if (_this.noticeText) {
                  msg = [];
                  msg.push({
                    name: '公告',
                    message: _this.noticeText,
                    id: "id".concat(Date.now()),
                    type: 2
                  });
                  _this.message = _this.message.concat(msg);
                }

                case 14:
                case "end":
                  return _context.stop();
            }
          }
        }, _callee);
      })));
      this.tls.on(_tlsMin["default"].EVENT.JOIN_GROUP, /*#__PURE__*/ function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee2(data) {
          var msg;
          return _regeneratorRuntime2["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  console.log('已经加入了群聊', Math.random()); //有人加群
                  console.log('已经加入了群聊', data); //有人加群
                  if(_this.groupInfo.ownerInfo.userID==data.userID) {
                    console.log("开始直播",data.userID);
                    // _this.getCouponList();
                    _this.getroominfo();
                  } 
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: '加入了直播间',
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.ERROR, /*#__PURE__*/ function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee3(data) {
          return _regeneratorRuntime2["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.EXIT_GROUP, /*#__PURE__*/ function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee4(data) {
          var msg;
          return _regeneratorRuntime2["default"].wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  console.log(this.groupInfo.groupID);
                  console.log(data.userID);
                  //有人退群
                  // msg = [];
                  // msg.push({
                  //   name: _this._formatNick(data.userID, data.nick),
                  //   message: '退出了直播间',
                  //   id: "id".concat(Date.now())
                  // });
                  // _this.message = _this.message.concat(msg);

                case 3:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function (_x3) {
          return _ref4.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.NOTIFACATION, /*#__PURE__*/ function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee5(data) {
          var msg;
          console.log("++++++++有新公告");
          return _regeneratorRuntime2["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  //有新的公告
                  _this.noticeText = data.notification;
                  msg = [];
                  msg.push({
                    name: '公告',
                    message: _this.noticeText,
                    id: "id".concat(Date.now()),
                    type: 2
                  });
                  _this.message = _this.message.concat(msg);

                case 4:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        return function (_x4) {
          return _ref5.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.MESSAGE, /*#__PURE__*/ function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee6(data) {
          var msg;
         
          return _regeneratorRuntime2["default"].wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (data.message == 'redpacket' ||data.message == 'noredpacket' ){
                    // console.log("获取红包");
                    _this.getRedList();

                  }  else if( data.message=='redcoupon') {
                    console.log("优惠券");
                    _this.getCouponList();
                  }   else if( data.message=='关闭了直播'&& _this.groupInfo.ownerInfo.userID==data.userID) {
                    console.log("关闭直播",data.userID);
                    // _this.getCouponList();
                    _this.getroominfo();
                  } else {
                    //有人发消息
                    msg = [];
                    msg.push({
                      name: _this._formatNick(data.userID, data.nick),
                      message: data.message,
                      id: "id".concat(Date.now())
                    });
                    _this.message = _this.message.concat(msg);
                  }
                  case 3:
                  case "end":
                    return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x5) {
          return _ref6.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.LIKE, /*#__PURE__*/ function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee7(data) {
          var msg;
          return _regeneratorRuntime2["default"].wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  //有人给主播点赞
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: '给主播点赞了',
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);

                case 3:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        return function (_x6) {
          return _ref7.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.SEND_GIFT, /*#__PURE__*/ function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee8(data) {
          var msg;
          return _regeneratorRuntime2["default"].wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  //有人给主播送礼
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: '给主播送礼了',
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);
                  _this.hasgift = true;
                  _this.giftAvatar = data.avatar;
                  _this.giftNick = data.nick;

                case 6:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8);
        }));

        return function (_x7) {
          return _ref8.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.ATTENTION, /*#__PURE__*/ function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee9(data) {
          var msg, a;
          return _regeneratorRuntime2["default"].wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  //有人关注了主播
                  app._get("live.room/getroominfo", {
                    room_id: _this.roomId
                  }, result => {
                    _this.fans = result.data.number;
                  });
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: '关注了主播',
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);
                  _context9.next = 5;
                  console.log(_context9.next);
                  console.log(_this.message);
                  return _this.tls.getUserInfo();

                case 5:
                  a = _context9.sent;

                case 6:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9);
        }));

        return function (_x8) {
          return _ref9.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.CANCELATTENTION, /*#__PURE__*/ function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee9(data) {
          var msg, a;
          return _regeneratorRuntime2["default"].wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  //有人取消关注了主播
                  app._get("live.room/getroominfo", {
                    room_id: _this.roomId
                  }, result => {
                    _this.fans = result.data.number;
                  });
                  // msg = [];
                  // msg.push({
                  //   name: _this._formatNick(data.userID, data.nick),
                  //   message: '取消关注了主播',
                  //   id: "id".concat(Date.now())
                  // });
                  // _this.message = _this.message.concat(msg);
                  // _context9.next = 5;
                  // console.log(_context9.next);
                  // console.log(_this.message);
                  // return _this.tls.getUserInfo();

                case 5:
                  a = _context9.sent;

                case 6:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9);
        }));

        return function (_x8) {
          return _ref9.apply(this, arguments);
        };
      }());
      // TLS.EVENT.ROOM_STATUS_CHANGE,
      this.tls.on(_tlsMin["default"].EVENT.ROOM_STATUS_CHANGE, /*#__PURE__*/ function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee2(data) {
          var msg;
          console.log(data);
          return _regeneratorRuntime2["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: '离开了直播间',
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.BUY_GOODS, /*#__PURE__*/ function () {
        var _ref10 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee10(data) {
          var msg;
          return _regeneratorRuntime2["default"].wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  //有人购买了商品
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: "\u8D2D\u4E70\u4E86\u5546\u54C1\uFF08".concat(JSON.parse(data.value).name, "\uFF09"),
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);

                case 3:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10);
        }));

        return function (_x9) {
          return _ref10.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.USE_COUPON, /*#__PURE__*/ function () {
        var _ref11 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee11(data) {
          var msg;
          return _regeneratorRuntime2["default"].wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  //有人领了优惠券
                  msg = [];
                  msg.push({
                    name: _this._formatNick(data.userID, data.nick),
                    message: '领取了优惠券',
                    id: "id".concat(Date.now())
                  });
                  _this.message = _this.message.concat(msg);

                case 3:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11);
        }));

        return function (_x10) {
          return _ref11.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.ADD_GOODS, /*#__PURE__*/ function () {
        var _ref12 = _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee12(data) {
          var goods;
          return _regeneratorRuntime2["default"].wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  //该场直播推荐商品有变更
                  wx.showToast({
                    title: '有新的商品上架'
                  });

                  // try {
                  //   goods = JSON.parse(data.value);
                  // } catch (err) {
                  //   goods = [];
                  // }

                  // _this.goods = goods;

                case 3:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12);
        }));

        return function (_x11) {
          return _ref12.apply(this, arguments);
        };
      }());
      this.tls.on(_tlsMin["default"].EVENT.KICKED, /*#__PURE__*/ _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee13() {
        return _regeneratorRuntime2["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      })));
      this.tls.on(_tlsMin["default"].EVENT.NETWORK_CHANGE, /*#__PURE__*/ _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee14() {
        return _regeneratorRuntime2["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      })));
      this.tls.on(_tlsMin["default"].EVENT.SDK_NOT_READY, /*#__PURE__*/ _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee15() {
        return _regeneratorRuntime2["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      })));
      this.tls.on(_tlsMin["default"].EVENT.PROFILE_UPDATE, /*#__PURE__*/ _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee16() {
        return _regeneratorRuntime2["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      })));
      this.tls.on(_tlsMin["default"].EVENT.ERROR, /*#__PURE__*/ _asyncToGenerator( /*#__PURE__*/ _regeneratorRuntime2["default"].mark(function _callee17() {
        return _regeneratorRuntime2["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      })));
    },
    hidecoupon: function hidecoupon() {
      var _this2 = this;

      this.hascoupon = false;
      setTimeout(function () {
        if (_this2.couponStack.shift()) {
          _this2.hascoupon = true;
        }
      }, 1000);
    },
    usecoupon: function usecoupon(event) {
      var _this3 = this;
      console.log(event);
      // console.log("领取");
      app._post_form('user.coupon/receive', {
        coupon_id: event
      }, function(result) {
        app.showSuccess(result.msg);
        // 获取优惠券列表
        _this3.getCouponList();
      });
      this.tls.useCoupon().then(function (data) {
        _this3.hidecoupon();
      });
    },

    coupon: function coupon() {
      this.hascoupon = true;
    },
    hideredpack: function hideredpack() {
      var _this2 = this;
      console.log("关闭2");
      this.hasredpack = false;
      this.received = false;
      // setTimeout(function () {
      //   // if (_this2.couponStack.shift()) {
      //   //   _this2.hascoupon = true;
      //   // }
      // }, 1000);
    },
    useredpack: function useredpack(id) {
      var _this = this;
      console.log(id);
      app._post_form("live.room/addRedUser", {
        red_id: id,
      }, result => {
        console.log(result.data);
        if (result.msg == '领取成功') {
          // result.data.price
          this.received = true;
          if(result.data.price){
            this.receivedMoney = result.data.price;
          }else if(result.data.code){
            if(result.data.code==2){
              this.receivedMoney= 0;
            }
          }
          this.tls.sendMessage('领取红包').then(function (res) {
            _this.message = _this.message.concat([{
              name: _this._formatNick(_this.userInfo.userID, _this.userInfo.nick),
              message: res.message,
              id: "id".concat(Date.now())
            }]);
          });
        }
        _this.getRedList();
      
      },()=>{
        _this.getRedList();
        _this.hideredpack();
      });
      // _this.hideredpack();

    },


    redpack: function redpack() {
      console.log('打来红包');
      this.hasredpack = true;
    },
    _formatNick: function _formatNick(userID, nick) {
      console.log("用户信息1", userID, "用户信息2", this.userInfo.userID, "用户信息3", nick);
      if (userID === this.userInfo.userID) {
        return '我';
      }

      return nick;
      // return userID;
    },
    buy: function buy(data) {
      var _this4 = this;

      wx.showLoading();

      this.tls.buy(data).then(function () {
        wx.hideLoading();

        _this4.hidegoods();
      });
    },
    hideani: function hideani() {
      var _this5 = this;

      this.hasgift = false, this.giftAvatar = '', this.giftNick = '';
      setTimeout(function () {
        var msg = _this5.giftStack.shift();

        if (msg) {
          _this5.hasgift = true, _this5.giftAvatar = msg.giftAvatar, _this5.giftNick = msg.giftNick;
        }
      }, 1000);
    },
    showgoods: function showgoods() {
      app._get('goods/lists', {
        page: 1,
        sortType: "all",
        sortPrice: 0,
        category_id: 0,
        search: '',
        room_id: this.roomId,
        is_use: 1
      }, result => {
        console.log(result.data.list.data);
        let resList = result.data.list.data;
        this.goods = resList;
        this.isLoading = false;
      });

      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom(0).step();
      this.animation2 = ani["export"]();
    },
    hidegoods: function hidegoods() {
      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom('-100vh').step();
      this.animation2 = ani["export"]();
    },
    showGift: function showGift() {
      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom(0).step();
      this.animation = ani["export"]();
    },
    sendgift: function sendgift() {
      var _this6 = this;

      wx.showModal({
        title: '提示',
        content: '确认送礼？',
        success: function success(data) {
          if (data.confirm) {
            _this6.tls.sendGift('礼物');
          }

          _this6.hideGift();
        }
      });
    },
    hideGift: function hideGift() {
      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom('-45vh').step();
      this.animation = ani["export"]();
    },
    like: function like() {
      this.tls.like().then(function (data) {});
    },

    // 关注
    attention: function attention() {
      wx.showLoading();
      // 获取iM配置信息
      let _this2 = this;
      if (!this.attentioned) {
        app._post_form("live.room/addLike", {
          room_id: _this2.roomId
        }, result => {
          // console.log(result);
          _this2.attentioned = true;
        });
        this.tls.attention().then(function (data) {
          wx.hideLoading();
        })["catch"](function () {
          wx.hideLoading();
        });
      } else {
        this.cancelAttention();
      }


    },

    // 取消关注
    cancelAttention: function cancelAttention() {

      this.tls.cancelAttention().then(function (data) {
        wx.hideLoading();
      })["catch"](function () {
        wx.hideLoading();
      });
      wx.showLoading();
      let _this = this;
      app._post_form("live.room/deleteLike", {
        room_id: this.roomId
      }, result => {
        console.log(result);
        _this.attentioned = false;
        _this.fans--;
        wx.hideLoading();
      });

    },

    quitGroup: function quitGroup() {
      var _this7 = this;

      wx.showLoading({
        mask: true
      });
      this.tls.exitRoom().then(function () {
        wx.hideLoading();
        wx.navigateTo({
          url: './../live/list',
        })
        _this7.isTimReady = false;
      })["catch"](function (err) {
        wx.navigateTo({
          url: './../live/list',
        })
      });
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
    sendMessage: function sendMessage(data) {
      // console.log('发送',data);
      var _this8 = this;

      this.tls.sendMessage(data).then(function (res) {
        _this8.message = _this8.message.concat([{
          name: _this8._formatNick(_this8.userInfo.userID, _this8.userInfo.nick),
          message: res.message,
          id: "id".concat(Date.now())
        }]);
      });
    },
    getUserSig: function getUserSig() {
      var _this9 = this;

      wx.request({
        url: "".concat(_const["default"].HOST, "/release/getUserSig"),
        method: 'GET',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          userId: app.userData.id
        },
        success: function success(data) {
          _this9.userSig = data.data.userSig;

          _this9.initTimLiveSell();
        },
        fail: function fail() {}
      });
    },
    //获取优惠券：
    getCouponList :function getCouponList(){
      // console.log('//获取优惠券：');
      var _this = this;
      app._get('coupon/lists', {
        room_id: _this.roomId,
      }, function(result) {
        // _this.setData({
        //   list: result.data.list,
        //   notcont: !result.data.list.length
        // });
        console.log(result);
        _this.couponList = result.data;
        var num = 0;
        if(result.data.list.length>0){
          for(var i in result.data.list){
            if(!result.data.list[i].is_receive){
              num++
            }
          }
          _this.couponNum=num;
        }
      });
    },
    //获取红包
    getRedList: function getRedList(){ 
      // console.log("获取红包列表");
      var _this = this;
      app._post_form("live.room/getRedList", {
      room_id: _this.roomId,
    }, result => {
      // console.log(result.data);
      clearInterval(timer)
      _this.redList = result.data;
      let num = 0; // 未领取红包个数
      if (_this.redList == null) {
        _this.showRed = false;
      } else {
        for (let i in _this.redList) {
          if (_this.redList[i].isok == 0) {
            num++
          }
        }
        _this.redNum = num;
        console.log(num);
        if (  num > 0){
  
          _this.showRed = true;
          var getId = () => {
            for (var i = 0; i < _this.redList.length; i++) {
              if (_this.redList[i].isok == 0) {
                console.log(i);
                return i;
              }
            }
          }
          var  isOkId = getId();
          console.log(isOkId);
          var  distance = _this.redList[isOkId].start_time - _this.redList[isOkId].time;
        
          timer = setInterval(() => {
            
            if (distance <= 1) {
              clearInterval(timer);
            }
            
            distance--;
            var minute = Math.floor(distance / 60);
            var second = distance % 60;
            minute = minute >= 10 ? minute : '0' + minute
            second = second >= 10 ? second : '0' + second
            _this.time = minute + ':' + second;
            console.log(_this.time);
            console.log(distance);
            if(distance <= 0){
              console.log("开始抢啦");
              _this.time = '抢';
            }
          }, 1000);
        }else
          _this.showRed = false;
  
      }
  
    });},
  
  },
  /**
   * 分享当前页面
   */
  onShareAppMessage() {
    let _this = this;
    app._get("live.room/getroominfo", {
      room_id: this.roomId
    }, result => {
      let url = "/pages/room/index?room_status=1&im_id=" + this.roomId
      return {
        title: result.data.anchor_name,
        path: url
      };
    });



  },

  onLoad: function onLoad(data) {
    if (wx.getStorageSync('token') == '') {
      console.log("未登录");
      wx.navigateTo({
        url: '../live/list',
      })
      return;
    }else{
      console.log('登录',wx.getStorageSync('token'));
    }
    this.roomId = data.im_id;
    this.roomCover = data.room_cover;
    // this.roomStatus = data.room_status;
    // this.getUserSig();
    this.getliveconfig();
    this.getPlayUrl();
    // this.getGoodList();
    this.getLike();
    this.getroominfo();
    this.getRedList();
    this.getCouponList();
  },

  onUnload: function onUnload() {
    this.tls.destroy();
    this.tls = null;
    this.message = [];
  },
  events: {}
}, {
  info: {
    "components": {
      "room-header": {
        "path": "./../../components/header"
      },
      "room-bottom": {
        "path": "./../../components/bottom"
      },
      "chatroom": {
        "path": "./../../components/chatroom"
      },
      "gifts": {
        "path": "./../../components/gifts"
      },
      "coupon": {
        "path": "./../../components/coupon"
      },
      "red-pack": {
        "path": "./../../components/red-pack/index"
      },
      "notice": {
        "path": "./../../components/notice"
      },
      "goods-list": {
        "path": "./../../components/goodslist"
      },
      "gift-animation": {
        "path": "./../../components/gift-animation"
      },
      "no-owner": {
        "path": "./../../components/noowner"
      }
    },
    "on": {
      "5-0": ["attention", "quitGroup", "coupon", "redpack"],
      "5-2": ["send-message", "like", "showGift", "showgoods"],
      "5-7": ["hideGift", "sendgift"],
      "5-9": ["hidegoods", "buy", "seeGoods"],
      "5-11": ["hideani"],
      "5-12": ["hidecoupon", "usecoupon"],
      "5-13": ["hideredpack", "useredpack"],
    }
  },
  handlers: {
    '5-0': {
      "attention": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.attention($event);
        })();

      },
      "quitGroup": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.quitGroup($event);
        })();

      },
      "coupon": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.coupon($event);
        })();


      },
      "redpack": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.redpack($event);
        })();

      }
    },
    '5-2': {
      "send-message": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.sendMessage($event);
        })();

      },

      "like": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.like($event);
        })();

      },
      "showGift": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.showGift($event);
        })();

      },
      "showgoods": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.showgoods($event);
        })();

      }
    },
    '5-7': {
      "hideGift": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.hideGift($event);
        })();

      },
      "sendgift": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.sendgift($event);
        })();

      }
    },
    '5-9': {
      "hidegoods": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.hidegoods($event);
        })();

      },
      "buy": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.buy($event);
        })();

      },
      "seeGoods": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.seeGoods($event);
        })();

      },
    },
    '5-11': {
      "hideani": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.hideani($event);
        })();

      }
    },
    '5-12': {
      "hidecoupon": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.hidecoupon($event);
        })();

      },
      "usecoupon": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.usecoupon($event);
        })();

      }
    },
    '5-13': {
      "hideredpack": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.hideredpack($event);
        })();

      },
      "useredpack": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.useredpack($event);
        })();

      }
    },
    '5-14': {
      "statechange": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.statechange($event);
        })();

      },
      "error": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.error($event);
        })();

      }
    }
  },
  models: {},
  refs: undefined
});