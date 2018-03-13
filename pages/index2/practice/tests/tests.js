// pages/tests/tests.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      test_name: "",
      tests: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({ test_name: options.paper_name });
      var my_session_key = wx.getStorageSync('my_session_key');
      var that = this;
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getTestsByPaperID",
          data: { paper_id: options.paper_id },
          header: {
              "Cookie": my_session_key,
              "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (data, statusCode, header) {
            var resp = data.data;
            if (resp.errmsg) {
              if (resp.errmsg == "notloggedin")
                wx.showToast({
                  title: "请重新登录。",
                  image: "../../statics/images/warning.png",
                  duration: 2000
                });
              else {
                wx.showToast({
                  title: resp.errmsg,
                  image: "../../statics/images/warning.png",
                  duration: 3000
                });
              }
              return;
            } else
              that.setData({
                tests: resp
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
  onTestDetailClicked: function(event) {
    wx.navigateTo({
      url: '../tested_detail/tested_detail?test_id=' + event.target.dataset.testId,
    })
  }
})