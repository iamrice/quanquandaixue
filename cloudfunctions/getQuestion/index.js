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
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const searchKey = event.searchKey;
  const collection = event.collection;

  // 操作数据库查询
  try {
    let count = await getCount(collection);
    count = count.total;
    let lis = []
    //let list = []
    for (let i = 0; i < count; i += 100) {
      console.log('i=', i)
      let result = await searchAll(i, collection)
      console.log('result.length=', result.length)
      lis = lis.concat(result);
      console.log('lis.length=', lis.length)
      //console.log('list.length=', list.length)
    }
    console.log(searchKey)
    if(searchKey){
      let li = await match(lis, searchKey);
      return li;
    }
    //console.log(lis)
    return lis;
  }
  catch (e) {
    console.error(e)
  }
}


//查询比对全部
async function searchAll(skip,collection) {
  let result = await db.collection(collection)
    .orderBy('_id', 'asc').skip(skip)
    .get()
  return result.data;
}

//根据关键词得出结果
async function match(result, searchKey) {
  let res = result
  //console.log('[数据库] [查询记录] 成功: ', res)
  //console.log('[数据库] [查询记录] 成功: ', result)
  let containAll = []
  for (var i = 0; i < res.length; i++) {
    if (res[i].question.indexOf(searchKey[0]) != -1 || res[i].unit.indexOf(searchKey[0]) != -1 || res[i].tag.indexOf(searchKey[0]) != -1) {
      containAll.push(res[i])
    }
  }
  if (containAll.length > 0) {
    if (searchKey.length > 1) {
      for (var n = 1; n < searchKey.length; n++) {
        let updat = []
        for (var i = 0; i < containAll.length; i++) {
          if (containAll[i].question.indexOf(searchKey[n]) != -1 || containAll[i].unit.indexOf(searchKey[n]) != -1 || containAll[i].tag.indexOf(searchKey[n]) != -1) {
            updat.push(containAll[i])
          }
        }
        if (updat.length != 0) {
          containAll = updat
        }
        else {
          break
        }
      }
    }
    console.log(containAll)
    return containAll;
  }
  console.log("none")
  return null;
}

//获取数据库题目总数
async function getCount(collection) {
  let count = await db.collection(collection).count();
  console.log('count=', count);
  return count;
}
