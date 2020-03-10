// pages/mine/mine.js
var app=getApp()
//云储存
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTag:0,
    selectedTag2:0,
  },

  tagChange:function(e){
    this.setData({
      selectedTag:e.currentTarget.id
    })
  },
  tagChange2:function(e){
    this.setData({
      selectedTag2:e.currentTarget.id
    })
  },
  turnPage:function(e){
    wx.navigateTo({
      url: e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth
    })
  },
  
  swiperChange: function (e) {
    console.log(e.detail)
    this.setData({
      selectedTag: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  register:function(){

  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo=true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    db.collection('UserList').add({
      data:{
        studentCheck:false,
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        concernedCourse:[],
        purchaseCourse:[],
        releaseCourse:[],
        myQuestion:[],
        myAnswer:[],
        concernedCourse:[]
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var times=0;
    var that=this;
    var t=setInterval(function(){
      times=times+1;
      console.log('times:'+times)
      if(app.globalData.hasUserInfo){
        that.setData({
          hasUserInfo: app.globalData.hasUserInfo,
          userInfo: app.globalData.userInfo
        })
        clearInterval(t)
      }
      if(times>10){
        clearInterval(t)
      }
    },200)
    this.setData({
      hasUserInfo: app.globalData.hasUserInfo,
      userInfo:app.globalData.userInfo
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