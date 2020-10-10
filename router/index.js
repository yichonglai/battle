const Router = require('koa-router');
const siteEntry = require('../controller/home');
const form = require('../controller/form');
const upload = require('../controller/upload');
const listUsers = require('../controller/listUsers');
const app = require('..');

const home = new Router();
home.get('/', siteEntry);

const api = new Router();
api.post('/', form);
api.post('/upload', upload);
api.get('/listUsers', listUsers);


const page = new Router();
page.get('/404', async ( ctx )=>{
  ctx.body = '404 page!'
}).get('/helloworld', async ( ctx )=>{
  ctx.body = 'helloworld page!'
});

const router = new Router();
router.use('/', home.routes(), home.allowedMethods());
router.use('/page', page.routes(), page.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());

module.exports = router;
