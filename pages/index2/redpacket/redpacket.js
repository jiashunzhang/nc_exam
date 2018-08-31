// pages/index2/redpacket/redpacket.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        currentTab: 0,
        rp_amount: 0,
        rp_detail: [],
        ap_amount: 0,
        ap_detail: []
    },
    swiperTab: function (e) {
        let that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    clickTab: function (e) {
        let that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        let that = this;
        let my_session_key = wx.getStorageSync("my_session_key");
        wx.request({
            url: "https://ncexam.jingjingjing.wang/getRPandAP",
            data: {},
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: function (data, statusCode, header) {
                let resp = data.data;

                if(resp == null || resp == undefined || resp == ""){
                    wx.showModal({
                        title: "异常",
                        content: "服务器未返回数据。",
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
                //console.log(JSON.stringify(resp));
                that.setData({
                    rp_amount: resp.rp_amount,
                    ap_amount: resp.ap_amount,
                    rp_detail: resp.rp_detail,
                    ap_detail: resp.ap_detail
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
  
  }
})