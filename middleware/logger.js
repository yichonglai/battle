const log = (ctx) => {
  console.log('middleware=====:',ctx.method, ctx.header.host + ctx.url);
}

module.exports = () => async (ctx, next) => {
  log(ctx);
  await next();
}