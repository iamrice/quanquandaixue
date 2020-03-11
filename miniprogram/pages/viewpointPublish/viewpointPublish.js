// miniprogram/pages/viewpointPublish/viewpointPublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTitle: "",
    inputText: "",
    userOpenid: null,
    userAvatarUrl: null,
    userNickName: null,
    viewpointId: null,
    sourcePage: "",
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    keyboardHeight: 0,
    isIOS: false
  },
  
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 将文件上传到服务器
        wx.cloud.uploadFile({
          cloudPath: "circle-zyhq1",
          filePath: res.tempFilePaths[0],
        }).then(res => {
          console.log(res.fileID)
          //获取当前时间戳  
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          console.log("当前时间戳为：" + timestamp); 
          that.editorCtx.insertImage({
            src: res.fileID,
            data: {
              id: timestamp,
              role: 'god'
            },
            width: '100%',
            success: function () {
              console.log('insert image success')
            }
          })
        })
      },
      fail:function(res){
        wx.showToast({
          title: '图片上传失败',
          duration : 2000,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    const that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var info = prevPage.data;
    console.log(info)
    console.log(options)
    that.setData({
      userOpenid: info.userOpenid,
      userAvatarUrl: info.userAvatarUrl,
      userNickName: info.userNickName,
      sourcePage: options.source,
    })
    
  },

  inputTitleBind: function (event) {
    var that = this;
    that.setData({
      inputTitle: event.detail.value
    })
  },

  inputTextBind: function (event) {
    var that = this;
    that.setData({
      inputText: event.detail.html
    })
  },

  alert: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认发表该观点吗?',
      success: function (res) {
        if (res.confirm && that.data.inputTitle == "") {
          console.log('标题为空')
          console.log(that.data.inputTitle)
          wx.showToast({
            title: '标题不能为空',
            image: '../../images/error.png',
            duration: 2000
          })
        } else if(res.confirm && that.data.inputText == "") {
          console.log('内容为空')
          console.log(that.data.inputText)
          wx.showToast({
            title: '内容不能为空',
            image: '../../images/error.png',
            duration: 2000
          })
        } else if (res.confirm && that.data.inputTitle != "" && that.data.inputText != "") {
          wx.cloud.callFunction({
            name: "searchMaxViewpointId",
            success: res => {
              console.log(res)
              if (res.result.data.length == 0) {
                that.setData({
                  viewpointId: 0,
                })
              } else {
                that.setData({
                  viewpointId: res.result.data[0].vpId + 1,
                })
              }
              wx.cloud.callFunction({
                name: "addViewpoint",
                data: {
                  vpUserId: that.data.userOpenid,
                  vpUserNickName: that.data.userNickName,
                  vpUserAvatarUrl: that.data.userAvatarUrl,
                  vpTitle: that.data.inputTitle,
                  vpId: that.data.viewpointId,
                  vpText:that.data.inputText,
                },
                success: res => {
                  console.log('用户点击确定')
                  wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 5000,
                    success: function (res) {
                      if (that.data.sourcePage == "viewpointList") {
                        wx.navigateBack({
                          delta:1
                        })
                      }
                      else if (that.data.sourcePage == "myViewpoint") {
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