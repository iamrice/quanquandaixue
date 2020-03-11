let titleShowList = []; 
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    tablist: ['电台好文', '观点分享'],
    vpDataList: [],
    userOpenid: null,
    userAvatarUrl: null,
    userNickName: null,
    titleListOnShow: null,//显示渲染的标题文本，长度超过的部分需要截取并省略
    pushDataList:[],
  },

  //tab框
  selected: function (e) {
    let that = this
    console.log(e)
    let index = e.currentTarget.dataset.index
    console.log("index", index)
    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else if (index == 1) {
      that.setData({
        selected: 1
      })
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
  onLoad: function (options) {
    this.setData({
      topBarHeight: wx.getSystemInfoSync().statusBarHeight,
      px2rpx: 750 / wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
    var that = this;

    // 获取公众号accesstoken
    // var serverUrl = 'http://localhost/test/getAccessToken.php';
    // wx.request({
    //   url:serverUrl,
    //   method:'GET',
    //   dataType:'json',
    //   success:function(res){
    //     console.log(res.data)
    //     that.getArtLists(res.data.access_token)//数据库导入素材
    //   },
    // })

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

  //导入素材函数
  getArtLists(accessToken) {
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/material/get_materialcount?access_token=' + accessToken,
      method:'GET',
      success(res){
        let news_count=res.data.news_count;
        let res_id=null;
        for (var i = 0; i < Math.ceil(news_count/20);i++){
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=' + accessToken,
            data: {
              "type": 'news',
              "offset": i*20,
              "count": 20
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success(res) {
              console.log('微信素材列表', res)
              for(let j=0;j<res.data.item.length;j++){
                let news_item = res.data.item[j].content.news_item;
                for(let k=0;k<news_item.length;k++){
                  let title=news_item[k].title;//标题
                  let url=news_item[k].url;//链接
                  let image_url=news_item[k].thumb_url;//封面
                  let digest=news_item[k].digest;//摘要
                  let author=news_item[k].author;//作者
                  db.collection('pushData').where({
                    _id: url
                  }).get({
                    success: function (res) {
                      res_id = res.data[0]._id;
                    }
                  })
                  if (res_id == url) {
                  } else {
                    db.collection('pushData').add({
                      data: {
                        _id: url,
                        title: title,
                        digest:digest,
                        image_url:image_url,
                      },
                      success: function (res) {
                        console.log(url+'插入成功')
                      },
                    })
                  }

                }
              }
            },
            fail(res) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            },
            complete() {
              
            }
          })
        }
      }
    })
    
  },

  toPushDetail:function(event){
    console.log(event);
    this.setData({
      index:event.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '/pages/pushDetail/pushDetail',
    })
  },

  toDetail: function (event) {
    console.log(event);
    this.setData({
      index: event.currentTarget.dataset.index
    })
    wx.navigateTo({
      url: '/pages/viewpointDetail/viewpointDetail'
    })
  },
  
  addAlert: function (event) {
    wx.navigateTo({
      url: '/pages/viewpointPublish/viewpointPublish?source=' + 'viewpointList',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 随机从素材中挑选五篇推文进行展示
    wx.cloud.callFunction({
      name:"searchPush",
    }).then(res => {
      console.log(res)
      let total_length=res.result.data.length
      let pushDataList=[]
      let numList=[]
      for (let i = 0; i < 5; i++) {
        var index = Math.floor(Math.random() * total_length);
        var flag = 0;
        for (let j = 0; j < numList.length; j++){
          if (numList[j] == index) {
            flag = 1;
            break;
          }
        }
        if(flag==0){
          numList.push(index)
          pushDataList.push(res.result.data[index])
        }
      }
      that.setData({
        pushDataList:pushDataList,
      })
    }).catch(err => {
      console.error(err)
    })
    wx.cloud.callFunction({
      name: "searchViewpoint",
    }).then(res => {
      console.log(res)
      for (var i = 0; i < res.result.data.length; i++) {
        if (res.result.data[i].vpTitle.length > 18) {
          titleShowList.push(res.result.data[i].vpTitle.substring(0, 17) + "···")
        } else {
          titleShowList.push(res.result.data[i].vpTitle)
        }
      }
      that.setData({
        vpDataList: res.result.data,
        titleListOnShow: titleShowList,
      })
      titleShowList = [];
    }).catch(err => {
      console.error(err)
    })
  },

  randShow:function(){
    var that=this
    // 随机从素材中挑选五篇推文进行展示
    wx.cloud.callFunction({
      name: "searchPush",
    }).then(res => {
      console.log(res)
      let total_length = res.result.data.length
      let pushDataList = []
      let numList = []
      for (let i = 0; i < 5; i++) {
        var index = Math.floor(Math.random() * total_length);
        var flag = 0;
        for (let j = 0; j < numList.length; j++) {
          if (numList[j] == index) {
            flag = 1;
            break;
          }
        }
        if (flag == 0) {
          numList.push(index)
          pushDataList.push(res.result.data[index])
        }
      }
      that.setData({
        pushDataList: pushDataList,
      })
    }).catch(err => {
      console.error(err)
    })
  }

})