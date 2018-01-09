const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    alias: null,
    lastName: null,
    firstName: null,
    email: null,
    telephone: null,
    sex: 1,
    birthday: null,
    status: null,
    validTo: null,

    maxAliasLength: '10',
    maxFnameLength: '5',
    maxLnameLength: '7',

    // "bloodType": "B",
    // "emergencyContact": "Sunden",
    // "emergencyPhone": "13096333971",
    // "height": 170,
    // "weight": 60,
    // "identityNo": "",
    // "openId": "",
    // "roles": "",    

    gender: ['女', '男'],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      alias: app.globalData.memberInfo.alias,
      lastName: app.globalData.memberInfo.lastName,
      firstName: app.globalData.memberInfo.firstName,
      email: app.globalData.memberInfo.email,
      telephone: app.globalData.memberInfo.telephone,
      sex: app.globalData.memberInfo.sex,
      birthday: app.globalData.memberInfo.birthday,
      statusDes: app.globalData.memberInfo.statusDec,
      validTo: app.globalData.memberInfo.validTo,
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
  bindAliasChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)

    if (this.getLength(e.detail.value) > this.data.maxAliasLength)
      e.detail.value = this.limitMaxLength(e.detail.value, this.data.maxAliasLength);

    this.setData({
      alias: e.detail.value
    })
  },
  bindFnameChange: function (e) {
    this.setData({
      firstName: e.detail.value
    })
  },
  bindLnameChange: function (e) {
    this.setData({
      lastName: e.detail.value
    })
  },
  bindMailChange: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  bindMailCheck: function (e) {
    if (!(/^[A-Za-zd0-9]+([-_.][a-zA-Z0-9_-]+)*@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value))) {
      wx.showModal({
        title: '邮箱错误',
        content: '不是完整或正确的邮箱格式',
        showCancel: false,
      })

      this.setData({
        email: null
      })
    }
  },
  bindTelChange: function (e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  bindTelCheck: function (e) {
    if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(e.detail.value))) {
      //alert("不是完整的11位手机号或者正确的手机号前七位")
      wx.showModal({
        title: '手机号错误',
        content: '不是完整或正确的11位手机号',
        showCancel: false,
      })
      this.setData({
        telephone: null,
      })
    }
  },

  bindGenderChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },

  bindSavePress: function () {

    if ((this.data.alias == null) || (this.data.lastName == null) || (this.data.firstName == null) || (this.data.email == null) || (this.data.telephone == null)) {
      wx.showModal({
        title: '提示',
        content: '请确认填写所有内容！',
        showCancel: false,
        // success: function (res) {
        //   if (res.confirm) {
        //     console.log('用户点击确定')
        //   } else if (res.cancel) {
        //     console.log('用户点击取消')
        //   }
        // }
      })
    } else {
      var memberInfo = {
        "alias": this.data.alias,
        "lastName": this.data.lastName,
        "firstName": this.data.firstName,
        "telephone": this.data.telephone,
        "email": this.data.email,
        "sex": this.data.sex,
        "birthday": this.data.birthday,
        "statusID": this.data.statusDec,
        "validTo": this.data.validTo,

        //"openId": "",
        //"roles": "",
        //"emergencyContact": "Sunden",
        //"emergencyPhone": "13096333971",
        //"height": 170,
        //"identityNo": "",
        //"weight": 60
        //"bloodType": "B",
      }

      wx.request({

        url: app.globalData.backendHost +'/members/me',  //小程序后台必须设置该路径为白名单
        method: 'PUT',
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync("sessionKey")                          //Put res.code to header but in data, for pre-authentication in Spring security

        },
        data: memberInfo,
        success: function (res) {
          if ((res.statusCode == 200)&&(!res.data.statusCode)) {
            app.globalData.memberInfo = res.data,
            wx.showModal({
              title: '恭喜你！！！',
              content: '成功修改！！',
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
              content: '没改好，程序员的锅！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {                  
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
  }

})