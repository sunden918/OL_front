 // pages/addhistory/addhistory.js
const app = getApp()
var util = require('../../utils/util.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    matchDate: util.formatDate(new Date()),
    matchDiscription: null,    
    matchType: null,
    matchTypeList: ['半标', '标铁', '703', '大铁'],
    maxDesLength: 16,
    matchTimeRange: [[], [], []],
    matchTime: [2, 30, 0], //default value: 02h00m00s

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var hh, mm, ss
    var array = [[], [], []]
    for (hh = 0; hh < 24; hh++)
      array[0][hh] = (hh >= 10) ? hh + '  小时' : "0" + hh + '  小时'
    for (mm = 0; mm < 60; mm++)
      array[1][mm] = (mm >= 10) ? mm + '  分' : "0" + mm + '  分'
    for (ss = 0; ss < 60; ss++)
      array[2][ss] = (ss >= 10) ? ss + '  秒' : "0" + ss + '  秒'

    this.setData({
      matchTimeRange: array
    })

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

  this.setData({
    matchType: wx.getStorageSync("currentTab")   
  })
  
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


  bindMatchDescriptionChange: function (e) {
    if (this.getLength(e.detail.value) > this.data.maxDesLength)
      e.detail.value = this.limitMaxLength(e.detail.value, this.data.maxDesLength);

    this.setData({
      matchDiscription: e.detail.value
    })

  },

  bindMatchTypeChange: function (e) {
    this.setData({
      matchType: e.detail.value
    })
  },
  bindMatchDateChange: function (e) {
    this.setData({
      matchDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      matchTime: e.detail.value
    })
  },
  bindTimeColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

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

  bindAddPress : function(){
    if (this.data.matchDiscription == null) {
      wx.showModal({
        title: '提示',
        content: '请填写比赛描述，如KONA,金堂铁三等',
        showCancel: false,
      })
    } else {
      var matchInfo = {
        "competitionDate": this.data.matchDate,
        "competitionName": this.data.matchDiscription,
        "gameTypeId": this.data.matchType,
        "score": app.matchTimeConvert2Backend(this.data.matchTime), 
      }

      wx.request({

        url: app.globalData.backendHost +'/scorehistories',  //小程序后台必须设置该路径为白名单
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync("sessionKey")                          //Put res.code to header but in data, for pre-authentication in Spring security

        },
        data: matchInfo,
        success: function (res) {
          if (res.data.uuid) {
            wx.showModal({
              title: '恭喜你',
              content: '添加成功！！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {                  
                    wx.switchTab({
                      url: '/pages/main/main',
                    })
                }
              }
            })
          } else {
            wx.showModal({
              title: '失败',
              content: '没加进去，找舵举！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //app.globalData.memberInfo = memberInfo,
                    wx.switchTab({
                      url: '/pages/main/main',
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
    }
  }



})