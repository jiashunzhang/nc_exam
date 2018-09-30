// pages/test/score/score.js
Page({
  /**
   * 页面的初始数据
   */
    data: {
        score: 0,
        passing_score: 0,
        test_paper_id: null,
        signin_count: 0,
        elapsed: "",
        fullwork_packet: null,
        fullmark_packet: null,
        encourage_packet: null,
        task_packet: null,
        show_red_packet_image: true,
        allow_red_packet: "1",
        accumulate_points: 0,
        cur_acc_points: 0
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
      let that = this;
      let my_session_key = wx.getStorageSync("my_session_key");
      wx.request({
        url: "https://ncexam.jingjingjing.wang/getCurrentAccumulatePoints",
        data: {
          test_paper_id: options.test_paper_id
        },
        header: {
          "Cookie": my_session_key,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (data, statusCode, header) {
          let resp = data.data;
          if (resp == "" || resp == undefined || resp == null)
            wx.showModal({
              title: "异常",
              content: "服务器未返回积分数据。",
              showCancel: false
            });
          else if (resp.errmsg)
            wx.showModal({
              title: "异常",
              content: resp.errmsg,
              showCancel: false
            });
          else {
            //console.log(JSON.stringify(resp));
            that.setData({
              accumulate_points: resp.accumulate_points,
              cur_acc_points: resp.cur_acc_points
            });
          }
        }
      });
      let arp = wx.getStorageSync("allow_red_packet");
      this.setData({
        score: Math.trunc(options.score),
        passing_score: Math.round(options.passing_score),
        test_paper_id: options.test_paper_id,
        elapsed: options.elapsed,
        signin_count: options.signin_count,
        allow_red_packet: arp
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
    onViewPaper: function(event) {
        wx.redirectTo({
            url: "../../tested_detail/tested_detail?test_id=" + this.data.test_paper_id
        });
    },
    onRedPacketOpened: function() {
        var that = this;
        var my_session_key = wx.getStorageSync("my_session_key");

        this.setData({
            show_red_packet_image: false
        });

        wx.showLoading({
            title: "正在打开红包"
        });

        wx.request({
            url: "https://ncexam.jingjingjing.wang/openTestRedPacket",
            data: {
                score: this.data.score,
                test_paper_id: this.data.test_paper_id
            },
            method: "POST",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(data, statusCode, header) {
                let resp = data.data;

                //console.log(JSON.stringify(resp));
                if(resp == undefined || resp == "" || resp == null) {
                    wx.showModal({
                        title: "异常",
                        content: "数据库未返回数据。",
                        showCancel: false
                    });
                    return;
                }
                if(resp.errmsg != null && resp.errmsg != undefined && resp.errmsg != "") {
                    wx.showModal({
                        title: "异常",
                        content: resp.errmsg,
                        showCancel: false
                    });
                    return;
                }
                that.setData({
                    fullwork_packet: resp.fwp,
                    fullmark_packet: resp.fmp,
                    encourage_packet: resp.enc,
                    task_packet: resp.task
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    }
});