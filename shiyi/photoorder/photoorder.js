Page({

  /**
   * 页面的初始数据
   */
  data: {
    photolist:"",
    myRank:"",
    totalContribution:"",
    userpic:"",
    username:""
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
    var that = this;
    console.log(wx.getStorageSync("userInfo"))
    var userpic = wx.getStorageSync("userInfo").avatarUrl
    var username = wx.getStorageSync("userInfo").nickName
    console.log(userpic)
      wx.request({
        url: "https://api.zhuiyinanian.com/YinianProject/activity/ShowCitySpaceContributionRank",
        data:{
          groupid:wx.getStorageSync("groupid")   
        },
        success:function(res){
          //设置标题
          wx.setNavigationBarTitle({
            title: wx.getStorageSync("ganme")+"贡献TOP100"
          });
          console.log(res)
          var photolist = res.data.data
          console.log(photolist)
          photolist.forEach(function(e){
            console.log(e.userid)
          });
          
          that.setData({
            photolist: photolist,
            myRank: wx.getStorageSync("myRank"),
            totalContribution: wx.getStorageSync("totalContribution"),
            userpic: userpic,
            username: username,
            userid:wx.getStorageSync("userid"),
          })

        }
      })
  },

})