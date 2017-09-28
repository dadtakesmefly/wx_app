Page({

  /**
   * 页面的初始数据
   */
  data: {
    printNum:"未绑定",
    buttonText:"点击获取打印码",
    className:"scan",
    status:"http://oibl5dyji.bkt.clouddn.com/2017092701.png",
    noprint:true,
    yesprint:false,
  },
  gotoindex:function(){
    wx.reLaunch({
      url: '/pages/index/index',
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
    //显示照片领取码
    var that = this
    var orderCode = wx.getStorageSync("orderCode");
    console.log(orderCode.split(""))
    var code = orderCode.split("")
    that.setData({
      code:code
    });
    // 5s调用一次是否打印成功的接口
    setInterval(function(){
          wx.request({
            url: "https://api.zhuiyinanian.com/YinianProject/activity/JudgePrintIsSuccess",
            data:{
              printCode:wx.getStorageSync("orderCode")
            },
            success:function(res){
              console.log(res)
              console.log(res.data.data.length)
              if (res.data.data.length == 0){
                  console.log("打印中")
                  that.setData({
                    status: "http://oibl5dyji.bkt.clouddn.com/2017092701.png",
                    noprint: true,
                    yesprint: false

                  })
              }
              else if (res.data.data[0].printStatus == 1){
                console.log("打印成功")
                that.setData({
                  status:"http://oibl5dyji.bkt.clouddn.com/2017092703.png",
                  noprint: false,
                  yesprint:true
                  
                })
              }
              else if (res.data.data[0].printStatus == 0){
                
              }
            }

          })
    },5000)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})