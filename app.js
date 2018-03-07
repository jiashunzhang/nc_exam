//app.js
App({
    onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
                url: "https://ncexam.jingjingjing.wang/login",
                data: {
                    code: res.code
                },
                header: {
                    "content-type": "application/json"
                },
                success: function (data, statusCode, header) {
                    console.log(JSON.stringify(data.data));
                    if(data.data.errmsg) {
                        /*if(data.data.errmsg == "nosuchmember")
                        {
                            wx.showModal({
                                title: '异常',
                                content: '该用户尚未注册。',
                                success: function(res) {
                                    wx.redirectTo({
                                        url: "../register/register"
                                    });
                                }
                            });
                        }
                        else */if(data.data.errmsg == "notverified")
                            wx.showModal({
                                title: '异常',
                                content: '用户尚未通过管理员审核，请等待审核。',
                                success: function(res) {
                                    wx.redirectTo({
                                        url: '../welcome/welcome?rejectlogin=1'
                                    });
                                }
                            });
                        else if(data.data.errmsg == "deletedmember")
                            wx.showModal({
                                title: '异常',
                                content: '用户已被禁用，请联系管理员。',
                                success: function (res) {
                                    wx.redirectTo({
                                        url: '../welcome/welcome?rejectlogin=1'
                                    });
                                }
                            });
                        else
                            wx.showModal({
                                title: '异常',
                                content: data.data.errmsg,
                            });
                    } else {
                        var msk = data.data.my_session_key;
                        if(msk)
                            wx.setStorageSync("my_session_key", "sessionid=" + msk);
                    }
                }
            });
        }
    });
    // 获取用户信息
    wx.getSetting({
        success: res => {
            if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                    success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        this.globalData.userInfo = res.userInfo

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                    }
                });
            } else {
                wx.authorize({
                    scope: 'scope.userInfo',
                    success() {
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                this.globalData.userInfo = res.userInfo

                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (this.userInfoReadyCallback) {
                                    this.userInfoReadyCallback(res)
                                }
                            }
                        });
                    }
                });
            }
            //console.log(JSON.stringify(res));
        }
    });
  },
  globalData: {
    userInfo: null
  }
})