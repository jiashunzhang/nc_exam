// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        count_down_seconds: 0,
        count_seconds: 0,
        count_down_time: "",
        count_time: "",
        question_count: 0,
        question_groups: null,
        done: {},
        done_count: 0,
        paper_id: null,
        to_view: "view-00",
        q_cata_index: ["一、", "二、", "三、"],
        question_micro_view: {},
        question_micro_view_arr: [],
        qmv_hidden: true,
        window_height: "0"
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var my_session_key = wx.getStorageSync('my_session_key');
      var w_height = "0";
      var res = wx.getSystemInfoSync();

      this.setData({
          count_down_seconds: parseInt(options.test_time),
          paper_id: options.paper_id,
          window_height: res.windowHeight + "px",
          qmv_hidden: true
      });
      wx.request({
          url: "https://ncexam.jingjingjing.wang/getRandomTest",
          data: {
            paper_id: options.paper_id
          },
          header: {
              "Cookie": my_session_key,
              "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: function (data, statusCode, header) {
              var resp = data.data;
              if (resp.errmsg) {
                  wx.showToast({
                      title: resp.errmsg,
                      image: "../../statics/images/warning.png",
                      duration: 3000
                  });
                  return;
              } else {
                  var q_groups = [];
                  var q_micro_view = {};
                  
                  var i = 0;
                  for (;i < resp.length; i++) {
                      var arr_answers = resp[i].question_answer_texts.split("|");
                      var obj_answers = [];
                      for (var j in arr_answers) {
                          var ans_depart = arr_answers[j].split(".");
                          obj_answers.push({ "header": ans_depart[0], "body": ans_depart[1] });
                      }

                      resp[i].question_answer_texts = obj_answers;

                      var contains = false;
                      var j = 0;
                      for (; j < q_groups.length; j++) {
                          if (q_groups[j].type_name == resp[i].type_name) {
                              contains = true;
                              break;
                          }
                      }
                      if (contains) {
                          q_groups[j].detail.push(resp[i]);
                      } else {
                          q_groups.push({ type_name: resp[i].type_name, detail: [resp[i]] });
                      }
                      q_micro_view[resp[i].question_id] = false;
                  }
                  that.setData({
                      question_groups: q_groups,
                      question_count: i,
                      question_micro_view: q_micro_view
                  });
                  countDown(that);
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
    onQuestionChange: function(e) {
        if(e.detail.value != undefined && e.detail.value != null) {
            if ((isArray(e.detail.value) && e.detail.value.length != 0) || (!isArray(e.detail.value) && e.detail.value != "")) {
                var qids = this.data.done;
                var q_micro_view = this.data.question_micro_view;

                qids[e.target.dataset.qid] = true;
                q_micro_view[e.target.dataset.qid] = true;

                this.setData({
                    done: qids,
                    question_micro_view: q_micro_view
                });
            }
            else {
                var qids = this.data.done;
                var q_micro_view = this.data.question_micro_view;

                qids[e.target.dataset.qid] = undefined;
                q_micro_view[e.target.dataset.qid] = false;

                this.setData({
                    done: qids,
                    question_micro_view: q_micro_view
                });
            }
        }
        //console.log(JSON.stringify(e.detail.value));
        this.setData({
            done_count: propertyCount(this.data.done)
        });
    },
    onHandin: function(e) {
        var paper_detail = e.detail.value;
        for(var i in paper_detail) {
            if(isArray(paper_detail[i])) {
                paper_detail[i] = (paper_detail[i].sort().join());
            }
        }
        console.log(JSON.stringify(paper_detail));

        var that = this;
        var my_session_key = wx.getStorageSync('my_session_key');

        wx.request({
            url: "https://ncexam.jingjingjing.wang/handin",
            data: {
                paper_id: that.data.paper_id,
                if_exam: 0,
                paper_detail: JSON.stringify(paper_detail)
            },
            method: "POST",
            header: {
                "Cookie": my_session_key,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(data, statusCode, header) {
                var resp = data.data;
                console.log(JSON.stringify(resp));
                if(resp.errmsg != undefined && resp.errmsg != null && resp.errmsg != "OK") {
                    wx.showToast({
                        title: resp.errmsg,
                        image: "../../../../statics/images/warning.png",
                        duration: 3000
                    });
                    return;
                }
                else {
                    wx.showToast({
                        title: "服务嚣未返回数据。",
                        image: "../../../../statics/images/warning.png",
                        duration: 3000
                    });
                }
                wx.redirectTo({
                    url: "./score/score?score=" + resp.score + "&passing_score=" + resp.passing_score + "&test_paper_id=" + resp.test_paper_id + "&elapsed=" + that.data.count_time
                });
            }
        });
        //console.log(JSON.stringify(paper_detail));
    },
    onMicroView: function(event) {
        var qmv_arr = [];
        var qmv = this.data.question_micro_view;
        var q_groups = this.data.question_groups;

        /*for(var i in q_groups) {
            var index = 0;
            var d = q_groups[i].detail;
            for(var j in d) {
                index++;
                qmv_arr.push({ "id": d[j].question_id, "done": qmv[d[j].question_id], "index": index })
            }
        }*/

        for(var i in q_groups) {
            var d = q_groups[i].detail;
            for (var j in d) {
                d[j]["done"] = qmv[d[j].question_id];
            }
        }
console.log(JSON.stringify(q_groups));
        /*for(var i in qmv) {
            qmv_arr.push({ "id":  i, "done": qmv[i]});
        }*/
        this.setData({
            question_groups: q_groups,
            qmv_hidden: (!this.data.qmv_hidden)
        });
    },
    onSeekQuestion: function(event) {
        this.setData({
            to_view: event.target.dataset.id
        });
    }
});
function countDown(that) {
    var sec_left = that.data.count_down_seconds;
    if(sec_left <= 0) {
        return;
    }
    setTimeout(function(){
        that.setData({
            count_down_seconds: that.data.count_down_seconds - 1000,
            count_down_time: time_format(that.data.count_down_seconds),
            count_seconds: that.data.count_seconds + 1000,
            count_time: time_format(that.data.count_seconds)
        });
        countDown(that);
    }, 1000);
}
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
function isArray(obj) {
    return (obj.constructor == Array)
}
function propertyCount(obj) {
    var count = 0;
    for(var i in obj) {
        if(obj[i] != undefined && obj[i] != null)
            count ++;
    }
    return count;
}