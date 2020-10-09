const path = require('path');
const util = require('./util');

module.exports = async (ctx) => {
  const saveFilePath = path.join(__dirname, '../../static/images' );
  ctx.body = await util.uploadFile(ctx, {
    fileType: 'album', // common or album
    path: saveFilePath
  });
}