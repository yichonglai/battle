/**
 * 用户业务操作
 */

const validator = require('validator')
const userModel = require('./../models/user-info')
const userCode = require('./../codes/user')

module.exports = {

  /**
   * 创建用户
   * @param  {object} user 用户信息
   * @return {object}      创建结果
   */
  async create(user) {
    const result = await userModel.create(user)
    return result
  },

  /**
   * 查找存在用户信息
   * @param  {object} formData 查找的表单数据
   * @return {object|null}      查找结果
   */
  async getExistOne(formData) {
    const res = await userModel.getExistOne({
      email: formData.email,
      name: formData.userName
    });
    return res;
  },

  /**
   * 登录业务操作
   * @param  {object} formData 登录表单信息
   * @return {object}          登录业务操作结果
   */
  async signIn(formData) {
    const resultData = await userModel.getOneByUserNameAndPassword({
      'password': formData.password,
      'name': formData.userName
    });
    return resultData;
  },


  /**
   * 根据用户ID查找用户业务操作
   * @param  {string} userId 用户ID
   * @return {object|null}     查找结果
   */
  async getUserInfoByUserId(userId) {
    const resultData = await userModel.getUserInfoByUserId(userId)
    return resultData;
  },


  /**
   * 检验用户注册数据
   * @param  {object} userInfo 用户注册数据
   * @return {object}          校验结果
   */
  validatorSignUp(userInfo) {
    const result = {
      success: false,
      message: '',
    }

    if (!/[a-z0-9\_\-]{6,16}/.test(userInfo.userName)) {
      result.message = userCode.ERROR_USER_NAME;
    } else if (!validator.isEmail(userInfo.email)) {
      result.message = userCode.ERROR_EMAIL;
    } else if (!/[\w+]{6,16}/.test(userInfo.password)) {
      result.message = userCode.ERROR_PASSWORD;
    } else if (userInfo.password !== userInfo.confirmPassword) {
      result.message = userCode.ERROR_PASSWORD_CONFORM;
    }
    if (result.message) return result;
    result.success = true;
    return result;
  }
}