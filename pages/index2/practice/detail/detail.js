// pages/papers/papers.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    papers: [],
    paper_type_name: "",
    test_time: 1800000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({ paper_type_name: options.typename });
      var my_session_key = wx.getStorageSync('my_session_key');
      var that = this;
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getPapersByType",
          data: { type_id: options.papertype },
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
              }
              console.log(JSON.stringify(resp));
              that.setData({
                  papers: resp
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
  onPaperDetailClicked: function(event) {
      wx.navigateTo({
          url: "../tests/tests?paper_id=" + event.target.dataset.paperId + "&paper_name=" + event.target.dataset.paperName,
      });
  },
  onTryOneMoreClicked: function(event) {
      wx.navigateTo({
          url: '../test/test?paper_id=' + event.target.dataset.paperId + "&paper_name=" + event.target.dataset.paperName + "&test_time=" + event.target.dataset.testTime,
      });
  }
})