const App = getApp();
Page({
  data: {
    
    push_url: ''
  },
  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher')
  },
  onShow() {
    this.get_push_url();
    // this.getPlayUrl();
    
  },

  // 推流地址
  get_push_url() {
    let _this = this;
    App._get("live.webapi/get_push_url", {
      streamName: 666666
    }, result => {
      console.log(result);
      _this.setData({
        push_url: result.data
      })
      // 刷新直播间状态 (体验不佳, 暂不使用)
      // _this.setLiveStatusText(resList);
    });
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  bindStart() {
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  }
})