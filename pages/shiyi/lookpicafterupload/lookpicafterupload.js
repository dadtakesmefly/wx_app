
let app = getApp();
let unit = require('../../../utils/util.js');
var Promise = require('../../../utils/promise.js');
Page({
  data: {
    canIUse: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      photoData: app.photoData
    })
    if (wx.canIUse) {
      if (wx.canIUse('button.open-type.share')) {
        this.setData({
          canIUse: true
        })
      }
    }
  },
  // 预览图片
  lookpreview: function (e) {
    var that = this;
    var sel = e.currentTarget.dataset.sel;
    wx.previewImage({
      current: that.data.photoData.url[sel],
      urls: that.data.photoData.url
    })
  },
  mored: function () {

  },
  uploadcomplete() {
    let _this = this;
    // wx.redirectTo({
    //   url: '/pages/viewscoll/viewscoll?groupid='+_this.data.photoData.egroupid+"&from=timeline"
    // })
    wx.navigateBack({
      delta: 1
    })
  },
  makepingtu: function () {
    //获取图片上传token
    wx.redirectTo({
      url: '/pages/commonpage/makeBurnAfterupload/makeBurnAfterupload?action=pingtu'
    })
  },
  shareIntro: function () {
    wx.showToast({
      title: '点击右上角分享',
    })
  },
  onShareAppMessage: function () {
    let _this = this;
    return {
      title: app.globalData.userInfo.nickName + '参加了照亮我的城市活动，你也来参加吧',
      path: 'pages/shiyi/share/share?port=小程序动态分享&eid=' + _this.data.photoData.eid,
      imageUrl: 'http://oibl5dyji.bkt.clouddn.com/20170929200404.png'
    }
  }
})