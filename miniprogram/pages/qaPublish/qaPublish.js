// miniprogram/pages/qaPublish/qaPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    userOpenid: null,
    userAvatarUrl: null,
    userNickName: null,
    questionId:null,
    sourcePage:""
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
    var that=this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var info = prevPage.data;
    console.log(info)
    console.log(options)
    that.setData({
      userOpenid: info.userOpenid,
      userAvatarUrl: info.userAvatarUrl,
      userNickName: info.userNickName,
      sourcePage:options.source,
    })
  },

  inputBind: function (event) {
    var that=this;
    that.setData({
      inputValue: event.detail.value
    })
  },

  alert: function (e) {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认发表该疑问吗?',
      success: function (res) {
        if (res.confirm && that.data.inputValue == ""){
          console.log('题目为空')
          console.log(that.data.inputValue)
          wx.showToast({
            title: '题目不能为空',
            image: '../../images/error.png',
            duration: 2000
          })
        } else if (res.confirm&&that.data.inputValue!="") {
          wx.cloud.callFunction({
            name: "searchMaxQuestionId",
            success:res=>{
              console.log(res)
              if(res.result.data.length==0)
              {
                that.setData({
                  questionId: 0,
                })  
              }else{
                that.setData({
                  questionId: res.result.data[0].qaId+1,
                })
              }
              wx.cloud.callFunction({
                name: "addQuestion",
                data: {
                  questionUserId: that.data.userOpenid,
                  questionUserNickName: that.data.userNickName,
                  questionUserAvatarUrl: that.data.userAvatarUrl,
                  qaTitle: that.data.inputValue,
                  qaId: that.data.questionId,
                },
                success:res=>{
                  console.log('用户点击确定')
                  wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 5000,
                    success: function (res) {
                      if (that.data.sourcePage == "qaList") {
                        wx.navigateBack({
                          delta:1
                        })
                      }
                      else if (that.data.sourcePage =="myQuestion"){
                        wx.navigateBack({
                          delta:1
                        })
                      }
                      
                    }
                  })
                }
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