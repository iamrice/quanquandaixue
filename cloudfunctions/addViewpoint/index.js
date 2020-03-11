// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'appointment-2cbf9b',
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("vpData").add({
    data: {
      vpUserId: event.vpUserId,
      vpUserNickName: event.vpUserNickName,
      vpUserAvatarUrl: event.vpUserAvatarUrl,
      vpTitle: event.vpTitle,
      vpId: event.vpId,
      vpText: event.vpText,
      vpAgreeAmount: 0,
      vpCommentList: [],
    }
  })
}