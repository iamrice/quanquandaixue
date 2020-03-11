Page({

  /**
   * 页面的初始数据
   */
  data: {
    vpData: null,
    index: null,
    inputValue: "",
    userOpenid: null,
    userAvatarUrl: null,
    userNickName: null,
    ifFirstLoad: true,
    ifAgree: false,
    agreeImgUrl: "/images/agreebefore.png",
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
    if (that.data.ifFirstLoad == true) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var info = prevPage.data;
      let index = info.index;
      that.setData({
        index: index,
        vpData: info.vpDataList[index],
        userOpenid: info.userOpenid,
        userAvatarUrl: info.userAvatarUrl,
        userNickName: info.userNickName,
      })
      wx.cloud.callFunction({
        name: "vpIfAgree",
        data: {
          userOpenId: that.data.userOpenid,
          vpId: that.data.vpData.vpId,
        },
        success: res => {
          if (res.result.data.length != 0) {
            that.setData({
              agreeImgUrl: "/images/agreeafter.png",
              ifAgree: true,
            })
            console.log("用户点过赞")
          }else{
            console.log("用户没点过赞")
          }
        }
      })
      console.log('初次访问页面')
    } else {
      console.log('评论后再次访问页面')
      console.log(that.data)
      wx.cloud.callFunction({
        name: "searchViewpointByVpId",
        data: {
          vpId: that.data.index,
        }
      }).then(res => {
        that.setData({
          vpData: res.result.data[0]
        })
      }).catch(err => {
        console.error(err)
      })
    }
  },

  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
  },

  agreeAlert: function (e) {
    var that = this;
    if (!that.data.ifAgree) {
      wx.cloud.callFunction({
        name: "vpAddAgreeRecord",
        data: {
          userOpenId: that.data.userOpenid,
          vpId: that.data.vpData.vpId,
        },
        success: res => {
          console.log(res)
          if (res.result.agreeAdd.errMsg == "collection.add:ok" && res.result.agreeUpdate.errMsg == "collection.update:ok") {
            wx.showToast({
              title: '点赞成功',
              image: '../../images/agreeafter.png',
              duration: 2000
            })
            console.log(that.data.vpData.vpAgreeAmount)
            that.setData({
              agreeImgUrl: "/images/agreeafter.png",
              ifAgree: true,
              ['vpData.vpAgreeAmount']: that.data.vpData.vpAgreeAmount + 1,
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '你已经点过赞了',
        image: '../../images/agreeafter.png',
        duration: 2000
      })
    }

  },

  alert: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认发表该评论吗?',
      success: function (res) {
        if (res.confirm && that.data.inputValue == "") {
          console.log('评论内容为空')
          console.log(that.data.inputValue)
          wx.showToast({
            title: '评论不能为空',
            image: '../../images/error.png',
            duration: 2000
          })
        } else if (res.confirm && that.data.inputValue != "") {
          console.log('用户点击确定')
          var obj = {
            commentId: that.data.vpData.vpCommentList.length + 1,
            commentUserId: that.data.userOpenid,
            commentUserName: that.data.userNickName,
            commentUserAvatarUrl: that.data.userAvatarUrl,
            commentText: that.data.inputValue
          }
          var commentList = that.data.vpData.vpCommentList
          commentList.push(obj)
          console.log(commentList)
          wx.cloud.callFunction({
            name: "addComment",
            data: {
              index: that.data.vpData.vpId,
              vpCommentList: commentList,
            },
            success: res => {
              console.log(res)
              that.setData({
                inputValue: "",
                vpCommentList: commentList,
                ifFirstLoad: false,
              })
              wx.showToast({
                title: '发表成功',
                icon: 'success',
                duration: 2000
              })
              that.onLoad()
            },
            fail: res => {
              wx.showToast({
                title: '发表失败',
                image: '../../images/error.png',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})