Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgSrc:""
  },
  //点击下一步 获取照片领取码
  nowprint: function () {
    wx.showLoading({
      title: '正在下单',
    })
    wx.request({
      url: "https://api.zhuiyinanian.com/YinianProject/activity/PlaceOrder",
      data: {
        userid: wx.getStorageSync("userid"),
        picAddress: wx.getStorageSync("printImg")
      },
      success: function (res) {
        wx.hideLoading()
        //下单成功
        if (res.data.code == 0){
          wx.setStorageSync("orderCode", res.data.data[0].orderCode);
          wx.navigateTo({
            url: '../scan/scan',
          })
        }
        //下单失败
        else{
          wx.showModal({
            title: '提示',
            content: '打印下单失败',
            showCancel: false
          })
        }
      
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {
      var value = wx.getStorageSync('printImg')
      if (value) {
        console.log(value);
        this.setData({
          imgSrc:value
        })
      }
    } catch (e) {
      // Do something when catch error
    }
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