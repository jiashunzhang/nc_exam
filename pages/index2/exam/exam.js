// pages/index2/exam/exam.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        examCatalogList: []
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            });
        } else if (this.data.canIUse) {
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

        var my_session_key = wx.getStorageSync('my_session_key');
        var that = this;
        wx.request({
            url: "https://ncexam.jingjingjing.wang/getMyPaperTypes",
            data: {
                if_exam: "1"
            },
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (data, statusCode, header) {
                var resp = data.data;
                if (resp.errmsg) {
                    if (resp.errmsg == "notloggedin")
                        wx.showToast({
                            title: "请重新登录。",
                            image: "../../../statics/images/warning.png",
                            duration: 2000
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
    onPaperTypeClicked: function (event) {
        wx.navigateTo({
            url: "./detail/detail?papertype=" + event.target.dataset.typeId + "&typename=" + event.target.dataset.typeName
        });
    },
    getUserInfo: function (e) {
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
})