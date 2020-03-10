// programmed by Erica
/**
 * 查询数据库
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: 'kkim-fkkdm',
        traceUser: true,})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const searchKey = event.searchKey;

  // 操作数据库查询
  try {
    let count = await getCount();
    count = count.total;
    let lis = []
    for (let i = 0; i < count; i += 100) {
      console.log('i=', i)
      let result = await searchAll(i)
      console.log('result.length=', result.length)
      lis = lis.concat(result);
      console.log('lis.length=', lis.length)
    }
    let li = await match(lis, searchKey);
    return li;
  }
  catch (e) {
    console.error(e)
  }
}

//查询比对全部
async function searchAll(skip) {
  let result = await db.collection("resources")
    .orderBy('_id', 'asc').skip(skip)
    .get()
  return result.data;
}

//得出结果
async function match(result, searchKey) {
  let res = result
  //console.log('[数据库] [查询记录] 成功: ', res)
  //console.log('[数据库] [查询记录] 成功: ', result)
  let containAll = []
  for (var i = 0; i < res.length; i++) {
    if (res[i].name.indexOf(searchKey[0]) != -1 || res[i].intro.indexOf(searchKey[0]) != -1 || res[i].tag.indexOf(searchKey[0]) != -1) {
      containAll.push(res[i])
    }
  }
  console.log(containAll)
  return containAll;
}

//获取数据库题目总数
async function getCount() {
  let count = await db.collection('resources').count();
  console.log('count=', count);
  return count;
}
