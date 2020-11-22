const dbUtils = require('../db/util/dbUtil');

module.exports = {

  /**
   * 数据库创建用户
   * @param  {object} model 用户数据模型
   * @return {object}       mysql执行结果
   */
  async create(model) {
    const result = await dbUtils.insertData('user_info', model)
    return result
  },

  /**
   * 查找一个存在用户的数据
   * @param  {obejct} options 查找条件参数
   * @return {object|null}        查找结果
   */
  async getExistOne(options) {
    const _sql = `
    SELECT * from user_info
      where email="${options.email}" or name="${options.name}"
      limit 1`
    const result = await dbUtils.query(_sql);
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  },

  /**
   * 根据用户名和密码查找用户
   * @param  {object} options 用户名密码对象
   * @return {object|null}         查找结果
   */
  async getOneByUserNameAndPassword(options) {
    const _sql = `SELECT * from user_info where password="${options.password}" and name="${options.name}" limit 1`;
    const _sql_name = `SELECT * from user_info where name="${options.name}" limit 1`;
    try {
      const result = await dbUtils.query(_sql);
      if (Array.isArray(result) && result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  },

  /**
   * 根据用户ID查找用户信息
   * @param  {string} userId 用户ID
   * @return {object|null}     查找结果
   */
  async getUserInfoByUserId(userId) {
    let result = await dbUtils.findDataById('user_info', userId);
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  },
}