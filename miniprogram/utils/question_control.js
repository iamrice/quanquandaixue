// programmed by Erica
/**
 * 答题问题控制
 */
//控制题目顺序
var questionControl = {
  questions: [],
  favorite_list: new Set(),
  wrong_list: new Set(),
  view_list: [],
  vid: 0,
  getQuestions:function(collection){
    wx.cloud.callFunction({
      name: "getQuestion",
      data: {
        searchKey: false,
        collection: collection//计网题库
      }
    }).then(res => {
      console.log(res)
      if (res != null) {
        this.questions = res.result
        return res.result
      }
    }
    )
  },
  getNextQuestion: function(step=1) {
    this.vid+=step
    this.vid = Math.min(this.vid, this.view_list.length-1)
    let qid = this.view_list[this.vid]
    return this.questions[qid]
  },
  getPreviousQuestion: function(step=1) {
    this.vid -= step
    this.vid = Math.max(this.vid, 0)
    let qid = this.view_list[this.vid]
    console.log(this.questions[qid]) 
    return this.questions[qid]
  },
  isFavorite: function(){
    let qid = this.view_list[this.vid]
    return this.favorite_list.has(qid)
  },
  toggleFavorite: function(){
    let qid = this.view_list[this.vid]
    if (this.favorite_list.has(qid)){
      this.favorite_list.delete(qid)
      return false
    }else{
      this.favorite_list.add(qid)
      return true
    }
  },
  getQuestionCount: function(){
    return this.questions.length
  },
  setFavoriteList: function(list){
    this.favorite_list = new Set(list)
  },
  isWrong: function (qid) {
    return this.wrong_list.has(qid)
  },
  setWrongList: function(list){
    this.wrong_list = new Set(list)
  },
  toggleWrong: function(){
    let qid = this.view_list[this.vid]
    if (this.favorite.has(qid)){
      this.wrong_list.delete(qid)
      return false
    }else{
      this.wrong_list.add(qid)
      return true
    }
  },
  finishedYet: function(){
    return this.vid >= this.view_list.length-1
  }

};

module.exports = {
  questionControl: questionControl
}