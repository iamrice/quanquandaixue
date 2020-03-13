// programmed by Erica
/**
 * 查询数据库
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'appointment-2cbf9b',
  traceUser: true,
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const searchKey = event.searchKey;
  console.log(searchKey)
  let result = await searchDetail(searchKey);
  return result
}
//搜索数据库具体问题的详细信息
async function searchDetail(id) {
  console.log(id)
  let result = await db.collection("resources")
    .doc(id).get()
  console.log(result)
  return result.data;
}