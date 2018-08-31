// pages/index2/index2.js
const innerAudioContext = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
data: {
    userName: "未知",
    practice_count: 0,
    avg_score: 0,
    work_type_name: "未知",
    pos_name: "未知",
    workshop_name: "未知",
    p_count_interval: 2000,
    timer_id: null,
    undone_exam_count: 0,
    mem_allow_rp: 1
},
    getIndexInfo: function(that) {
        let my_session_key = wx.getStorageSync("my_session_key");

        wx.request({
            url: "https://ncexam.jingjingjing.wang/getIndexInfo",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (data, statusCode, header) {
                var resp = data.data;
                if (resp.errmsg != undefined && resp.errmsg != null && resp.errmsg != "") {
                    if (resp.errmsg == "notloggedin")
                        wx.redirectTo({
                            url: "../welcome/welcome"
                        });
                    else {
                        wx.showModal({
                            title: "异常",
                            content: resp.errmsg,
                            showCancel: false,
                            success: function (res) {
                                wx.redirectTo({
                                    url: "../welcome/welcome"
                                });
                            }
                        });
                    }
                }
                else {
                    that.setData({
                        userName: resp.mem_name,
                        practice_count: resp.tests_count,
                        avg_score: Math.round(resp.avg_score),
                        work_type_name: resp.mem_wtn,
                        workshop_name: resp.mem_dep,
                        pos_name: resp.mem_pos,
                        mem_allow_rp: resp.mem_allow_rp
                    });

                    wx.setStorageSync("allow_red_packet", resp.mem_allow_rp);

                    innerAudioContext.autoplay = false;
                    innerAudioContext.src = "https://ncexam-1255671825.cos.ap-chengdu.myqcloud.com/%E6%8F%90%E7%A4%BA%E9%9F%B3.wav";
                    innerAudioContext.onError((res) => {
                        console.log(res.errCode, res.errMsg);
                    });
                    /*innerAudioContext.onPlay((res) => {
                        console.log("开始播放。");
                    });*/
                }
            }
        });
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
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
        this.getIndexInfo(this);
        this.PCountTimerProc();
        this.initPCountTimer();
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
    onHide: function () {
        clearInterval(this.data.timer_id);
    },

  /**
   * 生命周期函数--监听页面卸载
   */
    onUnload: function () {
        clearInterval(this.data.timer_id);
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
        if (event.currentTarget.dataset.tapName == "wrongs" || event.currentTarget.dataset.tapName == "business_learn"){
            wx.showModal({
                title: "提示",
                content: "该功能尚未开通。",
                showCancel: false
            });
            return;
        }
        wx.navigateTo({
            url: "./" + event.currentTarget.dataset.tapName + "/" + event.currentTarget.dataset.tapName
        });
    },
    PCountTimerProc: function() {
        var that = this;
        var my_session_key = wx.getStorageSync('my_session_key');

        wx.request({
            url: "https://ncexam.jingjingjing.wang/getUndoneExamCount",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (data, statusCode, header) {
                var resp = data.data;
                if (that.data.undone_exam_count != "99+") {
                    if (parseInt(resp.count) > parseInt(that.data.undone_exam_count))
                        innerAudioContext.play();
                }
                if(resp.count) {
                    that.setData({
                        undone_exam_count: (parseInt(resp.count) > 99 ? "99+" : resp.count)
                    });
                }
            }
        });
    },
    initPCountTimer: function() {
        clearInterval(this.data.timer_id);
        var t_id = setInterval(this.PCountTimerProc, this.data.p_count_interval);
        this.setData({
            timer_id: t_id
        });
    }
});