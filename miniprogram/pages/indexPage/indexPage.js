// pages/indexPage/indexPage.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    proList: [
      { index: 0, selected: 1 },
      { index: 1, selected: 0 },
      { index: 2, selected: 0 },
      { index: 3, selected: 0 },
      { index: 4, selected: 0 },
    ],
    recommendList: [
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/推荐页02.jpg'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/推荐页01.jpg'
      }, 
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/推荐页03.jpg'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/推荐页04.jpg'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/推荐页05.jpg'
      },
    ], 
    mainContent:[
      {
        image:'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/laoshi.png',
        text:'学霸帮帮',
        pageUrl:'/pages/CourseSearch/CourseSearch'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/gerentiku.png',
        text: '题库',
        pageUrl:'/pages/tiku/index'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/xiangfa.png',
        text: '问答/想法'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/ziliaoku.png',
        text: '资料库',
        pageUrl:'/pages/ziliao/ziliao'
      },
      {
        image: 'cloud://appointment-2cbf9b.6170-appointment-2cbf9b-1258572356/tuandui.png',
        text: '关于我们'
      },
    ]
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

  turnToPage:function(e){
    wx.navigateTo({
      url: this.data.mainContent[e.currentTarget.id].pageUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowHeight:wx.getSystemInfoSync().windowHeight,
      topBarHeight:wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth
    })    
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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