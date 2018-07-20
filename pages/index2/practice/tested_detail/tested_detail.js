// pages/tested_detail/tested_detail.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        question_groups: undefined
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var my_session_key = wx.getStorageSync('my_session_key');
    wx.request({
      url: "https://ncexam.jingjingjing.wang/getTestDetail",
      data: {
        test_paper_id: options.test_id
      },
      header: {
        "Cookie": my_session_key,
        "Content-Type": "application/x-www-form-urlencoded"
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
        } else {
            var q_groups = [];

            for(var i in resp) {
                var arr_answers = resp[i].question_answer_texts.split("|");
                var obj_answers = [];
                for (var j in arr_answers) {
                    var ans_depart = arr_answers[j].split(".");
                    if(ans_depart.length < 2)
                        obj_answers.push({ "body": ans_depart[0] });
                    else {
                        var ans_content_arr = [];
                        for(var k = 1; k < ans_depart.length; k++)
                            ans_content_arr.push(ans_depart[k]);
                        obj_answers.push({ "header": ans_depart[0], "body": ans_content_arr.join(".") });
                    }
                }

                resp[i].question_answer_texts = obj_answers;

                var contains = false;
                var j = 0;
                for(; j < q_groups.length; j++) {
                    if(q_groups[j].type_name == resp[i].type_name) {
                        contains = true;
                        break;
                    }
                }
                if(contains) {
                    q_groups[j].detail.push(resp[i]);
                } else {
                    q_groups.push({ type_name: resp[i].type_name, detail: [ resp[i] ] });
                }
            }
            that.setData({
                question_groups: q_groups
            });
        }
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