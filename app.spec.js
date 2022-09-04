const app = require('./app');
const supertest = require('supertest'); //서버를 실제로 켜 않고 리슨 상태가 아니어도 확인할 수 있게 해줌.

test('/index.hteml 경로에 요청했을 때 status code가 200이어야한다.', async () => {
  const res = await supertest(app).get('/index.html');
  expect(res.status).toEqual(200);
});
test('/test.html 경로에 요청했을 때 status code가 404여야 한다.', async () => {
  const res = await supertest(app).get('/test.html');
  expect(res.status).toEqual(404);
});
