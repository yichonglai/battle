const inspect = require('util').inspect;
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName( fileName ) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}         
 */
function uploadFile(ctx, options) {
  const req = ctx.req;
  const fileType = options.fileType || 'common'
  const busboy = new Busboy({headers: req.headers});
  const filePath = path.join(options.path, fileType);
  mkdirsSync(filePath);
  
  return new Promise((resolve, reject) => {
    console.log('文件上传开始！');
    const result = { 
      success: false,
      message: '',
      formData: {},
      data: null,
    }

    // 解析请求文件事件
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      const fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename);
      const _uploadFilePath = path.join(filePath, fileName);
      const saveTo = path.join(_uploadFilePath);

      file.pipe(fs.createWriteStream(saveTo));

      file.on('end', function() {
        result.success = true;
        result.message = '文件上传成功';
        result.data = {
          pictureUrl: `${ctx.origin}/images/${fileType}/${fileName}`
        }
      });
    });

    // 解析表单中其他字段信息
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      result.formData[fieldname] = inspect(val);
    });

    // 解析结束事件
    busboy.on('finish', function() {
      console.log('文件上传结束！');
      resolve(result);
    });

    // 解析错误事件
    busboy.on('error', function(err) {
      console.log('文件上传出错！');
      reject(result);
    });

    req.pipe(busboy);
  })
} 


module.exports =  {
  uploadFile
}