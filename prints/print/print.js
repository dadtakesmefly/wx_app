//单张图片上传 必备
var app = getApp();
let unit = require('../../../utils/util.js');
const api = require("../../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  //上传图片
  // 更换相册封面
  editpic: function (e) {
    var that = this;
    if (!wx.getStorageSync('userid')) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }
    // if (wx.getStorageSync('userid') != wx.getStorageSync('createrid')) {
    //   wx.showModal({
    //     title: "提示",
    //     content: "非相册创建者，无法修改背景图",
    //     showCancel: false
    //   })
    //   return;
    // }
    wx.request({
      url: api.getUrl('YinianProject/yinian/GetUploadToken'),
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        var token = res.data.data[0].token, picarr;
        wx.chooseImage({
          count: 1, // 最多可以选择的图片张数，默认9
          sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
          sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
          success: function (res) {
            wx.showLoading({
              title: '正在上传',
            })
            // wx.showToast({
            //   title: '正在上传',
            //   icon: 'loading',
            //   duration: 2000
            // })
            var tempUrl = res.tempFilePaths[0].split('//')[1];
            wx.uploadFile({
              url: 'https://up.qbox.me',
              filePath: res.tempFilePaths[0],
              name: 'file',
              formData: {
                'key': res.tempFilePaths[0].split('//')[1],
                'token': token
              },
              success: function (res) {
                //关闭loading
                wx.hideLoading();
                console.log(res);
                var data = JSON.parse(res.data);
                var now = new Date();
                var tempUpUrl = "http://7xlmtr.com1.z0.glb.clouddn.com/" + data.key;
                console.log(tempUpUrl);
                wx.setStorageSync("printImg", tempUpUrl)
                wx.navigateTo({
                  url: '../phototemplate/phototemplate',
                })
              
                // wx.request({
                //   url: api.getUrl("YinianProject/yinian/ModifyGroupPic"),
                //   data: {
                //     url: data.key,
                //     userid: wx.getStorageSync('userid'),
                //     groupID: wx.getStorageSync("groupid"),
                //   },
                //   success: function (res) {
                //     if (res.data.code == 0) {
                //       console.log(res)
                //       that.setData({
                //         ablumInfo: {
                //           canDelete: that.data.ablumInfo.canDelete,
                //           gtype: that.data.ablumInfo.gtype,
                //           gnum: that.data.ablumInfo.gnum,
                //           picnum: that.data.ablumInfo.picnum,
                //           gname: that.data.ablumInfo.gname,
                //           list: that.data.ablumInfo.list,
                //           gpic: "http://7xlmtr.com1.z0.glb.clouddn.com/" + tempUrl
                //         }
                //       })
                //       wx.showToast({
                //         title: '修改成功',
                //         icon: 'success',
                //         duration: 2000,
                //         success: function () {
                //           setTimeout(function () {
                //             wx.hideToast()
                //           }, 1500)
                //         }
                //       })
                //     }
                //   }
                // })
              }
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  },


  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    var na = this.version ? this.version : "";
    var nb = this.port ? this.port : "";
    var nc = this.fromUserID ? this.fromUserID : 0;
    var nd = this.fromSpaceID ? this.fromSpaceID : 0;
    var ne = this.fromEventID ? this.fromEventID : 0;

    //登录授权
    app.getUserInfo(function (userInfo) {
      var userid = wx.getStorageSync("userid");
        wx.request({
          url: "https://api.zhuiyinanian.com/YinianProject/activity/PrintStatusJudge",
          data:{
            userid: userid
          },
          success:function(res){
              console.log(res)
              console.log(res.data.data)
             
              //没使用过服务
              if (res.data.data.length == 0){
                console.log("没使用过服务")
              }
              //使用过服务但还没打印
              else if (res.data.data[0].printStatus == 0){
                wx.setStorageSync("orderCode", res.data.data[0].printCode)
                console.log("使用过服务但还没打印")
                wx.navigateTo({
                  url: '../fails/fails',
                })
              }
              //使用过服务且打印过
              else if (res.data.data[0].printStatus == 1){
                console.log("使用过服务且打印过")
                wx.navigateTo({
                  url: '../success/success',
                })
              }
          }
          
        })
    },na,nb,nc,nd,ne);


  },



})