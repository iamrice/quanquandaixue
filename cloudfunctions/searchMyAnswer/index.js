// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'appointment-2cbf9b',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("qaData").where({
    qaAnswerList: _.elemMatch({
      answerUserId: event.answerUserId,
    })
  }).get()
}