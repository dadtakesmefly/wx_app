
let api = require('../../../utils/api.js');
let util = require('../../../utils/util.js');
let App = getApp();
let picaddress = [];
let mainIdStr;
let formId = 0;
function uploadpicasync(a, b) {
  var that = this;
  if (b.length == 0) {
    //图片上传成功，开始发布动态
    let eplace = wx.getStorageSync('place');
    if (eplace == undefined || eplace == "不显示位置") eplace = '';
    wx.request({
      url: api.getUrl("YinianProject/yinian/UploadEvent"),
      data: {
        userid: wx.getStorageSync("userid"),
        groupid: mainIdStr,
        content: wx.getStorageSync("content"),
        picAddress: picaddress.join(','),
        storage: picaddress.length * 300,
        memorytime: util.formatTime(new Date()),
        mode: 'private',
        source: "小程序",
        place: eplace,
        formID: formId,
        isPush: "true"
      },
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200) {
          wx.removeStorageSync('uploadchoosedpic');
          wx.removeStorageSync('place');
          wx.hideToast();
          picaddress.length = 0;
          wx.showModal({
            title: '提示',
            content: '网络忙，请重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
          return;
        }
        wx.hideToast();
        wx.removeStorageSync('uploadchoosedpic');
        picaddress.length = 0;
        wx.removeStorageSync('place');
        App.photoData = res.data.data[0];
        wx.redirectTo({
          url: '/pages/shiyi/lookpicafterupload/lookpicafterupload?from=beforeshare'
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '上传动态不成功，请稍后重试',
          showCancel: false
        })
        wx.removeStorageSync('uploadchoosedpic');
        wx.removeStorageSync('place');
        wx.hideToast();
        picaddress.length = 0;
        wx.navigateBack({
          delta: 1
        })
      }
    })
  } else {
    //继续上传图片
    let currentuploadpic = b.splice(0, 1);
    uppic(a, currentuploadpic, b);
  }
}

function uppic(token, uparr, totalpicarr) {
  let val = uparr[0];
  picaddress.push(val.split('//')[1]);
  wx.uploadFile({
    url: 'https://up.qbox.me',
    filePath: val,
    name: 'file',
    formData: {
      'key': val.split('//')[1],
      'token': token
    },
    success: function (res) {
      var data = JSON.parse(res.data);
      let a = getCurrentPages();
      let curpage = a[a.length - 1];
      curpage.setData({
        uploadnum: picaddress.length
      })
      uploadpicasync(token, totalpicarr);
    },
    fail: function () {
      // console.log('1+');
      // uppic(token, uparr, totalpicarr);
    }
  })
}


Page({
  data: {
    choosepic: [],
    hiddenprocess: true,
    uploadnum: 0,
    totalnum: 0,
    nameString: "",
    idStr: ''
  },

  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '上传图片'
    });
    wx.removeStorageSync('place');
    var choosedpic = wx.getStorageSync('uploadchoosedpic') || [];
    that.setData({
      choosepic: choosedpic,
      hiddenprocess: true,
      uploadnum: 0,
      totalnum: 0
    })
    if (wx.getStorageSync('strId')) {
      wx.removeStorageSync('strId');
    }
    if (wx.getStorageSync('strName')) {
      wx.removeStorageSync('strName')
    }
  },
  prevent() {
    return;
  },
  onShow: function () {
    var that = this;
    let place = wx.getStorageSync('place') || "所在位置";
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        var sys = res.system.slice(0, 3);
        that.setData({
          sys: sys
        })
      },
    })
    this.setData({
      place: place
    })
    if (wx.getStorageSync('strName')) {
      that.setData({
        nameString: wx.getStorageSync('strName')
      })
    }
    var strId = wx.getStorageSync('strId');

    var idStr = strId ? strId : wx.getStorageSync("groupid");
    mainIdStr = idStr;
    that.setData({
      idStr: idStr
    })
  },
  onReady: function () {
    // console.log('ready');
  },
  toUploadSync: function () {
    wx.navigateTo({
      url: '/pages/others/uploadsync/uploadsync?groupid=' + wx.getStorageSync("groupid"),
    })
  },
  //添加图片
  addpic: function () {
    let that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let a = res.tempFilePaths;
        let temp = [];
        that.data.choosepic.forEach(function (val) {
          temp.push(val);
        });
        a.forEach(function (val) {
          temp.push(val);
        })
        that.setData({
          choosepic: temp
        })
      }
    })
  },
  picpdelete: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var temp = [];
    // if (this.data.choosepic.length == 1) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请至少保留一张图片',
    //     showCancel: false
    //   })
    //   return;
    // }
    this.data.choosepic.forEach(function (val) {
      temp.push(val);
    });
    temp.splice(index, 1)
    this.setData({
      choosepic: temp
    })
  },
  formSubmit: function (e) {
    console.log(e);
    var that = this;
    if (!wx.getStorageSync("userid") || !wx.getStorageSync("groupid")) {
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败，请稍后重试',
        showCancel: false
      })
      return;
    }
    formId = e.detail.formId;
    console.log(formId);
    if (that.data.choosepic.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '至少有一张图片才能上传',
        showCancel: false
      })
      return;
    }


    var context = e.detail.value.text;
    wx.setStorage({
      key: 'content',
      data: context
    })

    var picarr = [];
    that.data.choosepic.forEach(function (val) {
      picarr.push(val);
    })
    if (picarr.length > 90) {
      wx.showModal({
        title: '提示',
        content: '一次最多上传90张相片',
      })
      return;
    }
    that.setData({
      hiddenprocess: false,
      totalnum: picarr.length
    })
    // 获取图片上传token
    wx.request({
      url: api.getUrl('YinianProject/yinian/GetPrivateSpaceUploadToken'),
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // console.log(res);
        if (res.data.code === 0) {
          uploadpicasync(res.data.data[0].token, picarr);
        }
      }
    })
  }
})