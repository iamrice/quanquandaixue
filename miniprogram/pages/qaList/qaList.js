let titleShowList=[];
Page({
  
  data: {
    inputValue: "",
    qaDataList:[],
    userOpenid:null,
    userAvatarUrl:null,
    userNickName:null,
    titleListOnShow:null,//显示渲染的题目文本，长度超过的部分需要截取并省略
  },
  turnBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
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
      }
    })
  },

  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
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

  toSearch:function(e){
      var that=this;
      let key=that.data.inputValue;
      console.log(key);
      wx.cloud.callFunction({
        name:"searchQuestionByKey",
        data:{
          key: key,
        },
        success:res=>{
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
        },
        fail:res=>{
          that.setData({
            qaDataList: [],
            titleListOnShow: [],
          })
        }
      })
  },

  addAlert:function(event){
    wx.navigateTo({
      url: '/pages/qaPublish/qaPublish?source='+'qaList',
    })
  },

  onReady: function () {

  },

  onShow: function () {
    var that = this;
    wx.cloud.callFunction({
      name: "searchQA",
    }).then(res => {
      console.log(res)
      for(var i=0;i<res.result.data.length;i++)
      {
        if (res.result.data[i].qaTitle.length>18){
          titleShowList.push(res.result.data[i].qaTitle.substring(0, 17) + "···")
        }else{
          titleShowList.push(res.result.data[i].qaTitle)
        }
      }
      that.setData({
        qaDataList: res.result.data,
        titleListOnShow:titleShowList,
      })
      titleShowList=[];
    }).catch(err => {
      console.error(err)
    })
  },
})