// pages/admin_members/admin_members.js
const app = getApp()
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedMemberInfo: null,
    genderArray: [
      '女', '男'
    ]
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

    wx.getStorageSync("selectedMember")
    if (wx.getStorageSync("selectedMember")) {
      this.setData({
        selectedMemberInfo: wx.getStorageSync("selectedMember")
      })
    } else {
      app.messageBox("error", "cannot get User from StorageSync")
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
  bindDateChange: function (e) {
    var memberInfo = this.data.selectedMemberInfo
    memberInfo.validTo = e.detail.value

    this.setData({
      selectedMemberInfo: memberInfo
    })
  },


  bindSavePress: function () {
    var memberInfo = this.data.selectedMemberInfo

    if (memberInfo.statusDec == '初始')
      memberInfo.statusId = 0
    if (memberInfo.statusDec == '正常')
      memberInfo.statusId = 2
    if (memberInfo.statusDec == '欠费')
      memberInfo.statusId = 4
    if (memberInfo.statusDec == '锁定')
      memberInfo.statusId = 8

    if (memberInfo.statusId != 8) {
      var currentDate = util.formatDate(new Date())
      if (memberInfo.validTo < currentDate) {
        memberInfo.statusId = 4
      } else{
        memberInfo.statusId = 2
      }
     
    }
    wx.request({

      url: app.globalData.backendHost + "/members/" + this.data.selectedMemberInfo.uuid,  //小程序后台必须设置该路径为白名单
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("sessionKey")                          //Put res.code to header but in data, for pre-authentication in Spring security
      },
      data: memberInfo,
      success: function (res) {
        if ((res.statusCode == 200) && (!res.data.statusCode)) {
          wx.showModal({
            title: '成功！',
            content: '资料更新完毕！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                })

              }
            }
          })
        } else {
          wx.showModal({
            title: '保存失败',
            content: '找舵主问下？',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //app.globalData.memberInfo = memberInfo,
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
            }
          })

        }


      },

      fail: function (err) {
        console.log(err.statusCode)
      }
    })

  },

})