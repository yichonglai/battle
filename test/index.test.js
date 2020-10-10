const supertest = require('supertest');
const chai = require('chai');
const app = require('../index');

const expect = chai.expect;
const request = supertest(app.listen());

// 测试套件/组
describe('开始测试请求', ( ) => {
  
  // 测试用例
  it('测试/page/helloworld请求', ( done ) => {
      request
        .get('/page/helloworld')
        .expect(200)
        .end(( err, res ) => {
            // 断言判断结果是否为object类型
            expect(res.body).to.be.an('object');
            done();
        });
  });
});