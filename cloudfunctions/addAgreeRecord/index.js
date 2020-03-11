// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'appointment-2cbf9b',
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const agreeAdd=await db.collection("agreeRecord").add({
    data: {
      userOpenId: event.userOpenId,
      qaId: event.qaId,
      ifAgree:true,
    }
    });
    const agreeUpdate=await db.collection("qaData").where({
      qaId: event.qaId
    }).update({
      data: {
        qaAgreeAmount: _.inc(1)
      }
    });
    return {
      event,
      agreeAdd,
      agreeUpdate,
    }
  } catch (e) {
    console.log(e)
  }
}