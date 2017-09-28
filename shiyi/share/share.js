var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:"", //class类名
    pics: "", //照片
    content:"", //文本
    city: "武汉", //城市
    username:"", //用户名
    userpic:"", //用户头像
    hascontent:true //默认文本有内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.version) {
      this.version = options.version;
    }
    if (options.port) {
      this.port = options.port;
      this.setData({
        port: options.port
      })
    }
    if (options.fromUserID) {
      this.fromUserID = options.fromUserID;
    }
    if (options.fromSpaceID) {
      this.fromSpaceID = options.fromSpaceID;
    }
    if (options.fromEventID) {
      this.fromEventID = options.fromEventID;
    }
    if (options.eventId) {
      this.eventId = options.eventId;
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
    var that = this
    var na = this.version ? this.version : "";
    var nb = this.port ? this.port : "";
    var nc = this.fromUserID ? this.fromUserID : 0;
    var nd = this.fromSpaceID ? this.fromSpaceID : 0;
    var ne = this.fromEventID ? this.fromEventID : 0;
    var nf = this.eventId ? this.fromEventID : 274514;

    //登录授权
    app.getUserInfo(function (userInfo) {
      var userid = wx.getStorageSync("userid");

      wx.request({
        url: "https://api.zhuiyinanian.com/YinianProject/yinian/ShowSingleEvent",
        data: {
          eventId: nf
        },
        success: function (res) {
          console.log(res)
          console.log(res.data.data)
          console.log(res.data.data[0].thumbnail)
          var pics = res.data.data[0].thumbnail;
          var content = res.data.data[0].etext
          var userpic = res.data.data[0].publishUser.upic
          var username = res.data.data[0].publishUser.unickname
          var city = res.data.data[0].gname
          console.log(content.length)
          wx.setStorageSync("url", res.data.data[0].url)
          //判断是否有文字心情等
          if (content.length == 0){
                that.setData({
                  hascontent:false
                })
          }
          //照片数量为0
          if(pics.length ==0){
            that.setData({
              pics: pics,
              content: content,
              city: city,
              username: username,
              userpic: userpic
            })
          }
          //照片数量为1
          else if (pics.length == 1){
            that.setData({
              pics: pics,
              num:"one",
              content: content,
              city: city,
              username: username,
              userpic: userpic
            })
          }
          //照片数量为2
          else if (pics.length == 2){
            that.setData({
              pics: pics,
              num: "two",
              content: content,
              city: city,
              username: username,
              userpic: userpic
            })
          }
          //照片数量为3
          else if (pics.length == 3) {
            that.setData({
              pics: pics,
              num: "three",
              content: content,
              city: city,
              username: username,
              userpic: userpic
            })
          }
          //照片数量为4
          else if (pics.length == 4) {
            that.setData({
              pics: pics,
              num: "two",
              content: content,
              city: city,
              username: username,
              userpic: userpic
            })
          }
          //照片数量为3或者5以上
          else{
            that.setData({
              pics: pics,
              num: "three",
              content: content,
              username: username,
              userpic: userpic,
              city: city
            })
          }
    
        }

      })
    }, na, nb, nc, nd, ne);
  },
  gotoactiveindex:function(){
      wx.redirectTo({
        url: '/pages/shiyi/activeindex/activeindex',
      })
  },
  seebigpic:function(e){
    console.log(e)
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.pics[index] , // 当前显示图片的http链接
      urls: this.data.pics // 需要预览的图片http链接列表
    })
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