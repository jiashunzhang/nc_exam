// pages/test/score/score.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        score: 0,
        passing_score: 0,
        test_paper_id: null,
        elapsed: ""
    },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        this.setData({
            score: Math.floor(options.score),
            passing_score: Math.round(options.passing_score),
            exam_paper_id: options.exam_paper_id,
            elapsed: options.elapsed
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
            url: "../../tested_detail/tested_detail?exam_paper_id=" + this.data.exam_paper_id
        });
    }
})