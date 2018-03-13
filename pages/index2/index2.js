// pages/index2/index2.js
Page({

  /**
   * 页面的初始数据
   */
data: {
    userName: "未知",
    practice_count: 0,
    avg_score: 0,
    work_type_name: ""
},

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        var that = this;
        var my_session_key = wx.getStorageSync('my_session_key');

        wx.request({
            url: "https://ncexam.jingjingjing.wang/getIndexInfo",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (data, statusCode, header) {
                var resp = data.data;
                console.log(JSON.stringify(resp));
                if(resp.errmsg != undefined && resp.errmsg != null && resp.errmsg != "") {
                    if(resp.errmsg == "notloggedin")
                        wx.redirectTo({
                            url: "../welcome/welcome"
                        });
                    else {
                        wx.showToast({
                            title: resp.errmsg,
                            image: "../../statics/images/warning.png",
                            duration: 3000
                        });
                        wx.redirectTo({
                            url: "../welcome/welcome"
                        });
                    }
                }
                else {
                    that.setData({
                        userName: resp.mem_name,
                        practice_count: resp.tests_count,
                        avg_score: resp.avg_score,
                        work_type_name: resp.mem_wtn
                    });
                }
            }
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
    onCardTap: function(event) {
        wx.navigateTo({
            url: "./" + event.currentTarget.dataset.tapName + "/" + event.currentTarget.dataset.tapName
        });
    }
})