// pages/dashboard/dashboard.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubMatchHistory:null,
    winWidth: 0,
    winHeight: 0,
    currentTab: 1,
    maxGameDesLength:14,
    aa: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
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
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo,
        hasMemberInfo: true
      })
     
      this.getClubMHistory()
      //console.log("this is memberMHistory", this.data.memberMHistory)

    } else {
      //no userinform handling. to REG? 
      console.log("no member info")
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

  getClubMHistory: function (e) {
    var that=this

    wx.request({
      url: app.globalData.backendHost +'/scorehistories',  //小程序后台必须设置该路径为白名单
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("sessionKey")                          //Put res.code to header but in data, for pre-authentication in Spring security

      },
      success: function (res) {
        if (res.data) {
          var clubMHistory = res.data
          
          for (var i in clubMHistory)
            for (var j in clubMHistory[i]){
              clubMHistory[i][j].score = app.matchTimeConvert2UI(clubMHistory[i][j].score)
              clubMHistory[i][j].competitionName = clubMHistory[i][j].competitionDate.substring(0, 7) + " "
                + app.limitMaxLengthCap(clubMHistory[i][j].competitionName, that.data.maxGameDesLength)
              clubMHistory[i][j].colorByGender = clubMHistory[i][j].sex ==1?'black':'#ff6666' 

            }
          that.setData({
            clubMatchHistory: clubMHistory
          })
        } else {
          console.log("wx.reqest success, but res fail")
        }
      },
      fail: function (err) {
        console.log("wx.reqest fail")
      }
    })
  }

})