//index.js
//获取应用实例
let util = require('../../utils/util.js')
const db = wx.cloud.database()
let app = getApp()
/**
   * 页面的初始数据
   */
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navigationToTopHeight: 80,     // 导航栏到顶部的高度 80 + (margin-top)20
    navigationBarFix: '',           // 用于设置导航栏吸附样式
    showSearchView: true, // 控制显示、隐藏搜索页面
    showUploadView: false,   // 控制显示、隐藏历史搜索页面
    id: '',
    fileID:"",
    name: '',
    tag: '',
    intro: '',
    school: '',
    date:'',
    type: 'PPT',
    typeArray: ['PPT', 'PDF', 'TXT', 'WORD', '其他'],
    indexU: 0,

    sourceList: [
      // {
      //     id: 1,
      //     cover_img_url: 'default_cover_img',
      //     project_name: '项目名1',
      //
      // },
    ],

    // 终端的屏幕宽度
    windowWidth: app.globalData.windowWidth,
    // 计算出日记2张图片以上时图片显示的长、宽度 (15为margin-left\right 5为图片与图片之间的间距)
    diaryImgWidth: Math.floor((app.globalData.windowWidth - (15 * 2 + 5 * 3)) / 3),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 点击导航栏搜索功能 切换显示对应页面
  showSearchView: function () {
    let that = this;
    // 动画：将标识当前选项卡的指示器移动到用户关注推荐选项(第一个) ，也就是指示器的默认初始位置
    // 34(bar width) + 30(bar margin-right) = 64px
    this.animation.translate(0, 0).step();
    that.setData({
      animation: this.animation.export(),
      showSearchView: true,        // 显示用户搜索页面
      showUploadView: false,        // 隐藏打历史搜索页面
    });
  },

  // 点击导航栏上传功能 切换显示对应页面
  showUploadView: function () {
    let that = this;
    // 动画：将标识当前选项卡的指示器移动到日记推荐选项(第二个)，需要向右移动
    // 距离屏幕最左边 20（margin-left） + 38(bar width) + 30(bar margin-right) = 88px
    this.animation.translate(+64, 0).step();
    that.setData({
      animation: this.animation.export(),
      showSearchView: false,        // 隐藏用户搜索页面
      showUploadView: true,          // 显示文件上传页面
    });
  },

  // 进入资料搜索页
  intoSearchProjectPage: function () {
    wx.navigateTo({
      url: 'searchList/searchList'
    })
  },
  // 进入学习资料搜索页
  searchProjectByXuexi: function () {
    wx.navigateTo({
      url: 'searchList/searchList?searchKey=学习'
    })
  },
  // 进入考级考证搜索页
  searchProjectByKaozheng: function () {
    wx.navigateTo({
      url: 'searchList/searchList?searchKey=考级考证'
    })
  },
  // 进入考研资料搜索页
  searchProjectByKaoyan: function () {
    wx.navigateTo({
      url: 'searchList/searchList?searchKey=考研'
    })
  },
  // 进入影音资料搜索页
  searchProjectByYingyin: function () {
    wx.navigateTo({
      url: 'searchList/searchList?searchKey=影音'
    })
  },
  // 进入工具软件搜索页
  searchProjectByGongju: function () {
    wx.navigateTo({
      url: 'searchList/searchList?searchKey=工具软件'
    })
  },
  turnBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function () {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 文件类型选择
  bindTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      type: this.data.typeArray[e.detail.value]
    })
    console.log(this.data.type)
  },

  // 输入文件名
  funInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 输入标签
  funInputTag: function (e) {
    this.setData({
      tag: e.detail.value
    })
  },
  // 输入文件介绍
  funInputIntro: function (e) {
    this.setData({
      intro: e.detail.value
    })
  },
  // 输入学校
  funInputSchool: function (e) {
    this.setData({
      school: e.detail.value
    })
  },
  
  //文件上传
  upLoadFile() {
    let DATE = util.formatDate(new Date())
    // 1.从客户端中选择一个文件
    wx.chooseMessageFile({
      count:1,
      success: (res) => {
        // 2.将文件上传到服务器
        console.log("res")
        console.log(res)
        wx.cloud.uploadFile({
          cloudPath: res.tempFiles[0].name,
          filePath: res.tempFiles[0].path,
          }).then(res => {
            console.log(res.fileID)
            this.setData({
              fileID: res.fileID,
              date:DATE
            })
        })
        wx.showToast({
          title: '文件上传成功',
        })
      },
      fail: err => {
        wx.showToast({
          title: '文件上传失败'
        })
      }
    })
  },
  //跳转到详细页面
  viewOneDetail: function (e) {
    wx.navigateTo({
      url: '../ziliao/finddetail/finddetail?id=d68532785e3963910a43998c59942266'
    });
  },
  viewTwoDetail: function (e) {
    wx.navigateTo({
      url: '../ziliao/finddetail/finddetail?id=d9ea35c25e3922a50a23d5d20b67856b'
    });
  },
  viewThreeDetail: function (e) {
    wx.navigateTo({
      url: '../ziliao/finddetail/finddetail?id=74b140b45e3804f709c9e13968812f6a'
    });
  },

  //提交文件上传表单
  registerFormSubmit: function (e) {
    console.log(this.data)
    this.addResource()
  },

  //上传文件
  addResource: function () {
    console.log("1")
    if (!(this.data.name == '' || this.intro == "" || this.data.tag == '')) {
      db.collection('resources').add({
        data: {
          //插入时会自动插入_id和_openid
          name: this.data.name,
          tag: this.data.tag,
          intro: this.data.intro,
          school: this.data.school,
          fileID: this.data.fileID,
          type: this.data.type,
          date: this.data.date,
          img: "/images/bottomIcon/" + this.data.type + ".png"
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '新增文件成功',
          })
          console.log('[resources] [新增记录] 成功，记录 _id: ', res._id)

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增文件失败'
          })
          console.error('[resources] [新增记录] 失败：', err)
        }
      })
    }
    else {
      wx.showToast({
        icon: 'none',
        title: '信息不能为空'
      })
      console.log("something's null")
    }
  },

  /**
       * 生命周期函数--监听页面初次渲染完成
       */
  onReady: function () {
    // 获取动画实例 用于在切换导航栏功能的时候执行对应的动画
    this.animation = wx.createAnimation({
      duration: 400
    });
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
