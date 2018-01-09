// pages/admin/admin.js

const app = getApp()
//var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    memberList: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getMemberlist()
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

  getMemberlist: function () {
    var that = this

    wx.request({

      url: app.globalData.backendHost + '/members',  //小程序后台必须设置该路径为白名单
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("sessionKey")                          //Put res.code to header but in data, for pre-authentication in Spring security

      },     
      success: function (res) {
        if ((res.statusCode == 200) && (!res.data.statusCode)) {
          that.setData({
            memberList: res.data
          })
        } else {           
          wx.navigateBack()
          app.messageBox("注意", "这位同学不要乱点我")
        }


      },

      fail: function (err) {
        console.log(err.statusCode)
      }
    })
  },

  bindLineItemTap: function (e) {
    if (e.currentTarget.dataset.selectedmember) {
      wx.setStorageSync("selectedMember", e.currentTarget.dataset.selectedmember)
      wx.navigateTo({
        url: '/pages/admin_members/admin_members',
      })
    } else {
      console.log('cannot select member ')
    }
  }
})

