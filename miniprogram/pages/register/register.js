// pages/register/register.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperDot_1: 2,
    swiperDot_2: 0,
    swiperDot_3: 0,
    tipExpand: 0,
    address: '@mail.scut.edu.cn',
    code: '',
    countDown: ''
  },

  switch_2: function() {
    console.log('ook')
    this.setData({
      swiperDot_3: 1
    })
  },

  bindinput: function(e) {
    if (e.currentTarget.id == 'address')
      this.setData({
        [e.currentTarget.id]: e.detail.value + '@mail.scut.edu.cn',
      })
    else
      this.setData({
        [e.currentTarget.id]: e.detail.value,
      })
  },

  confirmPasscode: function(e) {
    this.setData({
      confirmPasscode: e.detail.value
    })
    if (this.data.passcode) {
      if (e.detail.value != this.data.passcode) {
        this.setData({
          passcodeTip: '密码不一致'
        })
      } else {
        this.setData({
          passcodeTip: ''
        })
      }
    }
  },

  codeInput: function(e) {
    var that = this
    if (this.data.code) {
      if (this.data.code == e.detail.value) {
        this.setData({
          codeTip: '验证成功',
          codeTipColor: 'green'
        })
        setTimeout(function() {
          if (e.currentTarget.id == 'login')
            that.setData({
              swiperDot_1: 2
            })
          if (e.currentTarget.id == 'register')
            that.setData({
              swiperDot_2: 1
            })
        }, 1000)
      } else {
        this.setData({
          codeTip: '验证码错误',
          codeTipColor: 'red'
        })
      }
    }
  },

  sendCode_login: function() {
    console.log('sendCode_login')
    var that = this
    if (this.data.loginAddress == '')
      this.setData({
        loginTip: '邮箱不能为空'
      })
    else {
      db.collection('UserList').where({
          address: that.data.loginAddress
        })
        .get()
        .then(res => {
          console.log(res.data)
          if (!res.data.length) {
            console.log('该邮箱未注册')
            this.setData({
              loginTip: '该邮箱未注册'
            })
          } else {
            console.log('countDown')
            var num = 60
            var i = setInterval(function() {
              that.setData({
                countDown: '已发送(' + num + 's)'
              })
              num = num - 1
              if (num < 0) {
                clearInterval(i)
                that.setData({
                  countDown: ''
                })
              }
            }, 1000)
            that.sendEmail(that.data.loginAddress)
          }
        })
    }
  },
  sendCode: function() {
    var that = this
    if (this.data.address == '@mail.scut.edu.cn')
      this.setData({
        addressTip: '邮箱不能为空'
      })
    else {
      db.collection('UserList').where({
          address: that.data.address
        })
        .get()
        .then(res => {
          if (res.data.length) {
            console.log('该邮箱已注册')
            this.setData({
              addressTip: '该邮箱已被注册'
            })
          } else {
            var num = 60
            var i = setInterval(function() {
              that.setData({
                countDown: '已发送(' + num + 's)'
              })
              num = num - 1
              if (num < 0) {
                clearInterval(i)
                that.setData({
                  countDown: ''
                })
              }
            }, 1000)
            that.sendEmail(that.data.address)
          }
        })
    }
  },

  sendEmail: function(address) {
    var code = Math.floor(Math.random() * 1000000)
    this.setData({
      code
    })
    wx.request({
      url: 'https://service-mpioz8cu-1300620164.gz.apigw.tencentcs.com/release/sendEmail',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'code': code,
        'address': address
      },
      success(res) {
        console.log(res.data)
      },
      fail(res) {
        console.log('请求失败')
      }
    })
  },

  login: function() {
    var that = this
    if (!this.data.loginAddress) {
      this.setData({
        loginTip: '请输入邮箱地址'
      })
    } else {
      db.collection('UserList').where({
          address: that.data.loginAddress
        }).get()
        .then(res => {
          if (!res.data.length) {
            that.setData({
              loginTip: '该邮箱未注册'
            })
          } else {
            var truePasscode = res.data[0].passcode
            if (truePasscode == that.data.loginPasscode) {
              that.setData({
                swiperDot_1: 2
              })
            } else {
              that.setData({
                loginTip: '密码错误'
              })
            }
          }
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          px2rpx: 750 / res.windowWidth,
          topBarHeight: res.statusBarHeight
        })

      },
    })
  },

  turnBack: function() {
    console.log('turnBack')
    wx.navigateBack({
      delta: 1
    })
  },

  switch_1: function(event) {
    this.setData({
      swiperDot_1: event.currentTarget.id
    })
  },

  tipClicked: function() {
    this.setData({
      tipExpand: !this.data.tipExpand
    })
  },

  nextStep: function() {
    if (this.data.passcode && this.data.confirmPasscode == this.data.passcode) {
      this.setData({
        swiperDot_2: 2
      })
    } else if (!this.data.passcode) {
      this.setData({
        passcodeTip: '密码不能为空'
      })
    } else {
      this.setData({
        passcodeTip: '密码不一致'
      })
    }
  },

  finish: function() {
    var t = this.data
    var that = this

    app.globalData.userInfo['address'] =t.address
    app.globalData.userInfo['name']=t.name
    app.globalData.userInfo['major']=t.major
    app.globalData.userInfo['phoneNumber']=t.phoneNumber
    app.globalData.userInfo['nickname']= t.nickname
    app.globalData.userInfo['studentCheck']=true

    db.collection('UserList').doc(app.globalData.userInfo._id).update({
      data: {
        address: t.address,
        name: t.name,
        major: t.major,
        phoneNumber: t.phoneNumber,
        grade: t.grade,
        studentCheck: true
      },
      success: function() {
        wx.showToast({
          title: '认证成功',
          icon: 'success',
          duration: 1200
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          })
        }, 1200)
      },
      fail:function(){
        wx.showToast({
          title: '上传失败',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})