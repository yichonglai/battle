const getSqlContentMap = require('./util/getSqlContentMap');
const { query } = require('./util/db');


// 打印脚本执行日志
const eventLog = (err, sqlFile, index) => {
  if (err) {
    console.log(`[ERROR] sql脚本文件: ${sqlFile} 第${index + 1}条脚本 执行失败 o(╯□╰)o ！`);
  } else {
    console.log(`[SUCCESS] sql脚本文件: ${sqlFile} 第${index + 1}条脚本 执行成功 O(∩_∩)O !`);
  }
}

// 执行建表sql脚本
const createAllTables = async () => {
  // 获取所有sql脚本内容
  const sqlContentMap = getSqlContentMap();
  for (let key in sqlContentMap) {
    const sqlShellList = sqlContentMap[key].split(';');
    for (let [i, shell] of sqlShellList.entries()) {
      if (shell.trim()) {
        const result = await query(shell);
        console.log(`=====${i}`, result);
        eventLog(result.serverStatus * 1 !== 2, key, i);
      }
    }
  }
  console.log('sql脚本执行结束！');
  console.log('请按 ctrl + c 键退出！');

}

createAllTables();