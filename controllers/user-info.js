const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const userInfoService = require('./../services/user-info');
const userCode = require('./../codes/user');
const baseConfig = require('../config/base');

// 响应对象模版
const responseTemplate = (opt) => {
  return Object.assign({
    success: false,
    message: '',
    data: null,
    code: ''
  }, opt || {});
};

module.exports = {

  /**
   * 登录操作session/token
   * @param  {obejct} ctx 上下文对象
   */
  async signIn(ctx) {
    const responseObj = responseTemplate();
    const formData = ctx.request.body;
    const user = await userInfoService.signIn(formData);

    if (user) {
      responseObj.success = true;
      if (formData.jwt) {
        // JWT登录
        const privateKey = fs.readFileSync(path.join(baseConfig.rootDir, 'token.private.key'));
        const paload = { userName: user.name, userId: user.id };
        const token = jwt.sign(paload, privateKey, { expiresIn: '1d' })
        responseObj.data = { token };
      } else {
        // sessiond登录
        const session = ctx.session;
        session.isLogin = true;
        session.userName = user.name;
        session.userId = user.id;
      }
    } else {
      responseObj.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR;
      responseObj.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR';
    }
    console.log(responseObj)
    ctx.body = responseObj;
  },

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async signUp(ctx) {
    const responseObj = responseTemplate();
    const formData = ctx.request.body;
    const validateResult = userInfoService.validatorSignUp(formData);

    if (!validateResult.success) {
      responseObj.message = validateResult.message;
      ctx.body = responseObj;
      return
    }
    const existOne = await userInfoService.getExistOne(formData);
    if (existOne) {
      if (existOne.name === formData.userName) {
        responseObj.message = userCode.FAIL_USER_NAME_IS_EXIST;
      } else if (existOne.email === formData.email) {
        responseObj.message = userCode.FAIL_EMAIL_IS_EXIST;
      }
      ctx.body = responseObj;
      return;
    }

    const userResult = await userInfoService.create({
      email: formData.email,
      password: formData.password,
      name: formData.userName,
      create_time: new Date().getTime(),
      level: 1,
    });

    if (userResult && userResult.insertId * 1 > 0) {
      responseObj.success = true;
    } else {
      responseObj.message = userCode.ERROR_SYS;
    }
    ctx.body = responseObj;
  },

  /**
   * 获取用户信息
   * @param    {obejct} ctx 上下文对象
   */
  async getLoginUserInfo(ctx) {
    const responseObj = responseTemplate();
    let { userId } = ctx.session;
    const { token } = ctx.request.body;
    if (token) {
      const privateKey = fs.readFileSync(path.join(baseConfig.rootDir, 'token.private.key'));
      try {
        userId = jwt.verify(token, privateKey).userId;
      } catch (error) {
        userId = '';
      }
    }

    if (userId) {
      const userInfo = await userInfoService.getUserInfoByUserId(userId);
      if (userInfo) {
        responseObj.data = userInfo;
        responseObj.success = true;
      } else {
        responseObj.message = userCode.FAIL_USER_NO_LOGIN;
        responseObj.code = 'FAIL_USER_NO_LOGIN';
      }
    } else {
      responseObj.message = userCode.FAIL_USER_NO_LOGIN;
      responseObj.code = 'FAIL_USER_NO_LOGIN';
    }
    ctx.body = responseObj;
  },

  /**
   * 校验用户是否登录
   * @param  {obejct} ctx 上下文对象
   */
  async validateLogin(ctx) {
    const { isLogin } = ctx.session;
    const responseObj = responseTemplate({
      message: userCode.FAIL_USER_NO_LOGIN,
      code: 'FAIL_USER_NO_LOGIN',
    });
    if (isLogin) {
      responseObj.success = true;
      responseObj.message = '';
      responseObj.code = '';
    }
    return ctx.body = responseObj;
  }
}
