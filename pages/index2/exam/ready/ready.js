// pages/tests/tests.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mem_name: "",
      workshop: "",
      exam_paper_id: "",
      paper_name: "",
      test_time: 1800000,
      test_time_text: "00:30:00",
      work_type: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var my_session_key = wx.getStorageSync('my_session_key');
      var that = this;
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getReadyInfo",
          header: {
              "Cookie": my_session_key,
              "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (data, statusCode, header) {
            var resp = data.data;
            if (resp.errmsg) {
                wx.showModal({
                    title: "异常",
                    content: resp.errmsg,
                    showCancel: false
                });
                return;
            } else
                that.setData({
                    exam_paper_id: options.exam_paper_id,
                    paper_name: options.paper_name,
                    test_time_text: time_format(options.test_time),
                    test_time: options.test_time,
                    mem_name: resp.mem_name,
                    workshop: resp.workshop,
                    work_type: resp.work_type
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
  onStartTestClicked: function(event) {
    wx.redirectTo({
        url: "../test/test?exam_paper_id=" + event.target.dataset.examPaperId + "&paper_name=" + event.target.dataset.paperName + "&test_time=" + event.target.dataset.testTime
    });
  }
});
function time_format(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = fill_zero_prefix(Math.floor(second / 3600));
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    //var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
    return hr + ":" + min + ":" + sec
}
// 位数不足补零
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
}