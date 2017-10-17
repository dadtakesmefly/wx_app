## 小程序
 
![img](http://oibl5dyji.bkt.clouddn.com/201709301105.jpg)

## 新手指引
### 小程序中并没有html标签，而是提供了一系列WXML组件 ： 
  + view 类似 div 
  + image 类似 img 
  + text 类似 span 
  + button  open-type=“share” 分享给朋友

#### [更多标签点击前往](https://mp.weixin.qq.com/debug/wxadoc/dev/component/cover-view.html)

### 生命周期函数
 绿色代表页面的生命周期函数执行的顺序
 ![img](http://oibl5dyji.bkt.clouddn.com/201709301424.png)


### 授权
部分接口需要获得用户授权同意后才能调用。此类接口调用时：

+ 如果用户未接受或拒绝过此权限，会弹窗询问用户，用户点击同意后方可调用接口；
+ 如果用户已授权，可以直接调用接口；
+ 如果用户已拒绝授权，则短期内不会出现弹窗，而是直接进入接口 fail 回调。
![img](http://oibl5dyji.bkt.clouddn.com/20170930144420.png)

		//可以通过 wx.getSetting 
		先查询一下用户是否授权了 "scope.record" 这个 scope
		wx.getSetting({
		    success(res) {
		        if (!res.authSetting['scope.record']) {
		            wx.authorize({
		                scope: 'scope.record',
		                success() {
		                    // 
		                    wx.startRecord()
		                }
		            })
		        }
		    }
		})
  

###  WXSS用于描述WXML的样式表 
为了适应各种屏幕，WXSS扩展了尺寸单位rpx（responsive pixel），规定屏幕宽度为750rpx（20rem） 
另外，WXSS并不支持所有css选择器，目前支持的选择器有

  + class

  + element

  + element,element

  + :after

  + :before
  
  + 属性选择器

  + 伪类选择器
  
  + nth-child()

### 数据绑定
数据绑定采用 “Mustache” 语法（双大括号）包裹变量

	<!--index.wxml-->
	<view class="container">
	  <text>{{hello}}</text>
	</view>
	 
	//index.js//index.js
	Page({
	  data: {
	    hello: 'Hello World'
	  },
	  onLoad: function () {
	    this.setData({
	      hello:'Hello World'
	    })
	  }
	})
	
输出为 **Hello World**

WXML 中的动态数据均来自对应 Page 的 data，并且需要调用setData方法通知视图数据变化

### 条件渲染

使用 *wx:if=“{{condition}}”* 来判断是否需要渲染该代码块，同大多MV*框架一样，if是惰性的，即初始判断为false时，不会渲染该代码块
		
	<view wx:if="{{condition}}"> True </view>
	
	Page({
	  data: {
	    condition: false 
	  },
	  onLoad: function () {
	    this.setData({
	      condition:true
	    })
	  }
	})
	
### 列表渲染

使用*wx:for=“{{list}}”*绑定一个数组
	
	<view wx:for="{{list}}">
		<image src=""{{item}}></image>
	</view>
   
	Page({
	  data: {
	    list: "" //初始数据 
	  },
	  onLoad: function () {
		var that = this 
		wx.request({
			url:接口地址，
			data:{userid:"123"},
			success:function(res){
			  var arr =  res.src 
			  that.setData({
	     		 list:array //请求数据成功后修改data的list数据
	    		})
			},
		})
	  }
	})

>

使用*wx:for=“{{citylist}}”*绑定一个对象

	<view wx:for="{{citylist}}" data-groupid='{{item.groupid}}' catchtap='gotocitydesc' class='list clearfix'>
          <image class='fl' src='{{item.gpic}}'></image>
          <view class='innerbox'>
            <text class='city'><text class='Num'>{{item.rank}}</text> {{item.gname}}</text>
            <text class='photonum'>照片数 : {{item.num}}</text>
          </view>
          <image class='fr'  src='http://oibl5dyji.bkt.clouddn.com/20170925113400.png'></image>
      </view>
	
	Page({
	  data: {
	    citylist: "" //初始数据 
	  },
	  onLoad: function () {
		var that = this 
		wx.request({
			url:接口地址，
			data:{userid:"123"},
			success:function(res){
			  var citylist =  res.list 
			  that.setData({
	     		 citylist:citylist //请求数据成功后修改data的list数据
	    		})
			},
		})
	  }
	})

### 事件绑定
以key-value形式绑定事件 
其中key为 bind 或 catch +事件名称，例如bindtap=“tapName”（bind不阻止冒泡，catch阻止事件向上冒泡） catchtap=“tapName” value为函数名称
 

	 Page({
	  data: {
	    
	  },
	  //绑定事件
	  tapName:function(){
		//绑定事件执行的操作
	  },
	  onLoad: function () {
	   
	  }
	})

### 事件对象

+ type 事件类型

+ timeStamp 事件生成时的时间戳

+ target 触发事件的组件的一些属性值集合 id、dataset、offsetLeft,、offsetTop

+ currentTarget 当前组件的一些属性值集合 id、dataset、offsetLeft,、offsetTop

+ touches 触摸事件，触摸点信息的数组 pageX、pageY、clientX、clientY、screenX、screenY

+ detail 特殊事件所携带的数据，如表单组件的提交事件会携带用户的输入

		//结合*wx:for=“{{citylist}}”*绑定一个对象看的更清楚
		//获取事件对象里面的 dataset.groupid的值
		gotocitydesc:function(event){
    		console.log(event.currentTarget.dataset.groupid)
    		wx.navigateTo({
      		url: '../city/city?groupid='+ event.currentTarget.dataset.groupid
   			})
    	｝

### 路由跳转传参等
   
**跳转一**

一个url如下

	<navigator url="../../navigate?title=navigate" hover-class="navigator-hover">跳转到新页面</navigator>
在目标页的声明周期函数onLoad中传入options即可获取路由参数对象，另外url是相对的

	Page({
	  onLoad: function(options) {
	    this.setData({
	      title: options.title
	    })
	  }
	})

**跳转二**
	
	gotoindex:function(){
		 wx.navigateTo({
      		url: '../city/city?groupid='+ event.currentTarget.dataset.groupid
    	})

	}

**跳转三**	
	
  		gotoindex:function(){
		 wx.redirectTo({
      		url: '../city/city?groupid='+ event.currentTarget.dataset.groupid
    	})
	}

**跳转四**	 

		gotoindex:function(){
		 wx.reLaunch({
      		url: '../city/city?groupid='+ event.currentTarget.dataset.groupid
    	})
		}
	
 ### 横向滚动

	//wxml
	  <!-- 我的城市 横向滚动 -->
	  <scroll-view bindtap="tapMove" bindscroll="scroll"  class="scroll-view_H" scroll-x style="width: 100%">
	    <view wx:for="{{mycitylist}}"  catchtap='gotocitydesc'  data-groupid='{{item.groupid}}' class='datalist'>
	      <image src='{{item.gpic}}'></image>
	      <text>{{item.rank}}.{{item.gname}}</text>
	    </view>
	  </scroll-view>
	</view>

	//wxss
	.scroll-view_H{
	  height: 200rpx;   
	  width: 100%;
	  white-space: nowrap; //重点
	}

### 交互反馈
	显示成功  持续2s		
	wx.showToast({
	  title: '成功',
	  icon: 'success',
	  duration: 2000
	})

	//菊花加载
	wx.showLoading({
	  title: '加载中',
	})

	//2s后关闭loading
	setTimeout(function(){
	  wx.hideLoading()
	},2000)
	
	//提示框
	wx.showModal({
  		title: '提示',
  		content: '这是一个模态弹窗',
 		showCancel:false  //隐藏取消按钮
  		confirmText："我知道了" //确定按钮的文字，默认为"确定"，最多 4 个字符
  		cancelText:"no" //取消按钮的文字，默认为"取消"，最多 4 个字符
	})
	
### 设置导航条
	//动态设置当前页面的标题
 	wx.setNavigationBarTitle({
  		title: '当前页面'
	})	
	
### 朋友圈照片排版 动态设置class 查看大图
	//照片排版
	<view class='template'>
      <image mode="aspectFill" data-index="{{index}}" 
		catchtap='seebigpic' wx:for="{{pics}}" class='{{num}}' src='{{item}}'>
     </image>
    </view>
    其中 mode="aspectFill" 是让图片在显示时候以最优的方式显示不会拉伸
	
	.template {
	  display: flex;
	  padding: 0 12rpx 20rpx 20rpx;
	  flex-flow: row wrap;
	  -ms-flex-pack: distribute;
	  justify-content:flex-start; 
	}
	.template .three{
	  width: 230rpx;
	  height: 230rpx;
	  margin-right: 8rpx;
	  margin-top: 8rpx;
	}
	.template .two{
	  width: 350rpx;
	  height: 350rpx;
	  margin-right: 8rpx;
	   margin-top: 8rpx;
	}
	.template .one{
	  width: 710rpx;
	  height: 710rpx;
	   margin-top: 8rpx;
	}

	
	Page({
		  	data: {
		    num:"", //class类名
		    pics: "", //照片
		    content:"", //文本
		    city: "武汉", //城市
		    username:"", //用户名
		    userpic:"", //用户头像
		    hascontent:true ,//默认文本有内容
		    url:"",
		  },
		  /**
		   * 生命周期函数--监听页面显示
		   */
		  onShow: function () {
		
		
		    //登录授权
		    app.getUserInfo(function (userInfo) {
		      var userid = wx.getStorageSync("userid");
		
		      wx.request({
		        url: "",
		        data: {
		          eventId: nf
		        },
		        success: function (res) {
		          console.log(res)
		          console.log(res.data.data)
		          console.log(res.data.data[0].thumbnail)
		          var pics = res.data.data[0].thumbnail;
		          var url = res.data.data[0].url;
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
		              userpic: userpic,
		              url:url
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
		              userpic: userpic,
		              url: url
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
		              userpic: userpic,
		              url: url
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
		              userpic: userpic,
		              url: url
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
		              userpic: userpic,
		              url: url
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
		              city: city,
		              url: url
		            })
		          }
		    
		        }
		
		      })
		    });
		  },

		//查看当前图片的大图
		seebigpic:function(e){
				 console.log(e)
				 var index = e.currentTarget.dataset.index;
				 wx.previewImage({
				      current: this.data.url[index] , // 当前显示图片的http链接
				      urls: this.data.url // 需要预览的图片http链接列表
				   })
			}


### 排行榜

![img](http://oibl5dyji.bkt.clouddn.com/20170930133008.png)

	<!-- 照片排行 -->
	<view class='photolist'>
	    <view wx:for='{{photolist}}' class='template'>
	        <view class='index'>
	          <image wx:if="{{index == 0}}" src='http://oibl5dyji.bkt.clouddn.com/20170926202900.png'></image>
	          <image wx:elif="{{index ==1}}" src='http://oibl5dyji.bkt.clouddn.com/20170926202904.png'></image>
	          <image wx:elif="{{index ==2}}" src='http://oibl5dyji.bkt.clouddn.com/20170926202901.png'></image>
	          <text wx:else>{{item.rank}}</text>
	        </view>
	        <view class='desc'>
	          <view>
	           <image src='{{item.upic}}'></image>
	           <text  class="{{item.userid == userid?'red':''}}">{{item.unickname}}</text>
	          </view>
	          <view>
	           <text>{{item.num}}</text>
	            <image src='http://oibl5dyji.bkt.clouddn.com/20170926202903.png'></image>
	          </view>
	        </view>
	    </view> 
	</view>		

	Page({
	  data: {
	    photolist:"",
	    myRank:"",
	    totalContribution:"",
	    userpic:"",
	    username:""
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
	        url: "",
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
	            console.log(e.userid).log(e.userid)
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
	
### 数据存储
  wx.setStorageSync(KEY,DATA)将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
  wx.getStorageSync(KEY)从本地缓存中同步获取指定 key 对应的内容。
  **[点击查看更多](https://mp.weixin.qq.com/debug/wxadoc/dev/api/data.html#wxsetstorageobject)**
### url传递参数	
  前一个页面通过url跳转传递参数到目标页面

		wx.navigateTo({
       		 url: '../photoerlist/photoerlist?searchLimit=' + that.data.activeList.menu[1].searchLimit + '&urlTitle=' + 		
		 that.data.activeList.menu[1].urlTitle
		})
目标页面获取参数

		onLoad: function (options) {
		    this.searchLimit = options.searchLimit ? options.searchLimit : 100;
		    this.urlTitle = options.urlTitle 
		    var that = this
		    wx.request({
		      url: "https://api.zhuiyinanian.com/YinianProject/space/GetGroupLikeList",
		      data: {
			groupid: wx.getStorageSync("groupid"),
			uid: wx.getStorageSync("userid"),
			searchLimit: that.searchLimit  //使用上一个页面传来的参数
			},
		      success: function (res) {
			console.log(res)
			var likelist = res.data.data;
			that.setData({
			  likelist: likelist
			})
			wx.setNavigationBarTitle({
			  title: that.urlTitle, //使用上一个页面传来的参数
			})
		      }
		    })
		  },
### 阻止当前页面分享功能
删除掉onShareAppMessage这个方法即可

		Page({
			  /**
			   * 用户点击右上角分享
			   */
			  onShareAppMessage: function () {
			    
			  }
			})
	
### 保存图片到本地相册

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
	    var imgSrc = "https://oibl5dyji.bkt.clouddn.com/20170929130817.png";
	    wx.downloadFile({
	      url: imgSrc,
	      success:function (res) {
	        console.log(res);
	        //图片保存到本地
	        wx.saveImageToPhotosAlbum({
	          filePath: res.tempFilePath,
	          success:function (data) {
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
 	 } 

