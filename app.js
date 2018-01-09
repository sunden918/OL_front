//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          this.getSessionKey(res.code)
          //this.getMemberInfo(wx.getStorageSync('sessionKey'))
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },

  getSessionKey: function (rescode) {

    var that = this
    wx.request({
      url: this.globalData.backendHost,  //小程序后台必须设置该路径为白名单
      header: {
        'content-type': 'application/json',
        'Authorization': rescode                          //Put res.code to header but in data, for pre-authentication in Spring security
      },

      success: function (res) {
        if (res.statusCode == 200) {
          wx.setStorageSync('sessionKey', res.data)
          that.getMemberInfo(wx.getStorageSync('sessionKey'))

        } else {
          console.log("get 3rd session Key failed:", res)
        }

        //防异步处理
        // if (getCurrentPages().length != 0) {
        //   getCurrentPages()[getCurrentPages().length - 1].onShow()
        // }
      },

      fail: function (err) {
        console.log(err.statusCode)
      }
    })
  },

  getMemberInfo: function (sessionKey) {
    if (sessionKey) {
      var that = this
      wx.request({
        url: this.globalData.backendHost + '/members/me',  //小程序后台必须设置该路径为白名单
        header: {
          'content-type': 'application/json',
          'Authorization': sessionKey                          //Put res.code to header but in data, for pre-authentication in Spring security
        },

        success: function (res) {
          if ((res.statusCode == 200) && (!res.data.statusCode)) {
            that.globalData.memberInfo = res.data           

          } else {
            if (res.statusCode == 200) {
              that.globalData.noMemberInfo = true
            }           
          }
            //防异步处理
          if (getCurrentPages().length != 0) {
            getCurrentPages()[getCurrentPages().length - 1].onLoad()
          }
        },
        fail: function (err) {
          console.log(err.statusCode)
        }
      })
    } else {
      console.log("there is no session Key from backend")
    }

  },

  matchTimeConvert2UI: function (time) {
    var HH = Math.floor(time / 3600)
    var MM = Math.floor(time % 3600 / 60)
    var SS = Math.floor(time % 60)

    HH = HH >= 10 ? HH.toString() : 0 + HH.toString()
    MM = MM >= 10 ? MM.toString() : 0 + MM.toString()
    SS = SS >= 10 ? SS.toString() : 0 + SS.toString()

    return HH + ":" + MM + ":" + SS
  },
  matchTimeConvert2Backend: function (time) {
    return time[0] * 3600 + time[1] * 60 + time[2]
  },
  getLength: function (str) {
    return str.replace(/[^ -~]/g, 'AA').length;
  },

  limitMaxLength: function (str, maxLength) {
    var result = [];
    for (var i = 0; i < maxLength; i++) {
      var char = str[i]
      if (/[^ -~]/.test(char))
        maxLength--;
      result.push(char);
    }
    return result.join('');
  },

  //Captilized lettle also counter as 2
  limitMaxLengthCap: function (str, maxLength) {
    var result = [];
    for (var i = 0; i < maxLength; i++) {
      var char = str[i]
      if (/[^ -~]/.test(char))
        maxLength--;
      if (/[A-Z]/.test(char))
        maxLength--;
      result.push(char);
    }
    return result.join('');
  },
  messageBox: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
    })
  },

  globalData: {
    userInfo: null,
    rescode: null,
    memberInfo: null,
    noMemberInfo:null,
    
    backendHost: 'https://clubfe996cf12.cn1.hana.ondemand.com/club/',
    appId: null,
    appSecret: null
  }

})