// pages/index2/wrongs/wrongs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      date_start: "",
      date_end: "",
      list_view_height: 0,
      wrong_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        if(wx.canIUse("getSystemInfo.success.windowHeight")) {
            this.setData({
                list_view_height: (wx.getSystemInfoSync().windowHeight - 40) + "px"
            });
        }
        let now = new Date();
        let last_month = new Date(now);
        last_month.setMonth(last_month.getMonth() - 1);

        this.setData({
            date_start: last_month.getFullYear() + "-" + fill_zero_prefix(last_month.getMonth() + 1) + "-" + fill_zero_prefix(last_month.getDate()),
            date_end: now.getFullYear() + "-" + fill_zero_prefix(now.getMonth() + 1) + "-" + fill_zero_prefix(now.getDate())
        });

        this.getMyWrongList();
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
    onDateStartChange: function(e) {
        this.setData({
            date_start: e.detail.value
        });
    },
    onDateEndChange: function (e) {
        this.setData({
            date_end: e.detail.value
        });
    },
    getMyWrongList: function() {
        let my_session_key = wx.getStorageSync("my_session_key");
        let that = this;
        wx.request({
            url: "https://ncexam.jingjingjing.wang/getMyWrongList",
            data: {
                date_start: this.data.date_start,
                date_end: this.data.date_end
            },
            method: "POST",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(data, statusCode, header) {
                let resp = data.data;
                if(data == null || data == undefined || data == "") 
                    wx.showModal({
                        title: "异常",
                        content: "服务器未返回数据。",
                        showCancel: false
                    });
                else if(resp.errmsg != undefined && resp.errmsg != null && resp.errmsg != "")
                    wx.showModal({
                        title: "异常",
                        content: resp.errmsg,
                        showCancel: false
                    });
                else
                    that.setData({
                        wrong_list: resp
                    });
            }
        });
    },
    onSetDateClicked: function() {
        this.getMyWrongList();
    },
    onShowDetail: function(e) {
        let params = "question_title=" + e.currentTarget.dataset.question_title + "&" +
                     "question_answer_texts=" + e.currentTarget.dataset.question_answer_texts + "&" +
                     "question_right_answers=" + e.currentTarget.dataset.question_right_answers + "&" +
                     "question_type=" + e.currentTarget.dataset.question_type + "&" +
                     "question_id=" + e.currentTarget.dataset.question_id + "&" +
                     "test_question_id=" + e.currentTarget.dataset.test_question_id + "&" +
                     "date_start=" + this.data.date_start + "&" +
                     "date_end=" + this.data.date_end;
        wx.navigateTo({
            url: "detail/detail?" + params,
        });
    }
});
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
}