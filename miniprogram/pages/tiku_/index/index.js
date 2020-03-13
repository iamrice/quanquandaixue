//index.js
/**
 * 答题模块
 */
//获取应用实例
var QC = new require('../../../utils/question_control.js')
var questioncontrol = QC.questionControl
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    console.log(options)
    this.setData({
      collection: options.collection,
    })
    console.log(this.data.collection)
  },
  
  turnBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //事件处理函数
  //按照顺序答题
  bindSequence: function() {
    questioncontrol.getQuestions(this.data.collection)
    wx.navigateTo({
      url: '../question/question?type=sequence'
    })
  },
  //乱序答题
  bindRandom: function () {
    questioncontrol.getQuestions(this.data.collection)
    wx.navigateTo({
      url: '../question/question?type=random'
    })
  },
  //收藏题目
  bindFavorite: function () {
    questioncontrol.getQuestions(this.data.collection)
    let favorite_list = wx.getStorageSync('favorite_list')
    if (!favorite_list) {
      wx.showModal({
        title: 'Oops!',
        content: '你没有收藏的问题'
      })
      return
    }
    wx.navigateTo({
      url: '../question/question?type=favorite'
    })
  },
  
  about: function(){
    wx.navigateTo({
      url: '../about/about'
    })
  }

})
