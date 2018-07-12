// pages/welcome/welcome.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
    data: {
        rejectlogin: false,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        curYear: (new Date()).getFullYear(),
        privateUserInfo: null,
        getUserLoopCount: 0
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        /*if (app.globalData.userInfo) {
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
        }*/

        if(!app.globalData.privateUserInfo) {
            this.getPrivateUserInfoLoop();
        } else {
            this.setData({
                privateUserInfo: app.globalData.privateUserInfo
            });
        }

        if (options.rejectlogin == 1) {
            this.setData({
                rejectlogin: true
            });
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
    onCurrentUserLogin: function(event) {
        var that = this;
        var my_session_key = wx.getStorageSync("my_session_key");
        wx.request({
            url: "https://ncexam.jingjingjing.wang/ifNewUserLogin",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (data, statusCode, header) {
                var resp = data.data;
                if(resp.errmsg) {
                    if(resp.errmsg == "openidlost") {
                        wx.showModal({
                            title: "异常",
                            content: "无法获取与您的微信号关联的人员信息，导致此问题的原因可能是您不是通过手机注册的考试账号。",
                            showCancel: false
                        });
                        return;
                    }
                    else if(resp.errmsg == "newuser") {
                        wx.redirectTo({
                            url: "../register/register"
                        });
                    }
                    else if(resp.errmsg == "OK") {
                        wx.navigateTo({
                            url: "../index2/index2"
                        }); 
                    }
                    else {
                        wx.showToast({
                            title: resp.errmsg,
                            image: "../../images/warning.png",
                            duration: 3000
                        });
                        return;
                    }
                }
            },
            fail: function() {
                wx.showModal({
                    title: "异常",
                    content: "请求失败。",
                    showCancel: false
                });
            }
        });
    },
    onOtherUserLogin: function(event) {
        wx.navigateTo({
            url: "../register/register"
        });
    },
    getPrivateUserInfoLoop: function() {
        this.setData({
            getUserLoopCount: this.data.getUserLoopCount + 1
        });

        if(!app.globalData.privateUserInfo && this.data.getUserLoopCount < 100) {
            setTimeout(this.getPrivateUserInfoLoop, 500);
        } else {
            this.setData({
                privateUserInfo: app.globalData.privateUserInfo
            });
        }
    }
})