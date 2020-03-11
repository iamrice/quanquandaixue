// pages/CourseDetail/CourseDetail.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeList:['不限时间','周一','周二','周三','周四','周四','周五','周六','周日'],
    timeClicked:false,
    proList: [
      { index: 0, selected: 1 },
      { index: 1, selected: 0 },
      { index: 2, selected: 0 },
      { index: 3, selected: 0 },
      { index: 4, selected: 0 },
    ],
    courseList:['a','b','c'],
    selectedTag:0
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
    
  },

  swiperChange:function(e){
    console.log(e.detail)
    this.setData({
      selectedTag:e.detail.current
    })
  },

  turnPage:function(e){
    {
      if(!app.globalData.hasUserInfo){
        wx.showModal({
          title: '您尚未注册',
          content: '您尚未注册账号，无法发布课程，请前往个人中心完成注册',
          showCancel:true,
          confirmText:'确定',
          cancelText:'取消',
          success(res){
            if(res.confirm){
              wx.switchTab({
                url: '/pages/mine/mine',
              })
            }
          }
        })
      }
      else if(!app.globalData.userInfo.studentCheck){
        wx.showModal({
          title: '尚未认证',
          content: '为保证安全，发布课程需要完成华南理工大学的学生认证', 
          confirmText: '前往认证',
          success(res){
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/register/register',
              })
            }
          }
        })
      }
      else{
        wx.navigateTo({
          url: e.currentTarget.id,
        })
      }
    }
    
  },

  tagChange: function (e) {
    this.setData({
      selectedTag: e.currentTarget.id
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
    var that = this
    db.collection('CourseInfo').get()
      .then(res => {
        console.log(res.data)
        that.setData({
          courseList: res.data
        })
      })
    db.collection('sickHelpList').get()
      .then(res => {
        console.log(res.data)
        that.setData({
          sickHelpList: res.data
        })
      })
  },

  courseClicked:function(event){
    var id=event.currentTarget.id
    console.log('/pages/CourseDetail/CourseDetail?courseID=' + id)
    if (this.data.selectedTag==0){
      wx.navigateTo({
        url: '/pages/CourseDetail/CourseDetail?courseInfo=' + JSON.stringify(this.data.courseList[id]),
      })
    }
    if (this.data.selectedTag == 1) {
      console.log('/pages/CourseDetail/CourseDetail?courseInfo=' + JSON.stringify(this.data.sickHelpList[id]))
      wx.navigateTo({
        url: '/pages/SickHelpDetail/SickHelpDetail?courseInfo=' + JSON.stringify(this.data.sickHelpList[id]),
      })
    }
    
  },

  timePickerChange:function(){
    this.setData({
      timeClicked:true
    })
  },

  getSelectItem: function (e) {
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.proList.length;////每个商品的宽度
    var scrollLeft = e.detail.scrollLeft;//滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth);///通过Math.round方法对滚动大于一半的位置进行进位
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
      that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    that.setData({
      proList: that.data.proList
    });
  },

  turnBack: function () {
    console.log('turnBack')
    wx.navigateBack({
      delta: 1
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