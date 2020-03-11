// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'appointment-2cbf9b',
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("qaData").orderBy('qaId','desc').field({
    qaId:true,
  }).limit(1)
    .get()
}