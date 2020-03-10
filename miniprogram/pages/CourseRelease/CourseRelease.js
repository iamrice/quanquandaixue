// pages/CourseRelease/CourseRelease.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    personInfoExpand:false,
    courseInfoExpand:true,
    uploadClicked:false,
    raiseHeight:0
  },

  personInfoClicked:function(){
    this.setData({
      personInfoExpand:!this.data.personInfoExpand
    })
  },
  courseInfoClicked: function () {
    this.setData({
      courseInfoExpand: !this.data.courseInfoExpand
    })
  },
  upload: function () {
    this.setData({
      uploadClicked:true
    })
  },
  submitClicked:function(e){
    var that=this
    var courseData={
      courseName:e.detail.value.courseName,
      price:e.detail.value.price,
      time:e.detail.value.time,
      date: e.detail.value.date,
      remark:e.detail.value.remark,
      ad:e.detail.value.ad
    }
    var priceNum = courseData.price.match(/[0-9]+/)
    if (priceNum && priceNum.index == 0) {
      courseData.priceNum = priceNum[0]
      courseData.priceUnit = courseData.price.substr(priceNum.index + priceNum[0].length)
    }
    var personInfo={
      name: e.detail.value.name,
      grade: e.detail.value.grade,
      major: e.detail.value.major,
      phoneNumber: e.detail.value.phoneNumber,
      nickName:this.data.userInfo.nickName,
      avatarUrl:this.data.userInfo.avatarUrl
    }
    console.log(courseData)
    db.collection('CourseInfo').add({
      data:{
        courseData:courseData,
        personInfo:personInfo
      },
      success:function(){
        wx.showToast({
          title: '课程发布成功',
          icon:'success',
          duration:1200
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },1200)
      },
      fail:function(){
        wx.showToast({
          title: '课程发布失败,请重试',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth,
      windowHeight:wx.getSystemInfoSync().windowHeight
    })

  },

  turnBack:function(){
    wx.navigateBack({
      delta:1
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
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo: app.globalData.userInfo
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