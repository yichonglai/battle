const {query} = require('../db/util/db');

module.exports = async (ctx) => {
    const result = await query(`SELECT * FROM user`);
    ctx.body = { 
      success: true,
      message: '请求成功！',
      data: result,
    };
}