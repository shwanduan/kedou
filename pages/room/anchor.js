"use strict";

var _regeneratorRuntime2 = _interopRequireDefault(require('./../../vendor.js')(0));

var _core = _interopRequireDefault(require('./../../vendor.js')(2));

var _timWxSdk = _interopRequireDefault(require('./../../vendor.js')(3));

var _tlsMin = _interopRequireDefault(require('./../../common/tls.min.js'));

var _const = _interopRequireDefault(require('./../../common/const.js'));

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
var ctx
_core["default"].page({
  data: {
    userSig: '',
    roomId: '',
    SDKAppID: SDKAppID,
    roomCover: '',
    mode: 'FHD',
    liveComponent: null,
    message: [],
    isTimReady: false,
    userInfo: {},
    groupInfo: {},
    ownerInfo: {},
    animation: null,
    animation2: null,
    animation3: null,
    hasgift: false,
    giftAvatar: '',
    giftNick: '',
    hascoupon: false,
    giftStack: [],
    couponStack: [],
    goods: [],
    noticeText: '',
    roomStatus: '0',
    push_url: '',
    liveconfig: '', //直播间信息
    userInfo2: "",
    noMore: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码
    list: {}, // 商品列表数据
    search: '', //搜索商品
    toSleect: false,
    scrollHeight: '',
    isAnchor: true, //是不是主播
    beautyNum: 1,
    toSet: false,
    fans: "0",
    packetMoney: '',
    packetNumber: '',
    payType:20,
    showMore:false,
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
  onReady(res) {
    console.log('加载中');
    ctx = wx.createLivePusherContext('pusher');
    console.log
  },
  methods: {
    sliderchange(e) {
      this.setData({
        beautyNum: e.detail.value
      })
      console.log("美颜", e.detail.value)
    },
    getroominfo() {
      app._get("live.room/getroominfo", {
        room_id: this.roomId
      }, result => {
        this.fans = result.data.number;
      });
    },
    selectGood(e) {
      // console.log(e.currentTarget.dataset.select);
      let _this = this;
      wx.showLoading()
      app._post_form("live.room/editgoods", {
        // room_id: this.roomId,
        goods_id: e.currentTarget.dataset.select
      }, result => {
        // console.log(result);
        wx.hideLoading();
        // _this.toback();
        var goodsList = this.list.data;
        goodsList.forEach(item => {
          if(item.goods_id==e.currentTarget.dataset.select){
            item.is_tuisong= item.is_tuisong==0? 1:0;
          }
        });
        app.showSuccess(result.msg);
        // console.log(this.list);
        // _this.tls.add_goods(data).then(function () {
        // });
      });

    },
    /**
     * 下拉到底加载数据
     */
    bindDownLoad() {
      // 已经是最后一页
      // console.log("到底了");
      // console.log(this.page);
      // console.log(this.list.last_page);
      if (this.page >= this.list.last_page) {
        this.no_more= true;
        return false;
      }
    
      // 加载下一页列表
      this.getGoodList(true, ++this.page);
    },
    /**
     * 商品搜索
     */
    triggerSearch() {

    },
    bindKeyInput: function (e) {
      this.search = e.detail.value

    },
    // 推流地址
    get_push_url() {
      let _this = this;
      app._get("live.webapi/get_push_url", {
        streamName: this.roomId
      }, result => {
        console.log(result);
        _this.push_url = result.data;

        // 刷新直播间状态 (体验不佳, 暂不使用)
        // _this.setLiveStatusText(resList);
      });
    },
    statechange(e) {
      console.log('live-pusher code:', e.detail.code)
    },
    bindStart() {
      console.log('开始直播');
      console.log(ctx);
      ctx.start({

        success: res => {
          console.log('start success')
        },
        fail: res => {
          console.log('start fail')
        }
      })
    },
    bindPause() {
      ctx.pause({
        success: res => {
          console.log('pause success')
        },
        fail: res => {
          console.log('pause fail')
        }
      })
    },
    bindStop : function bindStop() {
      var _this8= this;
      console.log(this);
     
      app._get("live.room/updataStatus", {
        room_id: this.roomId,
        live_status: 103,
      }, result => {
        ctx.stop({
          success: res => {
            console.log('stop success')
          },
          fail: res => {
            console.log('stop fail')
          }
        })
      this.tls.sendMessage('关闭了直播').then(function (res) {
        _this8.message = _this8.message.concat([{
          name: _this8._formatNick(_this8.userInfo.userID, _this8.userInfo.nick),
          message: res.message,
          id: "id".concat(Date.now())
        }]);
      });
      wx.reLaunch({
        url: '../user/index',
      });
        // wx.navigateTo({
        //   url: '../user/index',
        // })
        // wx.navigateBack();
      });


    },
    bindResume() {
      ctx.resume({
        success: res => {
          console.log('resume success')
        },
        fail: res => {
          console.log('resume fail')
        }
      })
    },
    bindSwitchCamera() {
      ctx.switchCamera({
        success: res => {
          console.log('switchCamera success')
        },
        fail: res => {
          console.log('switchCamera fail')
        }
      })
    },
    // 拉流地址
    // getPlayUrl() {
    //   let _this = this;
    //   app._get("live.webapi/getPlayUrl", {
    //     streamName: this.roomId
    //   }, result => {
    //     // console.log(result);
    //     _this.play_url = result.data;

    //     // console.log(_this.data.result);
    //     // 刷新直播间状态 (体验不佳, 暂不使用)
    //     // _this.setLiveStatusText(resList);
    //   });
    // },
    toback: function toback() {
      this.toSleect = false;
      console.log(this);
    },
    toSetting: function toSetting() {
      this.toSet = !this.toSet;
      console.log(this);
    },

    /**
     * 设置商品列表高度
     */
    setListHeight() {
      let _this = this;
      wx.getSystemInfo({
        success: res => {
          _this.scrollHeight = res.windowHeight - 90;

        }
      });
    },
    // 获取上品列表
    getGoodList(isPage, page) {
      this.showMore= false;
      let _this = this;
      app._get('goods/lists', {
        page: page || 1,
        sortType: "all",
        sortPrice: 0,
        category_id: 0,
        search: this.search,
        room_id: _this.roomId,
        listRows: 50,
      }, result => {

        // console.log(result.data.list.data);
        let resList = result.data.list;
        console.log(_this);
        // console.log(dataList);
        if (isPage == true) {
          let dataList = _this.list;
          _this.list.data= dataList.data.concat(resList.data);
          _this.isLoading= false
        } else {
          _this.list = resList;
          _this.isLoading = false;
          _this.page = 1;

        }
        console.log(_this);
      });
    },
    // 获取iM配置信息
    getliveconfig() {
      let _this = this;
      app._post_form("live.room/getliveconfig", {
        room_id: this.roomId
      }, result => {
        _this.liveconfig = result.data;
        console.log(result);
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

                try {
                  goods = JSON.parse(_this._getVarsByKey(groupInfo.groupCustomField, 'addgoods'));
                } catch (err) {
                  goods = [];
                }

                _this.goods = goods;

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
                  // console.log('已经加入了群聊', Math.random()); //有人加群
                  console.log('已经加入了群聊', data); //有人加群
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
                  console.log(_this.groupInfo.groupID);
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
                  // console.log('发消息',data);
                  if(data.message=='redpacket'||data.message=='redcoupon'){
                    
                  }else{
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

                  try {
                    goods = JSON.parse(data.value);
                  } catch (err) {
                    goods = [];
                  }

                  _this.goods = goods;

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
    usecoupon: function usecoupon() {
      var _this3 = this;

      this.tls.useCoupon().then(function (data) {
        _this3.hidecoupon();
      });
    },
    coupon: function coupon() {
      this.hascoupon = true;
    },
    _formatNick: function _formatNick(userID, nick) {
      console.log("用户信息1", userID, "用户信息2", this.userInfo.userID, "用户信息3", nick);
      if (userID === this.userInfo.userID) {
        return '我';
      }

      return nick;

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
     
      this.showMore = false;
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
   
    showSendRed: function  showSendRed() {
      console.log("发红包");
      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom(0).step();
      this.animation3 = ani["export"]();
    },
    hidesendred: function hidesendred() {
      console.log("关闭");
      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom('-100vh').step();
      this.animation3 = ani["export"]();
    },
    showGift: function showGift() {
      var ani = wx.createAnimation({
        duration: 200
      });
      ani.bottom(0).step();
      this.animation = ani["export"]();
    },
    // 推送商品
    editgoods: function editgoods() {
      console.log("打开推送", this.toSleect);
      this.getGoodList();
      this.toSleect = true;
      // console.log("获取推送商品");
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
    // 打开更多
    more:function more (){
      this.showMore = true;
    },
    closeMore:function closeMore (){
      // console.log("关闭更多2");
      this.showMore = false;
    },

    // 关注
    attention: function attention() {
      wx.showLoading();
      // 获取iM配置信息
      this.tls.attention().then(function (data) {
        let _this = this;
        app._post_form("live.room/addLike", {
          room_id: 99999
        }, result => {
          console.log(result);
        });

        wx.hideLoading();
      })["catch"](function () {
        wx.hideLoading();
      });


    },
    onShow() {

    },
    onHide() {
      // this.quitGroup();
      // app._get("live.room/updataStatus", {
      //   room_id: this.roomId,
      //   live_status:105,
      // }, result => {
      // });
      // this.bindPause();
    },

    quitGroup: function quitGroup() {
      var _this7 = this;
      app._get("live.room/updataStatus", {
        room_id: _this7.roomId,
        live_status: 103,
      }, result => {
        ctx.stop({
          success: res => {
            console.log('stop success')
          },
          fail: res => {
            console.log('stop fail')
          }
        })
        this.tls.sendMessage('关闭了直播').then(function (res) {
          _this8.message = _this8.message.concat([{
            name: _this8._formatNick(_this8.userInfo.userID, _this8.userInfo.nick),
            message: res.message,
            id: "id".concat(Date.now())
          }]);
        });
      });
      wx.showLoading({
        mask: true
      });
      _this7.tls.exitRoom().then(function () {
        wx.hideLoading();
        wx.reLaunch({
          url: '../user/index',
        })
        _this7.isTimReady = false;
      })["catch"](function (err) {
        wx.reLaunch({
          url: '../user/index',
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
    selectPayType:function selectPayType(event){
      console.log("选择");
     this.payType = event.currentTarget.dataset.type;
    },
    textInput: function textInput(data) {
      console.log(data);
      if(data.$wx.currentTarget.dataset.name=='money'){
        this.packetMoney = data.$wx.detail.value;
      }else if(data.$wx.currentTarget.dataset.name=='number'){
        this.packetNumber = data.$wx.detail.value;
      }
      // this.text = data.$wx.detail.value;
    },
    tosendRed: function tosendRed(){
      var _this = this;
      if(this.packetMoney==""||this.packetNumber==""){
        wx.showToast({
          title: '请正确填写',
          icon:'none',
        })
        return
      }
      wx.showLoading({
        mask: true
      });
      app._post_form("live.room/pay", {

        room_id: this.roomId,
        pay_price:this.packetMoney,
        number:this.packetNumber,
        pay_type:this.payType,
      }, result => { 
        wx.hideLoading();
        if(_this.payType=='20'){
          app.wxPayment({
            payment: result.data.payment,
            success(res) {
              app.showError(result.msg.success);
              // _this.getOrderDetail(orderId);
              _this.hidesendred();
              this.tls.sendMessage('发送红包').then(function (res) {
                _this.message = _this.message.concat([{
                  name: _this._formatNick(_this.userInfo.userID, _this.userInfo.nick),
                  message: res.message,
                  id: "id".concat(Date.now())
                }]);
              });
            },
            fail() {
              app.showError(result.msg.error);
            },
          });
        } else{
          this.tls.sendMessage('发送了红包').then(function (res) {
            _this.message = _this.message.concat([{
              name: _this._formatNick(_this.userInfo.userID, _this.userInfo.nick),
              message: res.message,
              id: "id".concat(Date.now())
            }]);
          });
          app.showError("支付成功");
          _this.hidesendred();
        }
      },rest =>{
        wx.hideLoading();
      });
    },
    
    
  },


  onLoad: function onLoad(data) {
    this.roomId = data.im_id;
    this.roomCover = data.room_cover;
    this.roomStatus = data.room_status;
    if(data.mode)
    this.mode = data.mode;
    // this.getUserSig();
    this.getliveconfig();
    this.get_push_url();
    this.setListHeight();
    this.getroominfo();
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
      "5-0": ["attention", "quitGroup", "coupon"],
      "5-2": ["send-message", "like", "showGift", "showgoods", "editgoods","more","closeMore","showSendRed"],
      "5-7": ["hideGift", "sendgift"],
      "5-9": ["hidegoods", "buy"],
      "5-11": ["hideani"],
      "5-12": ["hidecoupon", "usecoupon"]
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
      "more": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.more($event);
        })();

      },
      "closeMore": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.closeMore($event);
        })();

      },
      "showSendRed": function proxy() {
        this.showMore = false;
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.showSendRed($event);
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

      },
      "editgoods": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.editgoods($event);
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

      }
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
    '5-20': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          // console.log("点击事件++++");
          _vm.toback($event);
        })();
      }

    },
    '5-21': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          // console.log("点击事件++++");
          _vm.toSetting($event);
        })();
      }

    },
    '5-22': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          // console.log("点击事件++++");
          _vm.selectGood($event);
        })();
      }

    },
    '50-0': {
      "input": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.textInput($event);
        })();

      }
     
    },
    '50-1': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          // console.log("点击事件++++");
          _vm.tosendRed($event);
        })();
      }

    },
    '50-2': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.selectPayType($event);
        })();

      },
    }, '52-2': {
      "scrolltolower": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.bindDownLoad($event);
        })();

      },
    }, '55-2': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          _vm.bindStop($event);
        })();

      },
    },
    
    '51-0': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          // console.log("点击事件++++");
          _vm.showSendRed($event);
        })();
      }
    },
     '17-0': {
      "tap": function proxy() {
        var $event = arguments[arguments.length - 1];
        var _vm = this;
        return (function () {
          // console.log("点击事件++++");
          _vm.hidesendred($event);
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