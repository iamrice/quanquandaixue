// pages/finddetail/finddetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name:'',
    tag:'',
    intro:'',
    fileID:'',
    date:'',
    type:'',
    person:'',
    date: '',
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
      id: options.id
    })
    console.log(this.data.id)
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
    this.searchDB()
  },

  /**
   * 查询数据库获得文件详细信息
   */
  searchDB: function () {
    wx.cloud.callFunction({
      name: "getDetail",
      data: {
        searchKey: this.data.id
      }
    }).then(res => {
      console.log(res)
      if (res != null) {
        this.setData({
          _openid: res.result._openid,
          school: res.result.school,
          name: res.result.name,
          tag: res.result.tag,
          intro: res.result.intro,
          fileID: res.result.fileID,
          date: res.result.date,
          type: res.result.type,
          img: res.result.img,
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        console.log(this.data)
      }
      else {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    }
    )
  },

  /**
   * 下载文件
   */
  downloadFile() {
    wx.cloud.downloadFile({
      fileID: this.data.fileID
      }).then(res => {
        console.log(res.tempFilePath)
        this.setData({
          filePath: res.tempFilePath
          })
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