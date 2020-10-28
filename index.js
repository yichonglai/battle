const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');
const jsonp = require('koa-jsonp')
const app = new Koa();
const logger = require('./middleware/logger');
const router = require('./router');
// const { query } = require('./db/util/db');

// session login；ejs；
app.use(static(path.join(__dirname, './static'))); // need to view sourse
app.use(logger());
app.use(bodyParser());
app.use(jsonp());
app.use(router.routes()).use(router.allowedMethods());
// query(`SELECT * FROM user`).then(res => {
//   console.log(res[0]);
// }, (err) => console.log(err));

module.exports = app;
app.listen(3001, () => {
  console.log('Server at http://localhost:%d', 3001);
});