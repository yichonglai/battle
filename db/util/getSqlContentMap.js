const fs = require('fs');
const path = require('path');

/**
 * 遍历目录下的文件
 * @param  {string} dir  需进行遍历的目录
 * @param  {string} ext         遍历文件的后缀名
 * @return {object}              返回遍历后的目录结果
 */
const walkFile = (dir, ext) => {
  const files = fs.readdirSync(dir);
  const filesMap = {}
  for (let [i, item] of files.entries()) {
    const itemArr = item.split('\.');
    const itemExt = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : 'undefined';
    ext === itemExt && (filesMap[item] = path.join(dir, item));
  }
  return filesMap;
}
/**
 * 返回所有sql文件脚本内容
 * @return {object} 
 */
const getSqlContentMap = () => {
  const sqlContentMap = {};
  const sqlFileMap = walkFile(path.join(__dirname, '../sql'), 'sql');
  for (let fileName in sqlFileMap) {
    sqlContentMap[fileName] = fs.readFileSync(sqlFileMap[fileName], 'utf8');
  }
  return sqlContentMap
}
module.exports = getSqlContentMap;