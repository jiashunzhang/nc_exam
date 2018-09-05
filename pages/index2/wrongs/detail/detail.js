// pages/index2/wrongs/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      question_title: "",
      question_answer_list: [],
      question_right_answer: "",
      question_type: "",
      date_start: "",
      date_end: "",
      question_id: null,
      test_question_id: null,
      wrong_answers: "",
      wrong_note: "",
      wrong_note_length: 0,
      ms_ss_selections: [ "A", "B", "C", "D" ],
      js_selections: [ "√", "×" ],
      show_answers: false,
      my_cur_answers: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.setData({
          question_title: options.question_title,
          question_answer_list: options.question_answer_texts.split("|"),
          question_right_answer: options.question_right_answers,
          question_type: options.question_type,
          question_id: options.question_id,
          test_question_id: options.test_question_id,
          date_start: options.date_start,
          date_end: options.date_end
      });

      let my_session_key = wx.getStorageSync("my_session_key");
      let that = this;
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getWrongAnswerDetail",
          data: {
              question_id: this.data.question_id,
              date_start: this.data.date_start,
              date_end: this.data.date_end
          },
          method: "POST",
          header: {
              "Cookie": my_session_key,
              "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (data, statusCode, header) {
              let resp = data.data;
              if (data == null || data == undefined || data == "")
                  wx.showModal({
                      title: "异常",
                      content: "服务器未返回数据。",
                      showCancel: false
                  });
              else if (resp.errmsg != undefined && resp.errmsg != null && resp.errmsg != "")
                  wx.showModal({
                      title: "异常",
                      content: resp.errmsg,
                      showCancel: false
                  });
              else {
                  let answer_arr = [];
                  let wa = resp.wrong_answers;
                  for(let a of wa) {
                      if(!answer_arr.find(item => item == a))
                        answer_arr.push(a);
                  }
                    that.setData({
                        wrong_answers: answer_arr.join("、"),
                        wrong_note: resp.wrong_note,
                        wrong_note_length: resp.wrong_note.length
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
  
  },
    onWrongNoteInput: function(e) {
        this.setData({
            wrong_note_length: e.detail.value.length,
            wrong_note: e.detail.value
        });
    },
    onSaveWrongNote: function() {
        let my_session_key = wx.getStorageSync("my_session_key");
        let that = this;
        wx.request({
            url: "https://ncexam.jingjingjing.wang/saveWrongNote",
            data: {
                question_id: this.data.question_id,
                note: this.data.wrong_note,
                act: "save"
            },
            method: "POST",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (data, statusCode, header) {
                let resp = data.data;
                if (data == null || data == undefined || data == "")
                    wx.showModal({
                        title: "异常",
                        content: "服务器未返回数据。",
                        showCancel: false
                    });
                else if (resp.errmsg != undefined && resp.errmsg != null && resp.errmsg != "")
                    wx.showModal({
                        title: "异常",
                        content: resp.errmsg,
                        showCancel: false
                    });
                else {
                    wx.showModal({
                        title: "提示",
                        content: "保存成功。",
                        showCancel: false
                    });
                }
            }
        });
    },
    onAnswer: function(e) {
        if(Array.isArray(e.detail.value))
            this.setData({
                my_cur_answers: e.detail.value.join("")
            });
        else
            this.setData({
                my_cur_answers: e.detail.value
            });
    },
    onShowAnswers: function() {
        this.setData({
            show_answers: true
        });
    }
})