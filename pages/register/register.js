// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      work_type_list: [],
      work_type_list_index: 0,
      workshop_list: [],
      workshop_list_index: 0,
      submitFailedMsg: ""
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
  },
    onRegisterSubmit: function(e) {
        var verified = true;
        var verifyIDCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        var verifyName = /^([u4e00-u9fa5·\s]{1,20}|[a-zA-Z·\s]{1,20})$/;
        var verifyPhone = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;

        this.setData({
            submitFailedMsg: ""
        });
        if(!verifyIDCard.test(e.detail.value.idcard)) {
            this.setData({
                submitFailedMsg: "请输入正确的身份证号码!"
            });
            verified = false;
        }
        if (!verifyName.test(e.detail.value.username)) {
            var that = this;
            this.setData({
                submitFailedMsg: (that.data.submitFailedMsg + "\n请输入正确的姓名!")
            });
            verified = false;
        }
        if (e.detail.value.phonenumber && !verifyPhone.test(e.detail.value.phonenumber)) {
            var that = this;
            this.setData({
                submitFailedMsg: (that.data.submitFailedMsg + "\n请输入正确的手机号码!")
            });
            verified = false;
        }
        if(!verified)
            return;

        this.setData({
            submitFailedMsg: ""
        });
    }
})