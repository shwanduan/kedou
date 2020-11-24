const App = getApp();
Page({
  data: {
    play_url: '',
  },
  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
onShow(){
  this.getPlayUrl();
},
  // 拉流地址
  getPlayUrl() {
    let _this = this;
    App._get("live.webapi/getPlayUrl", {
      streamName: 666666
    }, result => {
      // console.log(result);
      _this.setData({
        play_url: result.data
      })
      console.log(_this.data.result);
      // 刷新直播间状态 (体验不佳, 暂不使用)
      // _this.setLiveStatusText(resList);
    });
  },


  bindPlay() {
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
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
  bindMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  }
})