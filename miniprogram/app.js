//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code)
          var loginCode = res.code
          return new Promise((reslove, reject) => {
            wx.request({
              url: 'https://service-3nwpcn9k-1300620164.gz.apigw.tencentcs.com/release/accountCheck',
              method: 'GET',
              header: {
                'loginCode': loginCode
              },
              success(res) {
                if (Object.prototype.toString.call(res.data) === "[object String]") {
                  var dic = JSON.parse(res.data)

                  console.log(dic)
                  if (dic['errcode'] == 0) {
                    console.log(dic['data'])
                    if (dic['data'].length == 0) {
                      console.log('用户未注册')
                    }
                    else {
                      console.log('用户已注册')
                      var info = JSON.parse(dic['data'][0])
                      
                      that.globalData.userInfo = info
                      that.globalData.hasUserInfo = true
                    }
                  }
                }
              },
              fail(res) {
                reject('请求失败，请检查网络是否正常')
                console.log('请求失败')
              }
            })
          })
        }
        else {
          console.log('no code')
        }
      }
    });

  },
  globalData:{
    hasUserInfo:false,
    userInfo:{}
  }
})
