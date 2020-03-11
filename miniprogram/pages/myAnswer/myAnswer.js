// miniprogram/pages/myAnswer/myAnswer.js
let titleShowList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qaDataList: [],
    userOpenid: null,
    userAvatarUrl: null,
    userNickName: null,
    titleListOnShow: null,//显示渲染的题目文本，长度超过的部分需要截取并省略
  },
  turnBack: function () {
    wx.navigateBack({
      delta: 1
    })
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
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        that.setData({
          userAvatarUrl: res.userInfo.avatarUrl,
          userNickName: res.userInfo.nickName
        })
      }
    })
    wx.cloud.callFunction({
      name: "getOpenid",
      complete: res => {
        console.log(res)
        that.setData({
          userOpenid: res.result.openid
        })
        console.log(that.data.userOpenid)
      }
    })
  },

  toDetail: function (event) {
    console.log(event);
    this.setData({
      index: event.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '/pages/qaDetail/qaDetail'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    setTimeout(function () {
      console.log(that.data)
      wx.cloud.callFunction({
        name: "searchMyAnswer",
        data: {
          answerUserId: that.data.userOpenid,
        },
        complete: res => {
          console.log(res)
          for (var i = 0; i < res.result.data.length; i++) {
            if (res.result.data[i].qaTitle.length > 18) {
              titleShowList.push(res.result.data[i].qaTitle.substring(0, 17) + "···")
            } else {
              titleShowList.push(res.result.data[i].qaTitle)
            }
          }
          that.setData({
            qaDataList: res.result.data,
            titleListOnShow: titleShowList,
          })
          titleShowList = [];
        }
      })
    }, 1800);
  },

})