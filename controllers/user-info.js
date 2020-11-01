const userInfoService = require('./../services/user-info')
const userCode = require('./../codes/user')

module.exports = {

  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
  async signIn(ctx) {
    const formData = ctx.request.body;
    console.log('======', formData, formData.source)
    let result = {
      success: false,
      message: '',
      data: null,
      code: ''
    };
    const userResult = await userInfoService.signIn(formData);

    if (userResult) {
      if (formData.userName === userResult.name) {
        result.success = true;
      } else {
        result.message = userCode.FAIL_USER_NAME_OR_PASSWORD_ERROR;
        result.code = 'FAIL_USER_NAME_OR_PASSWORD_ERROR';
      }
    } else {
      result.code = 'FAIL_USER_NO_EXIST';
      result.message = userCode.FAIL_USER_NO_EXIST;
    }

    if (result.success) {
      let session = ctx.session;
      session.isLogin = true;
      session.userName = userResult.name;
      session.userId = userResult.id;
    }
    ctx.body = result;
  },

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async signUp(ctx) {
    const formData = ctx.request.body;
    let result = {
      success: false,
      message: '',
      data: null
    };

    const validateResult = userInfoService.validatorSignUp(formData);

    if (!validateResult.success) {
      result = validateResult;
      ctx.body = result;
      return
    }

    const existOne = await userInfoService.getExistOne(formData);
    if (existOne) {
      if (existOne.name === formData.userName) {
        result.message = userCode.FAIL_USER_NAME_IS_EXIST;
        ctx.body = result;
        return;
      }
      if (existOne.email === formData.email) {
        result.message = userCode.FAIL_EMAIL_IS_EXIST;
        ctx.body = result;
        return;
      }
    }

    const userResult = await userInfoService.create({
      email: formData.email,
      password: formData.password,
      name: formData.userName,
      create_time: new Date().getTime(),
      level: 1,
    });

    if (userResult && userResult.insertId * 1 > 0) {
      result.success = true;
    } else {
      result.message = userCode.ERROR_SYS;
    }
    ctx.body = result;
  },

  /**
   * 获取用户信息
   * @param    {obejct} ctx 上下文对象
   */
  async getLoginUserInfo(ctx) {
    const { isLogin, userName } = ctx.session;
    console.log(ctx.session)
    let result = {
      success: false,
      message: '',
      data: null,
    };

    if (isLogin && userName) {
      const userInfo = await userInfoService.getUserInfoByUserName(userName);
      if (userInfo) {
        result.data = userInfo;
        result.success = true;
      } else {
        result.message = userCode.FAIL_USER_NO_LOGIN;
      }
    }
    ctx.body = result;
  },

  /**
   * 校验用户是否登录
   * @param  {obejct} ctx 上下文对象
   */
  validateLogin(ctx) {
    let result = {
      success: false,
      message: userCode.FAIL_USER_NO_LOGIN,
      data: null,
      code: 'FAIL_USER_NO_LOGIN',
    }
    let session = ctx.session
    if (session && session.isLogin === true) {
      result.success = true
      result.message = ''
      result.code = ''
    }
    return result
  }
}