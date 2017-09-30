Page({

  /**
   * 页面的初始数据
   */
  data: {
      code:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    var orderCode = wx.getStorageSync("orderCode")
    var code = orderCode.split("")
    that.setData({
      code: code
    });
    setInterval(function(){
      wx.request({
        url: "https://api.zhuiyinanian.com/YinianProject/activity/JudgePrintIsSuccess",
        success: function (res) {
          console.log(res)
          console.log(res.data.data.length)
          if (res.data.data.length == 0) {
            console.log("打印中")
            that.setData({
              status: "http://oibl5dyji.bkt.clouddn.com/2017092703.png",
              noprint: false,
              yesprint: true

            })
          }
          else if (res.data.data[0].printStatus == 1) {
            console.log("打印成功")
            that.setData({
              status: "http://oibl5dyji.bkt.clouddn.com/2017092703.png",
              noprint: false,
              yesprint: true

            })
          }
          else if (res.data.data[0].printStatus == 0) {
            console.log("打印失败")
          }
        }
      })

    },5000)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})