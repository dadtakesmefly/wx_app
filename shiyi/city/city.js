
const util = require('../../../utils/util.js');
const app = getApp();
let api = require('../../../utils/api.js');
function timeRest(stringTime) {
  var stringTime = stringTime.replace(/-/g, "/");
  console.log(stringTime);
  console.log(new Date(stringTime));
  var timestamp2 = Date.parse(new Date(stringTime));
  console.log(timestamp2);
  timestamp2 = timestamp2 / 1000;
  var nowTime = new Date().getTime();
  console.log(nowTime);
  var resultTime = parseInt(nowTime / 1000) - parseInt(timestamp2);
  console.log(resultTime);
  if (resultTime == 0) {
    return "刚刚"
  } else if (resultTime > 0 && resultTime < 60 * 60) {
    return "" + Math.ceil(resultTime / 60) + "分钟前";
  } else if (resultTime >= 60 * 60 && resultTime < 60 * 60 * 24) {
    return "" + Math.ceil(resultTime / (60 * 60)) + "小时前";
  } else if (resultTime >= 60 * 60 * 24 && resultTime < 60 * 60 * 24 * 3) {
    return "" + Math.ceil(resultTime / (60 * 60 * 24)) + "天前";
  } else {
    return stringTime.slice(0, 4) + "." + stringTime.slice(5, 7) + "." + stringTime.slice(8, 10);
  }
}
Page({
  data: {
    canIUse: false,
    returnhomepic: 'http://oibl5dyji.bkt.clouddn.com/20170605160928.png',
    ablumInfo: {},
    fromlast: 0,
    showModelHidden: false,
    pvShowModel: false,
    showAudioModelBox: false,
    eventlist: [],
    authorityList: [],
    gname: "",
    rank: "",
    photoNum: "",
    citypic: "",
    todayContribution: "",
    totalContribution: "",
    myRank: "",
  },
  // prevent: function () {
  //   this.setData({
  //     fromlast: 1
  //   })
  //   return
  // },
  stop: function () {
    return;
  },
  gotoleaderboard:function(){
    wx.navigateTo({
      url: '../photoorder/photoorder',
    })
  },

  onLoad: function (options) {
    // 统计需要的字段
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



    let _this = this;
    _this.setData({
      fromlast: 0
    })
    if (wx.canIUse) {
      if (wx.canIUse('button.open-type.share')) {
        _this.setData({
          canIUse: true
        })
      }
    }
   
    this.groupid = options.groupid;
    console.log(this.groupid)
    try {
      wx.setStorageSync('groupid', parseInt(options.groupid));
    } catch (e) {
      console.log(e);
    }
  },
  onShow: function () {
    var na = this.version ? this.version : "";
    var nb = this.port ? this.port : "";
    var nc = this.fromUserID ? this.fromUserID : 0;
    var nd = this.fromSpaceID ? this.fromSpaceID : 0;
    var ne = this.fromEventID ? this.fromEventID : 0;

    let _this = this;
    app.getshowState(function (res) {
      _this.setData({
        showpuzze: res
      })
    });
    // if(app.fromS==1){
    //   setTimeout(function(){
    //     app.fromS = 0;
    //   },1000)
    //   return;
    // }
    this.hiddenlike();
    /*如果页面是从设置页返回，则不更新数据，如果是从后台进入前台，则调用onshow刷新数据*/
    if (_this.data.fromlast == 1) {
      _this.timer = setTimeout(function () {
        _this.setData({
          fromlast: 0
        })
      }, 1000);
      return;
    }

    app.getUserInfo(UserInfo => {
      if ((wx.getStorageSync('userInfo').uLockPass != null) && app.globalData.pwdState) {
        wx.navigateTo({
          url: '/pages/others/password/password?setPwd=shuru',
        })
      }
      /*设置是否显示新用户引到*/
      _this.setData({
        showintroduce: UserInfo.isnew == "yes" ? true : false
      })

      if (_this.type != "photowall") {
        // util.wxreq({
        //   pathname: 'YinianProject/data/SmallAppBigAndSmallSpaceUVandPV',
        //   data: {
        //     userid: UserInfo.userid,
        //     groupid: _this.groupid
        //   }
        // })
      }
      _this.setData({
        winHeight: app.globalData.systemInfo.windowHeight,
        r2p: app.globalData.systemInfo.windowWidth / 750,
        from: _this.from,
        groupid: _this.groupid,
        userid: UserInfo.userid
      })

      _this.nickname = UserInfo.nickName
      util.wxreq({
        pathname: 'YinianProject/yinian/ShowSmallAppAlbumInformation',
        data: {
          userid: UserInfo.userid,
          groupid: _this.groupid,
          port: nb,
          fromUserID: nc
        }
      })
        .then(res => {
          console.log(res);
          var isPush = res.data[0].isPush ? res.data[0].isPush : 0;
          console.log(isPush);
          wx.setStorageSync("msgState", isPush);
          if (res.code == 1012) {
            wx.showModal({
              title: "提示",
              content: "相册已被删除",
              showCancel: false,
              success: function (res) {
                if (wx.reLaunch) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } else {
                  wx.navigateBack({
                    delta: 10
                  })
                }
              }
            })
          } else if (res.code == 1037) {
            wx.showModal({
              title: "提示",
              content: "相册已被封",
              showCancel: false,
              success: function (res) {
                if (wx.reLaunch) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                } else {
                  wx.navigateBack({
                    delta: 10
                  })
                }
              }
            })
          } else {
            var groupinfo = res.data[0];
            if (!groupinfo.joinStatus) wx.showToast({ title: "加入相册成功" });
            wx.setStorage({
              key: 'createrid',
              data: groupinfo.gcreator
            });
            wx.setStorage({
              key: 'gAuthority',
              data: groupinfo.gAuthority
            });
            var aArr = groupinfo.authorityList ? groupinfo.authorityList : [];
            wx.setStorage({
              key: 'authorityList',
              data: aArr
            });

            wx.setStorage({
              key: 'gnum',
              data: groupinfo.gnum
            });
            wx.setStorage({
              key: 'ganme',
              data: groupinfo.gname
            });
            _this.gname = groupinfo.gname;
            app.globalData.gtype = groupinfo.gtype;
            app.globalData.gcreator = groupinfo.gcreator;
            wx.setNavigationBarTitle({
              title: groupinfo.gname
            });
            let candelete;
            if ((groupinfo.gtype == 10 || groupinfo.gtype == 11) && UserInfo.userid == groupinfo.gcreator) {
              candelete = true
            } else {
              candelete = false
            }

            _this.setData({
              ablumInfo: {
                canDelete: candelete,
                gtype: groupinfo.gtype,
                gnum: groupinfo.gnum,
                picnum: groupinfo.picNum,
                gname: groupinfo.gname,
                list: groupinfo.memberList,
                gpic: groupinfo.gpic
              }
            })
            _this.gettimedata();

          }
        })

      wx.request({
        url: "https://api.zhuiyinanian.com/YinianProject/activity/ShowMyPhotoContribution",
        data: {
          userid: wx.getStorageSync('userid'),
          groupid: _this.groupid,
          port: nb,
          fromUserID: nc,
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          console.log(res.data.data)
          var cityinfo = res.data.data
          var gname = res.data.data[0].cityInfo.gname
          var rank = res.data.data[0].cityInfo.rank
          var photoNum = res.data.data[0].cityInfo.num
          var citypic = res.data.data[0].cityInfo.gpic
          var myRank = res.data.data[0].myContribution.myRank
          var todayContribution = res.data.data[0].myContribution.todayContribution
          var totalContribution = res.data.data[0].myContribution.totalContribution
          wx.setStorageSync("myRank", myRank)
          wx.setStorageSync("totalContribution", totalContribution)
          // wx.setStorageSync("gname", gname)
          //设置标题
          wx.setNavigationBarTitle({
            title: gname
          });
          //设置信息
          _this.setData({
            gname: gname,
            rank: rank,
            photoNum: photoNum,
            citypic: citypic,
            myRank: myRank,
            todayContribution: todayContribution,
            totalContribution: totalContribution
          })
        }
      })
    }, na, nb, nc, nd, ne)
  },
  goHome: function () {
    if (wx.reLaunch) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  addmember: function () {
    wx.showModal({
      title: "提示",
      content: "点击右上角更多按钮，将此页面分享给好友，即可邀请好友加入！",
      showCancel: false
    })

  },
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
    if (wx.getStorageSync('userid') != wx.getStorageSync('createrid')) {
      wx.showModal({
        title: "提示",
        content: "非相册创建者，无法修改背景图",
        showCancel: false
      })
      return;
    }
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
            wx.showToast({
              title: '正在上传',
              icon: 'loading',
              duration: 2000
            })
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
                var data = JSON.parse(res.data);
                var now = new Date();
                wx.request({
                  url: api.getUrl("YinianProject/yinian/ModifyGroupPic"),
                  data: {
                    url: data.key,
                    userid: wx.getStorageSync('userid'),
                    groupID: wx.getStorageSync("groupid"),
                  },
                  success: function (res) {
                    if (res.data.code == 0) {
                      that.setData({
                        ablumInfo: {
                          canDelete: that.data.ablumInfo.canDelete,
                          gtype: that.data.ablumInfo.gtype,
                          gnum: that.data.ablumInfo.gnum,
                          picnum: that.data.ablumInfo.picnum,
                          gname: that.data.ablumInfo.gname,
                          list: that.data.ablumInfo.list,
                          gpic: "http://7xlmtr.com1.z0.glb.clouddn.com/" + tempUrl
                        }
                      })
                      wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000,
                        success: function () {
                          setTimeout(function () {
                            wx.hideToast()
                          }, 1500)
                        }
                      })
                    }
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  /*发表评论*/
  comment(e) {
    let
      a = e.currentTarget.dataset.parentindex,
      b = e.currentTarget.dataset.childindex,
      eid = this.data.eventlist[a].list[b].eid;
    this.setData({
      fromlast: 1
    })
    wx.navigateTo({
      url: '/pages/commonpage/sendcomment/send?state=sendmaincomment&eid=' + eid,
      success: function () {
        setTimeout(function () {
          let
            pages = getCurrentPages(),
            length = pages.length;
          /*将评论区索引传入下级页面，发布评论后可直接将评论内容插入*/
          pages[length - 1].setData({
            listparentIndex: a,
            listchildIndex: b
          })
        }, 1500)
      }
    })
  },
  delete_event(e) {
    const Aindex = e.target.dataset.first, Bindex = e.target.dataset.second,
      eventid = this.data.eventlist[Aindex].list[Bindex].eid,
      that = this;
    let path = (this.data.ablumInfo.gtype == 10 || this.data.ablumInfo.gtype == 11) ? "YinianProject/yinian/DeleteEvent" : "YinianProject/yinian/DeleteEventWithUserVerify";
    let idname = (this.data.ablumInfo.gtype == 10 || this.data.ablumInfo.gtype == 11) ? "eventId" : "eventID";
    wx.showModal({
      title: '删除动态',
      content: '确定删除此条动态吗？',
      confirmColor: "#353535",
      success: function (res) {
        if (!res.confirm) return;
        util.wxreq({
          pathname: path,
          data: {
            userid: wx.getStorageSync('userid'),
            [idname]: eventid
          }
        }).then(res => {
          if (res.msg == "success") {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
            that.gettimedata();
          }
        })
      }
    })
  },
  /*回复评论*/
  recomment(e) {
    if (e.target.dataset.commentindex == undefined) return;
    let
      _this = this,
      commentindex = e.target.dataset.commentindex,
      [a, b] = e.currentTarget.dataset.dataindex.split(','),
      commentsList = this.data.eventlist[a].list[b].comments[commentindex],
      commentedUserid = commentsList.commentUser.userid,
      commentedNickname = commentsList.commentUser.unickname,
      eid = e.currentTarget.dataset.eid;
    if (commentedUserid == app.globalData.userInfo.userid) {
      wx.showModal({
        title: '提示',
        content: '删除此条评论？',
        success: function (res) {
          if (res.confirm) {
            util.wxreq({
              pathname: 'YinianProject/yinian/DeleteComment',
              data: {
                commentID: commentsList.cid
              }
            }).then(res => {
              if (res.msg == "success") {
                _this.data.eventlist[a].list[b].comments.splice(commentindex, 1);
                _this.setData({
                  eventlist: _this.data.eventlist
                })
              }
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/commonpage/sendcomment/send?state=sendusercomment&eid=' + eid + '&commeneduserid=' + commentedUserid,
        success: function (res) {
          setTimeout(function () {
            let
              pages = getCurrentPages(),
              length = pages.length;
            /*将评论区索引传入下级页面，发布评论后可直接将评论内容插入*/
            pages[length - 1].setData({
              listparentIndex: a,
              listchildIndex: b,
              placecontent: `@${commentedNickname}:`
            })
            pages[length - 1].commentedname = commentedNickname
          }, 1500)
        }
      })
    };

  },
  //关闭新用户引到
  closeintroduce: function () {
    this.setData({
      showintroduce: false
    })
  },
  //上传图片
  uploadpic: function () {
    var that = this;
    if (!wx.getStorageSync('userid')) {
      wx.showModal({
        title: "错误",
        content: "获取用户授权信息失败！请稍后再试",
        showCancel: false
      })
      return;
    }

    this.hiddenlike();
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.setStorage({
          key: 'uploadchoosedpic',
          data: tempFilePaths,
          success: function () {
            that.setData({
              pvShowModel: false
            })
            wx.navigateTo({
              url: '/pages/uploadpic/uploadpic'
            })
          },
          fail: function () {
            wx.showToast({
              title: '保存图片临时数据失败',
            })
          }
        })
      }
    })
  },
  // 上传视频
  uploadvideo: function () {
    var that = this;
    if (!wx.getStorageSync('userid')) {
      wx.showModal({
        title: '错误',
        content: '获取用户授权信息失败！请稍后再试',
        showCancel: false
      })
      return;
    }
    that.hiddenlike();
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var tempFilePaths = res.tempFilePath;
        wx.setStorage({
          key: 'uploadchoosedvideo',
          data: tempFilePaths,
          success: function () {
            that.setData({
              pvShowModel: false
            })
            wx.navigateTo({
              url: '/pages/uploadvideo/uploadvideo'
            })
          },
          fail: function () {
            wx.showToast({
              title: '保存视频临时数据失败',
            })
          }
        })
      }
    })
  },

  // 时间轴数据初始化
  gettimedata: function () {
    const _this = this;
    util.wxreq({
      pathname: 'YinianProject/event/ShowTimeAxis',
      data: {
        userid: app.globalData.userInfo.userid || wx.getStorageSync('userid'),
        groupid: _this.groupid,
        type: 'initialize',
        source: 'smallApp',
        eid: 0
      },
      reqtype: 'GET'
    }).then(res => {

      const dated = [];
      _this.templatearr = [];
      res.data.forEach(function (val) {
        Object.assign(val, {
          time: timeRest(val.euploadtime),
          showlibox: false
        })
        dated.push(val.euploadtime.substring(0, 10));
        _this.templatearr.push({
          day: val.euploadtime.substring(8, 10),
          month: val.euploadtime.substring(0, 7).replace('-', '.'),
          list: [val]
        })
      });
      _this.setData({
        eventlist: _this.templatearr
      })
      // console.log(_this.data.eventlist);
    })

  },


  /*图片预览*/
  enterpreview: function (event) {
    let a = event.currentTarget.dataset.parentindex;
    let b = event.currentTarget.dataset.childindex;
    let c = event.currentTarget.dataset.sel;
    let t = this.data.eventlist;

    var arrpic = [];

    for (var i = 0; i < t[a].list[b].picList.length; i++) {
      arrpic.push(t[a].list[b].picList[i].poriginal);
    }
    let that = this;
    clearTimeout(that.timer);
    that.setData({
      fromlast: 1
    })

    wx.previewImage({
      current: t[a].list[b].picList[c].poriginal,
      urls: arrpic// 需要预览的图片http链接列表
    })
    this.hiddenlike();
  },
  /*显示点赞框*/
  showlike(e) {
    let
      a = e.currentTarget.dataset.parentindex,
      b = e.currentTarget.dataset.childindex;
    if (!this.data.eventlist[a].list[b].showlibox) {
      this.hiddenlike();
      this.data.eventlist[a].list[b].showlibox = true;
      //设置flag，当前已存在打开的点赞弹框
      this.havelikebox = true;
      this.setData({
        eventlist: this.data.eventlist
      })
    } else {
      this.hiddenlike();
    }
  },
  scroll() {
    this.hiddenlike();
  },
  /*点赞*/
  like: function (e) {
    const typess = e.target.dataset.likecatagry,
      parentindex = e.currentTarget.dataset.parentindex,
      childindex = e.currentTarget.dataset.childindex,
      eid = this.data.eventlist[parentindex].list[childindex].eid,
      that = this;
    if (!typess) return;
    util.wxreq({
      pathname: 'YinianProject/yinian/AttachOrRemoveExpression',
      data: {
        type: typess,
        userid: app.globalData.userInfo.userid,
        eid: eid
      }
    }).then(res => {
      that.hiddenlike();
      if (res.code == 0) {
        wx.showToast({
          title: '点赞成功',
          icon: 'success',
          duration: 1000
        })
      }
      //获取当前动态点赞列表
      const likelist = that.data.eventlist[parentindex].list[childindex].like,
        resposnsedata = res.data;
      that.data.eventlist[parentindex].list[childindex].like = resposnsedata;
      that.setData({
        eventlist: that.data.eventlist
      })
    })
  },
  // 获取自己点赞的图标
  likeState: function () {

  },
  /*隐藏点赞框*/
  hiddenlike: function () {
    //如果不存在打开的点赞弹框，直接退出函数执行
    if (!this.havelikebox) return;
    this.havelikebox = false;
    this.data.eventlist.forEach(function (val) {
      val.list.forEach(function (v) {
        v.showlibox = false;
      })
    })
    this.setData({
      eventlist: this.data.eventlist,
    })
  },
  /*上拉加载*/
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (!wx.getStorageSync('userid')) {
      return
    }
    if (!this.data.eventlist) {
      return;
    }
    if (this.data.eventlist.length == 0) {
      return;
    }
    var that = this;
    that.loading();
  },
  loading: function () {
    var that = this;
    if (this.isloading) return;
    this.isloading = true;
    wx.showToast({
      title: '正在加载',
      icon: "loading",
      duration: 5000
    })
    util.wxreq({
      pathname: 'YinianProject/event/ShowTimeAxis',
      data: {
        userid: wx.getStorageSync('userid') || app.globalData.userInfo.userid,
        groupid: that.groupid,
        type: 'loading',
        source: 'smallApp',
        eid: that.templatearr[that.templatearr.length - 1].list[0].eid
      }
    }).then(res => {
      if (res.data.length == 0) {
        wx.showToast({ title: "已加载全部动态！" })
      } else {
        let date = [];
        res.data.forEach(function (val) {
          Object.assign(val, {
            time: timeRest(val.euploadtime),
            showlibox: false
          })
          date.push(val.euploadtime.substring(0, 10));
          that.templatearr.push({
            day: val.euploadtime.substring(8, 10),
            month: val.euploadtime.substring(0, 7).replace('-', '.'),
            list: [val]
          })
        });
        wx.hideToast();
        that.isloading = false;
        that.setData({
          eventlist: that.templatearr
        })
      }
    })
  },


  showPvModel: function () {
    var that = this;
    if (wx.getStorageSync('gAuthority') == 1) {
      if (wx.getStorageSync('userid') != wx.getStorageSync('createrid')) {
        wx.showModal({
          title: '提示',
          content: '只能创建者才能上传',
        })
        return;
      }

    }
    if (wx.getStorageSync('gAuthority') == 2) {
      var arrList = wx.getStorageSync('authorityList');
      if (arrList.length == 0) {
        return;
      }
      for (var i = 0; i < arrList.length; i++) {
        // console.log(2);
        if (arrList[i].userid == wx.getStorageSync('userid')) {
          // console.log(1);
          that.quanxian = true;
        }
      }
      // console.log(that.quanxian);
      if (!that.quanxian) {
        wx.showModal({
          title: '提示',
          content: '没有上传照片的权限',
          showCancel: false
        })
        return;
      }
    }
    that.setData({
      pvShowModel: true
    })
  },
  closepvModel: function () {
    this.setData({
      pvShowModel: false
    })
  },

  // 显示语音提示
  openAudioModel: function () {
    this.setData({
      showAudioModelBox: true
    })
  },
  closeAudioBox: function () {
    this.setData({
      showAudioModelBox: false
    })
  },
  preReset: function () {
    this.setData({
      fromlast: 1
    })
  },

  //去同步页面
  toDetailSync: function (e) {
    var a = e.currentTarget.dataset.parentindex;
    var b = e.currentTarget.dataset.childindex;
    var picSync = this.data.eventlist[a].list[b].picList;
    console.log(picSync);
    wx.setStorage({
      key: 'picSync',
      data: picSync,
      success: function () {
        wx.navigateTo({
          url: '/pages/eventdetail/detailsync/detailsync',
        })
      }
    })
  },


  onShareAppMessage: function () {
    let _this = this
    return {
      title: _this.nickname + '邀请你加入“' + _this.gname + '“相册',
      desc: '这里面有几张我很喜欢的照片，快来看看你喜欢嘛？',
      path: '/pages/viewscoll/viewscoll?port=小程序空间分享&groupid=' + wx.getStorageSync('groupid') + '&from=grouplist'
    }
  },
  returnhome: function () {
    if (wx.reLaunch) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateBack({
        delta: 10
      })
    }
  },
  openModel: function () {
    this.setData({
      showModelHidden: true
    })
  },
  closeModel: function () {
    this.setData({
      showModelHidden: false
    })
  },
  // 跳转查看视频
  seeBigVideo: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.setStorageSync('videourl', url)
    wx.navigateTo({
      url: '/pages/viewscoll/bigvideo/bigvideo',
    })
  },
  loadmore: function (e) {
    this.setData({
      fromlast: 1
    })
    wx.navigateTo({
      url: '/pages/eventdetail/eventdetail?dateindex=' + e.currentTarget.dataset.sela + '&eid=' + e.currentTarget.dataset.eid + '&rowindex=' + e.currentTarget.dataset.selb + '&efrom=viewscoll'
    })
  }
})