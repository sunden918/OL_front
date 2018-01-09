//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    memberInfo: {},
    hasMemberInfo: false,
    noMemberInfo: false,
    hasuserInfo: false,

  },
  //事件处理函数
  bindGo2Reg: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        memberInfo: app.globalData.memberInfo,
        hasUserInfo: true
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
        hasMemberInfo: true,
      })      
    } else {

    }

    this.setData({
      noMemberInfo: app.globalData.noMemberInfo,
    })  

  },

  onShow: function () {
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
        hasMemberInfo: true,
      })
    } else{

    }

    this.setData({
      noMemberInfo: app.globalData.noMemberInfo,
    })  
  },
  goAdminPage: function(){
    wx.navigateTo({
      url: '../admin/admin'
    })
  }
  /*,
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }*/

})
