// pages/CourseDetail/CourseDetail.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getConnect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth
    })
    var that = this
    if (options.courseInfo) {
      console.log(JSON.parse(options.courseInfo))
      this.setData({
        personInfo: JSON.parse(options.courseInfo).personInfo,
        courseInfo: JSON.parse(options.courseInfo).sickHelpData
      })
    }
    if (options.courseID) {
      db.collection('CourseInfo').doc(options.courseID)
        .get()
        .then(res => {
          var price = res.data.courseData.price
          var priceNum = price.match(/[0-9]+/)
          if (priceNum && priceNum.index == 0) {
            res.data.courseData.priceNum = priceNum[0]
            res.data.courseData.priceUnit = price.substr(priceNum.index + priceNum[0].length)
          }
          that.setData({
            courseInfo: res.data.courseData,
            personInfo: res.data.personInfo,
            courseID: res.data._id,
            teacher_openid: res.data._openid
          })
        })
    }
  },

  getConnect: function () {
    var that = this
    if (!app.globalData.hasUserInfo) {
      wx.showModal({
        title: '您尚未注册',
        content: '您尚未注册账号，无法购买课程，请前往个人中心完成注册',
        showCancel: true,
        confirmText: '确定',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }
        }
      })
    }
    else if (!app.globalData.userInfo.studentCheck) {
      wx.showModal({
        title: '尚未认证',
        content: '为保证安全，购买课程前需要完成华南理工大学的学生认证',
        confirmText: '前往认证',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/register/register',
            })
          }
        }
      })
    }
    else {
      db.collection('deal').add({
        data: {
          teacher_openid: that.data.teacher_openid,
          courseID: that.data.courseID
        }
      })
      this.setData({
        getConnect: true
      })
      /*wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
        if (rect) {
          // 使页面滚动到底部
          console.log(rect.height);
          wx.pageScrollTo({
            scrollTop: rect.height
          })
        }
      }).exec()*/
      wx.pageScrollTo({
        scrollTop: 1000
      })
    }
  },

  turnBack: function () {
    wx.navigateBack({
      delta: 1
    })
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