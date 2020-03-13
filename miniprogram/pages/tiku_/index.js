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
    question: '',
    answer: 'A',
    A: '',
    B: '',
    C: '',
    D: '',
    analysis: '',
    tag: [],
    unit: '1',
    unitArray: ['1：引言', '2：物理层', '3：数据链路层', '4：介质访问控制子层', '5：网络层', '6：传输层', '7：应用层'],
    uArray: ['1', '2', '3', '4', '5', '6', '7'],
    indexU: 0,
    choiceArray: ['A', 'B', 'C', 'D'],
    indexC: 0,

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
  // 进入题库搜索页
  intoSearchProjectPage: function () {
    wx.navigateTo({
      url: 'searchList/searchList'
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
  //跳转到详细页面
  viewOneDetail: function (e) {
    wx.navigateTo({
      url: '../tiku/index/index?collection=jiwang'
    });
  },

  //选择单元
  bindUnitChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      unit: this.data.uArray[e.detail.value]
    })
    console.log(this.data.unit)
  },

  //选择正确答案
  bindAnswerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      answer: this.data.choiceArray[e.detail.value]
    })
    console.log(this.data.answer)
  },

  //输入题目
  funInputTitle: function (e) {
    this.setData({
      question: e.detail.value
    })
  },

  //输入ABCD各选项
  funInputA: function (e) {
    this.setData({
      A: e.detail.value
    })
  },
  funInputB: function (e) {
    this.setData({
      B: e.detail.value
    })
  },
  funInputC: function (e) {
    this.setData({
      C: e.detail.value
    })
  },
  funInputD: function (e) {
    this.setData({
      D: e.detail.value
    })
  },

  //输入解析
  funInputAnalysis: function (e) {
    this.setData({
      analysis: e.detail.value
    })
  },

  //输入标签
  funInputTag: function (e) {
    this.setData({
      tag: e.detail.value
    })
  },
  registerFormSubmit: function (e) {
    console.log(this.data)
    this.addQuestion()

  },

  addQuestion: function () {
    console.log("1")
    if (!(this.data.question == '' || this.data.A == "" || this.data.B == '' || this.data.C == '' || this.data.D == '' || this.data.analysis == '' || this.data.tag == '' || this.data.answer == '' || this.data.unit == '')) {
      db.collection('questions').add({
        data: {
          //插入时会自动插入_id和_openid
          question: this.data.question,
          A: this.data.A,
          B: this.data.B,
          C: this.data.C,
          D: this.data.D,
          analysis: this.data.analysis,
          answer: this.data.answer,
          tag: this.data.tag,
          unit: this.data.unit,
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '新增题目成功',
          })
          console.log('[questions] [新增记录] 成功，记录 _id: ', res._id)

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增题目失败'
          })
          console.error('[diary] [新增记录] 失败：', err)
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

  judgeEvent: function () {
    console.log(this.id)
    this.addQuestion()
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
