const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');
const jsonp = require('koa-jsonp');
const views = require('koa-views');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');

const logger = require('./middleware/logger');
const routers = require('./routers');
const baseConfig = require('./config/base');
const app = new Koa();

// 配置session中间件
app.use(session({
  key: 'SESSION_ID',
  store: new MysqlStore(baseConfig.database)
}));
// ejs；
app.use(static(path.join(__dirname, './static'))); // need to view sourse
app.use(logger());
app.use(bodyParser());
app.use(jsonp());
// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}));
app.use(routers.routes()).use(routers.allowedMethods());

app.listen(baseConfig.port, () => {
  console.log('Server at http://localhost:%d', baseConfig.port);
});
module.exports = app;