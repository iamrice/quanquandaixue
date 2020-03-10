// pages/searchList/searchList.js
/**
 * 搜索并获取数据库数据
 */

//刷新动态球颜色
var iconColor = [
  "#a9d8ff", '#0063ce'
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0, //scroll-view高度
    pageIndex: 0, //页码
    totalRecord: 0, //题目总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[0], //下拉刷新球初始颜色
    pageData: [], //题目数据
    searchKey: null //搜索关键字
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
    if (options.searchKey) {
      this.setData({
        searchKey: options.searchKey
      })
      console.log(this.data.searchKey)
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

  //页面显示获取设备屏幕高度，以适配scroll-view组件高度
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750)
          //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        });
      }
    })
    console.log("2")
    console.log(this)
    if (this.data.searchKey) {
      console.log("1")
      this.setData({ pageIndex: 0, pageData: [] });
      this.searchDB();
    }
  },

  //搜索输入框输入取值
  searchInputEvent: function (e) {
    this.setData({ searchKey: e.detail.value });
    console.log(this.data.searchKey)
  },

  img_bind: function (event) {
    var id = event.currentTarget.dataset.item + 1;
    var variable = event.currentTarget.dataset.name;
    console.log(id)
    console.log(variable)
    if (variable == "total")
      this.setData({
        total: id,
      })
  },

  //搜索按钮点击事件
  searchClickEvent: function (e) {
    console.log(this.data.searchKey)
    if (!this.data.searchKey) {
      return;
    }
    this.setData({ pageIndex: 0, pageData: [] });
    this.searchDB();
    // requestData.call(this);
  },

  //下拉请求数据
  scrollLowerEvent: function (e) {
    if (this.data.loadingMore)
      return;
    this.searchDB();
    //requestData.call(this);
  },

  //通过关键字搜索数据库，调用云函数
  searchDB: function (e) {
    this.setData({ loadingMore: true, isInit: false });
    wx.cloud.callFunction({
      name: "searchRecource",
      data: {
        searchKey: this.data.searchKey,
      }
    }).then(res => {
      console.log(res)
      if (res != null) {
        this.setData({
          pageData: res.result,
          totalRecord: res.result.length
          //queryResult: JSON.stringify(res.data, null, 2)
        })
      }
      console.log(this.data.totalRecord)
    }
    )
    updateRefreshBall.call(this);
    // tasks.push(promise)
    // console.log(tasks)
    // this.data.pageData=tasks
    // this.data.totalRecord=tasks.length
    // console.log(this.data)
  },

  //跳转到详细页面
  viewResourceDetail: function (e) {
    var item = e.currentTarget.dataset.item; //资料_id [data-item] 
    console.log('id:',item)
    wx.navigateTo({
      url: '../finddetail/finddetail?id=' + item
    });
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
});
/**
 * 请求题目信息
 */
function requestData() {
  var _this = this;
  var q = this.data.searchKey;
  var start = this.data.pageIndex;

  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  console.log(start)
  requests.requestSearchBook({ q: q, start: start }, (data) => {
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      _this.setData({
        pageData: _this.data.pageData.concat(data.books),
        pageIndex: start + 1,
        totalRecord: data.total
      });
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });
}

/**
 * 刷新下拉效果变色球
 */
function updateRefreshBall() {
  var cIndex = 0;
  var _this = this;
  var timer = setInterval(function () {
    if (!_this.data['loadingMore']) {
      clearInterval(timer);
    }
    if (cIndex >= iconColor.length)
      cIndex = 0;
    _this.setData({ footerIconColor: iconColor[cIndex++] });
  }, 100);
}
