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
        curYear: (new Date()).getFullYear()
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

            console.log(app.globalData);
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

        if (options.rejectlogin == 1) {
            this.setData({
                rejectlogin: true
            });
        }
        //console.log();
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
        var my_session_key = wx.getStorageSync('my_session_key');
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
                        wx.showToast({
                            title: "远端用户信息丢失",
                            image: "../../statics/images/warning.png",
                            duration: 3000
                        });
                        return;
                    }
                    else if(resp.errmsg == "newuser") {
                        wx.redirectTo({
                            url: "../../register/register"
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
            }
        });
    },
    onOtherUserLogin: function(event) {
        wx.navigateTo({
            url: "../register/register"
        });
    }
})