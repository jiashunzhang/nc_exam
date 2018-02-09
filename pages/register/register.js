// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      work_type_list: [],
      work_type_list_index: 0,
      workshop_list: [],
      workshop_list_index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getWorkTypeList",
          success: function (data, statusCode, header) {
              var resp = data.data;
              if(resp.errmsg) {
                  wx.showModal({
                      title: '异常',
                      content: resp.errmsg
                  });
                  return;
              }
              that.setData({
                  work_type_list: resp.work_types,
              });
          }
      });
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getWorkShopList",
          success: function (data, statusCode, header) {
              var resp = data.data;
              console.log(JSON.stringify(resp));
              if (resp.errmsg) {
                  wx.showModal({
                      title: '异常',
                      content: resp.errmsg
                  });
                  return;
              }
              that.setData({
                  workshop_list: resp.workshops,
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
  onWorkTypeList_Change: function(e) {
    this.setData({
        work_type_list_index: e.detail.value
    });
  },
  onWorkShopList_Change: function (e) {
      this.setData({
          workshop_list_index: e.detail.value
      });
  }
})