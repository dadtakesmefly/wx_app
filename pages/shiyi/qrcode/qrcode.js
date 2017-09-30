Page({

  /**
   * 页面的初始数据
   */
  data: {
    // codepic:"http://oibl5dyji.bkt.clouddn.com/1.jpg"
  },
  seebigpic:function(e){
    wx.previewImage({
      current: 'http://oibl5dyji.bkt.clouddn.com/20170929130817.png', // 当前显示图片的http链接
      urls: ["http://oibl5dyji.bkt.clouddn.com/20170929130817.png"] // 需要预览的图片http链接列表
    })
  },
  //保存二维码到本地
  save:function(){
    //获取权限
    wx.getSetting({
      success(res) {
        if (!res['scope.writePhotosAlbum']) {
          // 设置询问
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res)
            },
            fail() { },
            complete() { }
          })
        }
      }
    })

   

   // 下载图片
    var imgSrc = "http://oibl5dyji.bkt.clouddn.com/20170929130817.png";

    wx.downloadFile({
      url: imgSrc,
      success:function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:
          function (data) {
            var tempFilePaths = res.tempFilePaths
          
            wx.showModal({
              title: '分享到朋友圈',
              content: '成功保存小程序码到本地相册，请自行前往朋友圈分享',
              confirmText:"知道了",
              showCancel:false,

            })
            console.log(data);
          },
          fail:function (err) {
            console.log(err);
            if
 (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if
 (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  }
                  else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})