Page({

  /**
   * 页面的初始数据
   */
  data: {
    qaData:null,
    index:null,
    inputValue: "",
    userOpenid: null,
    userAvatarUrl: null,
    userNickName: null,
    ifFirstLoad:true,
    ifAgree:false,
    agreeImgUrl:"/images/agreebefore.png",
    qaDataShow:[]
  },

  compare:function(property){
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  turnBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    var that=this;
    if (that.data.ifFirstLoad == true) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var info = prevPage.data;
      let index = info.index;
      if (info.qaDataList[index].length != 0) {
        let item = info.qaDataList[index]
        item.qaAnswerList.sort(that.compare('agreeAmount'))
        item.qaAnswerList.reverse()
        console.log(info.qaDataList[index])
      }
      that.setData({
        index: index,
        qaData: info.qaDataList[index],
        userOpenid: info.userOpenid,
        userAvatarUrl: info.userAvatarUrl,
        userNickName: info.userNickName,
      })
      
      wx.cloud.callFunction({
        name: "ifAgree",
        data: {
          userOpenId: that.data.userOpenid,
          qaId: that.data.qaData.qaId,
        },
        success: res => {
          console.log(res.result.data.length)
          if (res.result.data.length!=0){
            that.setData({
              agreeImgUrl:"/images/agreeafter.png",
              ifAgree:true,
            })
          }
        }
      })
      console.log('First')
    } else {
      console.log('NoFirst')
      console.log(that.data)
      wx.cloud.callFunction({
        name: "searchQuestionByQaId",
        data:{
          qaId:that.data.index,
        }
      }).then(res => {
        console.log(res)
        let item = res.result.data[0]
        item.qaAnswerList.sort(that.compare('agreeAmount'))
        item.qaAnswerList.reverse()
        that.setData({
          qaData: item
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

  agreeAlert: function(e){
    var that=this;
    if(!that.data.ifAgree){
      wx.cloud.callFunction({
        name:"addAgreeRecord",
        data:{
          userOpenId: that.data.userOpenid,
          qaId:that.data.qaData.qaId,
        },
        success:res=>{
          console.log(res)
          if (res.result.agreeAdd.errMsg == "collection.add:ok" && res.result.agreeUpdate.errMsg == "collection.update:ok"){
            wx.showToast({
              title: '点赞成功',
              image: '../../images/agreeafter.png',
              duration: 2000
            })
            console.log(that.data.qaData.qaAgreeAmount)
            that.setData({
              agreeImgUrl:"/images/agreeafter.png",
              ifAgree:true,
              ['qaData.qaAgreeAmount']: that.data.qaData.qaAgreeAmount+1,
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '你已经点过赞了',
        image: '../../images/agreeafter.png',
        duration: 2000
      })
    }

  },


// 评论点赞
  agreeAlertForAnswer: function(e){
    var that=this;
    var stopToAgree = 0
    var answerId=e.currentTarget.dataset.item.answerId;
    let item1 = {}
    item1 = JSON.parse(JSON.stringify(that.data.qaData.qaAnswerList))
    let item2 = {}
    item2 = JSON.parse(JSON.stringify(that.data.qaData.qaAnswerList))
    for (let i = 0; i < item2.length; i++) {
      if (item2[i].answerId != answerId){
        item2[i]["ifAgree"]=0
      } else if (item2[i].answerId == answerId &&
        item2[i]["ifAgree"] == 0) {
        item2[i]["agreeAmount"] += 1   
      } else if (item2[i].answerId == answerId &&
        item2[i]["ifAgree"] == 1){
          stopToAgree = 1
      }
    }
    if (!stopToAgree){
      wx.cloud.callFunction({
        name: "updateAnswerAgree",
        data: {
          qaAnswerList:item2,
          qaId: that.data.qaData.qaId,
        },
        success: res => {
          console.log(res)
          if (res.result.errMsg == "collection.update:ok") {
            wx.showToast({
              title: '点赞成功',
              image: '../../images/agreeafter.png',
              duration: 2000
            })
            for (let i = 0; i < item1.length; i++) {
              if (item1[i].answerId == answerId) {
                item1[i]["ifAgree"] = 1
                item1[i]["agreeAmount"] += 1
                break
              }
            }
            that.setData({
              ['qaData.qaAnswerList']: item1
            })  
          }
        }
      })
    }else{
      wx.showToast({
        title: '你已经点过赞了',
        image: '../../images/agreeafter.png',
        duration: 2000
      })
    }
  },

  alert: function(e){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确认发表该回答吗?',
      success: function (res) {
        if (res.confirm && that.data.inputValue == "") {
          console.log('回答内容为空')
          console.log(that.data.inputValue)
          wx.showToast({
            title: '回答不能为空',
            image: '../../images/error.png',
            duration: 2000
          })
        } else if (res.confirm&&that.data.inputValue!="") {
          console.log('用户点击确定')
          var obj={
            answerId: that.data.qaData.qaAnswerList.length+1,
            answerUserId: that.data.userOpenid,
            answerUserName:that.data.userNickName,
            answerUserAvatarUrl: that.data.userAvatarUrl,
            answerText:that.data.inputValue,
            agreeAmount:0,
            ifAgree:0,
          }
          let answerList = {}
          answerList = JSON.parse(JSON.stringify(that.data.qaData.qaAnswerList))
          answerList.push(obj)
          for(let i=0;i<answerList.length;i++){
            answerList[i]["ifAgree"]=0
          }
          console.log(answerList)
          wx.cloud.callFunction({
            name:"addAnswer",
            data:{
              index: that.data.qaData.qaId,
              qaAnswerList: answerList,
            },
            success: res => {
              console.log(res)
              that.setData({
                inputValue: "",
                qaAnswerList: answerList,
                ifFirstLoad:false,
              })
              wx.showToast({
                title: '发表成功',
                icon: 'success',
                duration: 2000
                })
              that.onLoad()
            },
            fail:res=>{
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

  onReady: function () {
    
  },

  onShow: function () {

  }
})