// pages/main/main.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: null,
    hasMemberInfo: false,
    //memberPB: {},
    memberPB: null,
    memberMHistory: null,
    noMemberInfo: null,
    statusColor: 'black',
    statusWeight: 'normal',

    // winWidth: 0,
    // winHeight: 0,
    currentTab: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
        noMemberInfo: app.globalData.noMemberInfo,
        hasMemberInfo: true
      })
    } else {
      this.setData({
        noMemberInfo: app.globalData.noMemberInfo,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


    //update memberInfo
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
        noMemberInfo: app.globalData.noMemberInfo,
        hasMemberInfo: true,
      })

      //set status color
      if (app.globalData.memberInfo.statusDec == "欠费") {
        this.setData({
          statusColor: 'red',
          statusWeight: 'bold',
        })
      }
      //update PB
      this.getMemberPB()

      //update History
      this.getMemberMHistory()
    } else{
      this.setData({
        noMemberInfo: app.globalData.noMemberInfo,
      })
    }

    if (this.data.noMemberInfo) {
      wx.showModal({
        title: '没有用户',
        content: '英雄！你还没有注册， 整一个哇？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({ url: "/pages/register/register" })
          } else if (res.cancel) {
            wx.switchTab({ url: "/pages/index/index" })
          }
        }
      })
    }



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getMemberPB: function (e) {
    var that=this

    wx.request({
      url: app.globalData.backendHost +'/members/personal-best',  //小程序后台必须设置该路径为白名单
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("sessionKey")            

      },
      success: function (res) {
        if ((res.statusCode == 200) && (res.data)) {
          var memberPB1 = { 
            pb257: res.data.gt257?app.matchTimeConvert2UI(res.data.gt257.score):"00:00:00",
            pb515: res.data.gt515?app.matchTimeConvert2UI(res.data.gt515.score):"00:00:00", 
            pb113: res.data.gt113?app.matchTimeConvert2UI(res.data.gt113.score):"00:00:00", 
            pb226: res.data.gt226?app.matchTimeConvert2UI(res.data.gt226.score):"00:00:00",
          }

          that.setData({
            memberPB: memberPB1
          })
        } else {
          console.log("wx.reqest success, but res fail")
        }
      },
      fail: function (err) {
        console.log("wx.reqest fail")
      }
    })
  },

  getMemberMHistory: function (e) {
    var memberMHistory1
    var that = this
    wx.request({
      url: app.globalData.backendHost +'/members/my-games',  //小程序后台必须设置该路径为白名单
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("sessionKey")                          //Put res.code to header but in data, for pre-authentication in Spring security

      },
      success: function (res) {
        if (res.data) {
          memberMHistory1 = res.data
          for (var i in memberMHistory1)
            for (var j in memberMHistory1[i])
              memberMHistory1[i][j].score = app.matchTimeConvert2UI(memberMHistory1[i][j].score)

          that.setData({
            memberMHistory: memberMHistory1
          })
        } else {
          console.log("wx.reqest success, but res fail")
        }
      },
      fail: function (err) {
        console.log("wx.reqest fail")
      }
    })
  },

  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  bindModifyProfile: function (e) {
    wx.navigateTo({
      url: '../changeprofile/changeprofile'
    })
  },

  bindAddHistory: function (e) {
    wx.setStorageSync("currentTab", this.data.currentTab)
    wx.navigateTo({
      url: '../addhistory/addhistory'
    })

  }

})

