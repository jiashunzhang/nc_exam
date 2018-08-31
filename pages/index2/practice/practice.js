//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    examCatalogList: []
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      });
    }

    var my_session_key = wx.getStorageSync("my_session_key");
    var that = this;
    wx.request({
        url: "https://ncexam.jingjingjing.wang/getMyPaperTypes",
        data: {
            if_exam: "0"
        },
        header: {
            "Cookie": my_session_key,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (data, statusCode, header) {
            var resp = data.data;
            if(resp.errmsg) {
                if(resp.errmsg == "notloggedin")
                    wx.showModal({
                        title: "异常",
                        content: "请重新登录。",
                        showCancel: false
                    });
                else {
                    wx.showModal({
                        title: "异常",
                        content: resp.errmsg,
                        showCancel: false
                    });
                }
                return;
            }
            that.setData({
                examCatalogList: resp
            });
        }
    });
  },
  onPaperTypeClicked: function(event) {
    wx.redirectTo({
        url: "./detail/detail?papertype=" + event.target.dataset.typeId + "&typename=" + event.target.dataset.typeName
    });    
  },
  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
})
